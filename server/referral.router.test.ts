import { describe, it, expect } from "vitest";
import { referralRouter } from "./referral.router";

const mockCtx = {
  user: { id: "test-user", email: "test@example.com" },
  req: {} as any,
  res: {} as any,
};

describe("Referral Router", () => {
  it("should generate referral link", async () => {
    const caller = referralRouter.createCaller(mockCtx as any);
    const result = await caller.generateReferralLink();

    expect(result.success).toBe(true);
    expect(result.referralCode).toBeDefined();
    expect(result.referralLink).toContain("ref=");
  });

  it("should get referral stats", async () => {
    const caller = referralRouter.createCaller(mockCtx as any);
    const result = await caller.getReferralStats();

    expect(result.totalReferrals).toBe(12);
    expect(result.activeReferrals).toBe(8);
    expect(result.totalBonusXP).toBe(2400);
  });

  it("should get referred users", async () => {
    const caller = referralRouter.createCaller(mockCtx as any);
    const result = await caller.getReferredUsers({ limit: 20 });

    expect(result.referredUsers).toHaveLength(3);
    expect(result.total).toBe(3);
  });

  it("should claim referral bonus", async () => {
    const caller = referralRouter.createCaller(mockCtx as any);
    const result = await caller.claimReferralBonus({
      referredUserId: "user_ref_1",
    });

    expect(result.success).toBe(true);
    expect(result.bonusXP).toBe(200);
  });

  it("should get referral tier benefits", async () => {
    const caller = referralRouter.createCaller(mockCtx as any);
    const result = await caller.getReferralTiers();

    expect(result.tiers).toHaveLength(4);
    expect(result.currentTier).toBe("Silver");
    expect(result.nextTier).toBe("Gold");
  });

  it("should get rewards history", async () => {
    const caller = referralRouter.createCaller(mockCtx as any);
    const result = await caller.getRewardsHistory({ limit: 20 });

    expect(result.rewards).toHaveLength(3);
    expect(result.totalXPEarned).toBe(900);
  });

  it("should share referral link", async () => {
    const caller = referralRouter.createCaller(mockCtx as any);
    const result = await caller.shareReferralLink({
      platform: "twitter",
      message: "Join me on Codelearnify!",
    });

    expect(result.success).toBe(true);
    expect(result.platform).toBe("twitter");
    expect(result.shared).toBe(true);
  });

  it("should get campaign stats", async () => {
    const caller = referralRouter.createCaller(mockCtx as any);
    const result = await caller.getCampaignStats();

    expect(result.totalClicks).toBe(156);
    expect(result.totalSignups).toBe(12);
    expect(result.conversionRate).toBeCloseTo(0.077, 2);
  });

  it("should validate referral code", async () => {
    const caller = referralRouter.createCaller(mockCtx as any);
    const result = await caller.validateReferralCode({
      code: "REF_ABC12345",
    });

    expect(result.valid).toBe(true);
    expect(result.referrerName).toBe("Alex Chen");
    expect(result.bonus.xp).toBe(200);
  });

  it("should get referral leaderboard", async () => {
    const caller = referralRouter.createCaller(mockCtx as any);
    const result = await caller.getReferralLeaderboard({
      limit: 10,
      period: "alltime",
    });

    expect(result.leaderboard).toHaveLength(3);
    expect(result.leaderboard[0].rank).toBe(1);
  });

  it("should track referral source", async () => {
    const caller = referralRouter.createCaller(mockCtx as any);
    const result = await caller.trackReferralSource({
      source: "social",
      referralCode: "REF_ABC12345",
    });

    expect(result.success).toBe(true);
    expect(result.tracked).toBe(true);
  });

  it("should get referral FAQ", async () => {
    const caller = referralRouter.createCaller(mockCtx as any);
    const result = await caller.getReferralFAQ();

    expect(result.faqs).toHaveLength(4);
    expect(result.faqs[0].question).toBeDefined();
  });
});
