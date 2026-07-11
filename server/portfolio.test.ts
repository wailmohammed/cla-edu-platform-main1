import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
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

describe("portfolio", () => {
  it("creates a new portfolio project", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.portfolio.createProject({
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce platform built with React and Node.js",
      technologies: ["React", "Node.js", "MongoDB"],
      githubUrl: "https://github.com/user/ecommerce",
      liveUrl: "https://ecommerce-demo.com",
      imageUrl: "https://via.placeholder.com/400x300",
      featured: true,
    });

    expect(result.success).toBe(true);
    expect(result.projectId).toBeDefined();
  });

  it("retrieves user's portfolio projects", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const projects = await caller.portfolio.getUserProjects();

    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0]).toHaveProperty("title");
    expect(projects[0]).toHaveProperty("description");
    expect(projects[0]).toHaveProperty("technologies");
  });

  it("retrieves portfolio statistics", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.portfolio.getPortfolioStats();

    expect(stats).toHaveProperty("totalProjects");
    expect(stats).toHaveProperty("featuredProjects");
    expect(typeof stats.totalProjects).toBe("number");
    expect(typeof stats.featuredProjects).toBe("number");
  });

  it("retrieves featured projects for showcase", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    });

    const projects = await caller.portfolio.getFeaturedProjects({ limit: 6 });

    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeLessThanOrEqual(6);
    if (projects.length > 0) {
      expect(projects[0]).toHaveProperty("title");
      expect(projects[0]).toHaveProperty("authorName");
    }
  });

  it("retrieves project details", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    });

    const project = await caller.portfolio.getProjectDetails({ projectId: 1 });

    expect(project).toHaveProperty("title");
    expect(project).toHaveProperty("description");
    expect(project).toHaveProperty("technologies");
    expect(project).toHaveProperty("authorName");
    expect(project).toHaveProperty("views");
    expect(project).toHaveProperty("likes");
  });

  it("adds a project review", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.portfolio.addProjectReview({
      projectId: 1,
      rating: 5,
      comment: "Amazing project! Great UI and functionality.",
    });

    expect(result.success).toBe(true);
    expect(result.reviewId).toBeDefined();
  });

  it("retrieves project reviews", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: { clearCookie: () => {} } as any,
    });

    const reviews = await caller.portfolio.getProjectReviews({ projectId: 1 });

    expect(Array.isArray(reviews)).toBe(true);
    if (reviews.length > 0) {
      expect(reviews[0]).toHaveProperty("rating");
      expect(reviews[0]).toHaveProperty("comment");
      expect(reviews[0]).toHaveProperty("authorName");
    }
  });

  it("updates a portfolio project", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.portfolio.updateProject({
      projectId: 1,
      title: "Updated E-Commerce Platform",
      featured: true,
    });

    expect(result.success).toBe(true);
  });

  it("deletes a portfolio project", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.portfolio.deleteProject({ projectId: 1 });

    expect(result.success).toBe(true);
  });
});
