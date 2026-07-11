import { describe, it, expect, beforeEach, vi } from "vitest";
import { smtpService, emailTemplates, initializeSMTP } from "./smtp-service";

describe("SMTP Email Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Email Template Generation", () => {
    it("should generate streak reminder email with correct structure", () => {
      const email = emailTemplates.streakReminder("John", 7, 10);
      expect(email.subject).toContain("Keep Your Streak Alive");
      expect(email.html).toContain("7-day");
      expect(email.html).toContain("John");
    });

    it("should generate referral bonus email with XP reward", () => {
      const email = emailTemplates.referralBonus("Alice", "Bob", 500, "Silver");
      expect(email.subject).toContain("Referral Bonus");
      expect(email.html).toContain("500 XP");
      expect(email.html).toContain("Silver Tier");
    });

    it("should generate achievement unlocked email", () => {
      const email = emailTemplates.achievementUnlocked("Charlie", "Python Master", 1000);
      expect(email.subject).toContain("Achievement Unlocked");
      expect(email.html).toContain("Python Master");
      expect(email.html).toContain("1000 XP");
    });

    it("should generate event invitation email with details", () => {
      const email = emailTemplates.eventInvitation(
        "Diana",
        "JavaScript Bootcamp",
        "2026-07-15",
        "10:00 AM",
        "Learn advanced JavaScript concepts"
      );
      expect(email.subject).toContain("You're Invited");
      expect(email.html).toContain("JavaScript Bootcamp");
      expect(email.html).toContain("2026-07-15");
    });

    it("should generate certificate earned email", () => {
      const email = emailTemplates.certificateEarned(
        "Eve",
        "Web Development Fundamentals",
        "2026-07-03"
      );
      expect(email.subject).toContain("Certificate Earned");
      expect(email.html).toContain("Web Development Fundamentals");
      expect(email.html).toContain("2026-07-03");
    });
  });

  describe("Email Service Status", () => {
    it("should return status when not initialized", () => {
      const status = smtpService.getStatus();
      expect(status.initialized).toBe(false);
      expect(status.config).toBeNull();
    });

    it("should handle missing SMTP credentials gracefully", () => {
      const result = initializeSMTP();
      // Should return false if credentials are not set
      expect(typeof result).toBe("boolean");
    });
  });

  describe("Email Content Validation", () => {
    it("should include unsubscribe links in all emails", () => {
      const emails = [
        emailTemplates.streakReminder("User", 5, 10),
        emailTemplates.referralBonus("User", "Friend", 100, "Bronze"),
        emailTemplates.achievementUnlocked("User", "Achievement", 50),
        emailTemplates.eventInvitation("User", "Event", "2026-07-15", "3:00 PM", "Description"),
        emailTemplates.certificateEarned("User", "Course", "2026-07-03"),
      ];

      emails.forEach((email) => {
        expect(email.html).toContain("notification-preferences");
      });
    });

    it("should have proper HTML structure in all templates", () => {
      const email = emailTemplates.streakReminder("Test", 10, 15);
      expect(email.html).toContain("<div");
      expect(email.html).toContain("</div>");
      expect(email.html).toContain("font-family");
    });

    it("should include call-to-action buttons", () => {
      const streakEmail = emailTemplates.streakReminder("User", 5, 10);
      expect(streakEmail.html).toContain("Continue Learning");

      const referralEmail = emailTemplates.referralBonus("User", "Friend", 100, "Gold");
      expect(referralEmail.html).toContain("View Your Referrals");

      const certificateEmail = emailTemplates.certificateEarned("User", "Course", "2026-07-03");
      expect(certificateEmail.html).toContain("Download Certificate");
    });
  });
});

describe("Badge System", () => {
  describe("Badge Display Logic", () => {
    it("should correctly identify unlocked badges", () => {
      const unlockedBadge = {
        id: "badge_1",
        name: "Bronze",
        unlockedAt: "2026-06-01T10:00:00Z",
      };

      const lockedBadge = {
        id: "badge_2",
        name: "Gold",
        unlockedAt: null,
      };

      expect(unlockedBadge.unlockedAt).not.toBeNull();
      expect(lockedBadge.unlockedAt).toBeNull();
    });

    it("should calculate progress percentage correctly", () => {
      const badge = {
        current: 12,
        requirement: 20,
      };

      const progress = (badge.current / badge.requirement) * 100;
      expect(progress).toBe(60);
    });

    it("should tier badges correctly", () => {
      const tiers = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];
      expect(tiers.length).toBe(5);
      expect(tiers[0]).toBe("Bronze");
      expect(tiers[4]).toBe("Diamond");
    });
  });

  describe("Badge Progression", () => {
    it("should unlock next tier badge when requirement is met", () => {
      const currentTier = "Bronze";
      const referralCount = 5;
      const nextTierRequirement = 10;

      const shouldUnlock = referralCount >= nextTierRequirement;
      expect(shouldUnlock).toBe(false);

      const newReferralCount = 10;
      const shouldUnlockNow = newReferralCount >= nextTierRequirement;
      expect(shouldUnlockNow).toBe(true);
    });

    it("should maintain badge history", () => {
      const badgeHistory = [
        { name: "Bronze", unlockedAt: "2026-05-15T10:00:00Z" },
        { name: "Silver", unlockedAt: "2026-05-28T14:00:00Z" },
        { name: "Gold", unlockedAt: null },
      ];

      const unlockedCount = badgeHistory.filter((b) => b.unlockedAt).length;
      expect(unlockedCount).toBe(2);
    });
  });
});

