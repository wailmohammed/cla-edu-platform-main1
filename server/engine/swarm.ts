import { LearningBrief, Prediction } from "./models";
import { invokeLLM } from "../_core/llm";

export interface PersonaDef {
  name: string;
  lens: string;
}

export const PERSONAS: PersonaDef[] = [
  { name: "Tutor", lens: "explaining concepts clearly and guiding discovery" },
  { name: "Critic", lens: "finding gaps in reasoning and challenging assumptions" },
  { name: "Mentor", lens: "encouraging persistence and building confidence" },
  { name: "Analyst", lens: "data-driven patterns, progress trends, and objective feedback" },
];

const _MAX_PREDS = 16;
const _SPLIT_SPREAD = 0.30;

export async function deliberate(
  oracle: { _chat(user: string): Promise<string> },
  brief: LearningBrief | null,
  predictions: Prediction[],
  personas?: string[],
  swarmModels?: Record<string, string>,
  onStage?: (stage: string, info: string) => void,
): Promise<Prediction[]> {
  if (!predictions.length) return predictions;

  const active = personas
    ? PERSONAS.filter(p => personas.includes(p.name))
    : PERSONAS;

  if (!active.length) return predictions;

  const subset = predictions.slice(0, _MAX_PREDS);
  if (onStage) await onStage("deliberating", `swarm of ${active.length} weighing ${subset.length} forecasts`);

  const listing = subset.map((p, i) => `${i}. [${p.horizon}] ${p.statement}`).join("\n");
  const briefText = brief?.text || "";

  const results: { name: string; model: string; scored: Record<number, [number, string]> }[] = [];

  for (const persona of active) {
    const model = swarmModels?.[persona.name];
    const messages = [
      { role: "system", content: _personaSystem(persona) },
      { role: "user", content: _personaUser(persona.name, briefText.slice(0, 2600), listing) },
    ];
    let text: string;
    try {
      const result = await invokeLLM({ messages: messages as any, max_tokens: 600 });
      text = typeof result.choices[0]?.message?.content === "string" ? result.choices[0].message.content : "";
    } catch {
      text = "";
    }
    const scored: Record<number, [number, string]> = {};
    for (const chunk of _extractObjects(text)) {
      try {
        const o = JSON.parse(chunk);
        const i = Number(o.i);
        const p = Number(o.p ?? 50);
        if (!Number.isFinite(i) || i < 0 || i >= subset.length) continue;
        scored[i] = [Math.max(0, Math.min(1, p / 100)) * 100, String(o.note || "").slice(0, 320)];
      } catch {}
    }
    results.push({ name: persona.name, model: model || "default", scored });
  }

  for (let idx = 0; idx < subset.length; idx++) {
    const views: { name: string; probability: number; note: string; model: string }[] = [];
    for (const r of results) {
      if (idx in r.scored) {
        const [p, note] = r.scored[idx];
        views.push({ name: r.name, probability: p / 100, note, model: r.model });
      }
    }
    if (!views.length) continue;
    const pred = subset[idx];
    (pred as any).agents = views;
    const base = pred.probability;
    const ps = views.map(v => v.probability);
    pred.probability = ps.reduce((s, p) => s + p, 0) / ps.length;
    pred.baseProbability = base;
    pred.split = (Math.max(...ps) - Math.min(...ps)) >= _SPLIT_SPREAD;
  }

  return predictions;
}

function _personaSystem(p: PersonaDef): string {
  return (
    `You are the ${p.name}, one specialist on the education oracle council. ` +
    `Your expertise is ${p.lens}. You will be given a learning snapshot and candidate predictions. ` +
    `For EACH prediction, estimate the probability (0-100) that the outcome happens within its horizon. ` +
    `Make your case in 1-2 sentences citing specific signals. ` +
    `Return ONLY a JSON array: [{"i": <index>, "p": <0-100>, "note": "<argument>"}]. No prose.`
  );
}

function _personaUser(name: string, briefText: string, listing: string): string {
  return `=== LEARNING SNAPSHOT ===\n${briefText.slice(0, 2600)}\n\n=== CANDIDATE PREDICTIONS ===\n${listing}\n\nScore every prediction from your lens. JSON array only.`;
}

function _extractObjects(text: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start: number | null = null;
  let inStr = false;
  let esc = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== null) {
        out.push(text.slice(start, i + 1));
        start = null;
      }
    }
  }
  return out;
}
