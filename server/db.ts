import { eq, and, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  courses,
  lessons,
  exercises,
  userProgress,
  lessonCompletion,
  exerciseSubmissions,
  streaks,
  badges,
  userBadges,
  certificates,
  leaderboard,
  friends,
  challenges,
  subscriptions,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "passwordHash"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function setEmailVerifyToken(
  userId: number,
  tokenHash: string,
  expires: Date
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(users)
    .set({ emailVerifyTokenHash: tokenHash, emailVerifyExpires: expires })
    .where(eq(users.id, userId));
}

export async function getUserByEmailVerifyTokenHash(tokenHash: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.emailVerifyTokenHash, tokenHash))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function markEmailVerified(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(users)
    .set({ emailVerified: true, emailVerifyTokenHash: null, emailVerifyExpires: null })
    .where(eq(users.id, userId));
}

export async function setPasswordResetToken(
  userId: number,
  tokenHash: string,
  expires: Date
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(users)
    .set({ resetPasswordTokenHash: tokenHash, resetPasswordExpires: expires })
    .where(eq(users.id, userId));
}

export async function getUserByResetTokenHash(tokenHash: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.resetPasswordTokenHash, tokenHash))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function resetPasswordWithHash(
  userId: number,
  passwordHash: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(users)
    .set({ passwordHash, resetPasswordTokenHash: null, resetPasswordExpires: null })
    .where(eq(users.id, userId));
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Course queries
 */
export async function getAllCourses() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(courses)
    .orderBy(asc(courses.displayOrder), asc(courses.title));
}

export async function getCourseBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCoursesByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(courses)
    .where(eq(courses.category, category as any))
    .orderBy(asc(courses.displayOrder));
}

export async function getCoursesByDifficulty(difficulty: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(courses)
    .where(eq(courses.difficulty, difficulty as any))
    .orderBy(asc(courses.displayOrder));
}

/**
 * Lesson queries
 */
export async function getLessonsByCourseId(courseId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.displayOrder));
}

export async function getLessonById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Exercise queries
 */
export async function getExercisesByLessonId(lessonId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(exercises)
    .where(eq(exercises.lessonId, lessonId))
    .orderBy(asc(exercises.displayOrder));
}

export async function getExerciseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * User progress queries
 */
export async function getUserProgress(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.courseId, courseId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserCourseProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
}

/**
 * Lesson completion queries
 */
export async function getLessonCompletion(userId: number, lessonId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(lessonCompletion)
    .where(and(eq(lessonCompletion.userId, userId), eq(lessonCompletion.lessonId, lessonId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserCompletedLessons(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(lessonCompletion)
    .where(and(eq(lessonCompletion.userId, userId), eq(lessonCompletion.completed, true)));
}

/**
 * Exercise submission queries
 */
export async function getExerciseSubmission(userId: number, exerciseId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(exerciseSubmissions)
    .where(and(eq(exerciseSubmissions.userId, userId), eq(exerciseSubmissions.exerciseId, exerciseId)))
    .orderBy(desc(exerciseSubmissions.submittedAt))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserExerciseSubmissions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(exerciseSubmissions)
    .where(eq(exerciseSubmissions.userId, userId))
    .orderBy(desc(exerciseSubmissions.submittedAt));
}

/**
 * Streak queries
 */
export async function getUserStreak(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(streaks).where(eq(streaks.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Badge queries
 */
export async function getAllBadges() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(badges);
}

export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(userBadges).where(eq(userBadges.userId, userId));
}

/**
 * Certificate queries
 */
export async function getUserCertificates(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(certificates).where(eq(certificates.userId, userId));
}

export async function getCertificate(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(certificates)
    .where(and(eq(certificates.userId, userId), eq(certificates.courseId, courseId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Leaderboard queries
 */
export async function getLeaderboard(period: "weekly" | "monthly" | "all-time", limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(leaderboard)
    .where(eq(leaderboard.period, period))
    .orderBy(asc(leaderboard.rank))
    .limit(limit);
}

/**
 * Friend queries
 */
export async function getUserFriends(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(friends)
    .where(and(eq(friends.userId, userId), eq(friends.status, "accepted")));
}

/**
 * Challenge queries
 */
export async function getUserChallenges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(challenges)
    .where(
      and(
        eq(challenges.status, "pending"),
        eq(challenges.challengedId, userId)
      )
    );
}

/**
 * Subscription queries
 */
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getSubscriptionByStripeId(stripeSubscriptionId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.providerSubscriptionId, stripeSubscriptionId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}
