import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { lessons, exercises, lessonCompletion } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const lessonsRouter = router({
  // Note: All queries use getDb() to get the database instance
  /**
   * Get a single lesson by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const lesson = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, input.id))
        .limit(1);
      return lesson[0] || null;
    }),

  /**
   * List all lessons for a course
   */
  listByCourse: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, input.courseId))
        .orderBy(lessons.displayOrder);
    }),

  /**
   * Get lesson with exercises
   */
  getWithExercises: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const lesson = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, input.id))
        .limit(1);

      if (!lesson[0]) return null;

      const exerciseList = await db
        .select()
        .from(exercises)
        .where(eq(exercises.lessonId, input.id))
        .orderBy(exercises.displayOrder);

      return {
        ...lesson[0],
        exercises: exerciseList,
      };
    }),

  /**
   * Create a new lesson (admin only)
   */
  create: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        slug: z.string(),
        title: z.string(),
        description: z.string().optional(),
        theoryContent: z.string().optional(),
        exampleCode: z.string().optional(),
        lessonType: z.enum(["theory", "challenge", "quiz", "project"]),
        displayOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can create lessons");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(lessons).values({
        courseId: input.courseId,
        slug: input.slug,
        title: input.title,
        description: input.description,
        theoryContent: input.theoryContent,
        exampleCode: input.exampleCode,
        lessonType: input.lessonType,
        displayOrder: input.displayOrder,
      });

      return result;
    }),

  /**
   * Update a lesson (admin only)
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        theoryContent: z.string().optional(),
        exampleCode: z.string().optional(),
        lessonType: z.enum(["theory", "challenge", "quiz", "project"]).optional(),
        displayOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can update lessons");
      }

      const { id, ...updateData } = input;
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(lessons).set(updateData).where(eq(lessons.id, id));

      return { success: true };
    }),

  /**
   * Delete a lesson (admin only)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can delete lessons");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(lessons).where(eq(lessons.id, input.id));

      return { success: true };
    }),

  /**
   * Mark lesson as completed
   */
  markComplete: protectedProcedure
    .input(z.object({ lessonId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if already completed
      const existing = await db
        .select()
        .from(lessonCompletion)
        .where(
          and(
            eq(lessonCompletion.userId, ctx.user.id),
            eq(lessonCompletion.lessonId, input.lessonId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return { success: true, alreadyCompleted: true };
      }

      // Get lesson to determine XP
      const lesson = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, input.lessonId))
        .limit(1);

      const xpEarned = 10; // Default XP for lesson completion

      await db.insert(lessonCompletion).values({
        userId: ctx.user.id,
        lessonId: input.lessonId,
        completed: true,
        xpEarned,
        completedAt: new Date(),
      });

      return { success: true, alreadyCompleted: false, xpEarned };
    }),

  /**
   * Get user's completed lessons
   */
  getUserCompleted: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(lessonCompletion)
      .where(eq(lessonCompletion.userId, ctx.user.id));
  }),
});
