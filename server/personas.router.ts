import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { personas, userPersonaPrefs } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { PERSONAS } from "./engine/swarm";

export const personasRouter = router({
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return PERSONAS;
    const rows = await db.select().from(personas);
    if (rows.length) {
      return rows.map(r => ({ id: r.id, name: r.name, lens: r.lens, systemPrompt: r.systemPrompt, isActive: r.isActive }));
    }
    return PERSONAS.map((p, i) => ({ id: i + 1, name: p.name, lens: p.lens, systemPrompt: "", isActive: true }));
  }),

  myPref: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db.select().from(userPersonaPrefs).where(eq(userPersonaPrefs.userId, ctx.user.id)).limit(1);
    return rows[0] || null;
  }),

  setPref: protectedProcedure
    .input(
      z.object({
        personaId: z.number(),
        model: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const existing = await db.select().from(userPersonaPrefs).where(eq(userPersonaPrefs.userId, ctx.user.id)).limit(1);
      if (existing.length) {
        await db.update(userPersonaPrefs).set({ personaId: input.personaId, model: input.model }).where(eq(userPersonaPrefs.userId, ctx.user.id));
      } else {
        await db.insert(userPersonaPrefs).values({ userId: ctx.user.id, personaId: input.personaId, model: input.model });
      }
      return { success: true };
    }),
});
