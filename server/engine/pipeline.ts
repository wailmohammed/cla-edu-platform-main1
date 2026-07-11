import { LearningBrief, LearningEvent, Prediction, RunRecord } from "./models";
import { Oracle } from "./oracle";
import { deliberate, PERSONAS } from "./swarm";
import { set_events, set_world, upsert_run, set_predictions, set_generating, set_deliberation, snapshot } from "./state";

let _lock = false;

export async function refreshWorld(events: LearningEvent[]): Promise<LearningBrief> {
  const byCat: Record<string, LearningEvent[]> = {};
  for (const e of events) {
    (byCat[e.category] ||= []).push(e);
  }
  const domains: Record<string, number> = {};
  const lines: string[] = [];
  const top: string[] = [];
  for (const cat of Object.keys(byCat).sort((a, b) => byCat[b].length - byCat[a].length)) {
    const evs = byCat[cat].sort((a, b) => b.salience - a.salience).slice(0, 8);
    lines.push(`\n[${cat.toUpperCase()}] (${byCat[cat].length} signals)`);
    for (const e of evs) {
      const loc = e.lat != null ? `  @${Number(e.lat).toFixed(1)},${Number(e.lng).toFixed(1)}` : "";
      const extra = e.summary ? ` — ${e.summary.slice(0, 140)}` : "";
      lines.push(`  • ${e.title}${extra}${loc}`);
      top.push(e.title);
    }
    domains[cat] = byCat[cat].length;
  }
  const text = lines.join("\n").trim().slice(0, 6500);
  const brief: LearningBrief = {
    id: `brief_${Math.random().toString(36).slice(2, 12)}`,
    ts: Date.now(),
    eventCount: events.length,
    domains,
    text,
    topEvents: top.slice(0, 24),
  };
  set_events(events);
  set_world(brief);
  return brief;
}

export async function runPrediction(
  oracle: Oracle,
  trigger: string = "manual",
  opts?: {
    horizons?: string[];
    predictionsPerHorizon?: number;
    swarmEnabled?: boolean;
    swarmModels?: Record<string, string>;
  },
): Promise<RunRecord> {
  if (_lock) {
    const existing = Object.values(snapshot().runs).pop() as RunRecord | undefined;
    return existing || {
      id: `run_${Math.random().toString(36).slice(2, 12)}`,
      trigger: "manual",
      stage: "queued",
      predictionIds: [],
      error: "",
      startedMs: Date.now(),
      updatedMs: Date.now(),
      elapsedMs: 0,
    } as RunRecord;
  }

  const horizons = opts?.horizons || ["24h", "week", "month"];
  const predictionsPerHorizon = opts?.predictionsPerHorizon || 3;
  const swarmEnabled = opts?.swarmEnabled ?? true;
  const swarmModels = opts?.swarmModels || {};

  const run: RunRecord = {
    id: `run_${Math.random().toString(36).slice(2, 12)}`,
    trigger,
    stage: "queued",
    predictionIds: [],
    error: "",
    startedMs: Date.now(),
    updatedMs: Date.now(),
    elapsedMs: 0,
  };
  upsert_run(run);
  set_generating(true);

  async function stage(name: string, info?: string) {
    run.stage = name;
    run.updatedMs = Date.now();
    run.elapsedMs = run.updatedMs - run.startedMs;
    if (info) run.error = info;
    upsert_run(run);
  }

  try {
    await stage("sensing", "reading events");
    const events = (snapshot().events as LearningEvent[]) || [];
    const brief = await refreshWorld(events);
    run.brief = brief;
    await stage("thinking", `${brief.eventCount} signals -> oracle`);

    let preds = await oracle.predict(brief, horizons, predictionsPerHorizon, async (s, info) => await stage(s, info));

    if (swarmEnabled && preds.length > 0) {
      await stage("deliberating", "swarm weighing forecasts");
      set_deliberation({
        ts: Date.now(),
        active: true,
        context: "forecast",
        statements: preds.slice(0, 16).map(p => ({ statement: p.statement.slice(0, 140), horizon: p.horizon })),
        voices: Object.fromEntries(PERSONAS.map(p => [p.name, { model: swarmModels[p.name] || "default", status: "voting" }])),
      });
      preds = await deliberate(oracle, brief, preds, undefined, swarmModels, async (s, info) => await stage(s, info));
      set_deliberation({
        ts: Date.now(),
        active: false,
        context: "forecast",
        statements: [],
        voices: {},
        consensus: preds.map(p => ({ i: 0, p: p.probability, base: p.baseProbability, split: p.split })),
      });
    }

    set_predictions(preds);
    run.predictionIds = preds.map(p => p.id);
    await stage("done", `${preds.length} predictions`);
  } catch (e: any) {
    run.error = String(e?.message || e);
    await stage("error", run.error);
  } finally {
    set_generating(false);
    _lock = false;
  }
  return run;
}
