/**
 * LLM invocation — calls the Anthropic API directly (replaces the former
 * Manus "forge" proxy at forge.manus.im). The public `invokeLLM` interface is
 * kept OpenAI-chat-shaped so every existing caller (ai-tutor.router.ts,
 * copilot.router.ts, error-checker.agent.ts, etc.) needs zero changes.
 */
import { ENV } from "./env";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = { type: "text"; text: string };
export type ImageContent = {
  type: "image_url";
  image_url: { url: string; detail?: "auto" | "low" | "high" };
};
export type FileContent = {
  type: "file_url";
  file_url: { url: string; mime_type?: string };
};
export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: { name: string; description?: string; parameters?: Record<string, unknown> };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = { type: "function"; function: { name: string } };
export type ToolChoice = ToolChoicePrimitive | ToolChoiceByName | ToolChoiceExplicit;

export type JsonSchema = { name: string; schema: Record<string, unknown>; strict?: boolean };
export type OutputSchema = JsonSchema;
export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
};

export type ToolCall = { id: string; type: "function"; function: { name: string; arguments: string } };

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: Role; content: string | Array<TextContent | ImageContent | FileContent>; tool_calls?: ToolCall[] };
    finish_reason: string | null;
  }>;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
};

const ensureArray = (value: MessageContent | MessageContent[]): MessageContent[] =>
  Array.isArray(value) ? value : [value];

const contentPartToAnthropicBlock = (part: MessageContent): any => {
  if (typeof part === "string") return { type: "text", text: part };
  if (part.type === "text") return { type: "text", text: part.text };
  if (part.type === "image_url") {
    // Anthropic requires base64 or a fetchable URL source; pass through as a URL source.
    return { type: "image", source: { type: "url", url: part.image_url.url } };
  }
  if (part.type === "file_url") {
    return { type: "document", source: { type: "url", url: part.file_url.url } };
  }
  return { type: "text", text: JSON.stringify(part) };
};

const anthropicToolsFromOpenAI = (tools: Tool[] | undefined) =>
  tools?.map(t => ({
    name: t.function.name,
    description: t.function.description,
    input_schema: t.function.parameters ?? { type: "object", properties: {} },
  }));

const anthropicToolChoiceFromOpenAI = (
  toolChoice: ToolChoice | undefined,
  tools: Tool[] | undefined
): any => {
  if (!toolChoice) return undefined;
  if (toolChoice === "none") return undefined;
  if (toolChoice === "auto") return { type: "auto" };
  if (toolChoice === "required") return { type: "any" };
  if ("name" in toolChoice) return { type: "tool", name: toolChoice.name };
  return { type: "tool", name: toolChoice.function.name };
};

const assertApiKey = () => {
  if (!ENV.anthropicApiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Set it in your environment to enable AI features."
    );
  }
};

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  assertApiKey();

  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
  } = params;

  // Anthropic takes system prompt separately from the message list.
  const systemParts: string[] = [];
  const anthropicMessages: any[] = [];

  for (const m of messages) {
    if (m.role === "system") {
      const parts = ensureArray(m.content).map(p => (typeof p === "string" ? p : (p as TextContent).text ?? ""));
      systemParts.push(...parts);
      continue;
    }
    if (m.role === "tool" || m.role === "function") {
      const text = ensureArray(m.content)
        .map(p => (typeof p === "string" ? p : JSON.stringify(p)))
        .join("\n");
      anthropicMessages.push({
        role: "user",
        content: [{ type: "tool_result", tool_use_id: m.tool_call_id ?? "unknown", content: text }],
      });
      continue;
    }
    const blocks = ensureArray(m.content).map(contentPartToAnthropicBlock);
    anthropicMessages.push({
      role: m.role === "assistant" ? "assistant" : "user",
      content: blocks,
    });
  }

  const schema = outputSchema || output_schema;
  const fmt = responseFormat || response_format;
  if (fmt?.type === "json_schema" && fmt.json_schema?.schema) {
    systemParts.push(
      `Respond ONLY with valid JSON matching this schema (no prose, no markdown fences): ${JSON.stringify(fmt.json_schema.schema)}`
    );
  } else if (schema?.schema) {
    systemParts.push(
      `Respond ONLY with valid JSON matching this schema (no prose, no markdown fences): ${JSON.stringify(schema.schema)}`
    );
  } else if (fmt?.type === "json_object") {
    systemParts.push("Respond ONLY with a valid JSON object, no prose, no markdown fences.");
  }

  const payload: Record<string, unknown> = {
    model: ENV.anthropicModel,
    max_tokens: params.maxTokens ?? params.max_tokens ?? 8192,
    messages: anthropicMessages,
  };

  if (systemParts.length > 0) payload.system = systemParts.join("\n\n");

  const anthTools = anthropicToolsFromOpenAI(tools);
  if (anthTools && anthTools.length > 0) payload.tools = anthTools;

  const anthChoice = anthropicToolChoiceFromOpenAI(toolChoice || tool_choice, tools);
  if (anthChoice) payload.tool_choice = anthChoice;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ENV.anthropicApiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM invoke failed: ${response.status} ${response.statusText} – ${errorText}`);
  }

  const data = (await response.json()) as any;

  const textBlocks = (data.content ?? []).filter((b: any) => b.type === "text");
  const toolUseBlocks = (data.content ?? []).filter((b: any) => b.type === "tool_use");

  const content = textBlocks.map((b: any) => b.text).join("\n");
  const tool_calls: ToolCall[] | undefined =
    toolUseBlocks.length > 0
      ? toolUseBlocks.map((b: any) => ({
          id: b.id,
          type: "function" as const,
          function: { name: b.name, arguments: JSON.stringify(b.input ?? {}) },
        }))
      : undefined;

  const finishReasonMap: Record<string, string> = {
    end_turn: "stop",
    max_tokens: "length",
    tool_use: "tool_calls",
    stop_sequence: "stop",
  };

  return {
    id: data.id,
    created: Math.floor(Date.now() / 1000),
    model: data.model,
    choices: [
      {
        index: 0,
        message: { role: "assistant", content, tool_calls },
        finish_reason: finishReasonMap[data.stop_reason] ?? data.stop_reason ?? null,
      },
    ],
    usage: data.usage
      ? {
          prompt_tokens: data.usage.input_tokens,
          completion_tokens: data.usage.output_tokens,
          total_tokens: (data.usage.input_tokens ?? 0) + (data.usage.output_tokens ?? 0),
        }
      : undefined,
  };
}
