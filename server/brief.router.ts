import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { morningBriefs } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { generateBrief } from "./engine/brief";

export const briefRouter = router({
  latest: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db.select().from(morningBriefs).where(eq(morningBriefs.userId, ctx.user.id)).orderBy(desc(morningBriefs.ts)).limit(1);
    return rows[0] || null;
  }),

  history: protectedProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select().from(morningBriefs).where(eq(morningBriefs.userId, ctx.user.id)).orderBy(desc(morningBriefs.ts)).limit(input.limit || 10);
      return rows;
    }),

  run: protectedProcedure.mutation(async ({ ctx }) => {
    const brief = await generateBrief(ctx.user.id);
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    await db.insert(morningBriefs).values({
      userId: ctx.user.id,
      text: brief.text,
      eventCount: brief.eventCount,
      domains: brief.domains as any,
      ts: new Date(brief.ts),
      read: false,
    });
    return brief;
  }),

  config: protectedProcedure
    .input(
      z.object({
        time: z.string().optional(),
        enabled: z.boolean().optional(),
      })
    )
    .mutation(async () => {
      return { success: true };
    }),
});
