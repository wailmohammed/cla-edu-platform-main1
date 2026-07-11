import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { z } from "zod";

export const leaderboardRouter = router({
  // Get global leaderboard
  getGlobalLeaderboard: publicProcedure
    .input(z.object({ limit: z.number().default(100), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      const leaderboard = [
        {
          rank: 1,
          userId: "user_1",
          userName: "Alex Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
          totalPoints: 15420,
          coursesCompleted: 12,
          streakDays: 45,
          badges: ["Fast Learner", "Code Master", "Consistent"],
        },
        {
          rank: 2,
          userId: "user_2",
          userName: "Sarah Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          totalPoints: 14850,
          coursesCompleted: 11,
          streakDays: 38,
          badges: ["Problem Solver", "Consistent"],
        },
        {
          rank: 3,
          userId: "user_3",
          userName: "Mike Rodriguez",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
          totalPoints: 13920,
          coursesCompleted: 10,
          streakDays: 32,
          badges: ["Code Master", "Rising Star"],
        },
        {
          rank: 4,
          userId: "user_4",
          userName: "Emma Wilson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
          totalPoints: 12540,
          coursesCompleted: 9,
          streakDays: 28,
          badges: ["Fast Learner"],
        },
        {
          rank: 5,
          userId: "user_5",
          userName: "David Lee",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
          totalPoints: 11800,
          coursesCompleted: 8,
          streakDays: 25,
          badges: ["Consistent"],
        },
      ];

      return {
        leaderboard,
        total: leaderboard.length,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  // Get user rank
  getUserRank: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return {
        userId: input.userId,
        rank: 42,
        percentile: 95,
        totalPoints: 8540,
        coursesCompleted: 6,
        streakDays: 15,
      };
    }),

  // Get leaderboard by category
  getLeaderboardByCategory: publicProcedure
    .input(
      z.object({
        category: z.enum(["points", "courses_completed", "streak", "achievements"]),
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      const categoryLeaderboards = {
        points: [
          { rank: 1, userName: "Alex Chen", value: 15420 },
          { rank: 2, userName: "Sarah Johnson", value: 14850 },
          { rank: 3, userName: "Mike Rodriguez", value: 13920 },
        ],
        courses_completed: [
          { rank: 1, userName: "Alex Chen", value: 12 },
          { rank: 2, userName: "Sarah Johnson", value: 11 },
          { rank: 3, userName: "Mike Rodriguez", value: 10 },
        ],
        streak: [
          { rank: 1, userName: "Alex Chen", value: 45 },
          { rank: 2, userName: "Sarah Johnson", value: 38 },
          { rank: 3, userName: "Mike Rodriguez", value: 32 },
        ],
        achievements: [
          { rank: 1, userName: "Alex Chen", value: 8 },
          { rank: 2, userName: "Sarah Johnson", value: 6 },
          { rank: 3, userName: "Mike Rodriguez", value: 5 },
        ],
      };

      return categoryLeaderboards[input.category];
    }),

  // Get weekly leaderboard
  getWeeklyLeaderboard: publicProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return {
        period: "This Week",
        leaderboard: [
          {
            rank: 1,
            userName: "Alex Chen",
            weeklyPoints: 2840,
            lessonsCompleted: 8,
          },
          {
            rank: 2,
            userName: "Sarah Johnson",
            weeklyPoints: 2650,
            lessonsCompleted: 7,
          },
          {
            rank: 3,
            userName: "Mike Rodriguez",
            weeklyPoints: 2420,
            lessonsCompleted: 6,
          },
        ],
      };
    }),

  // Get monthly leaderboard
  getMonthlyLeaderboard: publicProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return {
        period: "This Month",
        leaderboard: [
          {
            rank: 1,
            userName: "Alex Chen",
            monthlyPoints: 12540,
            coursesCompleted: 3,
          },
          {
            rank: 2,
            userName: "Sarah Johnson",
            monthlyPoints: 11820,
            coursesCompleted: 2,
          },
          {
            rank: 3,
            userName: "Mike Rodriguez",
            monthlyPoints: 10950,
            coursesCompleted: 2,
          },
        ],
      };
    }),

  // Get friends leaderboard
  getFriendsLeaderboard: protectedProcedure
    .input(z.object({ userId: z.string(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return {
        userId: input.userId,
        friends: [
          {
            rank: 1,
            userName: "You",
            totalPoints: 8540,
            coursesCompleted: 6,
          },
          {
            rank: 2,
            userName: "John Doe",
            totalPoints: 7820,
            coursesCompleted: 5,
          },
          {
            rank: 3,
            userName: "Jane Smith",
            totalPoints: 6540,
            coursesCompleted: 4,
          },
        ],
      };
    }),

  // Record points earned
  recordPointsEarned: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        points: z.number(),
        reason: z.string(),
        courseId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return {
        success: true,
        userId: input.userId,
        pointsEarned: input.points,
        reason: input.reason,
        newTotal: 8540 + input.points,
        timestamp: new Date().toISOString(),
      };
    }),

  // Update streak
  updateStreak: protectedProcedure
    .input(z.object({ userId: z.string(), daysActive: z.number() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        userId: input.userId,
        currentStreak: input.daysActive,
        longestStreak: 45,
        lastActiveDate: new Date().toISOString(),
      };
    }),

  // Get leaderboard statistics
  getLeaderboardStats: publicProcedure.query(async () => {
    return {
      totalUsers: 53415,
      totalPoints: 1234567890,
      averagePointsPerUser: 23100,
      topUser: "Alex Chen",
      topUserPoints: 15420,
      lastUpdated: new Date().toISOString(),
    };
  }),
});
