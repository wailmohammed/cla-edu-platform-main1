/**
 * Smart LLM Router
 * ─────────────────────────────────────────────────────────────────
 * Priority:
 *   1. Ollama (local LLaMA) — free, private, no API costs
 *   2. Anthropic Claude    — fallback for complex tasks or when Ollama unavailable
 *
 * The router picks automatically based on:
 *   - Whether Ollama is running locally
 *   - Task complexity (simple hints → Ollama, advanced reasoning → Claude)
 *   - Explicit `forceCloud` flag for tasks that need cloud quality
 *
 * User context injection:
 *   Pass `userContext` to enrich any prompt with the learner's progress,
 *   difficulty level, recent mistakes, and quiz history so the model
 *   gives personalised responses without re-training.
 */

import { invokeLLM, type Message, type InvokeParams, type InvokeResult } from "./llm";
import { ollamaChat, isOllamaAvailable, isModelAvailable, OLLAMA_MODEL, type OllamaMessage } from "./ollama";
import { getDb } from "../db";
import { users, lessonCompletion, exerciseSubmissions } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

// ─── User Learning Context ────────────────────────────────────────

export interface UserLearningContext {
  userId?: number;
  name?: string;
  level?: number;
  totalXP?: number;
  currentStreak?: number;
  learningGoal?: string;
  /** Topics the user has completed */
  completedTopics?: string[];
  /** Recent wrong answers to personalize hints */
  recentMistakes?: string[];
  /** User's overall difficulty preference derived from progress */
  inferredDifficulty?: "beginner" | "intermediate" | "advanced";
  /** Free-form notes the model should keep in mind */
  extra?: string;
}

/** Fetch and build the user's learning context from the database */
export async function buildUserContext(userId: number): Promise<UserLearningContext> {
  try {
    const db = await getDb();
    if (!db) return { userId };

    // Get user record
    const [user] = await db.select({
      name: users.name,
      level: users.level,
      totalXP: users.totalXP,
      currentStreakDays: users.currentStreakDays,
      learningGoal: users.learningGoal,
      recommendedPath: users.recommendedPath,
    }).from(users).where(eq(users.id, userId)).limit(1);

    // Get recent lesson completions
    const completions = await db
      .select({ lessonId: lessonCompletion.lessonId, xpEarned: lessonCompletion.xpEarned })
      .from(lessonCompletion)
      .where(eq(lessonCompletion.userId, userId))
      .orderBy(desc(lessonCompletion.completedAt))
      .limit(10);

    // Get recent exercise submissions (to detect mistakes)
    const submissions = await db
      .select({ passed: exerciseSubmissions.passed, code: exerciseSubmissions.code })
      .from(exerciseSubmissions)
      .where(eq(exerciseSubmissions.userId, userId))
      .orderBy(desc(exerciseSubmissions.submittedAt))
      .limit(20);

    const failedSubmissions = submissions.filter(s => !s.passed);
    const passRate = submissions.length > 0
      ? submissions.filter(s => s.passed).length / submissions.length
      : 0;

    // Infer difficulty from XP and pass rate
    const xp = user?.totalXP ?? 0;
    let inferredDifficulty: "beginner" | "intermediate" | "advanced" = "beginner";
    if (xp > 5000 && passRate > 0.7) inferredDifficulty = "advanced";
    else if (xp > 1000 && passRate > 0.5) inferredDifficulty = "intermediate";

    return {
      userId,
      name: user?.name ?? undefined,
      level: user?.level ?? 1,
      totalXP: xp,
      currentStreak: user?.currentStreakDays ?? 0,
      learningGoal: user?.learningGoal ?? undefined,
      completedTopics: completions.map(c => `lesson-${c.lessonId}`),
      recentMistakes: failedSubmissions.slice(0, 3).map(s =>
        s.code ? `Failed attempt: ${s.code.slice(0, 100)}` : "Failed exercise"
      ),
      inferredDifficulty,
      extra: passRate > 0
        ? `Recent exercise pass rate: ${Math.round(passRate * 100)}%`
        : undefined,
    };
  } catch {
    return { userId };
  }
}

/** Convert user context into a system prompt addendum */
export function userContextToPrompt(ctx: UserLearningContext): string {
  if (!ctx.userId) return "";

  const parts: string[] = ["\n--- STUDENT CONTEXT (use to personalise your response) ---"];

  if (ctx.name) parts.push(`Student name: ${ctx.name}`);
  if (ctx.level) parts.push(`Level: ${ctx.level} (${ctx.totalXP ?? 0} XP total)`);
  if (ctx.inferredDifficulty) parts.push(`Inferred skill level: ${ctx.inferredDifficulty}`);
  if (ctx.currentStreak) parts.push(`Current learning streak: ${ctx.currentStreak} days`);
  if (ctx.learningGoal) parts.push(`Learning goal: ${ctx.learningGoal}`);
  if (ctx.completedTopics?.length) parts.push(`Recently completed: ${ctx.completedTopics.slice(0, 5).join(", ")}`);
  if (ctx.recentMistakes?.length) {
    parts.push(`Recent struggles (use to tailor your hint):`);
    ctx.recentMistakes.forEach(m => parts.push(`  - ${m}`));
  }
  if (ctx.extra) parts.push(ctx.extra);
  parts.push("---");

  return parts.join("\n");
}

