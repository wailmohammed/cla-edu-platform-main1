export function nowMs(): number {
  return Date.now();
}

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}

export interface LearningEvent {
  id: number;
  userId?: number;
  category: string;
  source: string;
  title: string;
  summary?: string;
  lat?: number | null;
  lng?: number | null;
  salience: number;
  ts: number;
  raw?: Record<string, unknown>;
}

export interface LearningBrief {
  id: string;
  ts: number;
  eventCount: number;
  domains: Record<string, number>;
  text: string;
  topEvents: string[];
}

export interface AgentView {
  name: string;
  probability: number;
  note: string;
  model: string;
}

export interface Prediction {
  id: string;
  statement: string;
  horizon: string;
  probability: number;
  reasoning?: string;
  drivers?: string[];
  location?: string;
  lat?: number | null;
  lng?: number | null;
  agents: AgentView[];
  baseProbability?: number;
  prevProbability?: number;
  split: boolean;
  briefId?: string;
  ts: number;
  resolved?: boolean;
  verdict?: string;
  resolvedAt?: number;
}

export interface RunRecord {
  id: string;
  trigger: string;
  stage: string;
  brief?: LearningBrief;
  predictionIds: string[];
  error: string;
  startedMs: number;
  updatedMs: number;
  elapsedMs: number;
}

export interface Persona {
  id: number;
  name: string;
  lens: string;
  systemPrompt: string;
  isActive: boolean;
}

export interface AlertRule {
  id: number;
  userId: number;
  kind: string;
  name: string;
  params: Record<string, unknown>;
  active: boolean;
}

export interface MorningBrief {
  id: number;
  userId: number;
  text: string;
  eventCount: number;
  domains?: Record<string, number>;
  ts: number;
  read: boolean;
}
