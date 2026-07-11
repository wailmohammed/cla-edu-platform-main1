import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { streaks } from "../drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { z } from "zod";

export const activityRouter = router({
  // Record user activity (lesson completed, exercise completed, etc.)
  recordActivity: protectedProcedure
    .input(
      z.object({
        type: z.enum(["lesson_completed", "exercise_completed", "code_executed", "quiz_passed"]),
        lessonId: z.number().optional(),
        xpEarned: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Update streak if applicable
      const streakData = await db
        .select()
        .from(streaks)
        .where(eq(streaks.userId, ctx.user.id))
        .limit(1);

      if (streakData.length > 0 && streakData[0].lastActivityDate) {
        const lastActivityDate = new Date(
          streakData[0].lastActivityDate.getFullYear(),
          streakData[0].lastActivityDate.getMonth(),
          streakData[0].lastActivityDate.getDate()
        );
        const daysDiff = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          // Consecutive day - increment streak
          const currentStreak = streakData[0].currentStreak || 0;
          await db
            .update(streaks)
            .set({
              currentStreak: currentStreak + 1,
              lastActivityDate: today,
            })
            .where(eq(streaks.userId, ctx.user.id));
        } else if (daysDiff > 1) {
          // Streak broken - reset to 1
          await db
            .update(streaks)
            .set({
              currentStreak: 1,
              lastActivityDate: today,
            })
            .where(eq(streaks.userId, ctx.user.id));
        }
        // If daysDiff === 0, same day - no change
      }

      return { success: true };
    }),

  // Get user activity stats
  getActivityStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get streak data
    const streakData = await db
      .select()
      .from(streaks)
      .where(eq(streaks.userId, ctx.user.id))
      .limit(1);

    if (streakData.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        freezeDaysRemaining: 2,
        totalXP: 0,
      };
    }

    const streak = streakData[0];
    return {
      currentStreak: streak.currentStreak || 0,
      longestStreak: streak.longestStreak || 0,
      freezeDaysRemaining: 2 - (streak.freezeDaysUsed || 0),
      totalXP: 0, // Would calculate from actual activity
    };
  }),
});
