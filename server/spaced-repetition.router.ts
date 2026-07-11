import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

// SM-2 Algorithm implementation
interface ReviewItem {
  id: number;
  question: string;
  answer: string;
  easeFactor: number;
  interval: number;
  nextReviewDate: Date;
  repetitions: number;
  lastReviewDate: Date;
}

const calculateNextReview = (
  easeFactor: number,
  interval: number,
  quality: number
): { newEaseFactor: number; newInterval: number } => {
  // SM-2 algorithm
  let newEaseFactor = easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  newEaseFactor = Math.max(1.3, newEaseFactor);

  let newInterval: number;
  if (quality < 3) {
    newInterval = 1;
  } else if (interval === 0) {
    newInterval = 1;
  } else if (interval === 1) {
    newInterval = 3;
  } else {
    newInterval = Math.round(interval * newEaseFactor);
  }

  return { newEaseFactor, newInterval };
};

export const spacedRepetitionRouter = router({
  // Get review items for today
  getTodayReviews: protectedProcedure.query(async ({ ctx }: any) => {
    // Mock data for spaced repetition items
    const mockReviews: ReviewItem[] = [
      {
        id: 1,
        question: "What is the time complexity of binary search?",
        answer: "O(log n)",
        easeFactor: 2.5,
        interval: 3,
        nextReviewDate: new Date(),
        repetitions: 5,
        lastReviewDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        question: "Explain the concept of closure in JavaScript",
        answer:
          "A closure is a function that has access to variables from its outer scope",
        easeFactor: 2.3,
        interval: 1,
        nextReviewDate: new Date(),
        repetitions: 2,
        lastReviewDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: 3,
        question: "What is the difference between var, let, and const?",
        answer: "var is function-scoped, let and const are block-scoped",
        easeFactor: 2.6,
        interval: 7,
        nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        repetitions: 8,
        lastReviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];

    return {
      userId: ctx.user.id,
      todayReviews: mockReviews.filter(
        (item) => item.nextReviewDate.toDateString() === new Date().toDateString()
      ),
      totalReviews: mockReviews.length,
      completedToday: 2,
      dueToday: 3,
    };
  }),

  // Record review response
  recordReview: protectedProcedure
    .input(
      z.object({
        itemId: z.number(),
        quality: z.number().min(0).max(5), // 0-5 quality rating
        timeSpent: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }: any) => {
      const { newEaseFactor, newInterval } = calculateNextReview(2.5, 3, input.quality);

      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

      return {
        success: true,
        itemId: input.itemId,
        quality: input.quality,
        newEaseFactor,
        newInterval,
        nextReviewDate,
        xpEarned: input.quality >= 3 ? 10 : 5,
      };
    }),

  // Get learning statistics
  getLearningStats: protectedProcedure.query(async ({ ctx }: any) => {
    return {
      userId: ctx.user.id,
      totalItems: 45,
      masteredItems: 28,
      learningItems: 12,
      newItems: 5,
      averageRetention: 0.82,
      averageEaseFactor: 2.45,
      totalReviewsCompleted: 156,
      streakDays: 12,
      nextReviewIn: "2 hours",
      estimatedTimeToday: "15 minutes",
      retentionByDay: [
        { day: "Mon", retention: 0.85 },
        { day: "Tue", retention: 0.83 },
        { day: "Wed", retention: 0.81 },
        { day: "Thu", retention: 0.84 },
        { day: "Fri", retention: 0.82 },
        { day: "Sat", retention: 0.80 },
        { day: "Sun", retention: 0.79 },
      ],
    };
  }),

  // Get review queue
  getReviewQueue: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        category: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }: any) => {
      const mockQueue = [
        {
          id: 1,
          question: "What is a REST API?",
          category: "Web Development",
          difficulty: "Easy",
          lastReviewedDaysAgo: 3,
          easeFactor: 2.5,
        },
        {
          id: 2,
          question: "Explain the concept of async/await",
          category: "JavaScript",
          difficulty: "Medium",
          lastReviewedDaysAgo: 1,
          easeFactor: 2.3,
        },
        {
          id: 3,
          question: "What is the difference between SQL and NoSQL?",
          category: "Databases",
          difficulty: "Hard",
          lastReviewedDaysAgo: 7,
          easeFactor: 2.6,
        },
      ];

      return {
        userId: ctx.user.id,
        queue: mockQueue.slice(0, input.limit),
        totalInQueue: mockQueue.length,
        estimatedTime: `${mockQueue.length * 2} minutes`,
      };
    }),

  // Get retention chart data
  getRetentionChart: protectedProcedure.query(async ({ ctx }: any) => {
    return {
      userId: ctx.user.id,
      retentionData: [
        { interval: "1 day", retention: 0.95 },
        { interval: "3 days", retention: 0.88 },
        { interval: "1 week", retention: 0.82 },
        { interval: "2 weeks", retention: 0.75 },
        { interval: "1 month", retention: 0.68 },
        { interval: "3 months", retention: 0.55 },
      ],
      averageRetention: 0.77,
      trend: "improving",
    };
  }),

  // Get performance metrics
  getPerformanceMetrics: protectedProcedure.query(async ({ ctx }: any) => {
    return {
      userId: ctx.user.id,
      metrics: {
        totalReviews: 156,
        correctReviews: 134,
        accuracy: 0.859,
        averageTimePerReview: 45, // seconds
        fastestReview: 12,
        slowestReview: 180,
        bestCategory: "JavaScript",
        weakestCategory: "Databases",
        consistencyScore: 0.92,
      },
    };
  }),
});
