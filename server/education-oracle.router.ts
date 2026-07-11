import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { learningEvents, learningBriefs, predictions as predictionTable } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { Oracle } from "./engine/oracle";
import { refreshWorld, runPrediction } from "./engine/pipeline";
import { snapshot, set_watchlist } from "./engine/state";

const oracle = new Oracle();

export const educationOracleRouter = router({
  health: publicProcedure.query(async () => {
    const ok = await oracle.health();
    return { engine: true, oracle: ok };
  }),

  agentView: publicProcedure.query(async () => {
    const state = snapshot();
    const events = (state.events as any[]) || [];
    const byDomain: Record<string, any[]> = {};
    for (const e of events) {
      (byDomain[e.category] ||= []).push({
        title: e.title,
        summary: e.summary,
        source: e.source,
        lat: e.lat,
        lng: e.lng,
        salience: e.salience,
        ts: e.ts,
      });
    }
    return {
      generated_at: state.last_run_ms,
      summary: state.world?.text || "",
      domains: state.world?.domains || {},
      events_by_domain: byDomain,
      event_count: events.length,
      predictions: state.predictions,
      live_stream: "/api/trpc/educationOracle.stateStream",
    };
  }),

  events: publicProcedure
    .input(
      z.object({
        domain: z.string().optional(),
        source: z.string().optional(),
        min_salience: z.number().optional(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      let rows = await db.select().from(learningEvents).orderBy(desc(learningEvents.ts)).limit(input.limit || 50);
      if (input.domain) rows = rows.filter((r: any) => r.category === input.domain);
      if (input.source) rows = rows.filter((r: any) => r.source === input.source);
      if (input.min_salience) rows = rows.filter((r: any) => Number(r.salience || 0) >= input.min_salience!);
      return {
        count: rows.length,
        events: rows.map(r => ({
          id: r.id,
          title: r.title,
          summary: r.summary,
          category: r.category,
          source: r.source,
          lat: r.lat ? Number(r.lat) : null,
          lng: r.lng ? Number(r.lng) : null,
          salience: Number(r.salience || 0),
          ts: r.ts ? new Date(r.ts).getTime() : Date.now(),
        })),
        domains_available: Array.from(new Set(rows.map((r: any) => r.category))),
      };
    }),

  predictions: publicProcedure
    .input(
      z.object({
        horizon: z.string().optional(),
        min_probability: z.number().optional(),
      })
    )
    .query(async () => {
      const state = snapshot();
      return {
        predictions: state.predictions,
        horizons: ["24h", "week", "month", "year"],
        world: state.world,
      };
    }),

  predict: protectedProcedure.mutation(async () => {
    const state = snapshot();
    const swarmModels: Record<string, string> = {};
    try {
      const prefs = await runPrediction(oracle, "manual", { swarmModels });
      return { status: "started", runId: prefs.id };
    } catch (e: any) {
      return { status: "error", error: e?.message || String(e) };
    }
  }),

  stateStream: publicProcedure.query(() => {
    // SSE-style streaming is handled at the HTTP level; this returns current snapshot
    return snapshot();
  }),

  world: publicProcedure.query(async () => {
    const state = snapshot();
    if (!state.world) throw new Error("no world brief yet — run /predict or wait for next pass");
    return state.world;
  }),

  whatIf: protectedProcedure
    .input(
      z.object({
        scenario: z.string(),
        personas: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const state = snapshot();
      const brief = state.world;
      const { narrative, predictions } = await oracle.whatIf(
        input.scenario,
        brief || null,
        ["24h", "week", "month"],
        4
      );
      return { scenario: input.scenario.slice(0, 400), narrative, predictions, personas: input.personas || [] };
    }),

  watch: publicProcedure.query(async () => {
    const state = snapshot();
    return {
      watchlist: state.watchlist,
      pythia_watch: [],
    };
  }),

  watchlist: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .mutation(async ({ input }) => {
      const current = snapshot().watchlist as string[];
      const sym = input.symbol.trim().toUpperCase();
      if (!current.includes(sym) && current.length < 40) {
        set_watchlist([...current, sym]);
      }
      return { watchlist: snapshot().watchlist };
    }),

  scorecard: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const resolved = await db.select().from(predictionTable).where(eq(predictionTable.resolved, true));
    const total = resolved.length;
    const hits = resolved.filter((r: any) => r.verdict === "yes").length;
    const brier = total > 0 ? resolved.reduce((s: number, r: any) => {
      const p = Number(r.probability || 0);
      const v = r.verdict === "yes" ? 1 : r.verdict === "no" ? 0 : 0.5;
      return s + (p - v) * (p - v);
    }, 0) / total : 0;
    return {
      brier: Math.round(brier * 100) / 100,
      hit_rate: total > 0 ? Math.round((hits / total) * 100) / 100 : 0,
      resolved: total,
      horizons: {},
      personas: {},
      recent: resolved.slice(-10).reverse(),
    };
  }),
});
