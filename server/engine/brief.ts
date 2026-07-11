import { LearningBrief, MorningBrief as MorningBriefModel, Prediction } from "./models";
import { invokeLLM } from "../_core/llm";
import { snapshot } from "./state";

const SYSTEM =
  "You are an education morning brief writer. You write a concise, 60-second digest " +
  "for a learner: what changed overnight, which learning goals are making progress, " +
  "what to watch today, and what to focus on next. Be encouraging and specific.";

export async function generateBrief(userId: number): Promise<MorningBriefModel> {
  const state = snapshot();
  const events = (state.events as any[]) || [];
  const predictions = (state.predictions as Prediction[]) || [];
  const world = state.world as LearningBrief | null;

  const topEvents = world?.topEvents?.slice(0, 10).join("\n") || "No major activity yet.";
  const activePreds = predictions
    .filter(p => p.horizon === "24h" || p.horizon === "week")
    .slice(0, 5)
    .map(p => `- [${p.horizon}] ${Math.round(p.probability * 100)}% ${p.statement}`)
    .join("\n") || "No active predictions yet.";

  const prompt =
    `Generate a morning brief for learner ${userId}.\n\n` +
    `Overnight activity (most salient first):\n${topEvents}\n\n` +
    `Active learning predictions:\n${activePreds}\n\n` +
    `Return ONLY JSON:\n` +
    `{"text": "<60-120 word morning brief>", "domains": {"category": count, ...}, ` +
    `"eventCount": <number>}\nJSON only.`;

  const result = await invokeLLM({
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: prompt },
    ],
    max_tokens: 600,
  });
  const text = typeof result.choices[0]?.message?.content === "string" ? result.choices[0].message.content : "";
  let parsed: any = {};
  try { parsed = JSON.parse(text); } catch {}

  const brief: MorningBriefModel = {
    id: Date.now(),
    userId,
    text: String(parsed.text || text).slice(0, 2000) || "Keep learning! Your next lesson is ready.",
    eventCount: Number(parsed.eventCount || events.length),
    domains: parsed.domains || (world?.domains || {}),
    ts: Date.now(),
    read: false,
  };
  return brief;
}
