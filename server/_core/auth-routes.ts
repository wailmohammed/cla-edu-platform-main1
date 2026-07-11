/**
 * Standalone email/password auth routes (replaces the former Manus OAuth callback).
 * POST /api/auth/register  { email, password, name? }
 * POST /api/auth/login     { email, password }
 * POST /api/auth/logout
 * GET  /api/auth/me
 */
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import rateLimit from "express-rate-limit";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { getDb } from "../db";
import {
  sendVerificationEmail,
  verifyEmailToken,
  sendPasswordResetEmail,
  resetPasswordWithToken,
} from "./email-auth";

// Limits brute-force / abuse on the auth endpoints. Keyed by IP.
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again later." },
});

function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function registerAuthRoutes(app: any) {
  app.post("/api/auth/register", authRateLimit, async (req: any, res: any) => {
    const { email, password, name } = req.body ?? {};

    if (!isValidEmail(email)) {
      res.status(400).json({ error: "A valid email is required" });
      return;
    }
    if (typeof password !== "string" || password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }

    try {
      const { sessionToken, user } = await sdk.registerWithPassword({
        email,
        password,
        name: typeof name === "string" ? name : undefined,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      sendVerificationEmail(user).catch(err =>
        console.error("[Auth] Failed to send verification email:", err)
      );
      res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error: any) {
      console.error("[Auth] Register failed", error);
      res.status(error?.status ?? 400).json({ error: error?.message ?? "Registration failed" });
    }
  });

  app.post("/api/auth/verify-email", async (req: any, res: any) => {
    const { token } = req.body ?? {};
    if (typeof token !== "string" || !token) {
      res.status(400).json({ error: "Token is required" });
      return;
    }
    const result = await verifyEmailToken(token);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }
    res.json({ success: true });
  });

  app.post("/api/auth/request-password-reset", authRateLimit, async (req: any, res: any) => {
    const { email } = req.body ?? {};
    if (typeof email !== "string" || !isValidEmail(email)) {
      res.status(400).json({ error: "A valid email is required" });
      return;
    }
    await sendPasswordResetEmail(email);
    // Always succeed, regardless of whether the email exists.
    res.json({ success: true });
  });

  app.post("/api/auth/reset-password", authRateLimit, async (req: any, res: any) => {
    const { token, newPassword } = req.body ?? {};
    if (typeof token !== "string" || !token) {
      res.status(400).json({ error: "Token is required" });
      return;
    }
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }
    const passwordHash = await sdk.hashPassword(newPassword);
    const result = await resetPasswordWithToken(token, passwordHash);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }
    res.json({ success: true });
  });

  app.post("/api/auth/login", authRateLimit, async (req: any, res: any) => {
    const { email, password } = req.body ?? {};

    if (!isValidEmail(email) || typeof password !== "string") {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    try {
      const { sessionToken, user } = await sdk.loginWithPassword({ email, password });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error: any) {
      res.status(error?.status ?? 401).json({ error: error?.message ?? "Invalid email or password" });
    }
  });

  app.post("/api/auth/logout", async (req: any, res: any) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, cookieOptions);
    res.json({ ok: true });
  });

  app.post("/api/auth/change-password", async (req: any, res: any) => {
    try {
      const user = await sdk.authenticateRequest(req);
      if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }
      const { currentPassword, newPassword } = req.body ?? {};
      if (typeof newPassword !== "string" || newPassword.length < 8) {
        res.status(400).json({ error: "New password must be at least 8 characters" }); return;
      }
      // Verify current password
      const fullUser = await db.getUserByEmail(user.email!);
      if (!fullUser?.passwordHash) { res.status(400).json({ error: "No password set on this account" }); return; }
      const bcrypt = await import("bcryptjs");
      const valid = await bcrypt.default.compare(currentPassword, fullUser.passwordHash);
      if (!valid) { res.status(400).json({ error: "Current password is incorrect" }); return; }
      const newHash = await bcrypt.default.hash(newPassword, 12);
      await db.resetPasswordWithHash(user.id, newHash);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err?.message ?? "Server error" });
    }
  });

  app.delete("/api/auth/delete-account", async (req: any, res: any) => {
    try {
      const user = await sdk.authenticateRequest(req);
      if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }
      const drizzleDb = await getDb();
      if (drizzleDb) {
        const { eq } = await import("drizzle-orm");
        const { users } = await import("../../drizzle/schema");
        await drizzleDb.delete(users).where(eq(users.id, user.id));
      }
      const cookieOptions = getSessionCookieOptions(req);
      res.clearCookie(COOKIE_NAME, cookieOptions);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err?.message ?? "Server error" });
    }
  });

  app.get("/api/auth/me", async (req: any, res: any) => {
    try {
      const user = await sdk.authenticateRequest(req);
      res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch {
      res.status(401).json({ user: null });
    }
  });
}
