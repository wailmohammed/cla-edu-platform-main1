import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { smartInvoke, buildUserContext } from "./_core/llm-router";
import { isOllamaAvailable, isModelAvailable, OLLAMA_MODEL } from "./_core/ollama";

export const copilotRouter = router({
  /** Check which AI engine is available */
  getEngineStatus: publicProcedure.query(async () => {
    const ollamaUp   = await isOllamaAvailable();
    const modelReady = ollamaUp ? await isModelAvailable(OLLAMA_MODEL) : false;
    return {
      ollama:    { available: ollamaUp, modelReady, model: OLLAMA_MODEL },
      anthropic: { configured: !!process.env.ANTHROPIC_API_KEY },
      activeEngine: modelReady ? "ollama" : (process.env.ANTHROPIC_API_KEY ? "anthropic" : "none"),
    };
  }),

  /** Get code suggestions */
  getSuggestions: protectedProcedure
    .input(z.object({ code: z.string(), language: z.string(), context: z.string().optional(), cursorPosition: z.number().optional() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const userContext = await buildUserContext(ctx.user.id);
        const result = await smartInvoke({
          messages: [
            { role: "system", content: "You are a helpful code assistant. Respond only with JSON." },
            { role: "user", content: `Analyze this ${input.language} code and return JSON with keys: completions, optimizations, bestPractices, potentialIssues.\n\`\`\`${input.language}\n${input.code}\n\`\`\`` },
          ],
          userContext,
          complexity: "moderate",
        });
        const raw = typeof result.choices[0]?.message?.content === "string" ? result.choices[0].message.content : "";
        let suggestions = { completions: [] as string[], optimizations: [] as string[], bestPractices: [] as string[], potentialIssues: [] as string[] };
        try { const m = raw.match(/\{[\s\S]*\}/)?.[0]; if (m) suggestions = { ...suggestions, ...JSON.parse(m) }; }
        catch { suggestions.completions = [raw]; }
        return { success: true, suggestions, engine: result.engine };
      } catch {
        return { success: false, error: "Failed", suggestions: { completions: [], optimizations: [], bestPractices: [], potentialIssues: [] }, engine: "none" };
      }
    }),

  /** Analyze code for issues */
  analyzeCode: protectedProcedure
    .input(z.object({ code: z.string(), language: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const userContext = await buildUserContext(ctx.user.id);
        const result = await smartInvoke({
          messages: [
            { role: "system", content: "You are an expert code reviewer." },
            { role: "user", content: `Analyze this ${input.language} code for performance, security, and quality:\n\`\`\`${input.language}\n${input.code}\n\`\`\`` },
          ],
          userContext,
          complexity: "moderate",
        });
        const content = result.choices[0]?.message?.content;
        return { success: true, analysis: typeof content === "string" ? content : "", engine: result.engine };
      } catch {
        return { success: false, error: "Failed to analyze code", analysis: "", engine: "none" };
      }
    }),

  /** Generate code from description */
  generateCode: protectedProcedure
    .input(z.object({ description: z.string(), language: z.string(), context: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const userContext = await buildUserContext(ctx.user.id);
        const result = await smartInvoke({
          messages: [
            { role: "system", content: `You are an expert ${input.language} developer. Generate clean, well-commented code.` },
            { role: "user", content: `Generate ${input.language} code for: ${input.description}${input.context ? `\nRequirements: ${input.context}` : ""}` },
          ],
          userContext,
          complexity: "moderate",
          forceCloud: input.description.length > 500,
        });
        const raw = typeof result.choices[0]?.message?.content === "string" ? result.choices[0].message.content : "";
        const match = raw.match(/```[\w]*\n([\s\S]*?)\n```/);
        return { success: true, code: match ? match[1] : raw, engine: result.engine };
      } catch {
        return { success: false, error: "Failed to generate code", code: "", engine: "none" };
      }
    }),

  /** Explain code */
  explainCode: protectedProcedure
    .input(z.object({ code: z.string(), language: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const userContext = await buildUserContext(ctx.user.id);
        const result = await smartInvoke({
          messages: [
            { role: "system", content: "You are a patient code tutor. Explain code clearly for learners." },
            { role: "user", content: `Explain this ${input.language} code:\n\`\`\`${input.language}\n${input.code}\n\`\`\`\nProvide: 1) Overview 2) Step-by-step 3) Key concepts 4) Use cases` },
          ],
          userContext,
          complexity: "simple",
        });
        const content = result.choices[0]?.message?.content;
        return { success: true, explanation: typeof content === "string" ? content : "", engine: result.engine };
      } catch {
        return { success: false, error: "Failed to explain code", explanation: "", engine: "none" };
      }
    }),

  /** Refactor code */
  refactorCode: protectedProcedure
    .input(z.object({ code: z.string(), language: z.string(), goal: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const userContext = await buildUserContext(ctx.user.id);
        const result = await smartInvoke({
          messages: [
            { role: "system", content: "You are an expert code refactorer." },
            { role: "user", content: `Refactor this ${input.language} code to be ${input.goal || "cleaner and more maintainable"}:\n\`\`\`${input.language}\n${input.code}\n\`\`\`` },
          ],
          userContext,
          complexity: "moderate",
        });
        const raw = typeof result.choices[0]?.message?.content === "string" ? result.choices[0].message.content : "";
        const match = raw.match(/```[\w]*\n([\s\S]*?)\n```/);
        return { success: true, refactoredCode: match ? match[1] : raw, explanation: raw, engine: result.engine };
      } catch {
        return { success: false, error: "Failed to refactor", refactoredCode: "", explanation: "", engine: "none" };
      }
    }),
});
