import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import { getDb } from "./db";
import { users, subscriptions, courses, userProgress } from "../drizzle/schema";
import { eq, desc, count, sql, like, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

/** Only super_admin can call these procedures */
const superAdminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "super_admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Super admin access required" });
  }
  return next({ ctx });
});

export const adminRouter = router({
  /** Platform-wide stats */
  getStats: superAdminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

    const [[totalUsers], [premiumUsers], [totalCourses], [activeToday]] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(users).where(eq(users.subscriptionTier, "premium")),
      db.select({ count: count() }).from(courses),
      db.select({ count: count() }).from(users).where(
        sql`DATE(lastSignedIn) = CURDATE()`
      ),
    ]);

    return {
      totalUsers:    totalUsers.count,
      premiumUsers:  premiumUsers.count,
      freeUsers:     totalUsers.count - premiumUsers.count,
      totalCourses:  totalCourses.count,
      activeToday:   activeToday.count,
    };
  }),

  /** List all users with pagination + search */
  listUsers: superAdminProcedure
    .input(z.object({
      page:   z.number().default(1),
      limit:  z.number().default(20),
      search: z.string().optional(),
      role:   z.enum(["user", "admin", "super_admin", "all"]).default("all"),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const offset = (input.page - 1) * input.limit;

      let query = db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        subscriptionTier: users.subscriptionTier,
        subscriptionStatus: users.subscriptionStatus,
        onboardingCompleted: users.onboardingCompleted,
        totalXP: users.totalXP,
        level: users.level,
        createdAt: users.createdAt,
        lastSignedIn: users.lastSignedIn,
        emailVerified: users.emailVerified,
      }).from(users).$dynamic();

      if (input.search) {
        query = query.where(
          or(
            like(users.name, `%${input.search}%`),
            like(users.email, `%${input.search}%`)
          )
        ) as any;
      }
      if (input.role !== "all") {
        query = query.where(eq(users.role, input.role)) as any;
      }

      const [rows, [{ total }]] = await Promise.all([
        query.orderBy(desc(users.createdAt)).limit(input.limit).offset(offset),
        db.select({ total: count() }).from(users),
      ]);

      return { users: rows, total: total, pages: Math.ceil(total / input.limit) };
    }),

  /** Update a user's role or subscription */
  updateUser: superAdminProcedure
    .input(z.object({
      userId: z.number(),
      role: z.enum(["user", "admin", "super_admin"]).optional(),
      subscriptionTier: z.enum(["free", "premium"]).optional(),
      banned: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.user.id && input.role && input.role !== "super_admin") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot demote yourself" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const set: Record<string, any> = {};
      if (input.role !== undefined)             set.role = input.role;
      if (input.subscriptionTier !== undefined) set.subscriptionTier = input.subscriptionTier;

      await db.update(users).set(set).where(eq(users.id, input.userId));
      return { success: true };
    }),

  /** Reset a user's password */
  resetUserPassword: superAdminProcedure
    .input(z.object({ userId: z.number(), newPassword: z.string().min(8) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const hash = await bcrypt.hash(input.newPassword, 12);
      await db.update(users).set({ passwordHash: hash }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  /** Delete a user */
  deleteUser: superAdminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot delete yourself" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.delete(users).where(eq(users.id, input.userId));
      return { success: true };
    }),

  /** List all subscriptions */
  listSubscriptions: superAdminProcedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const offset = (input.page - 1) * input.limit;
      const rows = await db
        .select({
          id: subscriptions.id,
          userId: subscriptions.userId,
          plan: subscriptions.plan,
          status: subscriptions.status,
          startDate: subscriptions.startDate,
          endDate: subscriptions.endDate,
          providerSubscriptionId: subscriptions.providerSubscriptionId,
        })
        .from(subscriptions)
        .orderBy(desc(subscriptions.startDate))
        .limit(input.limit).offset(offset);
      const [{ total }] = await db.select({ total: count() }).from(subscriptions);
      return { subscriptions: rows, total };
    }),

  /** List all courses */
  listCourses: superAdminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
    return await db.select().from(courses).orderBy(courses.displayOrder);
  }),

  /** Toggle course premium status */
  updateCourse: superAdminProcedure
    .input(z.object({ courseId: z.number(), isPremium: z.boolean().optional(), title: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const set: Record<string, any> = {};
      if (input.isPremium !== undefined) set.isPremium = input.isPremium;
      if (input.title !== undefined)     set.title = input.title;
      await db.update(courses).set(set).where(eq(courses.id, input.courseId));
      return { success: true };
    }),
});
