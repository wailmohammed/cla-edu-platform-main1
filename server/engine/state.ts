import { LearningBrief, LearningEvent, Prediction, RunRecord, type AgentView } from "./models";

export interface OracleState {
  events: LearningEvent[];
  world: LearningBrief | null;
  predictions: Prediction[];
  runs: Record<string, RunRecord>;
  deliberation: Record<string, unknown> | null;
  generating: boolean;
  loop_enabled: boolean;
  last_run_ms: number;
  swarm_models: Record<string, string>;
  watchlist: string[];
}

const state: OracleState = {
  events: [],
  world: null,
  predictions: [],
  runs: {},
  deliberation: null,
  generating: false,
  loop_enabled: false,
  last_run_ms: 0,
  swarm_models: {},
  watchlist: [],
};

const listeners = new Set<(key: string, payload: unknown) => void>();

export function snapshot(): OracleState {
  return {
    events: state.events,
    world: state.world,
    predictions: state.predictions,
    runs: Object.values(state.runs).slice(-20).reduce((acc, r) => { acc[r.id] = r; return acc; }, {} as Record<string, RunRecord>),
    deliberation: state.deliberation,
    generating: state.generating,
    loop_enabled: state.loop_enabled,
    last_run_ms: state.last_run_ms,
    swarm_models: state.swarm_models,
    watchlist: state.watchlist,
  } as OracleState;
}

export function subscribe(fn: (key: string, payload: unknown) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function unsubscribe(fn: (key: string, payload: unknown) => void) {
  listeners.delete(fn);
}

function publish(key: string, payload: unknown) {
  for (const fn of Array.from(listeners)) {
    try { fn(key, payload); } catch {}
  }
}

export function set_events(events: LearningEvent[]) {
  state.events = events;
  publish("events", events);
}

export function set_world(world: LearningBrief | null) {
  state.world = world;
  state.last_run_ms = world?.ts ?? state.last_run_ms;
  publish("world", world);
}

export function set_predictions(predictions: Prediction[]) {
  state.predictions = predictions;
  publish("predictions", predictions);
}

export function upsert_run(run: RunRecord) {
  state.runs[run.id] = run;
  publish("runs", state.runs);
}

export function set_generating(v: boolean) {
  state.generating = v;
  publish("generating", v);
}

export function set_loop(v: boolean) {
  state.loop_enabled = v;
  publish("loop", v);
}

export function set_deliberation(v: Record<string, unknown> | null) {
  state.deliberation = v;
  publish("deliberation", v);
}

export function set_swarm_models(models: Record<string, string>) {
  state.swarm_models = { ...state.swarm_models, ...models };
  publish("swarm_models", state.swarm_models);
}

export function save_swarm_models() {
  try {
    // persisted by caller if needed
  } catch {}
}

export function set_watchlist(list: string[]) {
  state.watchlist = list;
  publish("watchlist", list);
}

export function save_watchlist() {
  try {
    // persisted by caller if needed
  } catch {}
}
