import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { getHealthMonitor } from "./healthMonitor";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  /**
   * Detailed health check with system status monitoring
   * Inspired by Website-Agent's monitoring system
   */
  healthCheck: publicProcedure.query(async () => {
    const monitor = getHealthMonitor();
    return await monitor.performHealthCheck();
  }),

  /**
   * Get health check history
   */
  healthHistory: adminProcedure.query(async () => {
    const monitor = getHealthMonitor();
    return monitor.getHistory();
  }),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),
});
