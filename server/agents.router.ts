import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { listAgents, getAgent } from "./_core/agents-library";
import { tutorChat, buildUserContext } from "./_core/llm-router";

export const agentsRouter = router({
  /**
   * List all available AI agents from the bundled agency-agents library,
   * grouped by division on the client. Public so the catalog can render
   * before login.
   */
  list: publicProcedure.query(() => listAgents()),

  /**
   * Chat with a specific agent. The agent's persona (markdown body) becomes
   * the system prompt; the smart LLM router picks Ollama or Anthropic.
   */
  chat: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        message: z.string().min(1),
        history: z
          .array(z.object({ role: z.string(), content: z.string() }))
          .default([]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const agent = getAgent(input.agentId);
      if (!agent) {
        return { success: false, response: "Agent not found.", engine: "none" };
      }
      try {
        const userContext = ctx.user ? await buildUserContext(ctx.user.id) : undefined;
        const systemPrompt =
          `${agent.body}\n\n` +
          `You are operating inside Codelearnify, an online learning platform. ` +
          `Stay fully in character as ${agent.name}. Be helpful, specific, and concise.`;

        const result = await tutorChat({
          systemPrompt,
          userMessage: input.message,
          history: input.history,
          userContext,
          complexity: "moderate",
        });

        return {
          success: true,
          response: result.text,
          engine: result.engine,
          agentName: agent.name,
        };
      } catch {
        return {
          success: false,
          response:
            "I'm having trouble responding right now. Please try again in a moment.",
          engine: "none",
        };
      }
    }),
});
