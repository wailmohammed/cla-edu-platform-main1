import { describe, it, expect } from "vitest";
import { websocketRouter } from "./websocket.router";
import { badgesRouter } from "./badges.router";
import { emailServiceRouter } from "./email-service.router";

const mockCtx = {
  user: { id: "test-user", email: "test@example.com" },
  req: {} as any,
  res: {} as any,
};

describe("Advanced Engagement Features", () => {
  describe("WebSocket Router", () => {
    it("should get active connections", async () => {
      const caller = websocketRouter.createCaller(mockCtx as any);
      const result = await caller.getActiveConnections();

      expect(result.totalConnections).toBeGreaterThan(0);
      expect(result.activeRooms).toBeGreaterThan(0);
      expect(result.connectionStatus).toBe("healthy");
    });

    it("should get realtime stats", async () => {
      const caller = websocketRouter.createCaller(mockCtx as any);
      const result = await caller.getRealtimeStats();

      expect(result.messagesPerSecond).toBeGreaterThan(0);
      expect(result.activeUsers).toBeGreaterThan(0);
      expect(result.uptime).toBeGreaterThan(0);
    });

    it("should emit streak milestone", async () => {
      const caller = websocketRouter.createCaller(mockCtx as any);
      const result = await caller.emitStreakMilestone({
        milestone: 25,
        badge: "Bronze",
        xpReward: 100,
      });

      expect(result.success).toBe(true);
      expect(result.eventEmitted).toBe(true);
      expect(result.event.milestone).toBe(25);
    });

    it("should emit referral bonus", async () => {
      const caller = websocketRouter.createCaller(mockCtx as any);
      const result = await caller.emitReferralBonus({
        referredUserName: "John Smith",
        bonusXP: 200,
        tier: "Silver",
      });

      expect(result.success).toBe(true);
      expect(result.eventEmitted).toBe(true);
      expect(result.event.bonusXP).toBe(200);
    });

    it("should broadcast message", async () => {
      const caller = websocketRouter.createCaller(mockCtx as any);
      const result = await caller.broadcastMessage({
        roomId: "room_123",
        content: "Hello everyone!",
        mentions: ["user_1", "user_2"],
      });

      expect(result.success).toBe(true);
      expect(result.broadcasted).toBe(true);
      expect(result.content).toBe("Hello everyone!");
    });

    it("should update presence", async () => {
      const caller = websocketRouter.createCaller(mockCtx as any);
      const result = await caller.updatePresence({
        roomId: "room_123",
        status: "online",
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe("online");
    });

    it("should send typing indicator", async () => {
      const caller = websocketRouter.createCaller(mockCtx as any);
      const result = await caller.sendTypingIndicator({
        roomId: "room_123",
        isTyping: true,
      });

      expect(result.success).toBe(true);
      expect(result.isTyping).toBe(true);
    });

    it("should get connection health", async () => {
      const caller = websocketRouter.createCaller(mockCtx as any);
      const result = await caller.getConnectionHealth();

      expect(result.status).toBe("healthy");
      expect(result.latency).toBeGreaterThan(0);
      expect(result.uptime).toBeGreaterThan(0);
    });

    it("should test connection", async () => {
      const caller = websocketRouter.createCaller(mockCtx as any);
      const result = await caller.testConnection();

      expect(result.success).toBe(true);
      expect(result.connectionTest).toBe("passed");
    });
  });

  describe("Badges Router", () => {
    it("should get user badges", async () => {
      const caller = badgesRouter.createCaller(mockCtx as any);
      const result = await caller.getUserBadges();

      expect(result.badges).toHaveLength(4);
      expect(result.totalBadges).toBe(4);
      expect(result.unlockedBadges).toBeGreaterThan(0);
    });

    it("should get badge details", async () => {
      const caller = badgesRouter.createCaller(mockCtx as any);
      const result = await caller.getBadgeDetails({
        badgeId: "badge_gold",
      });

      expect(result.id).toBe("badge_gold");
      expect(result.name).toBe("Gold Referrer");
      expect(result.requirement).toBe(20);
    });

    it("should get all badges", async () => {
      const caller = badgesRouter.createCaller(mockCtx as any);
      const result = await caller.getAllBadges();

      expect(result.badges).toHaveLength(5);
      expect(result.totalBadges).toBe(5);
    });

    it("should check badge unlock", async () => {
      const caller = badgesRouter.createCaller(mockCtx as any);
      const result = await caller.checkBadgeUnlock({
        badgeId: "badge_bronze",
      });

      expect(result.badgeId).toBe("badge_bronze");
      expect(result.unlocked).toBe(true);
    });

    it("should share badge", async () => {
      const caller = badgesRouter.createCaller(mockCtx as any);
      const result = await caller.shareBadge({
        badgeId: "badge_gold",
        platform: "twitter",
      });

      expect(result.success).toBe(true);
      expect(result.platform).toBe("twitter");
      expect(result.shareUrl).toContain("badge");
    });

    it("should get badge leaderboard", async () => {
      const caller = badgesRouter.createCaller(mockCtx as any);
      const result = await caller.getBadgeLeaderboard({
        tier: "Gold",
        limit: 10,
      });

      expect(result.tier).toBe("Gold");
      expect(result.leaderboard).toHaveLength(3);
      expect(result.leaderboard[0].rank).toBe(1);
    });

    it("should get badge progress", async () => {
      const caller = badgesRouter.createCaller(mockCtx as any);
      const result = await caller.getBadgeProgress();

      expect(result.currentBadge).toBeDefined();
      expect(result.nextBadge).toBeDefined();
      expect(result.milestones).toHaveLength(5);
    });

    it("should get badge rewards", async () => {
      const caller = badgesRouter.createCaller(mockCtx as any);
      const result = await caller.getBadgeRewards({
        tier: "Gold",
      });

      expect(result.tier).toBe("Gold");
      expect(result.rewards.xp).toBeGreaterThan(0);
    });

    it("should display badge on profile", async () => {
      const caller = badgesRouter.createCaller(mockCtx as any);
      const result = await caller.displayBadgeOnProfile({
        badgeId: "badge_gold",
        display: true,
      });

      expect(result.success).toBe(true);
      expect(result.displayed).toBe(true);
    });

    it("should get displayed badges", async () => {
      const caller = badgesRouter.createCaller(mockCtx as any);
      const result = await caller.getDisplayedBadges();

      expect(result.displayedBadges).toBeDefined();
      expect(result.maxDisplayed).toBeGreaterThan(0);
    });

    it("should get badge stats", async () => {
      const caller = badgesRouter.createCaller(mockCtx as any);
      const result = await caller.getBadgeStats();

      expect(result.totalBadges).toBe(5);
      expect(result.userBadges).toBeGreaterThan(0);
      expect(result.raretyDistribution).toBeDefined();
    });
  });

  describe("Email Service Router", () => {
    it("should send streak reminder email", async () => {
      const caller = emailServiceRouter.createCaller(mockCtx as any);
      const result = await caller.sendStreakReminderEmail({
        streakDays: 23,
        nextMilestone: 30,
        daysUntilMilestone: 7,
      });

      expect(result.success).toBe(true);
      expect(result.emailSent).toBe(true);
      expect(result.templateId).toBe("streak_reminder");
    });

    it("should send referral bonus email", async () => {
      const caller = emailServiceRouter.createCaller(mockCtx as any);
      const result = await caller.sendReferralBonusEmail({
        referredName: "John Smith",
        bonusXP: 200,
        tier: "Silver",
        totalReferrals: 8,
        totalBonusXP: 1600,
        nextTier: "Gold",
        referralsUntilNextTier: 12,
      });

      expect(result.success).toBe(true);
      expect(result.emailSent).toBe(true);
      expect(result.templateId).toBe("referral_bonus");
    });

    it("should send achievement email", async () => {
      const caller = emailServiceRouter.createCaller(mockCtx as any);
      const result = await caller.sendAchievementEmail({
        achievementName: "First Course Completed",
        icon: "🎓",
        description: "You completed your first course!",
        xpReward: 500,
        badgeName: "Scholar",
      });

      expect(result.success).toBe(true);
      expect(result.emailSent).toBe(true);
      expect(result.templateId).toBe("achievement_unlocked");
    });

    it("should send event invitation email", async () => {
      const caller = emailServiceRouter.createCaller(mockCtx as any);
      const result = await caller.sendEventInvitationEmail({
        eventName: "Python Bootcamp",
        eventDate: "2026-06-15",
        eventTime: "18:00",
        eventLocation: "Online",
        eventDescription: "Learn Python from scratch",
        participantCount: 150,
        highlights: ["Live coding", "Q&A session", "Certificate"],
      });

      expect(result.success).toBe(true);
      expect(result.emailSent).toBe(true);
      expect(result.templateId).toBe("event_invitation");
    });

    it("should send certificate email", async () => {
      const caller = emailServiceRouter.createCaller(mockCtx as any);
      const result = await caller.sendCertificateEmail({
        courseName: "JavaScript Mastery",
        completionDate: "2026-06-07",
        lessonsCompleted: 25,
        xpEarned: 2500,
        skillsLearned: 12,
      });

      expect(result.success).toBe(true);
      expect(result.emailSent).toBe(true);
      expect(result.templateId).toBe("certificate_earned");
    });

    it("should get email preferences", async () => {
      const caller = emailServiceRouter.createCaller(mockCtx as any);
      const result = await caller.getEmailPreferences();

      expect(result.streakReminders).toBe(true);
      expect(result.referralBonuses).toBe(true);
      expect(result.frequency).toBeDefined();
    });

    it("should update email preferences", async () => {
      const caller = emailServiceRouter.createCaller(mockCtx as any);
      const result = await caller.updateEmailPreferences({
        streakReminders: false,
        frequency: "weekly",
      });

      expect(result.success).toBe(true);
      expect(result.updated).toBe(true);
      expect(result.preferences.frequency).toBe("weekly");
    });

    it("should schedule email", async () => {
      const caller = emailServiceRouter.createCaller(mockCtx as any);
      const result = await caller.scheduleEmail({
        templateId: "streak_reminder",
        recipientEmail: "test@example.com",
        data: { streakDays: 10 },
        scheduledTime: "2026-06-08T09:00:00Z",
      });

      expect(result.success).toBe(true);
      expect(result.scheduled).toBe(true);
      expect(result.status).toBe("scheduled");
    });

    it("should get email history", async () => {
      const caller = emailServiceRouter.createCaller(mockCtx as any);
      const result = await caller.getEmailHistory({
        limit: 20,
        offset: 0,
      });

      expect(result.emails).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.openRate).toBeGreaterThan(0);
    });

    it("should get email stats", async () => {
      const caller = emailServiceRouter.createCaller(mockCtx as any);
      const result = await caller.getEmailStats();

      expect(result.totalEmailsSent).toBeGreaterThan(0);
      expect(result.averageOpenRate).toBeGreaterThan(0);
      expect(result.topTemplate).toBeDefined();
    });

    it("should unsubscribe from emails", async () => {
      const caller = emailServiceRouter.createCaller(mockCtx as any);
      const result = await caller.unsubscribeFromEmails();

      expect(result.success).toBe(true);
      expect(result.unsubscribed).toBe(true);
    });

    it("should resubscribe to emails", async () => {
      const caller = emailServiceRouter.createCaller(mockCtx as any);
      const result = await caller.resubscribeToEmails();

      expect(result.success).toBe(true);
      expect(result.resubscribed).toBe(true);
    });

    it("should test email delivery", async () => {
      const caller = emailServiceRouter.createCaller(mockCtx as any);
      const result = await caller.testEmailDelivery();

      expect(result.success).toBe(true);
      expect(result.testEmailSent).toBe(true);
    });
  });
});
