import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { alertRules, alertFeed as alertFeedTable, learningEvents } from "../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { upsertRule, removeRule, evaluate, getFeed, RULES } from "./engine/alerts";

export const alertsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(alertRules).where(eq(alertRules.userId, ctx.user.id)).orderBy(alertRules.id);
    return rows;
  }),

  create: protectedProcedure
    .input(
      z.object({
        kind: z.string(),
        name: z.string(),
        params: z.any(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const rec = upsertRule({ ...input, userId: ctx.user.id });
      await db.insert(alertRules).values({
        userId: ctx.user.id,
        kind: rec.kind,
        name: rec.name,
        params: rec.params as any,
        active: rec.active,
      });
      return rec;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        active: z.boolean().optional(),
        params: z.any().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const existing = RULES.find(r => r.id === input.id && r.userId === ctx.user.id);
      if (!existing) throw new Error("Rule not found");
      if (input.active !== undefined) existing.active = input.active;
      if (input.params) existing.params = input.params;
      await db.update(alertRules).set({ active: existing.active, params: existing.params as any }).where(eq(alertRules.id, input.id));
      return existing;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const ok = removeRule(input.id);
      if (!ok) throw new Error("Rule not found");
      await db.delete(alertRules).where(and(eq(alertRules.id, input.id), eq(alertRules.userId, ctx.user.id)));
      return { success: true };
    }),

  feed: protectedProcedure
    .input(z.object({ since: z.number().optional(), limit: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const since = input.since || 0;
      const limit = input.limit || 50;
      const db = await getDb();
      if (!db) return { alerts: [] };
      const rows = await db.select().from(alertFeedTable).where(eq(alertFeedTable.userId, ctx.user.id)).orderBy(desc(alertFeedTable.ts)).limit(limit);
      const filtered = rows.filter((r: any) => new Date(r.ts).getTime() >= since);
      return { alerts: filtered };
    }),

  evaluate: protectedProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) return { fired: [] };
    const rows = await db.select().from(learningEvents);
    const fired = evaluate(rows.map((r: any) => ({ ...r, ts: new Date(r.ts).getTime() })));
    return { fired };
  }),
});
