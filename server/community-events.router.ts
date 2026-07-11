import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

export const communityEventsRouter = router({
  // Get active challenges
  getActiveChallenges: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        title: "30-Day Coding Challenge",
        description: "Code every day for 30 days",
        participants: 1250,
        startDate: new Date(Date.now() - 5 * 86400000),
        endDate: new Date(Date.now() + 25 * 86400000),
        difficulty: "Beginner",
        prize: "$500 in prizes",
        category: "Consistency",
      },
      {
        id: 2,
        title: "Algorithm Master Challenge",
        description: "Solve 100 algorithm problems",
        participants: 890,
        startDate: new Date(Date.now() - 10 * 86400000),
        endDate: new Date(Date.now() + 20 * 86400000),
        difficulty: "Advanced",
        prize: "$1000 in prizes",
        category: "Algorithms",
      },
      {
        id: 3,
        title: "Build a Full Stack App",
        description: "Build and deploy a full stack application",
        participants: 450,
        startDate: new Date(Date.now() - 3 * 86400000),
        endDate: new Date(Date.now() + 27 * 86400000),
        difficulty: "Advanced",
        prize: "$2000 in prizes",
        category: "Projects",
      },
    ];
  }),

  // Get upcoming events
  getUpcomingEvents: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        title: "Live Coding Interview Prep",
        description: "Practice coding interviews with experts",
        date: new Date(Date.now() + 7 * 86400000),
        time: "2:00 PM UTC",
        duration: 120,
        speakers: ["Alice Chen", "Bob Johnson"],
        registrations: 450,
        maxCapacity: 500,
      },
      {
        id: 2,
        title: "System Design Workshop",
        description: "Learn system design from FAANG engineers",
        date: new Date(Date.now() + 14 * 86400000),
        time: "3:00 PM UTC",
        duration: 90,
        speakers: ["Carol Martinez"],
        registrations: 320,
        maxCapacity: 400,
      },
      {
        id: 3,
        title: "Career Panel Discussion",
        description: "Discuss career paths in tech",
        date: new Date(Date.now() + 21 * 86400000),
        time: "1:00 PM UTC",
        duration: 60,
        speakers: ["Multiple Industry Leaders"],
        registrations: 200,
        maxCapacity: 1000,
      },
    ];
  }),

  // Join challenge
  joinChallenge: protectedProcedure
    .input(z.object({ challengeId: z.number() }))
    .mutation(async () => {
      return {
        success: true,
        message: "Joined challenge successfully",
        challengeId: 1,
        startDate: new Date(),
      };
    }),

  // Get user's challenge progress
  getUserChallengeProgress: protectedProcedure.query(async () => {
    return [
      {
        id: 1,
        title: "30-Day Coding Challenge",
        progress: 15,
        total: 30,
        currentStreak: 15,
        rank: 45,
        totalParticipants: 1250,
      },
      {
        id: 2,
        title: "Algorithm Master Challenge",
        progress: 67,
        total: 100,
        currentStreak: 12,
        rank: 12,
        totalParticipants: 890,
      },
    ];
  }),

  // Register for event
  registerForEvent: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async () => {
      return {
        success: true,
        message: "Registered for event successfully",
        eventId: 1,
        confirmationEmail: "sent",
      };
    }),

  // Get event details
  getEventDetails: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async () => {
      return {
        id: 1,
        title: "Live Coding Interview Prep",
        description: "Practice coding interviews with experts",
        date: new Date(Date.now() + 7 * 86400000),
        time: "2:00 PM UTC",
        duration: 120,
        speakers: [
          { name: "Alice Chen", title: "Senior Engineer at Google" },
          { name: "Bob Johnson", title: "Tech Lead at Meta" },
        ],
        registrations: 450,
        maxCapacity: 500,
        agenda: [
          { time: "2:00 PM", topic: "Interview tips and tricks" },
          { time: "2:30 PM", topic: "Live coding problem solving" },
          { time: "3:15 PM", topic: "Q&A session" },
        ],
        resources: [
          { title: "Interview Prep Guide", url: "https://example.com/guide" },
          { title: "Code Templates", url: "https://example.com/templates" },
        ],
      };
    }),

  // Get leaderboard for challenge
  getChallengeLeaderboard: publicProcedure
    .input(z.object({ challengeId: z.number() }))
    .query(async () => {
      return [
        { rank: 1, name: "John Doe", score: 1000, progress: 100 },
        { rank: 2, name: "Jane Smith", score: 950, progress: 95 },
        { rank: 3, name: "Mike Johnson", score: 900, progress: 90 },
        { rank: 4, name: "Sarah Lee", score: 850, progress: 85 },
        { rank: 5, name: "Tom Brown", score: 800, progress: 80 },
      ];
    }),

  // Create community challenge
  createChallenge: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        difficulty: z.string(),
        duration: z.number(),
        prize: z.string().optional(),
      })
    )
    .mutation(async () => {
      return {
        success: true,
        message: "Challenge created successfully",
        challengeId: Math.floor(Math.random() * 100000),
      };
    }),

  // Get community stats
  getCommunityStats: publicProcedure.query(async () => {
    return {
      totalMembers: 50000,
      activeThisMonth: 15000,
      totalChallengesCompleted: 125000,
      totalEventsHeld: 250,
      totalPrizesMoney: 500000,
      communityGrowth: "25% YoY",
      topCountries: [
        { country: "USA", members: 15000 },
        { country: "India", members: 12000 },
        { country: "UK", members: 8000 },
      ],
    };
  }),

  // Get challenge results
  getChallengeResults: publicProcedure
    .input(z.object({ challengeId: z.number() }))
    .query(async () => {
      return {
        id: 1,
        title: "30-Day Coding Challenge",
        totalParticipants: 1250,
        completionRate: 45,
        averageScore: 750,
        topPerformers: [
          { rank: 1, name: "John Doe", score: 1000 },
          { rank: 2, name: "Jane Smith", score: 950 },
          { rank: 3, name: "Mike Johnson", score: 900 },
        ],
        insights: {
          mostSolvedCategory: "Arrays",
          averageTimePerProblem: 12,
          successRate: 72,
        },
      };
    }),

  // Get community feed
  getCommunityFeed: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        type: "achievement",
        user: "John Doe",
        message: "Completed 30-Day Coding Challenge",
        timestamp: new Date(Date.now() - 3600000),
        likes: 234,
      },
      {
        id: 2,
        type: "challenge_created",
        user: "Jane Smith",
        message: "Created new challenge: Build a Chat App",
        timestamp: new Date(Date.now() - 7200000),
        likes: 156,
      },
      {
        id: 3,
        type: "milestone",
        user: "Mike Johnson",
        message: "Reached Level 20",
        timestamp: new Date(Date.now() - 10800000),
        likes: 89,
      },
    ];
  }),

  // Get recommendations based on community
  getCommunityRecommendations: protectedProcedure.query(async () => {
    return {
      challenges: [
        {
          title: "Popular Challenge: Algorithm Master",
          participants: 890,
          reason: "Trending in your skill level",
        },
      ],
      events: [
        {
          title: "System Design Workshop",
          speakers: ["Carol Martinez"],
          reason: "Matches your learning goals",
        },
      ],
      people: [
        {
          name: "Alice Chen",
          expertise: ["Python", "Data Science"],
          reason: "Similar interests",
        },
      ],
    };
  }),
});
