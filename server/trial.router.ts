import { and, eq } from "drizzle-orm";
import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { users, subscriptions } from "../drizzle/schema";
import { TRPCError } from "@trpc/server";

export const trialRouter = router({
  // Check if user is eligible for trial
  isEligibleForTrial: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    // Check if user already has an active subscription
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    // User is eligible if they don't have any subscription history
    return {
      eligible: existingSubscription.length === 0,
      reason: existingSubscription.length > 0 ? "Already subscribed" : "Eligible",
    };
  }),

  // Start trial subscription (7 days free)
  startTrial: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    // Check eligibility
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (existingSubscription.length > 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Trial already used for this account",
      });
    }

    // Create trial subscription (7 days)
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    try {
      await db.insert(subscriptions).values({
        userId: ctx.user.id,
        provider: "stripe",
        plan: "basic",
        status: "trial",
        startDate: startDate,
        renewalDate: endDate,
      });

      return {
        success: true,
        message: "Trial started successfully",
        endDate: endDate,
        daysRemaining: 7,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to start trial",
      });
    }
  }),

  // Get trial status
  getTrialStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const subscription = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, ctx.user.id),
          eq(subscriptions.status, "trial")
        )
      )
      .limit(1);

    if (!subscription.length) {
      return {
        isOnTrial: false,
        daysRemaining: 0,
        endDate: null,
      };
    }

    const sub = subscription[0];
    const now = new Date();
    const endDate = sub.renewalDate;

    if (!endDate || new Date(endDate) < now) {
      return {
        isOnTrial: false,
        daysRemaining: 0,
        endDate: null,
        expired: true,
      };
    }

    const daysRemaining = Math.ceil(
      (new Date(endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      isOnTrial: true,
      daysRemaining,
      endDate: endDate,
      hoursRemaining: Math.ceil(
        (new Date(endDate).getTime() - now.getTime()) / (1000 * 60 * 60)
      ),
    };
  }),

  // Convert trial to paid subscription
  convertTrialToPaid: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const subscription = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, ctx.user.id),
          eq(subscriptions.status, "trial")
        )
      )
      .limit(1);

    if (!subscription.length) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active trial found",
      });
    }

    // Update subscription to active (1 month)
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    try {
      await db
        .update(subscriptions)
        .set({
          status: "active",
          renewalDate: endDate,
        })
        .where(eq(subscriptions.id, subscription[0].id));

      return {
        success: true,
        message: "Trial converted to paid subscription",
        endDate: endDate,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to convert trial",
      });
    }
  }),

  // Cancel trial
  cancelTrial: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const subscription = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, ctx.user.id),
          eq(subscriptions.status, "trial")
        )
      )
      .limit(1);

    if (!subscription.length) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active trial found",
      });
    }

    try {
      await db
        .update(subscriptions)
        .set({
          status: "cancelled",
        })
        .where(eq(subscriptions.id, subscription[0].id));

      return {
        success: true,
        message: "Trial cancelled successfully",
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to cancel trial",
      });
    }
  }),

  // Get trial reminder (for UI notifications)
  getTrialReminder: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const subscription = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, ctx.user.id),
          eq(subscriptions.status, "trial")
        )
      )
      .limit(1);

    if (!subscription.length) {
      return null;
    }

    const sub = subscription[0];
    const now = new Date();
    const endDate = sub.renewalDate;

    if (!endDate) return null;

    const daysRemaining = Math.ceil(
      (new Date(endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Show reminder when 3 days or less remain
    if (daysRemaining <= 3 && daysRemaining > 0) {
      return {
        show: true,
        message: `Your free trial expires in ${daysRemaining} day${daysRemaining > 1 ? "s" : ""}. Upgrade now to continue learning!`,
        daysRemaining,
        urgency: daysRemaining === 1 ? "high" : "medium",
      };
    }

    if (daysRemaining <= 0) {
      return {
        show: true,
        message: "Your free trial has expired. Upgrade to continue learning!",
        daysRemaining: 0,
        urgency: "critical",
        expired: true,
      };
    }

    return null;
  }),
});
