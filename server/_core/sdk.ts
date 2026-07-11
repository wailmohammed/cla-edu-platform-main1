/**
 * Standalone auth service (replaces the former Manus OAuth-backed SDK).
 * Keeps the same public interface (`sdk.authenticateRequest`, `sdk.verifySession`,
 * `sdk.signSession`) so the rest of the app (context.ts, trpc.ts, routers) is unaffected.
 */
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import bcrypt from "bcryptjs";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import { randomUUID } from "crypto";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

export type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

export type AuthenticatedUser = User & {
  taskUid?: string;
  isCron?: boolean;
};

const CRON_OPEN_ID_PREFIX = "cron_";

class AuthService {
  private getSessionSecret() {
    const secret = ENV.cookieSecret;
    if (!secret) {
      throw new Error(
        "JWT_SECRET is not configured. Set a strong random JWT_SECRET environment variable."
      );
    }
    return new TextEncoder().encode(secret);
  }

  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) return new Map<string, string>();
    return new Map(Object.entries(parseCookieHeader(cookieHeader)));
  }

  /** Hash a plaintext password for storage. */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /** Compare a plaintext password against a stored hash. */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /** Generate a fresh internal user id (kept as `openId` for schema compatibility). */
  generateOpenId(): string {
    return `user_${randomUUID()}`;
  }

  async signSession(
    payload: SessionPayload,
    options: { expiresInMs?: number } = {}
  ): Promise<string> {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();

    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async createSessionToken(
    openId: string,
    options: { expiresInMs?: number; name?: string } = {}
  ): Promise<string> {
    return this.signSession(
      { openId, appId: ENV.appId, name: options.name || "" },
      options
    );
  }

  async verifySession(
    cookieValue: string | undefined | null
  ): Promise<{ openId: string; appId: string; name: string } | null> {
    if (!cookieValue) return null;

    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"],
      });
      const { openId, appId, name } = payload as Record<string, unknown>;

      if (!isNonEmptyString(openId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }

      return { openId, appId: isNonEmptyString(appId) ? appId : ENV.appId, name };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }

  /** Register a new user with email + password. Returns the signed session cookie value. */
  async registerWithPassword(params: {
    email: string;
    password: string;
    name?: string;
  }): Promise<{ sessionToken: string; user: User }> {
    const existing = await db.getUserByEmail(params.email);
    if (existing) {
      throw ForbiddenError("An account with this email already exists");
    }

    const openId = this.generateOpenId();
    const passwordHash = await this.hashPassword(params.password);

    await db.upsertUser({
      openId,
      name: params.name || null,
      email: params.email.toLowerCase(),
      loginMethod: "email",
      passwordHash,
      lastSignedIn: new Date(),
    } as any);

    const user = await db.getUserByOpenId(openId);
    if (!user) throw ForbiddenError("Failed to create user");

    const sessionToken = await this.createSessionToken(openId, {
      name: user.name || "",
    });

    return { sessionToken, user };
  }

  /** Log in an existing user with email + password. */
  async loginWithPassword(params: {
    email: string;
    password: string;
  }): Promise<{ sessionToken: string; user: User }> {
    const user = await db.getUserByEmail(params.email);
    if (!user || !(user as any).passwordHash) {
      throw ForbiddenError("Invalid email or password");
    }

    const valid = await this.verifyPassword(
      params.password,
      (user as any).passwordHash
    );
    if (!valid) {
      throw ForbiddenError("Invalid email or password");
    }

    await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() } as any);

    const sessionToken = await this.createSessionToken(user.openId, {
      name: user.name || "",
    });

    return { sessionToken, user };
  }

  async authenticateRequest(req: Request): Promise<AuthenticatedUser> {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);

    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }

    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      return buildCronUser(session.openId);
    }

    const user = await db.getUserByOpenId(session.openId);
    if (!user) {
      throw ForbiddenError("User not found");
    }

    await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() } as any);

    return user;
  }
}

function buildCronUser(openId: string): AuthenticatedUser {
  const now = new Date();
  return {
    id: -1,
    openId,
    name: "Scheduled Task",
    email: null,
    loginMethod: null,
    passwordHash: null,
    emailVerified: false,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    isCron: true,
  } as AuthenticatedUser;
}

export const sdk = new AuthService();
