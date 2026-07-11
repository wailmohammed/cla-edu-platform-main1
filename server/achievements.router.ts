import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { z } from "zod";

export const achievementsRouter = router({
  // Get all available achievements
  getAllAchievements: publicProcedure.query(async () => {
    return {
      achievements: [
        {
          id: 1,
          name: "First Steps",
          description: "Complete your first lesson",
          icon: "🚀",
          points: 10,
          rarity: "common",
        },
        {
          id: 2,
          name: "Fast Learner",
          description: "Complete 5 courses in 30 days",
          icon: "⚡",
          points: 50,
          rarity: "rare",
        },
        {
          id: 3,
          name: "Code Master",
          description: "Solve 100 code challenges",
          icon: "🧠",
          points: 100,
          rarity: "epic",
        },
        {
          id: 4,
          name: "Consistent",
          description: "Maintain a 30-day learning streak",
          icon: "🔥",
          points: 75,
          rarity: "rare",
        },
        {
          id: 5,
          name: "Problem Solver",
          description: "Get 10 correct solutions in a row",
          icon: "🎯",
          points: 40,
          rarity: "uncommon",
        },
        {
          id: 6,
          name: "Rising Star",
          description: "Reach top 10% of leaderboard",
          icon: "⭐",
          points: 150,
          rarity: "legendary",
        },
        {
          id: 7,
          name: "Mentor",
          description: "Help 10 other learners",
          icon: "👨‍🏫",
          points: 80,
          rarity: "rare",
        },
        {
          id: 8,
          name: "Perfectionist",
          description: "Score 100% on 5 challenges",
          icon: "💯",
          points: 60,
          rarity: "uncommon",
        },
      ],
    };
  }),

  // Get user achievements
  getUserAchievements: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return {
        userId: input.userId,
        earnedAchievements: [
          {
            id: 1,
            name: "First Steps",
            description: "Complete your first lesson",
            icon: "🚀",
            points: 10,
            unlockedAt: "2026-05-01T10:30:00Z",
          },
          {
            id: 2,
            name: "Fast Learner",
            description: "Complete 5 courses in 30 days",
            icon: "⚡",
            points: 50,
            unlockedAt: "2026-05-15T14:20:00Z",
          },
          {
            id: 4,
            name: "Consistent",
            description: "Maintain a 30-day learning streak",
            icon: "🔥",
            points: 75,
            unlockedAt: "2026-05-20T09:45:00Z",
          },
        ],
        totalPoints: 135,
        progress: {
          "Code Master": { current: 42, target: 100 },
          "Problem Solver": { current: 8, target: 10 },
          "Rising Star": { current: 42, target: 5346 },
        },
      };
    }),

  // Unlock achievement
  unlockAchievement: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        achievementId: z.number(),
        achievementName: z.string(),
        points: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return {
        success: true,
        userId: input.userId,
        achievementId: input.achievementId,
        achievementName: input.achievementName,
        pointsEarned: input.points,
        unlockedAt: new Date().toISOString(),
      };
    }),

  // Share achievement
  shareAchievement: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        achievementId: z.number(),
        platform: z.enum(["twitter", "linkedin", "facebook", "email"]),
        customMessage: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const shareMessages = {
        twitter: `🎉 I just unlocked an achievement on Codelearnify! #Codelearnify #Achievement`,
        linkedin: `I'm excited to share that I've achieved a new milestone on Codelearnify!`,
        facebook: `I just earned a new achievement on Codelearnify! Join me in learning.`,
        email: `I wanted to share my achievement with you!`,
      };

      return {
        success: true,
        userId: input.userId,
        achievementId: input.achievementId,
        platform: input.platform,
        shareUrl: `https://codelearnify.com/achievement/${input.achievementId}`,
        message: input.customMessage || shareMessages[input.platform],
        sharedAt: new Date().toISOString(),
      };
    }),

  // Get achievement details
  getAchievementDetails: publicProcedure
    .input(z.object({ achievementId: z.number() }))
    .query(async ({ input }) => {
      const achievements: Record<number, any> = {
        1: {
          id: 1,
          name: "First Steps",
          description: "Complete your first lesson",
          icon: "🚀",
          points: 10,
          rarity: "common",
          unlockedBy: 45230,
          unlockPercentage: 84.7,
          howToUnlock: "Complete any lesson in any course",
        },
        2: {
          id: 2,
          name: "Fast Learner",
          description: "Complete 5 courses in 30 days",
          icon: "⚡",
          points: 50,
          rarity: "rare",
          unlockedBy: 12340,
          unlockPercentage: 23.1,
          howToUnlock: "Enroll and complete 5 courses within a 30-day period",
        },
      };

      return achievements[input.achievementId] || { error: "Achievement not found" };
    }),

  // Get achievement leaderboard
  getAchievementLeaderboard: publicProcedure
    .input(z.object({ achievementId: z.number(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return {
        achievementId: input.achievementId,
        leaderboard: [
          {
            rank: 1,
            userName: "Alex Chen",
            unlockedAt: "2026-05-01T10:30:00Z",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
          },
          {
            rank: 2,
            userName: "Sarah Johnson",
            unlockedAt: "2026-05-02T14:20:00Z",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          },
          {
            rank: 3,
            userName: "Mike Rodriguez",
            unlockedAt: "2026-05-03T09:45:00Z",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
          },
        ],
      };
    }),

  // Get achievement progress
  getAchievementProgress: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return {
        userId: input.userId,
        totalAchievements: 8,
        earnedAchievements: 3,
        completionPercentage: 37.5,
        totalPoints: 135,
        nextAchievements: [
          {
            name: "Code Master",
            description: "Solve 100 code challenges",
            progress: 42,
            target: 100,
            percentComplete: 42,
            pointsReward: 100,
          },
          {
            name: "Problem Solver",
            description: "Get 10 correct solutions in a row",
            progress: 8,
            target: 10,
            percentComplete: 80,
            pointsReward: 40,
          },
        ],
      };
    }),

  // Get badge collection
  getBadgeCollection: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return {
        userId: input.userId,
        badges: [
          {
            id: 1,
            name: "First Steps",
            icon: "🚀",
            color: "blue",
            unlockedAt: "2026-05-01",
          },
          {
            id: 2,
            name: "Fast Learner",
            icon: "⚡",
            color: "yellow",
            unlockedAt: "2026-05-15",
          },
          {
            id: 4,
            name: "Consistent",
            icon: "🔥",
            color: "red",
            unlockedAt: "2026-05-20",
          },
        ],
        totalBadges: 3,
        displayBadges: [1, 2, 4],
      };
    }),

  // Update badge display
  updateBadgeDisplay: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        displayBadges: z.array(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      return {
        success: true,
        userId: input.userId,
        displayBadges: input.displayBadges,
        updatedAt: new Date().toISOString(),
      };
    }),

  // Get achievement statistics
  getAchievementStats: publicProcedure.query(async () => {
    return {
      totalAchievements: 8,
      totalUnlocks: 234567,
      mostCommonAchievement: "First Steps",
      mostRareAchievement: "Rising Star",
      averageAchievementsPerUser: 3.2,
      averagePointsPerUser: 32,
    };
  }),
});
