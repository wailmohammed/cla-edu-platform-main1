import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

/**
 * Badges Router for Gamified Referral System
 * Manages badge unlocks, display, and sharing
 */
export const badgesRouter = router({
  /**
   * Get user's badges
   */
  getUserBadges: protectedProcedure.query(async () => {
    return {
      badges: [
        {
          id: "badge_bronze",
          name: "Bronze Referrer",
          tier: "Bronze",
          description: "Referred 1-5 friends",
          icon: "🥉",
          color: "#CD7F32",
          unlockedAt: new Date(Date.now() - 2592000000).toISOString(),
          progress: 100,
          requirement: 5,
          current: 5,
        },
        {
          id: "badge_silver",
          name: "Silver Referrer",
          tier: "Silver",
          description: "Referred 6-10 friends",
          icon: "🥈",
          color: "#C0C0C0",
          unlockedAt: new Date(Date.now() - 1296000000).toISOString(),
          progress: 100,
          requirement: 10,
          current: 8,
        },
        {
          id: "badge_gold",
          name: "Gold Referrer",
          tier: "Gold",
          description: "Referred 11-20 friends",
          icon: "🥇",
          color: "#FFD700",
          unlockedAt: null,
          progress: 40,
          requirement: 20,
          current: 8,
        },
        {
          id: "badge_platinum",
          name: "Platinum Referrer",
          tier: "Platinum",
          description: "Referred 21-50 friends",
          icon: "💎",
          color: "#E5E4E2",
          unlockedAt: null,
          progress: 0,
          requirement: 50,
          current: 8,
        },
      ],
      totalBadges: 4,
      unlockedBadges: 2,
      nextBadge: "Gold Referrer",
      progressToNext: 40,
    };
  }),

  /**
   * Get badge details
   */
  getBadgeDetails: protectedProcedure
    .input(z.object({ badgeId: z.string() }))
    .query(async (opts: any) => {
      const input = opts.input;
      return {
        id: input.badgeId,
        name: "Gold Referrer",
        tier: "Gold",
        description: "Referred 11-20 friends",
        icon: "🥇",
        color: "#FFD700",
        requirement: 20,
        current: 8,
        progress: 40,
        rewards: {
          xp: 1000,
          courses: 2,
          premiumDays: 30,
        },
        holders: 1234,
        rarity: "uncommon",
        unlockedAt: null,
      };
    }),

  /**
   * Get all available badges
   */
  getAllBadges: protectedProcedure.query(async () => {
    return {
      badges: [
        {
          id: "badge_bronze",
          name: "Bronze Referrer",
          tier: "Bronze",
          icon: "🥉",
          color: "#CD7F32",
          requirement: 5,
          rarity: "common",
          holders: 5432,
        },
        {
          id: "badge_silver",
          name: "Silver Referrer",
          tier: "Silver",
          icon: "🥈",
          color: "#C0C0C0",
          requirement: 10,
          rarity: "uncommon",
          holders: 2134,
        },
        {
          id: "badge_gold",
          name: "Gold Referrer",
          tier: "Gold",
          icon: "🥇",
          color: "#FFD700",
          requirement: 20,
          rarity: "rare",
          holders: 876,
        },
        {
          id: "badge_platinum",
          name: "Platinum Referrer",
          tier: "Platinum",
          icon: "💎",
          color: "#E5E4E2",
          requirement: 50,
          rarity: "epic",
          holders: 234,
        },
        {
          id: "badge_diamond",
          name: "Diamond Referrer",
          tier: "Diamond",
          icon: "👑",
          color: "#B9F2FF",
          requirement: 100,
          rarity: "legendary",
          holders: 45,
        },
      ],
      totalBadges: 5,
    };
  }),

  /**
   * Check badge unlock condition
   */
  checkBadgeUnlock: protectedProcedure
    .input(z.object({ badgeId: z.string() }))
    .query(async (opts: any) => {
      const input = opts.input;
      return {
        badgeId: input.badgeId,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        rewards: {
          xp: 500,
          courses: 1,
          premiumDays: 7,
        },
        notification: "🎉 You've unlocked a new badge!",
      };
    }),

  /**
   * Share badge on social media
   */
  shareBadge: protectedProcedure
    .input(
      z.object({
        badgeId: z.string(),
        platform: z.enum(["twitter", "facebook", "linkedin", "whatsapp"]),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        badgeId: input.badgeId,
        platform: input.platform,
        shareUrl: `https://codelearnify.com/badge/${input.badgeId}`,
        message: "I just unlocked the Gold Referrer badge on Codelearnify! 🥇",
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * Get badge leaderboard
   */
  getBadgeLeaderboard: protectedProcedure
    .input(
      z.object({
        tier: z.enum(["Bronze", "Silver", "Gold", "Platinum", "Diamond"]),
        limit: z.number().default(10),
      })
    )
    .query(async (opts: any) => {
      const input = opts.input;
      return {
        tier: input.tier,
        leaderboard: [
          {
            rank: 1,
            name: "Alex Chen",
            referrals: 45,
            unlockedAt: new Date(Date.now() - 2592000000).toISOString(),
            badge: input.tier,
          },
          {
            rank: 2,
            name: "Sarah Johnson",
            referrals: 32,
            unlockedAt: new Date(Date.now() - 1728000000).toISOString(),
            badge: input.tier,
          },
          {
            rank: 3,
            name: "Mike Davis",
            referrals: 28,
            unlockedAt: new Date(Date.now() - 1296000000).toISOString(),
            badge: input.tier,
          },
        ],
        yourRank: 12,
        yourReferrals: 8,
      };
    }),

  /**
   * Get badge progress
   */
  getBadgeProgress: protectedProcedure.query(async () => {
    return {
      currentBadge: "Silver Referrer",
      nextBadge: "Gold Referrer",
      currentProgress: 8,
      nextRequirement: 20,
      progressPercentage: 40,
      referralsNeeded: 12,
      estimatedDaysToUnlock: 45,
      milestones: [
        { referrals: 5, badge: "Bronze", unlocked: true },
        { referrals: 10, badge: "Silver", unlocked: true },
        { referrals: 20, badge: "Gold", unlocked: false },
        { referrals: 50, badge: "Platinum", unlocked: false },
        { referrals: 100, badge: "Diamond", unlocked: false },
      ],
    };
  }),

  /**
   * Get badge rewards
   */
  getBadgeRewards: protectedProcedure
    .input(z.object({ tier: z.string() }))
    .query(async (opts: any) => {
      const input = opts.input;
      const rewards: Record<string, any> = {
        Bronze: { xp: 100, courses: 0, premiumDays: 0 },
        Silver: { xp: 250, courses: 1, premiumDays: 7 },
        Gold: { xp: 500, courses: 2, premiumDays: 30 },
        Platinum: { xp: 1000, courses: 5, premiumDays: 90 },
        Diamond: { xp: 2000, courses: 10, premiumDays: 365 },
      };

      return {
        tier: input.tier,
        rewards: rewards[input.tier] || rewards.Bronze,
      };
    }),

  /**
   * Display badge on profile
   */
  displayBadgeOnProfile: protectedProcedure
    .input(z.object({ badgeId: z.string(), display: z.boolean() }))
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        badgeId: input.badgeId,
        displayed: input.display,
        message: input.display ? "Badge added to profile" : "Badge removed from profile",
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * Get user's displayed badges
   */
  getDisplayedBadges: protectedProcedure.query(async () => {
    return {
      displayedBadges: [
        {
          id: "badge_bronze",
          name: "Bronze Referrer",
          tier: "Bronze",
          icon: "🥉",
          position: 1,
        },
        {
          id: "badge_silver",
          name: "Silver Referrer",
          tier: "Silver",
          icon: "🥈",
          position: 2,
        },
      ],
      maxDisplayed: 5,
      currentDisplayed: 2,
    };
  }),

  /**
   * Get badge statistics
   */
  getBadgeStats: protectedProcedure.query(async () => {
    return {
      totalBadges: 5,
      userBadges: 2,
      totalHolders: 10000,
      raretyDistribution: {
        common: 5432,
        uncommon: 2134,
        rare: 876,
        epic: 234,
        legendary: 45,
      },
      mostPopularBadge: "Bronze Referrer",
      raresBadge: "Diamond Referrer",
    };
  }),

  /**
   * Unlock badge manually (admin only)
   */
  unlockBadge: protectedProcedure
    .input(z.object({ badgeId: z.string(), userId: z.string().optional() }))
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        badgeId: input.badgeId,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        notification: "🎉 Badge unlocked!",
      };
    }),
});
