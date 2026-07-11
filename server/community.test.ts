import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-community",
    email: "community@example.com",
    name: "Community User",
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

describe("Community Router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("Forum Posts", () => {
    it("should create a new forum post", async () => {
      const result = await caller.community.createPost({
        title: "How to optimize Python code?",
        content: "I'm trying to optimize my Python code for better performance...",
        category: "Python",
        tags: ["performance", "optimization"],
      });

      expect(result.success).toBe(true);
      expect(result).toHaveProperty("postId");
      expect(typeof result.postId).toBe("number");
    });

    it("should get forum posts", async () => {
      const result = await caller.community.getPosts({
        category: "Python",
        limit: 20,
        sort: "recent",
      });

      expect(result).toHaveProperty("posts");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.posts)).toBe(true);

      if (result.posts.length > 0) {
        const post = result.posts[0];
        expect(post).toHaveProperty("id");
        expect(post).toHaveProperty("title");
        expect(post).toHaveProperty("author");
        expect(post).toHaveProperty("category");
      }
    });

    it("should get post details", async () => {
      const result = await caller.community.getPostDetail({
        postId: 1,
      });

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("content");
      expect(result).toHaveProperty("author");
      expect(result).toHaveProperty("replies");
      expect(Array.isArray(result.replies)).toBe(true);
    });

    it("should reply to a post", async () => {
      const result = await caller.community.replyToPost({
        postId: 1,
        content: "Great question! You can use profiling tools like cProfile...",
      });

      expect(result.success).toBe(true);
      expect(result).toHaveProperty("replyId");
    });

    it("should like a post", async () => {
      const result = await caller.community.likePost({
        postId: 1,
      });

      expect(result.success).toBe(true);
      expect(result).toHaveProperty("likes");
      expect(typeof result.likes).toBe("number");
    });

    it("should mark a reply as solution", async () => {
      const result = await caller.community.markSolved({
        postId: 1,
        replyId: 1,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("User Reputation", () => {
    it("should get user reputation", async () => {
      const result = await caller.community.getUserReputation({
        userId: 1,
      });

      expect(result).toHaveProperty("userId");
      expect(result).toHaveProperty("reputation");
      expect(result).toHaveProperty("badges");
      expect(result).toHaveProperty("postsCount");
      expect(result).toHaveProperty("answersCount");
      expect(Array.isArray(result.badges)).toBe(true);
      expect(typeof result.reputation).toBe("number");
    });
  });

  describe("Search", () => {
    it("should search forum posts", async () => {
      const result = await caller.community.searchForum({
        query: "Python optimization",
        limit: 10,
      });

      expect(result).toHaveProperty("results");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.results)).toBe(true);
    });
  });

  describe("Challenges", () => {
    it("should get challenges", async () => {
      const result = await caller.community.getChallenges({
        difficulty: "easy",
        limit: 20,
      });

      expect(result).toHaveProperty("challenges");
      expect(Array.isArray(result.challenges)).toBe(true);

      if (result.challenges.length > 0) {
        const challenge = result.challenges[0];
        expect(challenge).toHaveProperty("id");
        expect(challenge).toHaveProperty("title");
        expect(challenge).toHaveProperty("difficulty");
        expect(challenge).toHaveProperty("xpReward");
      }
    });

    it("should submit challenge solution", async () => {
      const result = await caller.community.submitChallengeSolution({
        challengeId: 1,
        code: "def fibonacci(n):\n  if n <= 1:\n    return n\n  return fibonacci(n-1) + fibonacci(n-2)",
        language: "python",
      });

      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("message");
      expect(result).toHaveProperty("testResults");
      expect(Array.isArray(result.testResults)).toBe(true);
    });

    it("should get challenge leaderboard", async () => {
      const result = await caller.community.getChallengeLeaderboard({
        challengeId: 1,
        limit: 50,
      });

      expect(result).toHaveProperty("leaderboard");
      expect(Array.isArray(result.leaderboard)).toBe(true);

      result.leaderboard.forEach((entry) => {
        expect(entry).toHaveProperty("rank");
        expect(entry).toHaveProperty("userName");
        expect(entry).toHaveProperty("score");
      });
    });
  });

  describe("Learning Path", () => {
    it("should get personalized learning path", async () => {
      const result = await caller.community.getPersonalizedPath();

      expect(result).toHaveProperty("pathId");
      expect(result).toHaveProperty("userId");
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("progress");
      expect(result).toHaveProperty("nodes");
      expect(Array.isArray(result.nodes)).toBe(true);
    });

    it("should update path progress", async () => {
      const result = await caller.community.updatePathProgress({
        pathId: 1,
        nodeId: 3,
        progress: 75,
      });

      expect(result.success).toBe(true);
      expect(result).toHaveProperty("newProgress");
      expect(result.newProgress).toBe(75);
    });

    it("should get adaptive recommendations", async () => {
      const result = await caller.community.getAdaptiveRecommendations();

      expect(result).toHaveProperty("recommendations");
      expect(Array.isArray(result.recommendations)).toBe(true);

      result.recommendations.forEach((rec) => {
        expect(rec).toHaveProperty("type");
        expect(rec).toHaveProperty("title");
        expect(rec).toHaveProperty("reason");
      });
    });
  });

  describe("Skill Assessment", () => {
    it("should start skill assessment", async () => {
      const result = await caller.community.startSkillAssessment({
        skill: "Python",
      });

      expect(result).toHaveProperty("assessmentId");
      expect(result).toHaveProperty("skill");
      expect(result).toHaveProperty("questions");
      expect(Array.isArray(result.questions)).toBe(true);
    });

    it("should submit skill assessment", async () => {
      const result = await caller.community.submitSkillAssessment({
        assessmentId: 1,
        answers: [
          { questionId: 1, answer: "A container for data" },
          { questionId: 2, answer: "A function definition" },
        ],
      });

      expect(result.success).toBe(true);
      expect(result).toHaveProperty("score");
      expect(result).toHaveProperty("proficiency");
      expect(result).toHaveProperty("feedback");
      expect(typeof result.score).toBe("number");
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });
});
