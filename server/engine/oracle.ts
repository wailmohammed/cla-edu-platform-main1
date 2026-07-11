import { LearningBrief, Prediction } from "./models";
import { invokeLLM } from "../_core/llm";

const SYSTEM =
  "You are an education oracle. You watch a live snapshot of learning activity " +
  "and predict concrete future learning outcomes. Be specific, plausible, and grounded " +
  "in the snapshot. Output strictly JSON.";

const HORIZON_LABEL: Record<string, string> = {
  "24h": "the next 24 hours",
  week: "the next week",
  month: "the next month",
  year: "the next year",
};

export class Oracle {
  async health(): Promise<boolean> {
    try {
      await invokeLLM({
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 1,
      });
      return true;
    } catch {
      return false;
    }
  }

  _prompt(brief: LearningBrief, horizons: string[], predictionsPerHorizon: number): string {
    const spans = horizons.map(h => `${h} = ${HORIZON_LABEL[h] || h}`).join("; ");
    return (
      `=== LIVE LEARNING SNAPSHOT (${brief.eventCount} signals) ===\n${brief.text}\n\n` +
      `Give ${predictionsPerHorizon} concrete predictions for EACH horizon (${spans}).\n` +
      `Return ONLY a JSON array. Each element exactly:\n` +
      `{"statement": "<specific predicted learning outcome>", ` +
      `"horizon": <one of ${horizons.join("|")}>, ` +
      `"probability": <integer 0-100>, ` +
      `"reasoning": "<one sentence grounded in the snapshot>", ` +
      `"location": "<user or topic this is about>", ` +
      `"lat": <approx or null>, "lng": <approx or null>}}\n` +
      `JSON array only — no markdown, no commentary.`
    );
  }

  async predict(
    brief: LearningBrief,
    horizons: string[],
    predictionsPerHorizon: number,
    onStage?: (stage: string, info?: string) => void,
  ): Promise<Prediction[]> {
    if (onStage) await onStage("thinking", "asking model");
    const text = await this._chat(this._prompt(brief, horizons, predictionsPerHorizon));
    const preds = this._parse(text, brief.id);
    return preds;
  }

