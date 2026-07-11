import { describe, it, expect } from "vitest";
import { streakNotificationsRouter } from "./streak-notifications.router";

const mockCtx = {
  user: { id: "test-user", email: "test@example.com" },
  req: {} as any,
  res: {} as any,
};

describe("Streak Notifications Router", () => {
  it("should schedule daily reminder", async () => {
    const caller = streakNotificationsRouter.createCaller(mockCtx as any);
    const result = await caller.scheduleDailyReminder({
      time: "09:00",
      timezone: "UTC",
      enabled: true,
    });

    expect(result.success).toBe(true);
    expect(result.time).toBe("09:00");
    expect(result.timezone).toBe("UTC");
  });

  it("should get streak settings", async () => {
    const caller = streakNotificationsRouter.createCaller(mockCtx as any);
    const result = await caller.getStreakSettings();

    expect(result.remindersEnabled).toBe(true);
    expect(result.currentStreak).toBe(23);
    expect(result.longestStreak).toBe(45);
  });

  it("should send streak reminder", async () => {
    const caller = streakNotificationsRouter.createCaller(mockCtx as any);
    const result = await caller.sendStreakReminder({});

    expect(result.success).toBe(true);
    expect(result.notificationSent).toBe(true);
  });

  it("should get streak statistics", async () => {
    const caller = streakNotificationsRouter.createCaller(mockCtx as any);
    const result = await caller.getStreakStats();

    expect(result.currentStreak).toBe(23);
    expect(result.longestStreak).toBe(45);
    expect(result.totalDaysLearned).toBe(156);
  });

  it("should update streak preferences", async () => {
    const caller = streakNotificationsRouter.createCaller(mockCtx as any);
    const result = await caller.updateStreakPreferences({
      remindersEnabled: false,
      reminderTime: "10:00",
      timezone: "EST",
    });

    expect(result.success).toBe(true);
    expect(result.updated).toBe(true);
    expect(result.preferences.remindersEnabled).toBe(false);
  });

  it("should record learning activity", async () => {
    const caller = streakNotificationsRouter.createCaller(mockCtx as any);
    const result = await caller.recordLearningActivity({
      courseId: "course_1",
      duration: 30,
      type: "lesson",
    });

    expect(result.success).toBe(true);
    expect(result.streakMaintained).toBe(true);
    expect(result.xpEarned).toBeGreaterThan(0);
  });

  it("should get streak milestones", async () => {
    const caller = streakNotificationsRouter.createCaller(mockCtx as any);
    const result = await caller.getStreakMilestones();

    expect(result.milestones).toHaveLength(5);
    expect(result.milestones[0].days).toBe(7);
  });

  it("should get streak leaderboard", async () => {
    const caller = streakNotificationsRouter.createCaller(mockCtx as any);
    const result = await caller.getStreakLeaderboard({
      limit: 10,
      period: "alltime",
    });

    expect(result.leaderboard).toHaveLength(3);
    expect(result.leaderboard[0].rank).toBe(1);
  });

  it("should check streak status", async () => {
    const caller = streakNotificationsRouter.createCaller(mockCtx as any);
    const result = await caller.checkStreakStatus();

    expect(result.streakActive).toBe(true);
    expect(result.currentStreak).toBe(23);
  });

  it("should get streak insights", async () => {
    const caller = streakNotificationsRouter.createCaller(mockCtx as any);
    const result = await caller.getStreakInsights();

    expect(result.insights).toHaveLength(3);
    expect(result.predictedNextMilestone).toBe(30);
  });
});
