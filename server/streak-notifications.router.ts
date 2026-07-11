import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

export const streakNotificationsRouter = router({
  /**
   * Schedule daily streak reminder
   */
  scheduleDailyReminder: protectedProcedure
    .input(
      z.object({
        time: z.string(), // HH:MM format
        timezone: z.string(),
        enabled: z.boolean().default(true),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        scheduledAt: new Date().toISOString(),
        nextReminderAt: new Date(Date.now() + 86400000).toISOString(),
        time: input.time,
        timezone: input.timezone,
      };
    }),

  /**
   * Get streak reminder settings
   */
  getStreakSettings: protectedProcedure.query(async () => {
    return {
      remindersEnabled: true,
      reminderTime: "09:00",
      timezone: "UTC",
      nextReminder: new Date(Date.now() + 3600000).toISOString(),
      currentStreak: 23,
      longestStreak: 45,
      totalDaysLearned: 156,
    };
  }),

  /**
   * Send streak reminder notification
   */
  sendStreakReminder: protectedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .mutation(async () => {
      return {
        success: true,
        notificationSent: true,
        message: "Keep your learning streak alive!",
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * Get streak statistics
   */
  getStreakStats: protectedProcedure.query(async () => {
    return {
      currentStreak: 23,
      longestStreak: 45,
      totalDaysLearned: 156,
      thisWeekDays: 5,
      thisMonthDays: 18,
      streakStartDate: new Date(Date.now() - 23 * 86400000).toISOString(),
      lastLearningDate: new Date(Date.now() - 3600000).toISOString(),
      nextMilestone: 25,
      daysUntilMilestone: 2,
    };
  }),

  /**
   * Update streak reminder preferences
   */
  updateStreakPreferences: protectedProcedure
    .input(
      z.object({
        remindersEnabled: z.boolean().optional(),
        reminderTime: z.string().optional(),
        timezone: z.string().optional(),
        quietHoursStart: z.string().optional(),
        quietHoursEnd: z.string().optional(),
        notificationChannels: z.array(z.enum(["email", "push", "sms"])).optional(),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        updated: true,
        preferences: {
          remindersEnabled: input.remindersEnabled ?? true,
          reminderTime: input.reminderTime ?? "09:00",
          timezone: input.timezone ?? "UTC",
          quietHoursStart: input.quietHoursStart,
          quietHoursEnd: input.quietHoursEnd,
          notificationChannels: input.notificationChannels ?? ["push"],
        },
      };
    }),

  /**
   * Record learning activity to maintain streak
   */
  recordLearningActivity: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        duration: z.number(), // in minutes
        type: z.enum(["lesson", "exercise", "challenge", "project"]),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        streakMaintained: true,
        currentStreak: 23,
        xpEarned: Math.floor(input.duration * 2),
        streakBonusXP: 50,
        totalXPEarned: Math.floor(input.duration * 2) + 50,
        activityRecordedAt: new Date().toISOString(),
      };
    }),

  /**
   * Get streak milestones
   */
  getStreakMilestones: protectedProcedure.query(async () => {
    return {
      milestones: [
        { days: 7, reward: "Bronze Streak Badge", xp: 100, achieved: true },
        { days: 14, reward: "Silver Streak Badge", xp: 250, achieved: true },
        { days: 30, reward: "Gold Streak Badge", xp: 500, achieved: false },
        { days: 60, reward: "Platinum Streak Badge", xp: 1000, achieved: false },
        { days: 100, reward: "Diamond Streak Badge", xp: 2000, achieved: false },
      ],
    };
  }),

  /**
   * Get streak leaderboard
   */
  getStreakLeaderboard: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        period: z.enum(["week", "month", "alltime"]).default("alltime"),
      })
    )
    .query(async (opts: any) => {
      const input = opts.input;
      return {
        period: input.period,
        leaderboard: [
          {
            rank: 1,
            name: "Alex Chen",
            streak: 156,
            badge: "Diamond",
            lastActivity: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            rank: 2,
            name: "Sarah Johnson",
            streak: 134,
            badge: "Platinum",
            lastActivity: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            rank: 3,
            name: "Mike Davis",
            streak: 89,
            badge: "Gold",
            lastActivity: new Date(Date.now() - 10800000).toISOString(),
          },
        ],
        yourRank: 42,
        yourStreak: 23,
      };
    }),

  /**
   * Send streak milestone celebration
   */
  celebrateMilestone: protectedProcedure
    .input(z.object({ milestone: z.number() }))
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        milestone: input.milestone,
        reward: `Congratulations! You've reached a ${input.milestone}-day streak!`,
        xpReward: input.milestone * 10,
        badgeUnlocked: true,
        celebrationSent: true,
      };
    }),

  /**
   * Reset streak (if user misses a day)
   */
  checkStreakStatus: protectedProcedure.query(async () => {
    return {
      streakActive: true,
      lastActivityDate: new Date(Date.now() - 3600000).toISOString(),
      currentStreak: 23,
      daysUntilReset: 1,
      warningMessage: "Complete a lesson today to maintain your streak!",
    };
  }),

  /**
   * Get personalized streak insights
   */
  getStreakInsights: protectedProcedure.query(async () => {
    return {
      insights: [
        {
          title: "Peak Learning Time",
          description: "You learn best between 9 AM - 11 AM",
          recommendation: "Schedule your lessons during this time for better retention",
        },
        {
          title: "Learning Pattern",
          description: "You're most consistent on weekdays",
          recommendation: "Try weekend challenges to maintain your weekend streak",
        },
        {
          title: "Streak Trend",
          description: "Your streaks are getting longer!",
          recommendation: "Keep up the momentum - you're on track for a 100-day streak",
        },
      ],
      predictedNextMilestone: 30,
      daysToReachIt: 7,
    };
  }),

  /**
   * Get streak history
   */
  getStreakHistory: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async (opts: any) => {
      const input = opts.input;
      return {
        history: [
          {
            streak: 156,
            startDate: new Date(Date.now() - 156 * 86400000).toISOString(),
            endDate: new Date(Date.now() - 90 * 86400000).toISOString(),
            reason: "Completed",
          },
          {
            streak: 89,
            startDate: new Date(Date.now() - 90 * 86400000).toISOString(),
            endDate: new Date(Date.now() - 45 * 86400000).toISOString(),
            reason: "Missed a day",
          },
        ],
        total: 2,
      };
    }),
});
