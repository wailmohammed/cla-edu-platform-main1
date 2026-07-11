import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const katasRouter = router({
  // Get all katas with filtering
  getKatas: publicProcedure
    .input(
      z.object({
        difficulty: z.enum(["8kyu", "7kyu", "6kyu", "5kyu", "4kyu", "3kyu", "2kyu", "1kyu"]).optional(),
        language: z.string().optional(),
        tag: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return [
        {
          id: 1,
          title: "Sum of positive",
          description: "You get an array of numbers, return the sum of all of the positives ones.",
          difficulty: "8kyu",
          languages: ["JavaScript", "Python", "Java", "C++"],
          tags: ["arrays", "loops"],
          completions: 125000,
          rating: 4.8,
          averageTime: 3,
        },
        {
          id: 2,
          title: "Convert a string to an array",
          description: "Write a function to split a string and convert it to an array of characters.",
          difficulty: "8kyu",
          languages: ["JavaScript", "Python", "Java"],
          tags: ["strings", "arrays"],
          completions: 98000,
          rating: 4.7,
          averageTime: 2,
        },
        {
          id: 3,
          title: "Implement a calculator",
          description: "Create a calculator that can perform basic arithmetic operations.",
          difficulty: "6kyu",
          languages: ["JavaScript", "Python", "Java"],
          tags: ["functions", "parsing"],
          completions: 45000,
          rating: 4.5,
          averageTime: 15,
        },
      ];
    }),

  // Get kata details
  getKataDetails: publicProcedure
    .input(z.object({ kataId: z.number() }))
    .query(async ({ input }) => {
      return {
        id: input.kataId,
        title: "Sum of positive",
        description: "You get an array of numbers, return the sum of all of the positives ones.",
        fullDescription: `
# Sum of positive

You get an array of numbers, return the sum of all of the positives ones.

## Example
\`\`\`
[1, 2, 3, 4, 5] => 15
[1, -2, 3, 4, 5] => 13
[-1, -2, -3, -4, -5] => 0
\`\`\`

## Notes
- If the input array is empty or null, return 0.
- Ignore negative numbers.
        `,
        difficulty: "8kyu",
        languages: ["JavaScript", "Python", "Java", "C++"],
        tags: ["arrays", "loops"],
        completions: 125000,
        rating: 4.8,
        averageTime: 3,
        starterCode: `
function sumOfPositive(arr) {
  // Your code here
}
        `,
        testCases: [
          { input: "[1, 2, 3, 4, 5]", expected: "15" },
          { input: "[1, -2, 3, 4, 5]", expected: "13" },
          { input: "[-1, -2, -3, -4, -5]", expected: "0" },
          { input: "[]", expected: "0" },
        ],
      };
    }),

  // Get kata solutions
  getKataSolutions: publicProcedure
    .input(z.object({ kataId: z.number(), language: z.string().optional() }))
    .query(async ({ input }) => {
      return [
        {
          id: 1,
          author: "Alice Expert",
          language: "JavaScript",
          solution: `
function sumOfPositive(arr) {
  return arr.reduce((sum, num) => num > 0 ? sum + num : sum, 0);
}
          `,
          votes: 1250,
          rating: 4.9,
          createdAt: new Date("2024-03-01"),
        },
        {
          id: 2,
          author: "Bob Coder",
          language: "JavaScript",
          solution: `
function sumOfPositive(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 0) sum += arr[i];
  }
  return sum;
}
          `,
          votes: 890,
          rating: 4.7,
          createdAt: new Date("2024-03-02"),
        },
      ];
    }),

  // Submit kata solution
  submitKataSolution: protectedProcedure
    .input(
      z.object({
        kataId: z.number(),
        code: z.string(),
        language: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        submissionId: Math.floor(Math.random() * 10000),
        passed: true,
        testsPassed: 4,
        totalTests: 4,
        xpEarned: 10,
        message: "Kata completed!",
        rank: "8kyu",
      };
    }),

  // Post kata solution
  postKataSolution: protectedProcedure
    .input(
      z.object({
        kataId: z.number(),
        code: z.string(),
        language: z.string(),
        explanation: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        solutionId: Math.floor(Math.random() * 10000),
        message: "Solution posted successfully",
      };
    }),

  // Get kata leaderboard
  getKataLeaderboard: publicProcedure
    .input(z.object({ kataId: z.number(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return [
        {
          rank: 1,
          username: "Alice Expert",
          solveTime: 1.5,
          codeLength: 45,
          votes: 1250,
          rating: 4.9,
        },
        {
          rank: 2,
          username: "Bob Coder",
          solveTime: 2.3,
          codeLength: 78,
          votes: 890,
          rating: 4.7,
        },
        {
          rank: 3,
          username: "Charlie Dev",
          solveTime: 3.1,
          codeLength: 120,
          votes: 650,
          rating: 4.5,
        },
      ];
    }),

  // Get user kata stats
  getUserKataStats: protectedProcedure.query(async ({ ctx }) => {
    return {
      totalCompleted: 145,
      currentRank: "3kyu",
      honor: 2850,
      languages: ["JavaScript", "Python", "Java"],
      streakDays: 23,
      nextRankProgress: 65,
    };
  }),

  // Get kata discussions
  getKataDiscussions: publicProcedure
    .input(z.object({ kataId: z.number(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      return [
        {
          id: 1,
          author: "Alice Developer",
          title: "Elegant solution using reduce",
          content: "Here's a clean way to solve this using reduce...",
          replies: 12,
          votes: 45,
          createdAt: new Date("2024-03-01"),
        },
        {
          id: 2,
          author: "Bob Learner",
          title: "Help with understanding the problem",
          content: "I'm confused about what the function should return...",
          replies: 5,
          votes: 3,
          createdAt: new Date("2024-03-02"),
        },
      ];
    }),

  // Post kata discussion
  postKataDiscussion: protectedProcedure
    .input(
      z.object({
        kataId: z.number(),
        title: z.string().min(5).max(200),
        content: z.string().min(20).max(5000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        discussionId: Math.floor(Math.random() * 10000),
        message: "Discussion posted successfully",
      };
    }),

  // Create a kata
  createKata: protectedProcedure
    .input(
      z.object({
        title: z.string().min(5).max(200),
        description: z.string().min(50).max(2000),
        difficulty: z.enum(["8kyu", "7kyu", "6kyu", "5kyu", "4kyu", "3kyu", "2kyu", "1kyu"]),
        languages: z.array(z.string()).min(1),
        tags: z.array(z.string()).min(1),
        starterCode: z.string(),
        testCases: z.array(
          z.object({
            input: z.string(),
            expected: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        kataId: Math.floor(Math.random() * 10000),
        message: "Kata created successfully",
      };
    }),

  // Get kata stats
  getKataStats: publicProcedure
    .input(z.object({ kataId: z.number() }))
    .query(async ({ input }) => {
      return {
        totalAttempts: 125000,
        totalCompletions: 98000,
        successRate: 0.784,
        averageTime: 3.2,
        averageRating: 4.8,
        difficultyDistribution: {
          "8kyu": 45000,
          "7kyu": 35000,
          "6kyu": 15000,
          "5kyu": 3000,
        },
      };
    }),
});
