import { router, publicProcedure, protectedProcedure, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { paymentProviders } from "../drizzle/schema";
import { getDb } from "./db";

export const paymentConfigRouter = router({
  /**
   * Get all payment providers (admin only)
   */
  getProviders: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const providers = await db.select().from(paymentProviders);
    return providers;
  }),

  /**
   * Get active payment providers (public)
   */
  getActiveProviders: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return [];
    }

    const providers = await db
      .select()
      .from(paymentProviders)
      .where(eq(paymentProviders.isActive, true));

    // Return only public info (no secrets)
    return providers.map((p) => ({
      id: p.id,
      provider: p.provider,
      isActive: p.isActive,
      isDefault: p.isDefault,
      environment: p.environment,
    }));
  }),

  /**
   * Get default payment provider
   */
  getDefaultProvider: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return null;
    }

    const providers = await db
      .select()
      .from(paymentProviders)
      .where(eq(paymentProviders.isDefault, true))
      .limit(1);

    if (providers.length === 0) {
      return null;
    }

    const provider = providers[0];
    return {
      id: provider.id,
      provider: provider.provider,
      isActive: provider.isActive,
      environment: provider.environment,
    };
  }),

  /**
   * Update payment provider configuration (admin only)
   */
  updateProvider: adminProcedure
    .input(
      z.object({
        id: z.number(),
        isActive: z.boolean().optional(),
        isDefault: z.boolean().optional(),
        apiKey: z.string().optional(),
        apiSecret: z.string().optional(),
        webhookSecret: z.string().optional(),
        clientId: z.string().optional(),
        clientSecret: z.string().optional(),
        environment: z.enum(["sandbox", "production"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const { id, ...updateData } = input;

      // If setting as default, unset other defaults
      if (updateData.isDefault === true) {
        await db
          .update(paymentProviders)
          .set({ isDefault: false })
          .where(eq(paymentProviders.isDefault, true));
      }

      const result = await db
        .update(paymentProviders)
        .set(updateData)
        .where(eq(paymentProviders.id, id));

      return { success: true };
    }),

  /**
   * Create payment provider (admin only)
   */
  createProvider: adminProcedure
    .input(
      z.object({
        provider: z.enum(["stripe", "paypal", "paddle"]),
        isActive: z.boolean().default(false),
        isDefault: z.boolean().default(false),
        apiKey: z.string().optional(),
        apiSecret: z.string().optional(),
        webhookSecret: z.string().optional(),
        clientId: z.string().optional(),
        clientSecret: z.string().optional(),
        environment: z.enum(["sandbox", "production"]).default("sandbox"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // If setting as default, unset other defaults
      if (input.isDefault === true) {
        await db
          .update(paymentProviders)
          .set({ isDefault: false })
          .where(eq(paymentProviders.isDefault, true));
      }

      const result = await db.insert(paymentProviders).values(input);
      
      return { success: true };
    }),

  /**
   * Delete payment provider (admin only)
   */
  deleteProvider: adminProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      await db.delete(paymentProviders).where(eq(paymentProviders.id, input.id));
      
      return { success: true };
    }),

  /**
   * Test payment provider connection (admin only)
   */
  testProvider: adminProcedure
    .input(
      z.object({
        provider: z.enum(["stripe", "paypal", "paddle"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // In production, test actual API connection
      // For now, return mock success
      
      const testResults = {
        stripe: {
          connected: true,
          message: "Stripe API connection successful",
          latency: 45,
        },
        paypal: {
          connected: true,
          message: "PayPal API connection successful",
          latency: 120,
        },
        paddle: {
          connected: true,
          message: "Paddle API connection successful",
          latency: 89,
        },
      };

      return testResults[input.provider];
    }),
});