  async _chat(user: string): Promise<string> {
    const result = await invokeLLM({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: user },
      ],
      max_tokens: 1400,
    });
    const content = result.choices[0]?.message?.content;
    return typeof content === "string" ? content : "";
  }

  async chat(
    question: string,
    brief: LearningBrief | null,
    predictions: Prediction[],
    history: { role: string; content: string }[] = [],
    persona?: { name: string; lens: string },
    model?: string,
  ): Promise<string> {
    const parts: string[] = [];
    if (brief) {
      parts.push(
        `=== LIVE LEARNING DATA — ${brief.eventCount} signals ===\n${brief.text}`
      );
    }
    if (predictions.length > 0) {
      parts.push(
        "=== CURRENT PREDICTIONS ===\n" +
          predictions
            .slice(0, 24)
            .map(
              p =>
                `- [${p.horizon}] ${Math.round(p.probability * 100)}% ${p.statement}` +
                (p.reasoning ? ` — ${p.reasoning}` : "")
            )
            .join("\n")
      );
    }
    const context = parts.join("\n\n") || "(no live data loaded yet)";

    const sys = persona
      ? `You are the ${persona.name}, one specialist on the education oracle council. Your expertise is ${persona.lens}. Answer in your own voice, through that lens, while staying grounded in the live data below. Be specific and concise, cite concrete signals, and say plainly when something is outside your lane.`
      : "You are an education oracle watching student activity through live learning feeds. Answer the user's question using the live data below and sound reasoning. Be specific and concise, cite concrete signals, and say when data doesn't cover something.";

    const messages: { role: string; content: string }[] = [
      { role: "system", content: sys },
      ...history.slice(-6).map(h => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: typeof h.content === "string" ? h.content.slice(0, 2000) : JSON.stringify(h.content).slice(0, 2000),
      })),
      { role: "user", content: `${context}\n\n— USER QUESTION —\n${question}` },
    ];

    const result = await invokeLLM({
      messages: messages as any,
      max_tokens: 800,
    });
    const content = result.choices[0]?.message?.content;
    return typeof content === "string" ? content : "I'm here to help. What would you like to know?";
  }

  async whatIf(
    scenario: string,
    brief: LearningBrief | null,
    horizons: string[],
    predictionsPerHorizon: number,
  ): Promise<{ narrative: string; predictions: Prediction[] }> {
    const base = (brief?.text || "(no live learning data loaded)").slice(0, 4000);
    const prompt =
      `=== LIVE LEARNING SNAPSHOT ===\n${base}\n\n` +
      `=== HYPOTHETICAL EVENT (assume it just happened) ===\n${scenario.slice(0, 400)}\n\n` +
      "Reason through the knock-on consequences, grounded in the real snapshot above.\n" +
      "Return ONLY JSON:\n" +
      '{"narrative": "<3-4 sentences>", "predictions": [{"statement": "<event>", "horizon": "24h", ' +
      '"probability": <0-100>, "reasoning": "<one sentence>", "location": "<place>"}]}\n' +
      "JSON only.";

    const result = await invokeLLM({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
      max_tokens: 2400,
    });
    const raw = result.choices[0]?.message?.content;
    const text = typeof raw === "string" ? raw : "";
    return this._parseWhatIf(text, horizons, predictionsPerHorizon);
  }

  private _parse(text: string, briefId: string): Prediction[] {
    const preds: Prediction[] = [];
    for (const chunk of this._extractObjects(text)) {
      try {
        const it = JSON.parse(chunk);
        if (!it.statement) continue;
        let p = Number(it.probability ?? 50);
        if (!Number.isFinite(p)) p = 50;
        p = Math.max(0, Math.min(1, p / 100)) * 100;
        preds.push({
          id: `pred_${Math.random().toString(36).slice(2, 12)}`,
          statement: String(it.statement).slice(0, 300),
          horizon: this._normHorizon(String(it.horizon || "week")),
          probability: Math.round(p) / 100,
          reasoning: String(it.reasoning || "").slice(0, 400),
          drivers: Array.isArray(it.drivers) ? it.drivers.slice(0, 10) : [],
          location: String(it.location || "").slice(0, 80),
          lat: this._num(it.lat),
          lng: this._num(it.lng),
          agents: [],
          split: false,
          briefId,
          ts: Date.now(),
        });
      } catch {}
    }
    return preds;
  }

  private _parseWhatIf(
    text: string,
    horizons: string[],
    predictionsPerHorizon: number
  ): { narrative: string; predictions: Prediction[] } {
    let narrative = "";
    const preds: Prediction[] = [];
    for (const chunk of this._extractObjects(text)) {
      try {
        const d = JSON.parse(chunk);
        if (typeof d.narrative === "string") narrative = d.narrative.slice(0, 900);
        if (Array.isArray(d.predictions)) {
          for (const it of d.predictions.slice(0, predictionsPerHorizon * horizons.length)) {
            if (!it.statement) continue;
            let p = Number(it.probability ?? 50);
            if (!Number.isFinite(p)) p = 50;
            p = Math.max(0, Math.min(1, p / 100)) * 100;
            preds.push({
              id: `pred_${Math.random().toString(36).slice(2, 12)}`,
              statement: String(it.statement).slice(0, 300),
              horizon: this._normHorizon(String(it.horizon || "week")),
              probability: Math.round(p) / 100,
              reasoning: String(it.reasoning || "").slice(0, 400),
              location: String(it.location || "").slice(0, 80),
              agents: [],
              split: false,
              ts: Date.now(),
            });
          }
        }
      } catch {}
    }
    if (!preds.length) {
      const lb = text.indexOf("[");
      for (const chunk of this._extractObjects(text.slice(lb ?? 0))) {
        try {
          const it = JSON.parse(chunk);
          if (!it.statement) continue;
          preds.push({
            id: `pred_${Math.random().toString(36).slice(2, 12)}`,
            statement: String(it.statement).slice(0, 300),
            horizon: this._normHorizon(String(it.horizon || "week")),
            probability: 0.5,
            reasoning: "",
            location: "",
            agents: [],
            split: false,
            ts: Date.now(),
          });
        } catch {}
      }
    }
    return { narrative, predictions: preds };
  }

  private _extractObjects(text: string): string[] {
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

  private _normHorizon(h: string): string {
    const lower = h.toLowerCase();
    if (lower.includes("24") || lower.includes("day") || lower.includes("tomorrow") || lower.includes("hour")) return "24h";
    if (lower.includes("week")) return "week";
    if (lower.includes("month")) return "month";
    if (lower.includes("year")) return "year";
    return "week";
  }

  private _num(v: unknown): number | null {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
}
