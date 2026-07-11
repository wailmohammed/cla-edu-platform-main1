import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const livecodingRouter = router({
  // Create a live coding session
  createLiveSession: protectedProcedure
    .input(
      z.object({
        title: z.string().min(5).max(200),
        description: z.string().max(500),
        language: z.string(),
        topic: z.string(),
        isPublic: z.boolean().default(true),
        maxParticipants: z.number().default(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        sessionId: Math.floor(Math.random() * 10000),
        sessionCode: "SESSION-" + Math.random().toString(36).substring(7).toUpperCase(),
        message: "Live session created successfully",
        joinUrl: "https://codelearnify.com/live/SESSION-ABC123",
      };
    }),

  // Get active live sessions
  getActiveSessions: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        title: "React Hooks Deep Dive",
        instructor: "Dr. Jane Smith",
        language: "JavaScript",
        topic: "React",
        participants: 8,
        maxParticipants: 15,
        startedAt: new Date(Date.now() - 15 * 60000),
        duration: 60,
        difficulty: "intermediate",
        rating: 4.8,
      },
      {
        id: 2,
        title: "Python Data Analysis Live Coding",
        instructor: "Prof. John Doe",
        language: "Python",
        topic: "Data Science",
        participants: 12,
        maxParticipants: 20,
        startedAt: new Date(Date.now() - 30 * 60000),
        duration: 90,
        difficulty: "intermediate",
        rating: 4.7,
      },
    ];
  }),

  // Get session details
  getSessionDetails: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      return {
        id: input.sessionId,
        title: "React Hooks Deep Dive",
        instructor: "Dr. Jane Smith",
        instructorBio: "Full-stack developer with 10+ years experience",
        language: "JavaScript",
        topic: "React",
        description: "Learn advanced React hooks patterns and best practices",
        participants: 8,
        maxParticipants: 15,
        startedAt: new Date(Date.now() - 15 * 60000),
        duration: 60,
        difficulty: "intermediate",
        rating: 4.8,
        code: `
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
        `,
        participants_list: [
          {
            id: 1,
            name: "Alice Learner",
            role: "participant",
            joinedAt: new Date(Date.now() - 10 * 60000),
          },
          {
            id: 2,
            name: "Bob Developer",
            role: "participant",
            joinedAt: new Date(Date.now() - 8 * 60000),
          },
        ],
        chat: [
          {
            author: "Dr. Jane Smith",
            message: "Welcome everyone! Today we'll explore custom hooks.",
            timestamp: new Date(Date.now() - 12 * 60000),
          },
          {
            author: "Alice Learner",
            message: "Great! Looking forward to this.",
            timestamp: new Date(Date.now() - 11 * 60000),
          },
        ],
      };
    }),

  // Join live session
  joinLiveSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        message: "Joined session successfully",
        sessionId: input.sessionId,
        participantId: Math.floor(Math.random() * 10000),
      };
    }),

  // Leave live session
  leaveLiveSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        message: "Left session",
      };
    }),

  // Send chat message
  sendChatMessage: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        message: z.string().min(1).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        messageId: Math.floor(Math.random() * 10000),
      };
    }),

  // Update shared code
  updateSharedCode: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        message: "Code updated",
      };
    }),

  // Get pair programming sessions
  getPairProgrammingSessions: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        title: "Build a Todo App Together",
        mentor: "Alice Expert",
        mentee: "Bob Learner",
        language: "React",
        difficulty: "intermediate",
        duration: 45,
        startedAt: new Date(Date.now() - 20 * 60000),
        status: "active",
      },
      {
        id: 2,
        title: "JavaScript Debugging Session",
        mentor: "Charlie Developer",
        mentee: "Diana Student",
        language: "JavaScript",
        difficulty: "beginner",
        duration: 30,
        startedAt: new Date(Date.now() - 10 * 60000),
        status: "active",
      },
    ];
  }),

  // Request pair programming session
  requestPairSession: protectedProcedure
    .input(
      z.object({
        mentorId: z.number(),
        topic: z.string(),
        language: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        requestId: Math.floor(Math.random() * 10000),
        message: "Pair programming request sent",
        status: "pending",
      };
    }),

  // Accept pair programming request
  acceptPairRequest: protectedProcedure
    .input(z.object({ requestId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        sessionId: Math.floor(Math.random() * 10000),
        message: "Pair programming session started",
      };
    }),

  // Get mentor profile
  getMentorProfile: publicProcedure
    .input(z.object({ mentorId: z.number() }))
    .query(async ({ input }) => {
      return {
        id: input.mentorId,
        name: "Alice Expert",
        bio: "Full-stack developer with 10+ years experience",
        avatar: "https://...",
        expertise: ["React", "Node.js", "Python", "Data Science"],
        rating: 4.9,
        reviews: 245,
        sessionsCompleted: 128,
        responseTime: "< 1 hour",
        hourlyRate: 50,
        availability: ["Monday", "Wednesday", "Friday", "Saturday"],
        languages: ["English", "Spanish"],
      };
    }),

  // Get session recording
  getSessionRecording: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      return {
        sessionId: input.sessionId,
        title: "React Hooks Deep Dive",
        recordingUrl: "https://...",
        duration: 3600,
        recordedAt: new Date("2024-03-15"),
        views: 245,
        rating: 4.8,
        transcript: `
[00:00] Welcome to React Hooks Deep Dive
[00:30] Today we'll explore useState and useEffect
[05:00] Let's start with a simple counter example
...
        `,
      };
    }),

  // Get session recordings
  getSessionRecordings: publicProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input }) => {
      return [
        {
          id: 1,
          title: "React Hooks Deep Dive",
          instructor: "Dr. Jane Smith",
          recordedAt: new Date("2024-03-15"),
          duration: 3600,
          views: 245,
          rating: 4.8,
          thumbnail: "https://...",
        },
        {
          id: 2,
          title: "Python Data Analysis Live Coding",
          instructor: "Prof. John Doe",
          recordedAt: new Date("2024-03-14"),
          duration: 5400,
          views: 189,
          rating: 4.7,
          thumbnail: "https://...",
        },
      ];
    }),

  // Rate session
  rateSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        rating: z.number().min(1).max(5),
        feedback: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        message: "Session rated successfully",
      };
    }),

  // Get user's mentorship stats
  getMentorshipStats: protectedProcedure.query(async ({ ctx }) => {
    return {
      sessionsCompleted: 15,
      hoursSpent: 22.5,
      averageRating: 4.8,
      mentorsInteracted: 3,
      skillsLearned: ["React", "Advanced Hooks", "Performance Optimization"],
      nextSession: new Date(Date.now() + 2 * 24 * 60 * 60000),
    };
  }),
});
