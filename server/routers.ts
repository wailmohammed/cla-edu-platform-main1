import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import {
  sendVerificationEmail,
  verifyEmailToken,
  sendPasswordResetEmail,
  resetPasswordWithToken,
} from "./_core/email-auth";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, rateLimitedProcedure, router } from "./_core/trpc";
import { getUserProgress, getUserSubscription, getLeaderboard, upsertUser, getDb } from "./db";
import { eq } from "drizzle-orm";
import { users, challenges } from "../drizzle/schema";
import { z } from "zod";
import { gamificationRouter } from "./gamification.router";
import { portfolioRouter } from "./portfolio.router";
import { tierRouter } from "./tier.router";
import { activityRouter } from "./activity.router";
import { advancedFeaturesRouter } from "./advanced-features.router";
import { communityRouter } from "./community.router";
import { projectsRouter } from "./projects.router";
import { katasRouter } from "./katas.router";
import { datascienceRouter } from "./datascience.router";
import { certificationsRouter } from "./certifications.router";
import { teamsRouter } from "./teams.router";
import { livecodingRouter } from "./livecoding.router";
import { aiethicsRouter } from "./aiethics.router";
import { trialRouter } from "./trial.router";
import { lessonsRouter } from "./lessons.router";
import { exercisesRouter } from "./exercises.router";
import { copilotRouter } from "./copilot.router";
import { enhancementsAdvancedRouter } from "./enhancements-advanced.router";
import { mentorRouter } from "./mentor.router";
import { jobboardRouter } from "./jobboard.router";
import { personalizationRouter } from "./personalization.router";
import { communityEventsRouter } from "./community-events.router";
import { notificationsRouter } from "./notifications.router";
import { leaderboardRouter } from "./leaderboard.router";
import { achievementsRouter } from "./achievements.router";
import { stripeRouter } from "./stripe.router";
import { courseContentRouter } from "./course-content.router";
import { realtimeRouter } from "./realtime.router";
import { socialRouter } from "./social.router";
import { messagingRouter } from "./messaging.router";
import { streakNotificationsRouter } from "./streak-notifications.router";
import { referralRouter } from "./referral.router";
import { websocketRouter } from "./websocket.router";
import { badgesRouter } from "./badges.router";
import { emailServiceRouter } from "./email-service.router";
import { codeExecutionRouter } from "./code-execution.router";
import { aiTutorRouter } from "./ai-tutor.router";
import { agentsRouter } from "./agents.router";
import { adminRouter } from "./admin.router";
import { ttsRouter } from "./tts.router";
import { paypalRouter } from "./paypal.router";
import { paddleRouter } from "./paddle.router";
import { paymentConfigRouter } from "./payment-config.router";
import { coursesRouter } from "./courses.router";
import { getAllCourses } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    register: rateLimitedProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(8),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { sessionToken, user } = await sdk.registerWithPassword(input);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        (ctx.res as any).cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });
        sendVerificationEmail(user).catch(err =>
          console.error("[Auth] Failed to send verification email:", err)
        );
        return { id: user.id, name: user.name, email: user.email };
      }),
    verifyEmail: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const result = await verifyEmailToken(input.token);
        if (!result.ok) {
          throw new Error(result.error);
        }
        return { success: true } as const;
      }),
    resendVerificationEmail: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.emailVerified) {
        return { alreadyVerified: true } as const;
      }
      await sendVerificationEmail(ctx.user);
      return { alreadyVerified: false } as const;
    }),
    requestPasswordReset: rateLimitedProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        await sendPasswordResetEmail(input.email);
        // Always return success, regardless of whether the email exists,
        // to avoid leaking which addresses are registered.
        return { success: true } as const;
      }),
    resetPassword: rateLimitedProcedure
      .input(z.object({ token: z.string(), newPassword: z.string().min(8) }))
      .mutation(async ({ input }) => {
        const passwordHash = await sdk.hashPassword(input.newPassword);
        const result = await resetPasswordWithToken(input.token, passwordHash);
        if (!result.ok) {
          throw new Error(result.error);
        }
        return { success: true } as const;
      }),
    login: rateLimitedProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { sessionToken, user } = await sdk.loginWithPassword(input);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        (ctx.res as any).cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });
        return { id: user.id, name: user.name, email: user.email };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      (ctx.res as any).clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    updatePreferences: protectedProcedure
      .input(
        z.object({
          learningGoal: z.string().optional(),
          recommendedPath: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db
          .update(users)
          .set({
            learningGoal: input.learningGoal,
            recommendedPath: input.recommendedPath,
            onboardingCompleted: true,
          })
          .where(eq(users.id, ctx.user.id));

        return { success: true };
      }),
  }),

  /**
   * Courses
   */
  courses: coursesRouter,

  /**
   * Lessons
   */
  lessons: lessonsRouter,

  /**
   * Exercises
   */
  exercises: exercisesRouter,

  /**
   * AI Copilot (GitHub Copilot-like features)
   */
  copilot: copilotRouter,

  /**
   * Advanced Enhancements (Phases 35-43)
   */
  enhancements: enhancementsAdvancedRouter,

  /**
   * User Progress & Tracking
   */
  progress: router({
    getUserProgress: protectedProcedure.query(async ({ ctx }) => {
      // Return empty object for now - would need courseId from input
      return {};
    }),
    listCourseProgress: protectedProcedure.query(async ({ ctx }) => {
      // This would fetch all course progress for the user
      // For now, returning empty array
      return [];
    }),
    getLessonCompletion: protectedProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ input, ctx }) => {
        // This is a placeholder - would need actual implementation
        return null;
      }),
  }),

  /**
   * Subscription Management
   */
  subscription: router({
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await getUserSubscription(ctx.user.id);
      // Return default free tier subscription if none exists
      return subscription || {
        id: 0,
        userId: ctx.user.id,
        plan: 'free',
        status: 'active',
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        startDate: new Date(),
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),
    upgrade: protectedProcedure
      .input(z.object({ plan: z.enum(['premium']) }))
      .mutation(async ({ ctx, input }) => {
        // Create Stripe checkout session
        const session = {
          url: `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substr(2, 9)}`,
          id: `cs_${Math.random().toString(36).substr(2, 9)}`,
        };
        return session;
      }),
  }),

  /**
   * Leaderboard
   */
  leaderboard: router({
    getGlobal: publicProcedure.query(async () => {
      return await getLeaderboard("all-time", 100);
    }),
    getWeekly: publicProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input }) => {
        return await getLeaderboard("weekly", input.limit);
      }),
    getMonthly: publicProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input }) => {
        return await getLeaderboard("monthly", input.limit);
      }),
    getAllTime: publicProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input }) => {
        return await getLeaderboard("all-time", input.limit);
      }),
  }),

  /**
   * Gamification
   */
  gamification: gamificationRouter,

  /**
   * Portfolio
   */
  portfolio: portfolioRouter,

  /**
   * Tier Management
   */
  tier: tierRouter,

  /**
   * Activity Tracking
   */
  activity: activityRouter,

  /**
   * Advanced Features
   */
  advanced: advancedFeaturesRouter,

  /**
   * Community & Discussions
   */
  community: communityRouter,

  /**
   * Real-World Projects
   */
  projects: projectsRouter,

  /**
   * Code Katas
   */
  katas: katasRouter,

  /**
   * Data Science Tracks
   */
  datascience: datascienceRouter,

  /**
   * Certifications
   */
  certifications: certificationsRouter,

  /**
   * Teams & Classrooms
   */
  teams: teamsRouter,

  /**
   * Live Coding & Pair Programming
   */
  livecoding: livecodingRouter,

  /**
   * AI Ethics Curriculum
   */
  aiethics: aiethicsRouter,

  /**
   * Trial Period Management
   */
  trial: trialRouter,

  /**
   * Mentor Matching System (Follow-up 1)
   */
  mentor: mentorRouter,

  /**
   * Job Board & Career Paths (Follow-up 2)
   */
  jobboard: jobboardRouter,

  /**
   * Advanced Personalization Engine (Follow-up 3)
   */
  personalization: personalizationRouter,

  /**
   * Community Challenges & Events (Follow-up 4)
   */
  communityEvents: communityEventsRouter,
  notifications: notificationsRouter,
  achievements: achievementsRouter,
  /**
   * Stripe Payment Processing
   */
  stripe: stripeRouter,

  /**
   * PayPal Payment Processing
   */
  paypal: paypalRouter,

  /**
   * Paddle Payment Processing
   */
  paddle: paddleRouter,

  /**
   * Payment Provider Configuration (Admin)
   */
  paymentConfig: paymentConfigRouter,

  /**
   * Course Content with Top 10 Courses
   */
  courseContent: courseContentRouter,

  /**
   * Real-Time Notifications
   */
  realtime: realtimeRouter,

  /**
   * Social Features
   */
  social: socialRouter,

  /**
   * Direct Messaging
   */
  messaging: messagingRouter,

  /**
   * Streak Notifications & Reminders
   */
  streakNotifications: streakNotificationsRouter,

  /**
   * Referral System
   */
  referral: referralRouter,

  /**
   * WebSocket Real-Time Updates
   */
  websocket: websocketRouter,

  /**
   * Gamified Badges
   */
  badges: badgesRouter,

  /**
   * Email Service & Templates
   */
  emailService: emailServiceRouter,

  /**
   * Code Execution Engine
   */
  codeExecution: codeExecutionRouter,

  /**
   * AI Tutor with contextual hints and guidance
   */
  aiTutor: aiTutorRouter,
  agents: agentsRouter,
  admin: adminRouter,
  
  /**
   * Text-to-Speech using Fish Audio
   */
  tts: ttsRouter,
});

export type AppRouter = typeof appRouter;
