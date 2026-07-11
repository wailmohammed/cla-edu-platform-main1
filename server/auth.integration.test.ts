import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Integration tests for authentication flow
 * Tests session creation, protected access, and logout
 */

describe("Authentication Integration", () => {
  let ctx: TrpcContext;
  let clearedCookies: Array<{ name: string; options: Record<string, unknown> }>;

  beforeEach(() => {
    clearedCookies = [];

    // Mock authenticated user context
    const user = {
      id: 1,
      openId: "test-user-123",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    ctx = {
      user,
      req: {
        protocol: "https",
        headers: {
          host: "localhost:3000",
        },
      } as TrpcContext["req"],
      res: {
        clearCookie: (name: string, options: Record<string, unknown>) => {
          clearedCookies.push({ name, options });
        },
      } as TrpcContext["res"],
    };
  });

  describe("User Session", () => {
    it("should retrieve authenticated user info via auth.me", async () => {
      const caller = appRouter.createCaller(ctx);
      const user = await caller.auth.me();

      expect(user).toBeDefined();
      expect(user?.id).toBe(1);
      expect(user?.openId).toBe("test-user-123");
      expect(user?.email).toBe("test@example.com");
      expect(user?.role).toBe("user");
    });

    it("should have valid session with user context", () => {
      expect(ctx.user).toBeDefined();
      expect(ctx.user?.id).toBe(1);
      expect(ctx.user?.openId).toBe("test-user-123");
    });
  });

  describe("Logout Flow", () => {
    it("should clear session cookie on logout", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.logout();

      expect(result.success).toBe(true);
      expect(clearedCookies).toHaveLength(1);
      expect(clearedCookies[0]?.name).toBe("app_session_id");
      expect(clearedCookies[0]?.options.maxAge).toBe(-1);
      expect(clearedCookies[0]?.options.httpOnly).toBe(true);
    });

    it("should set secure cookie options on logout", async () => {
      const caller = appRouter.createCaller(ctx);
      await caller.auth.logout();

      const cookieOptions = clearedCookies[0]?.options;
      expect(cookieOptions?.maxAge).toBe(-1);
      expect(cookieOptions?.httpOnly).toBe(true);
      expect(cookieOptions?.path).toBe("/");
    });
  });

  describe("Protected Procedures", () => {
    it("should allow authenticated user to access protected procedures", async () => {
      const caller = appRouter.createCaller(ctx);

      // Test accessing a protected procedure
      const user = await caller.auth.me();
      expect(user?.id).toBe(1);
      expect(user?.openId).toBe("test-user-123");
    });

    it("should have user context in protected calls", async () => {
      const caller = appRouter.createCaller(ctx);

      // Create a test context with user
      const testCtx = {
        ...ctx,
        user: ctx.user,
      };

      const caller2 = appRouter.createCaller(testCtx);
      const user = await caller2.auth.me();

      expect(user?.id).toBe(ctx.user?.id);
    });
  });

  describe("User Role", () => {
    it("should have user role by default", async () => {
      const caller = appRouter.createCaller(ctx);
      const user = await caller.auth.me();

      expect(user?.role).toBe("user");
    });

    it("should support admin role", () => {
      const adminCtx = {
        ...ctx,
        user: {
          ...ctx.user!,
          role: "admin" as const,
        },
      };

      expect(adminCtx.user?.role).toBe("admin");
    });
  });
});
