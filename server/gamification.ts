import { eq, and, gte, lte } from "drizzle-orm";
import { getDb } from "./db";
import {
  streaks,
  userBadges,
  badges,
  certificates,
  courses,
  userProgress,
  users,
} from "../drizzle/schema";

export const gamificationService = {
  /**
   * Award XP to a user for completing an activity
   */
  async awardXP(userId: number, amount: number, activityType: string) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // For now, XP is tracked in the users table
    // This is a simplified implementation
    return { success: true, xpAwarded: amount };
  },

  /**
   * Update user streak
   */
  async updateStreak(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get existing streak
    const existingStreak = await db
      .select()
      .from(streaks)
      .where(eq(streaks.userId, userId));

    if (existingStreak.length === 0) {
      // Create new streak
      await db.insert(streaks).values({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
        freezeDaysUsed: 0,
      });
      return { success: true, streak: 1, isNewStreak: true };
    }

    const streak = existingStreak[0];
    const lastActivity = new Date(streak.lastActivityDate || new Date());
    lastActivity.setHours(0, 0, 0, 0);

    // Check if activity is today (no update needed)
    if (lastActivity.getTime() === today.getTime()) {
      return { success: true, streak: streak.currentStreak || 0, isNewStreak: false };
    }

    // Streak broken, reset
    await db
      .update(streaks)
      .set({
        currentStreak: 1,
        lastActivityDate: today,
      })
      .where(eq(streaks.id, streak.id));

    return { success: true, streak: 1, streakBroken: true };
  },

  /**
   * Award a badge to a user
   */
  async awardBadge(userId: number, badgeSlug: string) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get badge by slug
    const badgeRecord = await db
      .select()
      .from(badges)
      .where(eq(badges.slug, badgeSlug));

    if (badgeRecord.length === 0) {
      throw new Error(`Badge not found: ${badgeSlug}`);
    }

    const badge = badgeRecord[0];

    // Check if user already has this badge
    const existingBadge = await db
      .select()
      .from(userBadges)
      .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badge.id)));

    if (existingBadge.length > 0) {
      return { success: false, message: "User already has this badge" };
    }

    // Award badge
    await db.insert(userBadges).values({
      userId,
      badgeId: badge.id,
      earnedAt: new Date(),
    });

    return { success: true, badge: badge.title };
  },

  /**
   * Award certificate for course completion
   */
  async awardCertificate(userId: number, courseId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Check if user already has certificate for this course
    const existingCert = await db
      .select()
      .from(certificates)
      .where(
        and(eq(certificates.userId, userId), eq(certificates.courseId, courseId))
      );

    if (existingCert.length > 0) {
      return { success: false, message: "User already has certificate for this course" };
    }

    // Get course info
    const courseRecord = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId));

    if (courseRecord.length === 0) {
      throw new Error(`Course not found: ${courseId}`);
    }

    const course = courseRecord[0];

    // Award certificate
    const certId = await db.insert(certificates).values({
      userId,
      courseId,
      certificateNumber: `CERT-${userId}-${courseId}-${Date.now()}`,
      issuedAt: new Date(),
    });

    // Award badge for course completion
    await this.awardBadge(userId, "course-complete").catch(() => {
      // Badge might already be awarded, ignore
    });

    return {
      success: true,
      certificate: {
        id: certId,
        course: course.title,
        issuedAt: new Date(),
      },
    };
  },

/**
 * Get user's gamification stats
 */
  async getUserStats(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get user's total XP and level
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userRecord[0];
    const totalXP = user?.totalXP || 0;
    const level = user?.level || 1;
    const currentStreakDays = user?.currentStreakDays || 0;
    const longestStreakDays = user?.longestStreakDays || 0;
    const freezeDaysUsed = 2 - (user?.freezeDaysRemaining || 2);

    // Get streak info (for detailed tracking)
    const streakRecords = await db
      .select()
      .from(streaks)
      .where(eq(streaks.userId, userId));

    const streak = streakRecords[0] || {
      currentStreak: currentStreakDays,
      longestStreak: longestStreakDays,
      freezeDaysUsed,
    };

    // Get badges
    const userBadgeRecords = await db
      .select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId));

    // Get certificates
    const certs = await db
      .select()
      .from(certificates)
      .where(eq(certificates.userId, userId));

    return {
      totalXP,
      level,
      currentStreak: currentStreakDays,
      longestStreak: longestStreakDays,
      freezeDaysRemaining: user?.freezeDaysRemaining ?? 2,
      badgesCount: userBadgeRecords.length,
      certificatesCount: certs.length,
    };
  },

  /**
   * Check and award badges based on criteria
   */
  async checkAndAwardBadges(userId: number) {
    const stats = await this.getUserStats(userId);

    // Award first lesson badge
    if (stats.totalXP > 0) {
      await this.awardBadge(userId, "first-lesson").catch(() => {});
    }

    // Award streak badges
    if (stats.currentStreak >= 7) {
      await this.awardBadge(userId, "week-streak").catch(() => {});
    }

    if (stats.currentStreak >= 30) {
      await this.awardBadge(userId, "month-streak").catch(() => {});
    }

    // Award XP milestone badges
    if (stats.totalXP >= 1000) {
      await this.awardBadge(userId, "xp-1000").catch(() => {});
    }

    return { success: true };
  }
};
