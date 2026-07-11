import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-advanced",
    email: "advanced@example.com",
    name: "Advanced User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Advanced Features Router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("AI Tutor", () => {
    it("should provide hints for lesson problems", async () => {
      const result = await caller.advanced.aiTutor.getHint({
        lessonId: 1,
        problemIndex: 0,
      });

      expect(result).toHaveProperty("hint");
      expect(result).toHaveProperty("difficulty");
      expect(result).toHaveProperty("timestamp");
      expect(typeof result.hint).toBe("string");
      expect(result.difficulty).toBe("intermediate");
    });

    it("should provide different hints for different problems", async () => {
      const hint1 = await caller.advanced.aiTutor.getHint({
        lessonId: 1,
        problemIndex: 0,
      });

      const hint2 = await caller.advanced.aiTutor.getHint({
        lessonId: 1,
        problemIndex: 1,
      });

      expect(hint1.hint).not.toBe(hint2.hint);
    });

    it("should record attempt successfully", async () => {
      const result = await caller.advanced.aiTutor.recordAttempt({
        lessonId: 1,
        problemIndex: 0,
        success: true,
        timeSpent: 300,
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("Analytics", () => {
    it("should return weekly stats", async () => {
      const stats = await caller.advanced.analytics.getWeeklyStats();

      expect(Array.isArray(stats)).toBe(true);
      expect(stats.length).toBe(7);

      stats.forEach((day) => {
        expect(day).toHaveProperty("date");
        expect(day).toHaveProperty("xp");
        expect(day).toHaveProperty("lessonsCompleted");
        expect(day).toHaveProperty("timeSpent");
        expect(typeof day.xp).toBe("number");
        expect(typeof day.lessonsCompleted).toBe("number");
        expect(typeof day.timeSpent).toBe("number");
      });
    });

    it("should return skill proficiency data", async () => {
      const result = await caller.advanced.analytics.getSkillProficiency();

      expect(result).toHaveProperty("skills");
      expect(Array.isArray(result.skills)).toBe(true);
      expect(result.skills.length).toBeGreaterThan(0);

      result.skills.forEach((skill) => {
        expect(skill).toHaveProperty("skill");
        expect(skill).toHaveProperty("proficiency");
        expect(skill).toHaveProperty("trend");
        expect(typeof skill.proficiency).toBe("number");
        expect(skill.proficiency).toBeGreaterThanOrEqual(0);
        expect(skill.proficiency).toBeLessThanOrEqual(100);
      });
    });

    it("should return learning insights", async () => {
      const result = await caller.advanced.analytics.getInsights();

      expect(result).toHaveProperty("insights");
      expect(Array.isArray(result.insights)).toBe(true);
      expect(result.insights.length).toBeGreaterThan(0);

      result.insights.forEach((insight) => {
        expect(insight).toHaveProperty("title");
        expect(insight).toHaveProperty("description");
        expect(insight).toHaveProperty("type");
        expect(typeof insight.title).toBe("string");
        expect(typeof insight.description).toBe("string");
      });
    });
  });

  describe("Social Features", () => {
    it("should add friend successfully", async () => {
      const result = await caller.advanced.social.addFriend({
        friendEmail: "friend@example.com",
      });

      expect(result).toHaveProperty("success");
      expect(result.success).toBe(true);
      expect(result).toHaveProperty("message");
    });

    it("should get friends list", async () => {
      const result = await caller.advanced.social.getFriends();

      expect(result).toHaveProperty("friends");
      expect(Array.isArray(result.friends)).toBe(true);

      result.friends.forEach((friend) => {
        expect(friend).toHaveProperty("id");
        expect(friend).toHaveProperty("name");
        expect(friend).toHaveProperty("streak");
        expect(friend).toHaveProperty("level");
        expect(friend).toHaveProperty("xp");
      });
    });

    it("should create challenge successfully", async () => {
      const result = await caller.advanced.social.createChallenge({
        friendId: 2,
        exerciseId: 1,
      });

      expect(result).toEqual({ success: true });
    });

    it("should get leaderboard", async () => {
      const result = await caller.advanced.social.getLeaderboard({
        period: "weekly",
        limit: 50,
      });

      expect(result).toHaveProperty("leaderboard");
      expect(result).toHaveProperty("period");
      expect(result.period).toBe("weekly");
      expect(Array.isArray(result.leaderboard)).toBe(true);

      result.leaderboard.forEach((entry) => {
        expect(entry).toHaveProperty("rank");
        expect(entry).toHaveProperty("name");
        expect(entry).toHaveProperty("xp");
        expect(entry).toHaveProperty("streak");
        expect(entry).toHaveProperty("league");
        expect(["platinum", "gold", "silver", "bronze"]).toContain(entry.league);
      });
    });

    it("should get user rank", async () => {
      const result = await caller.advanced.social.getUserRank({
        period: "weekly",
      });

      expect(result).toHaveProperty("rank");
      expect(result).toHaveProperty("xp");
      expect(result).toHaveProperty("percentile");
      expect(typeof result.rank).toBe("number");
      expect(typeof result.xp).toBe("number");
      expect(typeof result.percentile).toBe("number");
    });
  });

  describe("Developer Tools", () => {
    it("should get cheat sheets", async () => {
      const result = await caller.advanced.tools.getCheatSheets({
        language: "Python",
      });

      expect(result).toHaveProperty("cheatSheets");
      expect(Array.isArray(result.cheatSheets)).toBe(true);

      result.cheatSheets.forEach((sheet) => {
        expect(sheet).toHaveProperty("id");
        expect(sheet).toHaveProperty("language");
        expect(sheet).toHaveProperty("title");
        expect(sheet).toHaveProperty("category");
        expect(sheet).toHaveProperty("content");
      });
    });

    it("should get code snippets", async () => {
      const result = await caller.advanced.tools.getCodeSnippets({
        language: "Python",
      });

      expect(result).toHaveProperty("snippets");
      expect(Array.isArray(result.snippets)).toBe(true);

      result.snippets.forEach((snippet) => {
        expect(snippet).toHaveProperty("id");
        expect(snippet).toHaveProperty("title");
        expect(snippet).toHaveProperty("language");
        expect(snippet).toHaveProperty("code");
      });
    });

    it("should get references", async () => {
      const result = await caller.advanced.tools.getReferences();

      expect(result).toHaveProperty("references");
      expect(Array.isArray(result.references)).toBe(true);

      result.references.forEach((ref) => {
        expect(ref).toHaveProperty("id");
        expect(ref).toHaveProperty("title");
        expect(ref).toHaveProperty("category");
        expect(ref).toHaveProperty("url");
      });
    });
  });
});
