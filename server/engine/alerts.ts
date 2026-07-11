export interface AlertRuleInput {
  kind: string;
  name: string;
  params: Record<string, unknown>;
}

export interface AlertMatch {
  ruleId?: number;
  kind: string;
  title: string;
  body: string;
  ts: number;
}

type Rule = {
  id: number;
  userId: number;
  kind: string;
  name: string;
  params: Record<string, unknown>;
  active: boolean;
};

export const RULES: Rule[] = [];
export const FEED: AlertMatch[] = [];

export function getRules(): Rule[] {
  return RULES;
}

export function upsertRule(input: AlertRuleInput & { id?: number; userId?: number }): Rule {
  const existing = input.id != null ? RULES.findIndex(r => r.id === input.id) : -1;
  const rec: Rule = {
    id: existing >= 0 ? RULES[existing].id : Date.now(),
    userId: input.userId || 0,
    kind: input.kind,
    name: input.name,
    params: input.params,
    active: true,
  };
  if (existing >= 0) {
    RULES[existing] = { ...RULES[existing], ...rec };
    return RULES[existing];
  }
  RULES.push(rec);
  return rec;
}

export function removeRule(id: number): boolean {
  const idx = RULES.findIndex(r => r.id === id);
  if (idx >= 0) { RULES.splice(idx, 1); return true; }
  return false;
}

export function evaluate(
  events: { category: string; title: string; summary?: string; userId?: number; ts: number }[]
): AlertMatch[] {
  const matches: AlertMatch[] = [];
  const now = Date.now();
  for (const ev of events) {
    for (const rule of RULES) {
      if (!rule.active) continue;
      if (rule.kind === "keyword" && typeof rule.params.keywords === "string") {
        const keywords = String(rule.params.keywords).split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
        const hay = `${ev.title} ${ev.summary || ""}`.toLowerCase();
        if (keywords.some(k => hay.includes(k))) {
          matches.push({
            ruleId: rule.id,
            kind: rule.kind,
            title: `Signal: ${rule.name}`,
            body: ev.title,
            ts: ev.ts || now,
          });
        }
      }
      if (rule.kind === "category" && rule.params.category === ev.category) {
        matches.push({
          ruleId: rule.id,
          kind: rule.kind,
          title: `Domain alert: ${rule.name}`,
          body: ev.title,
          ts: ev.ts || now,
        });
      }
      if (rule.kind === "streak" && ev.category === "streak") {
        const min = Number(rule.params.minDays || 3);
        const days = Number((ev as any).days || 0);
        if (days <= min) {
          matches.push({
            ruleId: rule.id,
            kind: rule.kind,
            title: `Streak risk: ${rule.name}`,
            body: `${ev.title} — only ${days} days remaining`,
            ts: ev.ts || now,
          });
        }
      }
      if (rule.kind === "quiz" && ev.category === "quiz") {
        const threshold = Number(rule.params.threshold || 60);
        const score = Number((ev as any).score || 0);
        if (score < threshold) {
          matches.push({
            ruleId: rule.id,
            kind: rule.kind,
            title: `Low quiz score: ${rule.name}`,
            body: `${ev.title} — scored ${Math.round(score)}%`,
            ts: ev.ts || now,
          });
        }
      }
    }
  }
  if (matches.length) {
    FEED.push(...matches);
  }
  return matches;
}

export function getFeed(since: number, limit = 200): AlertMatch[] {
  return FEED.filter(a => a.ts >= since).slice(-Math.max(1, Math.min(200, limit)));
}