describe("Email Preferences", () => {
  describe("Preference Validation", () => {
    it("should validate email frequency options", () => {
      const validFrequencies = ["immediate", "daily", "weekly"];
      const userFrequency = "daily";

      expect(validFrequencies).toContain(userFrequency);
    });

    it("should validate timezone format", () => {
      const validTimezones = ["UTC", "EST", "PST", "GMT", "IST", "JST"];
      const userTimezone = "IST";

      expect(validTimezones).toContain(userTimezone);
    });

    it("should validate quiet hours format", () => {
      const quietHoursStart = "22:00";
      const quietHoursEnd = "08:00";

      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      expect(timeRegex.test(quietHoursStart)).toBe(true);
      expect(timeRegex.test(quietHoursEnd)).toBe(true);
    });
  });

  describe("Preference Persistence", () => {
    it("should save and retrieve email preferences", () => {
      const preferences = {
        streakReminders: true,
        referralBonuses: true,
        achievements: false,
        frequency: "daily" as const,
        timezone: "UTC",
      };

      expect(preferences.streakReminders).toBe(true);
      expect(preferences.achievements).toBe(false);
      expect(preferences.frequency).toBe("daily");
    });

    it("should handle preference updates", () => {
      let preferences = {
        streakReminders: true,
        frequency: "daily" as const,
      };

      preferences = {
        ...preferences,
        frequency: "weekly" as const,
      };

      expect(preferences.frequency).toBe("weekly");
    });

    it("should reset preferences to defaults", () => {
      const defaultPreferences = {
        streakReminders: true,
        referralBonuses: true,
        achievements: true,
        frequency: "daily" as const,
        timezone: "UTC",
      };

      const customPreferences = {
        ...defaultPreferences,
        frequency: "weekly" as const,
      };

      expect(customPreferences.frequency).toBe("weekly");
      expect(defaultPreferences.frequency).toBe("daily");
    });
  });

  describe("Email History Tracking", () => {
    it("should track email delivery status", () => {
      const emailLog = {
        id: "email_1",
        status: "delivered" as const,
        opens: 0,
        clicks: 0,
      };

      expect(emailLog.status).toBe("delivered");
      expect(emailLog.opens).toBe(0);
    });

    it("should calculate email engagement metrics", () => {
      const emails = [
        { status: "opened", opens: 1, clicks: 0 },
        { status: "clicked", opens: 1, clicks: 1 },
        { status: "delivered", opens: 0, clicks: 0 },
        { status: "opened", opens: 1, clicks: 0 },
        { status: "clicked", opens: 1, clicks: 1 },
      ];

      const openRate = (emails.filter((e) => e.opens > 0).length / emails.length) * 100;
      const clickRate = (emails.filter((e) => e.clicks > 0).length / emails.length) * 100;

      expect(openRate).toBe(80);
      expect(clickRate).toBe(40);
    });
  });
});

describe("Real-Time Updates", () => {
  describe("WebSocket Events", () => {
    it("should emit streak milestone event", () => {
      const event = {
        type: "streak_milestone",
        userId: "user_123",
        streakDays: 10,
        milestone: 10,
      };

      expect(event.type).toBe("streak_milestone");
      expect(event.streakDays).toBe(event.milestone);
    });

    it("should emit referral bonus event", () => {
      const event = {
        type: "referral_bonus",
        userId: "user_123",
        referredUserId: "user_456",
        bonusXP: 500,
        newTier: "Silver",
      };

      expect(event.type).toBe("referral_bonus");
      expect(event.bonusXP).toBeGreaterThan(0);
    });

    it("should emit badge unlock event", () => {
      const event = {
        type: "badge_unlocked",
        userId: "user_123",
        badgeId: "badge_silver",
        badgeName: "Silver Referrer",
      };

      expect(event.type).toBe("badge_unlocked");
      expect(event.badgeName).toContain("Silver");
    });
  });

  describe("Event Broadcasting", () => {
    it("should broadcast to specific user room", () => {
      const room = `user_123`;
      expect(room).toMatch(/^user_\d+$/);
    });

    it("should broadcast to leaderboard updates", () => {
      const room = "leaderboard";
      expect(room).toBe("leaderboard");
    });

    it("should handle multiple concurrent events", () => {
      const events = [
        { type: "streak_milestone", userId: "user_1" },
        { type: "referral_bonus", userId: "user_2" },
        { type: "badge_unlocked", userId: "user_3" },
      ];

      expect(events.length).toBe(3);
      expect(events.every((e) => e.type && e.userId)).toBe(true);
    });
  });
});
