/**
 * Ollama local LLaMA client.
 * Talks to a locally-running Ollama server (default: http://localhost:11434).
 * Model is configurable via OLLAMA_MODEL env var (default: llama3.2).
 *
 * Ollama docs: https://ollama.com/
 * Install:  https://ollama.com/download
 * Pull model: ollama pull llama3.2
 */

export const OLLAMA_BASE = process.env.OLLAMA_URL ?? "http://localhost:11434";
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2";

export interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Returns true if the local Ollama server is reachable */
export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
      signal: AbortSignal.timeout(2000), // 2-second ping
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Check if a specific model is pulled */
export async function isModelAvailable(model: string = OLLAMA_MODEL): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return false;
    const data = await res.json() as { models?: { name: string }[] };
    return (data.models ?? []).some(m => m.name.startsWith(model.split(":")[0]));
  } catch {
    return false;
  }
}

export interface OllamaChatOptions {
  model?: string;
  messages: OllamaMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: false;
}

export interface OllamaChatResult {
  message: { role: string; content: string };
  done: boolean;
  total_duration?: number;
  model: string;
}

/** Call Ollama chat endpoint */
export async function ollamaChat(opts: OllamaChatOptions): Promise<OllamaChatResult> {
  const model = opts.model ?? OLLAMA_MODEL;

  const body = {
    model,
    messages: opts.messages,
    stream: false,
    options: {
      temperature: opts.temperature ?? 0.7,
      num_predict: opts.maxTokens ?? 1024,
    },
  };

  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60_000), // 60s timeout for generation
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ollama error ${res.status}: ${err}`);
  }

  return res.json() as Promise<OllamaChatResult>;
}
