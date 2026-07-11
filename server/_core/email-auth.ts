// Handles token generation/verification and email dispatch for the
// email-verification and password-reset flows.
import { createHash, randomBytes } from "crypto";
import * as db from "../db";
import { smtpService } from "../smtp-service";
import { ENV } from "./env";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function generateToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("hex");
  const hash = createHash("sha256").update(token).digest("hex");
  return { token, hash };
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function sendOrLog(params: { to: string; subject: string; html: string; text: string; devLabel: string }) {
  const status = smtpService.getStatus();
  if (!status.initialized) {
    // No SMTP configured (e.g. local dev) — log so the flow is still testable.
    console.log(`[Email:${params.devLabel}] SMTP not configured. Would send to ${params.to}:\n${params.text}`);
    return { success: false as const, loggedOnly: true as const };
  }

  const result = await smtpService.sendEmail({
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
  });

  if (!result.success) {
    console.warn(`[Email:${params.devLabel}] Send failed, logging instead: ${result.error}\n${params.text}`);
  }

  return { ...result, loggedOnly: false as const };
}

/** Generates a verification token, stores its hash, and emails the link. */
export async function sendVerificationEmail(user: { id: number; email: string | null; name: string | null }) {
  if (!user.email) return;

  const { token, hash } = generateToken();
  await db.setEmailVerifyToken(user.id, hash, new Date(Date.now() + TOKEN_TTL_MS));

  const link = `${ENV.appUrl.replace(/\/$/, "")}/verify-email?token=${token}&email=${encodeURIComponent(user.email)}`;

  await sendOrLog({
    to: user.email,
    subject: "Verify your email address",
    text: `Hi ${user.name || "there"},\n\nPlease verify your email address by visiting:\n${link}\n\nThis link expires in 1 hour.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Verify your email</h1>
        <p>Hi ${user.name || "there"},</p>
        <p>Please confirm your email address to finish setting up your account.</p>
        <a href="${link}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">Verify email</a>
        <p style="color:#666;font-size:12px;margin-top:20px;">This link expires in 1 hour. If you didn't create an account, you can ignore this email.</p>
      </div>
    `,
    devLabel: "verify",
  });
}

export type VerifyEmailResult = { ok: true } | { ok: false; error: string };

export async function verifyEmailToken(token: string): Promise<VerifyEmailResult> {
  const hash = hashToken(token);
  const user = await db.getUserByEmailVerifyTokenHash(hash);

  if (!user) return { ok: false, error: "Invalid or already-used verification link." };
  if (user.emailVerifyExpires && new Date(user.emailVerifyExpires).getTime() < Date.now()) {
    return { ok: false, error: "This verification link has expired. Please request a new one." };
  }

  await db.markEmailVerified(user.id);
  return { ok: true };
}

/** Generates a reset token, stores its hash, and emails the link. Silent no-op if the email doesn't exist (avoids leaking which emails are registered). */
export async function sendPasswordResetEmail(email: string) {
  const user = await db.getUserByEmail(email);
  if (!user) {
    console.log(`[Email:reset] No account for ${email}; not sending (avoids email enumeration).`);
    return;
  }

  const { token, hash } = generateToken();
  await db.setPasswordResetToken(user.id, hash, new Date(Date.now() + TOKEN_TTL_MS));

  const link = `${ENV.appUrl.replace(/\/$/, "")}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  await sendOrLog({
    to: email,
    subject: "Reset your password",
    text: `Hi ${user.name || "there"},\n\nWe received a request to reset your password. Visit this link to choose a new one:\n${link}\n\nThis link expires in 1 hour. If you didn't request this, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Reset your password</h1>
        <p>Hi ${user.name || "there"},</p>
        <p>We received a request to reset your password. Click below to choose a new one:</p>
        <a href="${link}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">Reset password</a>
        <p style="color:#666;font-size:12px;margin-top:20px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
    devLabel: "reset",
  });
}

export type ResetPasswordResult = { ok: true } | { ok: false; error: string };

export async function resetPasswordWithToken(
  token: string,
  newPasswordHash: string
): Promise<ResetPasswordResult> {
  const hash = hashToken(token);
  const user = await db.getUserByResetTokenHash(hash);

  if (!user) return { ok: false, error: "Invalid or already-used reset link." };
  if (user.resetPasswordExpires && new Date(user.resetPasswordExpires).getTime() < Date.now()) {
    return { ok: false, error: "This reset link has expired. Please request a new one." };
  }

  await db.resetPasswordWithHash(user.id, newPasswordHash);
  return { ok: true };
}
