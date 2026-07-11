import { protectedProcedure, router } from "./_core/trpc";
import { gamificationService } from "./gamification";
import { z } from "zod";

export const gamificationRouter = router({
  /**
   * Get user's gamification stats
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    return await gamificationService.getUserStats(ctx.user.id);
  }),

  /**
   * Award XP to user
   */
  awardXP: protectedProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        activityType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await gamificationService.awardXP(ctx.user.id, input.amount, input.activityType);
    }),

  /**
   * Update user streak
   */
  updateStreak: protectedProcedure.mutation(async ({ ctx }) => {
    return await gamificationService.updateStreak(ctx.user.id);
  }),

  /**
   * Award badge to user
   */
  awardBadge: protectedProcedure
    .input(
      z.object({
        badgeSlug: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await gamificationService.awardBadge(ctx.user.id, input.badgeSlug);
    }),

  /**
   * Award certificate for course completion
   */
  awardCertificate: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await gamificationService.awardCertificate(ctx.user.id, input.courseId);
    }),

  /**
   * Check and award badges based on criteria
   */
  checkAndAwardBadges: protectedProcedure.mutation(async ({ ctx }) => {
    return await gamificationService.checkAndAwardBadges(ctx.user.id);
  }),
});
