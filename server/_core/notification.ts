// Owner notification — replaces the former Manus Notification Service call
// with plain email via the app's own SMTP service (server/smtp-service.ts).
import { TRPCError } from "@trpc/server";
import { smtpService } from "../smtp-service";
import { ENV } from "./env";

export type NotificationPayload = {
  title: string;
  content: string;
};

const TITLE_MAX_LENGTH = 1200;
const CONTENT_MAX_LENGTH = 20000;

const trimValue = (value: string): string => value.trim();
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const validatePayload = (input: NotificationPayload): NotificationPayload => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Notification title is required." });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Notification content is required." });
  }

  const title = trimValue(input.title);
  const content = trimValue(input.content);

  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({ code: "BAD_REQUEST", message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.` });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({ code: "BAD_REQUEST", message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.` });
  }

  return { title, content };
};

/**
 * Notifies the site owner by email. Configure OWNER_EMAIL + SMTP_* env vars.
 * Returns `false` (instead of throwing) if the mail send fails, so callers can
 * continue without the notification blocking their main flow.
 */
export async function notifyOwner(payload: NotificationPayload): Promise<boolean> {
  const { title, content } = validatePayload(payload);

  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) {
    console.warn("[Notification] OWNER_EMAIL not configured; skipping owner notification.");
    return false;
  }

  const result = await smtpService.sendEmail({
    to: ownerEmail,
    subject: title,
    html: `<p>${content.replace(/\n/g, "<br/>")}</p>`,
    text: content,
  });

  if (!result.success) {
    console.warn("[Notification] Failed to email owner:", result.error);
    return false;
  }

  return true;
}
