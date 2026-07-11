import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

export const referralRouter = router({
  /**
   * Generate referral link for user
   */
  generateReferralLink: protectedProcedure.mutation(async () => {
    const referralCode = `REF_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    return {
      success: true,
      referralCode,
      referralLink: `https://codelearnify.com/join?ref=${referralCode}`,
      createdAt: new Date().toISOString(),
    };
  }),

  /**
   * Get referral statistics
   */
  getReferralStats: protectedProcedure.query(async () => {
    return {
      referralCode: "REF_ABC12345",
      totalReferrals: 12,
      activeReferrals: 8,
      totalBonusXP: 2400,
      totalBonusCourses: 2,
      referralLink: "https://codelearnify.com/join?ref=REF_ABC12345",
      conversionRate: 0.67,
      pendingRewards: {
        xp: 500,
        courses: 1,
      },
    };
  }),

  /**
   * Get list of referred users
   */
  getReferredUsers: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async (opts: any) => {
      const input = opts.input;
      return {
        referredUsers: [
          {
            id: "user_ref_1",
            name: "John Smith",
            email: "john@example.com",
            referralDate: new Date(Date.now() - 604800000).toISOString(),
            status: "active",
            coursesEnrolled: 3,
            xpEarned: 450,
            bonusXPEarned: 200,
          },
          {
            id: "user_ref_2",
            name: "Emily Brown",
            email: "emily@example.com",
            referralDate: new Date(Date.now() - 432000000).toISOString(),
            status: "active",
            coursesEnrolled: 2,
            xpEarned: 320,
            bonusXPEarned: 200,
          },
          {
            id: "user_ref_3",
            name: "David Wilson",
            email: "david@example.com",
            referralDate: new Date(Date.now() - 259200000).toISOString(),
            status: "pending",
            coursesEnrolled: 0,
            xpEarned: 0,
            bonusXPEarned: 0,
          },
        ],
        total: 3,
      };
    }),

  /**
   * Claim referral bonus
   */
  claimReferralBonus: protectedProcedure
    .input(
      z.object({
        referredUserId: z.string(),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        bonusXP: 200,
        bonusCourse: "Python Basics",
        claimedAt: new Date().toISOString(),
        message: "Bonus claimed! Check your account for the rewards.",
      };
    }),

  /**
   * Get referral tier benefits
   */
  getReferralTiers: protectedProcedure.query(async () => {
    return {
      tiers: [
        {
          tier: "Bronze",
          referralsNeeded: 0,
          bonusPerReferral: { xp: 200, courses: 0 },
          tierBonus: { xp: 0, courses: 0 },
          achieved: true,
        },
        {
          tier: "Silver",
          referralsNeeded: 5,
          bonusPerReferral: { xp: 250, courses: 0 },
          tierBonus: { xp: 500, courses: 1 },
          achieved: true,
        },
        {
          tier: "Gold",
          referralsNeeded: 10,
          bonusPerReferral: { xp: 300, courses: 0 },
          tierBonus: { xp: 1000, courses: 2 },
          achieved: false,
        },
        {
          tier: "Platinum",
          referralsNeeded: 20,
          bonusPerReferral: { xp: 400, courses: 1 },
          tierBonus: { xp: 2000, courses: 5 },
          achieved: false,
        },
      ],
      currentTier: "Silver",
      nextTier: "Gold",
      referralsUntilNextTier: 2,
    };
  }),

  /**
   * Get referral rewards history
   */
  getRewardsHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async (opts: any) => {
      const input = opts.input;
      return {
        rewards: [
          {
            id: "reward_1",
            type: "referral_bonus",
            description: "Referral bonus from John Smith",
            xpAwarded: 200,
            courseAwarded: null,
            claimedAt: new Date(Date.now() - 604800000).toISOString(),
            status: "claimed",
          },
          {
            id: "reward_2",
            type: "tier_bonus",
            description: "Silver tier bonus",
            xpAwarded: 500,
            courseAwarded: "Python Basics",
            claimedAt: new Date(Date.now() - 432000000).toISOString(),
            status: "claimed",
          },
          {
            id: "reward_3",
            type: "referral_bonus",
            description: "Referral bonus from Emily Brown",
            xpAwarded: 200,
            courseAwarded: null,
            claimedAt: null,
            status: "pending",
          },
        ],
        total: 3,
        totalXPEarned: 900,
        totalCoursesEarned: 1,
      };
    }),

  /**
   * Share referral link to social media
   */
  shareReferralLink: protectedProcedure
    .input(
      z.object({
        platform: z.enum(["twitter", "facebook", "linkedin", "whatsapp", "email"]),
        message: z.string().optional(),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        platform: input.platform,
        shared: true,
        shareUrl: `https://codelearnify.com/join?ref=REF_ABC12345`,
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * Get referral campaign stats
   */
  getCampaignStats: protectedProcedure.query(async () => {
    return {
      campaignName: "Refer a Friend",
      startDate: new Date(Date.now() - 2592000000).toISOString(),
      totalClicks: 156,
      totalSignups: 12,
      conversionRate: 0.077,
      totalBonusXPDistributed: 2400,
      totalCoursesDistributed: 2,
      topReferrer: "You",
      topReferrerReferrals: 12,
    };
  }),

  /**
   * Validate referral code
   */
  validateReferralCode: protectedProcedure
    .input(z.object({ code: z.string() }))
    .query(async (opts: any) => {
      const input = opts.input;
      return {
        valid: true,
        code: input.code,
        referrerName: "Alex Chen",
        bonus: { xp: 200, courses: 0 },
        message: "Valid referral code! You'll receive bonus XP when you complete your first course.",
      };
    }),

  /**
   * Get referral leaderboard
   */
  getReferralLeaderboard: protectedProcedure
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
            referrals: 45,
            totalBonusXP: 9000,
            tier: "Platinum",
          },
          {
            rank: 2,
            name: "Sarah Johnson",
            referrals: 32,
            totalBonusXP: 6400,
            tier: "Gold",
          },
          {
            rank: 3,
            name: "Mike Davis",
            referrals: 28,
            totalBonusXP: 5600,
            tier: "Gold",
          },
        ],
        yourRank: 12,
        yourReferrals: 12,
        yourBonusXP: 2400,
      };
    }),

  /**
   * Track referral source
   */
  trackReferralSource: protectedProcedure
    .input(
      z.object({
        source: z.enum(["direct", "social", "email", "ad", "other"]),
        referralCode: z.string(),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        source: input.source,
        tracked: true,
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * Get referral FAQ
   */
  getReferralFAQ: protectedProcedure.query(async () => {
    return {
      faqs: [
        {
          question: "How much can I earn by referring friends?",
          answer: "You earn 200 XP for each friend who signs up. As you reach higher tiers, you earn more per referral and unlock exclusive course bonuses.",
        },
        {
          question: "When do I get my referral bonus?",
          answer: "Your bonus is awarded when your referred friend completes their first course. You can claim it immediately from your rewards dashboard.",
        },
        {
          question: "Is there a limit to how many friends I can refer?",
          answer: "No! You can refer as many friends as you want. There's no limit to your earning potential.",
        },
        {
          question: "Can I share my referral link on social media?",
          answer: "Yes! We make it easy to share on Twitter, Facebook, LinkedIn, WhatsApp, and email. Use the share buttons in your referral dashboard.",
        },
      ],
    };
  }),
});
