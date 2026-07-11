import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getUserSubscriptionStatus, getAccessibleCourses } from "./tier-check";
import { z } from "zod";

export const tierRouter = router({
  // Get current user's subscription status
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    return getUserSubscriptionStatus(ctx.user.id);
  }),

  // Check if user is premium
  isPremium: protectedProcedure.query(async ({ ctx }) => {
    const status = await getUserSubscriptionStatus(ctx.user.id);
    return status.tier === "premium";
  }),

  // Get courses accessible to user
  getAccessibleCourses: protectedProcedure.query(async ({ ctx }) => {
    return getAccessibleCourses(ctx.user.id);
  }),

  // Get tier features
  getFeatures: publicProcedure.input(z.enum(["free", "premium"])).query(({ input }) => {
    const features = {
      free: {
        coursesAccess: "Beginner courses only",
        lessonsPerDay: "Unlimited",
        codeExecution: "Limited (5 runs/day)",
        aiTutor: false,
        certificates: false,
        leaderboard: false,
        friendChallenges: false,
        advancedAnalytics: false,
      },
      premium: {
        coursesAccess: "All courses",
        lessonsPerDay: "Unlimited",
        codeExecution: "Unlimited",
        aiTutor: true,
        certificates: true,
        leaderboard: true,
        friendChallenges: true,
        advancedAnalytics: true,
      },
    };

    return features[input];
  }),
});
