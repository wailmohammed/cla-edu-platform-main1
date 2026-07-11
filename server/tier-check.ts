import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { courses, subscriptions } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Check if a user can access a course based on their subscription tier
 */
export async function checkCourseAccess(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get course to check if it's premium-only
  const course = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (course.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
  }

  // For now, all courses are accessible (tier system can be added later)
  // In production, check courseData.difficulty or a tier field
  return { allowed: true };
}

/**
 * Get courses available to a user based on their tier
 */
export async function getAccessibleCourses(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get user's subscription
  const subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  const isPremium = subscription.length > 0 && subscription[0].status === "active";

  // If premium, return all courses
  if (isPremium) {
    return await db.select().from(courses);
  }

  // If free, return only beginner courses
  return await db
    .select()
    .from(courses)
    .where(eq(courses.difficulty, "beginner"));
}

/**
 * Get user's subscription status
 */
export async function getUserSubscriptionStatus(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (subscription.length === 0) {
    return {
      tier: "free",
      status: "none",
      plan: "free",
    };
  }

  const sub = subscription[0];
  return {
    tier: sub.status === "active" ? "premium" : "free",
    status: sub.status,
    plan: "premium",
    expiresAt: sub.renewalDate,
  };
}
