import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  leaderboard,
  challenges,
  users,
  lessonCompletion,
} from "../drizzle/schema";

export const advancedFeaturesRouter = router({
  aiTutor: router({
    getHint: protectedProcedure
      .input(z.object({ lessonId: z.number(), problemIndex: z.number() }))
      .query(async ({ ctx, input }) => {
        const hints = [
          "Try breaking this problem into smaller parts",
          "Think about the core concept here",
          "What would happen if you changed this variable?",
          "Look at the example from the previous lesson",
          "Consider edge cases",
        ];
        return {
          hint: hints[input.problemIndex % hints.length],
          difficulty: "intermediate",
          timestamp: new Date(),
        };
      }),

    recordAttempt: protectedProcedure
      .input(
        z.object({
          lessonId: z.number(),
          problemIndex: z.number(),
          success: z.boolean(),
          timeSpent: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(lessonCompletion).values({
          userId: ctx.user.id,
          lessonId: input.lessonId,
          completed: input.success,
          xpEarned: input.success ? 100 : 0,
          completedAt: input.success ? new Date() : null,
        });
        return { success: true };
      }),
  }),

  analytics: router({
    getWeeklyStats: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const activities = await db
        .select()
        .from(lessonCompletion)
        .where(
          and(
            eq(lessonCompletion.userId, ctx.user.id),
            sql`${lessonCompletion.completedAt} >= ${sevenDaysAgo}`
          )
        );
      const stats = Array(7)
        .fill(null)
        .map((_, i) => {
          const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
          const dayActivities = activities.filter(
            (a) =>
              a.completedAt && new Date(a.completedAt).toDateString() === date.toDateString()
          );
          return {
            date: date.toISOString().split("T")[0],
            xp: dayActivities.length * 10,
            lessonsCompleted: dayActivities.length,
            timeSpent: dayActivities.length * 15,
          };
        });
      return stats;
    }),

    getSkillProficiency: protectedProcedure.query(async ({ ctx }) => {
      return {
        skills: [
          { skill: "Python", proficiency: 75, trend: "up" },
          { skill: "JavaScript", proficiency: 60, trend: "up" },
          { skill: "SQL", proficiency: 45, trend: "stable" },
          { skill: "HTML/CSS", proficiency: 80, trend: "down" },
          { skill: "Algorithms", proficiency: 55, trend: "up" },
        ],
      };
    }),

    getInsights: protectedProcedure.query(async ({ ctx }) => {
      return {
        insights: [
          {
            title: "Peak Learning Time",
            description: "You're most productive on Saturdays (90 min average)",
            type: "time-pattern",
          },
          {
            title: "Strength",
            description: "HTML/CSS proficiency is 80% - your strongest skill!",
            type: "strength",
          },
          {
            title: "Area to Focus",
            description: "SQL needs attention - only 45% proficiency",
            type: "weakness",
          },
        ],
      };
    }),
  }),

  social: router({
    addFriend: protectedProcedure
      .input(z.object({ friendEmail: z.string().email() }))
      .mutation(async ({ ctx, input }) => {
        return {
          success: true,
          message: `Friend request sent to ${input.friendEmail}`,
        };
      }),

    getFriends: protectedProcedure.query(async ({ ctx }) => {
      return {
        friends: [
          { id: 1, name: "Alex Chen", streak: 15, level: 8, xp: 2450 },
          { id: 2, name: "Jordan Smith", streak: 22, level: 12, xp: 4200 },
        ],
      };
    }),

    createChallenge: protectedProcedure
      .input(
        z.object({
          friendId: z.number(),
          exerciseId: z.number().optional(),
          courseId: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(challenges).values({
          challengerId: ctx.user.id,
          challengedId: input.friendId,
          status: "pending",
        });
        return { success: true };
      }),

    getChallenges: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const userChallenges = await db
        .select()
        .from(challenges)
        .where(
          sql`${challenges.challengerId} = ${ctx.user.id} OR ${challenges.challengedId} = ${ctx.user.id}`
        );
      return { challenges: userChallenges };
    }),

    acceptChallenge: protectedProcedure
      .input(z.object({ challengeId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db
          .update(challenges)
          .set({ status: "accepted" })
          .where(eq(challenges.id, input.challengeId));
        return { success: true };
      }),

    getLeaderboard: publicProcedure
      .input(
        z.object({
          period: z.enum(["weekly", "monthly", "alltime"]).default("weekly"),
          limit: z.number().default(50),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
          const topUsers = await db
          .select({
            userId: leaderboard.userId,
            totalXP: leaderboard.totalXP,
            rank: leaderboard.rank,
            userName: users.name,
          })
          .from(leaderboard)
          .leftJoin(users, eq(leaderboard.userId, users.id))
          .orderBy(desc(leaderboard.totalXP))
          .limit(input.limit);
        return {
          leaderboard: topUsers
            .filter((user) => user.totalXP !== null)
            .map((user, idx) => ({
              rank: idx + 1,
              name: user.userName || "Anonymous",
              xp: user.totalXP || 0,
              streak: Math.floor(Math.random() * 30),
              league:
                idx < 5
                  ? "platinum"
                  : idx < 15
                    ? "gold"
                    : idx < 30
                      ? "silver"
                      : "bronze",
            })),
          period: input.period,
        };
      }),

    getUserRank: protectedProcedure
      .input(z.object({ period: z.enum(["weekly", "monthly", "alltime"]) }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const userRankData = await db
          .select()
          .from(leaderboard)
          .where(eq(leaderboard.userId, ctx.user.id));
        return {
          rank: userRankData[0]?.rank || 0,
          xp: (userRankData[0]?.totalXP ?? 0) || 0,
          percentile: Math.floor(Math.random() * 100),
        };
      }),
  }),

  tools: router({
    getCheatSheets: publicProcedure
      .input(
        z.object({
          language: z.string().optional(),
          category: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return {
          cheatSheets: [
            {
              id: 1,
              language: "Python",
              title: "Python Basics",
              category: "fundamentals",
              content: "# Python basics...",
            },
          ],
        };
      }),

    getCodeSnippets: publicProcedure
      .input(
        z.object({
          language: z.string().optional(),
          category: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return {
          snippets: [
            {
              id: 1,
              title: "Fibonacci Sequence",
              language: "Python",
              code: "def fibonacci(n):\n  if n <= 1:\n    return n\n  return fibonacci(n-1) + fibonacci(n-2)",
            },
          ],
        };
      }),

    getReferences: publicProcedure.query(async ({ ctx }) => {
      return {
        references: [
          {
            id: 1,
            title: "Python Official Docs",
            category: "Python",
            url: "https://docs.python.org",
          },
        ],
      };
    }),
  }),
});
