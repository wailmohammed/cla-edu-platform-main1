import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { courses, lessons, userProgress } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export const coursesRouter = router({
  /**
   * Get all courses
   */
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db.select().from(courses).orderBy(courses.displayOrder);
  }),

  /**
   * Get course by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const course = await db
        .select()
        .from(courses)
        .where(eq(courses.id, input.id))
        .limit(1);
      return course[0] || null;
    }),

  /**
   * Get course by slug
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const course = await db
        .select()
        .from(courses)
        .where(eq(courses.slug, input.slug))
        .limit(1);
      return course[0] || null;
    }),

  /**
   * Get courses by category
   */
  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db
        .select()
        .from(courses)
        .where(eq(courses.category, input.category as any))
        .orderBy(courses.displayOrder);
    }),

  /**
   * Get courses by difficulty
   */
  getByDifficulty: publicProcedure
    .input(z.object({ difficulty: z.enum(["beginner", "intermediate", "advanced"]) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db
        .select()
        .from(courses)
        .where(eq(courses.difficulty, input.difficulty))
        .orderBy(courses.displayOrder);
    }),

  /**
   * Search courses
   */
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const allCourses = await db.select().from(courses);
      const query = input.query.toLowerCase();
      return allCourses.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          (c.description && c.description.toLowerCase().includes(query)) ||
          (c.language && c.language.toLowerCase().includes(query))
        );
    }),

  /**
   * Get course with lessons
   */
  getWithLessons: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const course = await db
        .select()
        .from(courses)
        .where(eq(courses.id, input.id))
        .limit(1);

      if (!course[0]) return null;

      const lessonList = await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, input.id))
        .orderBy(lessons.displayOrder);

      return {
        ...course[0],
        lessons: lessonList,
      };
    }),

  /**
   * Get user progress for a course
   */
  getUserProgress: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const progress = await db
        .select()
        .from(userProgress)
        .where(
          and(
            eq(userProgress.userId, ctx.user.id),
            eq(userProgress.courseId, input.courseId)
          )
        )
        .limit(1);
      return progress[0] || null;
    }),

  /**
   * Create a new course (admin only)
   */
  create: adminProcedure
    .input(
      z.object({
        slug: z.string(),
        title: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(),
        category: z.enum([
          "programming",
          "web-development",
          "data-science",
          "mathematics",
          "algorithms",
          "databases",
          "devops",
          "ai-ml",
          "other",
        ]),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]),
        language: z.string().optional(),
        totalLessons: z.number().default(0),
        estimatedHours: z.string().optional(),
        isPremium: z.boolean().default(false),
        displayOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(courses).values(input);
      return { success: true, id: (result as any).insertId };
    }),

  /**
   * Update a course (admin only)
   */
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        slug: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        category: z.enum([
          "programming",
          "web-development",
          "data-science",
          "mathematics",
          "algorithms",
          "databases",
          "devops",
          "ai-ml",
          "other",
        ]).optional(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        language: z.string().optional(),
        totalLessons: z.number().optional(),
        estimatedHours: z.string().optional(),
        isPremium: z.boolean().optional(),
        displayOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(courses).set(updateData).where(eq(courses.id, id));
      return { success: true };
    }),

  /**
   * Delete a course (admin only)
   */
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(courses).where(eq(courses.id, input.id));
      return { success: true };
    }),

  /**
   * Enroll user in a course
   */
  enroll: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if already enrolled
      const existing = await db
        .select()
        .from(userProgress)
        .where(
          and(
            eq(userProgress.userId, ctx.user.id),
            eq(userProgress.courseId, input.courseId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return { success: true, alreadyEnrolled: true };
      }

      // Get course to determine total lessons
      const course = await db
        .select()
        .from(courses)
        .where(eq(courses.id, input.courseId))
        .limit(1);

      await db.insert(userProgress).values({
        userId: ctx.user.id,
        courseId: input.courseId,
        completedLessons: 0,
        totalLessons: course[0]?.totalLessons || 0,
        progressPercentage: "0.00",
        status: "not-started",
        startedAt: new Date(),
      });

      return { success: true, alreadyEnrolled: false };
    }),

  /**
   * Get popular courses (by enrollment count)
   */
  getPopular: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db
        .select()
        .from(courses)
        .orderBy(desc(courses.enrollmentCount))
        .limit(input.limit);
    }),

  /**
   * Get premium courses
   */
  getPremium: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(courses)
      .where(eq(courses.isPremium, true))
      .orderBy(courses.displayOrder);
  }),
});
