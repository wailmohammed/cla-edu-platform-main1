import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { generateSpeech, generateSpeechAndStore } from "./_core/fishAudio";
import { z } from "zod";
import { nanoid } from "nanoid";

export const ttsRouter = router({
  /**
   * Generate speech from text using Fish Audio's free S2.1 Pro model
   * Returns the audio buffer as base64 for direct playback
   */
  generate: publicProcedure
    .input(
      z.object({
        text: z.string().min(1),
        referenceId: z.string().optional(),
        format: z.enum(["mp3", "wav", "pcm"]).default("mp3"),
        speed: z.number().min(0.5).max(2.0).default(1.0),
        pitch: z.number().min(0.5).max(2.0).default(1.0),
      })
    )
    .mutation(async ({ input }) => {
      const { audioBuffer, format } = await generateSpeech(input);
      
      // Convert buffer to base64 for client-side playback
      const base64Audio = audioBuffer.toString("base64");
      const mimeType = `audio/${format}`;
      
      return {
        audioData: `data:${mimeType};base64,${base64Audio}`,
        format,
        size: audioBuffer.length,
      };
    }),

  /**
   * Generate speech and store it in the storage system
   * Returns a storage URL that can be used to access the audio
   */
  generateAndStore: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        referenceId: z.string().optional(),
        format: z.enum(["mp3", "wav", "pcm"]).default("mp3"),
        speed: z.number().min(0.5).max(2.0).default(1.0),
        pitch: z.number().min(0.5).max(2.0).default(1.0),
        storageKey: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { text, format, speed, pitch, referenceId, storageKey } = input;
      
      // Generate a unique storage key if not provided
      const key = storageKey || `tts/${ctx.user.id}/${nanoid()}.${format}`;
      
      const url = await generateSpeechAndStore(
        {
          text,
          referenceId,
          format,
          speed,
          pitch,
        },
        key
      );
      
      return {
        url,
        key,
        format,
      };
    }),

  /**
   * Generate speech for lesson content (educational use case)
   * Optimized for longer educational content
   */
  generateLessonAudio: protectedProcedure
    .input(
      z.object({
        lessonId: z.number(),
        content: z.string().min(1),
        sectionTitle: z.string().optional(),
        format: z.enum(["mp3", "wav"]).default("mp3"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { lessonId, content, sectionTitle, format } = input;
      
      // Create a descriptive storage key
      const safeTitle = sectionTitle?.replace(/[^a-z0-9]/gi, "-").toLowerCase() || "content";
      const key = `lessons/${lessonId}/${ctx.user.id}/${safeTitle}-${nanoid()}.${format}`;
      
      const url = await generateSpeechAndStore(
        {
          text: content,
          format,
          speed: 1.0, // Normal speed for educational content
          pitch: 1.0,
        },
        key
      );
      
      return {
        url,
        key,
        lessonId,
        sectionTitle,
      };
    }),
});