// ─── Smart Router ────────────────────────────────────────────────

export type Complexity = "simple" | "moderate" | "complex";

export interface SmartInvokeParams extends InvokeParams {
  /** Hint to the router about task complexity */
  complexity?: Complexity;
  /** Force Anthropic cloud even if Ollama is available */
  forceCloud?: boolean;
  /** User context to inject for personalisation */
  userContext?: UserLearningContext;
}

export interface SmartInvokeResult extends InvokeResult {
  /** Which engine was used */
  engine: "ollama" | "anthropic";
}

let _ollamaChecked = false;
let _ollamaAvailable = false;
let _lastCheck = 0;

/** Cache Ollama availability for 30 seconds to avoid hammering it */
async function checkOllama(): Promise<boolean> {
  const now = Date.now();
  if (_ollamaChecked && now - _lastCheck < 30_000) return _ollamaAvailable;
  _ollamaAvailable = await isOllamaAvailable();
  if (_ollamaAvailable) {
    // Also check the model is pulled
    _ollamaAvailable = await isModelAvailable(OLLAMA_MODEL);
  }
  _ollamaChecked = true;
  _lastCheck = now;
  return _ollamaAvailable;
}

/**
 * Main entry point. Drop-in replacement for `invokeLLM` with smart routing
 * and optional user-context personalisation.
 */
export async function smartInvoke(params: SmartInvokeParams): Promise<SmartInvokeResult> {
  // Inject user context into the system prompt if provided
  const messages = injectUserContext(params.messages, params.userContext);

  // Decide which engine to use
  const useOllama =
    !params.forceCloud &&
    params.complexity !== "complex" &&
    (await checkOllama());

  if (useOllama) {
    try {
      const result = await callOllama({ ...params, messages });
      return { ...result, engine: "ollama" };
    } catch (err) {
      console.warn("[LLM Router] Ollama failed, falling back to Anthropic:", (err as Error).message);
      // Mark as unavailable so we don't retry immediately
      _ollamaAvailable = false;
    }
  }

  // Anthropic fallback
  const result = await invokeLLM({ ...params, messages });
  return { ...result, engine: "anthropic" };
}

/** Inject user context into the system message (or prepend one) */
function injectUserContext(messages: Message[], ctx?: UserLearningContext): Message[] {
  if (!ctx) return messages;
  const contextStr = userContextToPrompt(ctx);
  if (!contextStr) return messages;

  const msgs = [...messages];
  const sysIdx = msgs.findIndex(m => m.role === "system");
  if (sysIdx >= 0) {
    const existing = msgs[sysIdx];
    const existingText = typeof existing.content === "string"
      ? existing.content
      : JSON.stringify(existing.content);
    msgs[sysIdx] = { ...existing, content: existingText + contextStr };
  } else {
    msgs.unshift({ role: "system", content: contextStr });
  }
  return msgs;
}

/** Convert OpenAI-shaped messages to Ollama format and call */
async function callOllama(params: InvokeParams): Promise<InvokeResult> {
  const ollamaMessages: OllamaMessage[] = params.messages.map(m => ({
    role: m.role === "tool" || m.role === "function" ? "user" : m.role as OllamaMessage["role"],
    content: typeof m.content === "string"
      ? m.content
      : Array.isArray(m.content)
        ? m.content.map((c: any) => (typeof c === "string" ? c : c.text ?? JSON.stringify(c))).join("\n")
        : JSON.stringify(m.content),
  }));

  const result = await ollamaChat({
    messages: ollamaMessages,
    maxTokens: params.maxTokens ?? params.max_tokens ?? 1024,
  });

  return {
    id: `ollama-${Date.now()}`,
    created: Math.floor(Date.now() / 1000),
    model: result.model,
    choices: [{
      index: 0,
      message: { role: "assistant", content: result.message.content },
      finish_reason: result.done ? "stop" : null,
    }],
  };
}

// ─── Convenience wrappers ────────────────────────────────────────

/** Quick chat: Ollama first, Anthropic fallback, with user context */
export async function tutorChat(opts: {
  systemPrompt: string;
  userMessage: string;
  history?: { role: string; content: string }[];
  userContext?: UserLearningContext;
  complexity?: Complexity;
}): Promise<{ text: string; engine: string }> {
  const messages: Message[] = [
    { role: "system", content: opts.systemPrompt },
    ...(opts.history ?? []).map(h => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    })),
    { role: "user", content: opts.userMessage },
  ];

  const result = await smartInvoke({
    messages,
    userContext: opts.userContext,
    complexity: opts.complexity ?? "simple",
  });

  const content = result.choices[0]?.message?.content;
  return {
    text: typeof content === "string" ? content : "I'm here to help! What would you like to know?",
    engine: result.engine,
  };
}
