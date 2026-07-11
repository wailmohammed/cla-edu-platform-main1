import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { smartInvoke, buildUserContext, tutorChat } from "./_core/llm-router";

export const aiTutorRouter = router({
  /**
   * Get AI tutor hint based on current context
   */
  getHint: protectedProcedure
    .input(
      z.object({
        topic: z.string(),
        userCode: z.string().optional(),
        errorMessage: z.string().optional(),
        context: z.string().optional(),
        lessonContent: z.string().optional(),
        hintLevel: z.enum(["subtle", "moderate", "detailed"]).default("subtle"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const userContext = await buildUserContext(ctx.user.id);

        const hintPrompts: Record<string, string> = {
          subtle: "Give a very brief, subtle hint that points the student in the right direction without revealing the solution.",
          moderate: "Provide a moderate hint that explains the concept and guides the student toward the solution.",
          detailed: "Provide a detailed step-by-step hint that breaks down the problem into manageable parts.",
        };

        const prompt = `You are an expert programming tutor helping a student learn. Your goal is to guide them to understanding, not just give answers.

Topic: ${input.topic}
Hint Level: ${input.hintLevel}

${input.userCode ? `Student's current code:\`\`\`\n${input.userCode}\n\`\`\`` : ""}
${input.errorMessage ? `Error they encountered: ${input.errorMessage}` : ""}
${input.context ? `Context: ${input.context}` : ""}
${input.lessonContent ? `Lesson content: ${input.lessonContent}` : ""}

Instructions:
- Be encouraging and supportive
- Never give away the complete solution
- Ask guiding questions instead of stating facts
- Break down complex concepts into simpler parts
- Relate to real-world examples when possible
- Keep hints concise and actionable

Provide a helpful hint:`;

        const result = await tutorChat({
          systemPrompt: "You are a patient, encouraging programming tutor. You never give away answers directly. Instead, you ask questions and provide hints that help students discover solutions themselves. You adapt your teaching style to the student's level.",
          userMessage: prompt,
          userContext,
          complexity: "simple",
        });

        return { success: true, hint: result.text, engine: result.engine };
      } catch (error) {
        return { success: false, hint: "I'm here to help! Could you tell me more about what you're trying to do?", engine: "none" };
      }
    }),

  /**
   * Analyze code and provide feedback
   */
  analyzeCode: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        language: z.string(),
        expectedBehavior: z.string().optional(),
        errorMessage: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const userContext = await buildUserContext(ctx.user.id);
        const result = await tutorChat({
          systemPrompt: "You are a supportive code reviewer for students. You never fix their code for them, but you help them see what's working and what might need attention. You celebrate what's correct before suggesting improvements.",
          userMessage: `Analyze this ${input.language} code and provide helpful feedback.\n\nCode:\n\`\`\`${input.language}\n${input.code}\n\`\`\`\n${input.errorMessage ? `Error: ${input.errorMessage}` : ""}\n${input.expectedBehavior ? `Expected: ${input.expectedBehavior}` : ""}\n\nProvide: 1) What's correct 2) One issue to investigate 3) A guiding question 4) Encouragement.`,
          userContext,
          complexity: "moderate",
        });
        return { success: true, feedback: result.text, engine: result.engine };
      } catch (error) {
        return { success: false, feedback: "I'm analyzing your code. Could you tell me what you think it does?", engine: "none" };
      }
    }),

  /**
   * Explain a concept in simple terms
   */
  explainConcept: protectedProcedure
    .input(
      z.object({
        concept: z.string(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
        examples: z.boolean().default(true),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const userContext = ctx.user ? await buildUserContext(ctx.user.id) : undefined;
        const result = await tutorChat({
          systemPrompt: "You are an expert educator who explains technical concepts clearly and simply. Always start with 'why', then 'what', then 'how'. Use analogies to make abstract concepts concrete.",
          userMessage: `Explain "${input.concept}" to a ${input.difficulty} learner in under 200 words.${input.examples ? " Include a simple code example." : ""} Avoid jargon.`,
          userContext,
          complexity: "simple",
        });
        return { success: true, explanation: result.text, engine: result.engine };
      } catch {
        return { success: false, explanation: "Could you tell me what you understand about this concept so far?", engine: "none" };
      }
    }),

  /**
   * Generate a personalized learning step
   */
  getNextStep: protectedProcedure
    .input(
      z.object({
        currentTopic: z.string(),
        completedTopics: z.array(z.string()).default([]),
        userLevel: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
        goals: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const userContext = ctx.user ? await buildUserContext(ctx.user.id) : undefined;
        const result = await tutorChat({
          systemPrompt: "You are an expert curriculum designer. You create personalized learning paths that are engaging and achievable. Always suggest a concrete, actionable next step.",
          userMessage: `Student is learning "${input.currentTopic}" at ${input.userLevel} level. Completed: ${input.completedTopics.join(", ") || "nothing yet"}. ${input.goals ? `Goal: ${input.goals}` : ""}\n\nSuggest the next small step (5-15 min task).`,
          userContext,
          complexity: "simple",
        });
        return { success: true, nextStep: result.text, engine: result.engine };
      } catch {
        return { success: false, nextStep: "Continue practicing the current topic. Mastery comes with repetition!", engine: "none" };
      }
    }),

  /**
   * Chat with AI tutor - main conversational interface
   */
  chat: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        topic: z.string().optional(),
        userCode: z.string().optional(),
        lessonContent: z.string().optional(),
        history: z.array(z.object({ role: z.string(), content: z.string() })).default([]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const userContext = await buildUserContext(ctx.user.id);

        const systemPrompt = `You are Koji, an expert AI tutor from Codelearnify. Your personality:
- Patient, encouraging, and curious
- You never just give answers - you guide students to discover them
- You can see what the student is working on and ask questions about it
- You speak in a natural, conversational tone
- You celebrate small wins and normalize mistakes as part of learning

${input.topic ? `Current topic: ${input.topic}` : ""}
${input.userCode ? `Student's current code:\`\`\`\n${input.userCode}\n\`\`\`` : ""}
${input.lessonContent ? `Lesson context: ${input.lessonContent}` : ""}

Guidelines:
- If the student is stuck, first acknowledge their effort
- Ask a question that helps them think differently
- Keep responses concise (under 150 words) unless teaching a concept
- Use the Socratic method: ask, don't tell`;

        const result = await tutorChat({
          systemPrompt,
          userMessage: input.message,
          history: input.history,
          userContext,
          complexity: "simple",
        });

        return { success: true, response: result.text, engine: result.engine };
      } catch (error) {
        return { success: false, response: "I'm processing your question. What part is giving you the most trouble?", engine: "none" };
      }
    }),
});
