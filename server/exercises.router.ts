import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { exercises, exerciseSubmissions } from "../drizzle/schema";
import { validateSolution } from "./code-execution.router";

export const exercisesRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const exercise = await db
        .select()
        .from(exercises)
        .where(eq(exercises.id, input.id))
        .limit(1);
      return exercise[0] || null;
    }),

  listByLesson: publicProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db
        .select()
        .from(exercises)
        .where(eq(exercises.lessonId, input.lessonId))
        .orderBy(exercises.displayOrder);
    }),

  submit: protectedProcedure
    .input(
      z.object({
        exerciseId: z.number(),
        code: z.string(),
        language: z.enum(["javascript", "python", "typescript"]).default("javascript"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const exerciseRows = await db
        .select()
        .from(exercises)
        .where(eq(exercises.id, input.exerciseId))
        .limit(1);

      if (!exerciseRows[0]) {
        throw new Error("Exercise not found");
      }

      const exercise = exerciseRows[0];
      const testCases = (exercise.testCases as any) || [];

      let passed = false;
      let testResults: Array<{ passed: boolean; description: string; expected: string; actual: string }> = [];

      if (testCases.length > 0) {
        const validationResult = await validateSolution({
          exerciseId: input.exerciseId,
          code: input.code,
          language: input.language,
        });

        passed = validationResult.passed;
        testResults = validationResult.testResults.map((r: { passed: boolean; description: string; expected: string; actual: string }) => ({
          passed: r.passed,
          description: r.description,
          expected: r.expected,
          actual: r.actual,
        }));
      } else {
        passed = true;
      }

      const xpEarned = passed ? (exercise.xpReward || 10) : 0;

      const result = await db.insert(exerciseSubmissions).values({
        userId: ctx.user.id,
        exerciseId: input.exerciseId,
        code: input.code,
        passed,
        testResults: testResults as any,
        xpEarned,
      });

      return {
        success: true,
        passed,
        xpEarned,
        testResults,
        totalTests: testCases.length || 0,
        passedTests: testResults.filter((r) => r.passed).length,
      };
    }),

  getSubmission: protectedProcedure
    .input(z.object({ exerciseId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const submission = await db
        .select()
        .from(exerciseSubmissions)
        .where(eq(exerciseSubmissions.exerciseId, input.exerciseId))
        .limit(1);

      return submission[0] || null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        lessonId: z.number(),
        slug: z.string(),
        title: z.string(),
        description: z.string().optional(),
        language: z.string(),
        starterCode: z.string().optional(),
        solution: z.string().optional(),
        testCases: z.any().optional(),
        difficulty: z.enum(["easy", "medium", "hard"]).default("easy"),
        displayOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "super_admin") {
        throw new Error("Only admins can create exercises");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(exercises).values({
        lessonId: input.lessonId,
        slug: input.slug,
        title: input.title,
        description: input.description,
        language: input.language,
        starterCode: input.starterCode,
        solution: input.solution,
        testCases: input.testCases,
        xpReward: 10,
        difficulty: input.difficulty,
        displayOrder: input.displayOrder,
      });

      return result;
    }),
});
