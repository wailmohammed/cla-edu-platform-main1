import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

export const mentorRouter = router({
  // Get available mentors
  getAvailableMentors: publicProcedure
    .input(
      z.object({
        expertise: z.string().optional(),
        minRating: z.number().optional(),
        availability: z.enum(["morning", "afternoon", "evening"]).optional(),
      })
    )
        .query(async ({ input }: any) => {
      const { expertise, minRating, availability } = input;
      const mentors = [
        {
          id: 1,
          name: "Alice Chen",
          expertise: ["Python", "Data Science", "Machine Learning"],
          rating: 4.9,
          hourlyRate: 50,
          availability: "evening",
          bio: "10+ years in data science",
          students: 234,
          responseTime: "< 1 hour",
        },
        {
          id: 2,
          name: "Bob Johnson",
          expertise: ["JavaScript", "React", "Web Development"],
          rating: 4.8,
          hourlyRate: 45,
          availability: "afternoon",
          bio: "Full-stack developer, startup founder",
          students: 189,
          responseTime: "< 30 min",
        },
        {
          id: 3,
          name: "Carol Martinez",
          expertise: ["Java", "System Design", "Backend"],
          rating: 4.7,
          hourlyRate: 55,
          availability: "morning",
          bio: "Senior engineer at FAANG company",
          students: 156,
          responseTime: "< 2 hours",
        },
      ];

      return mentors.filter((m) => {
        if (expertise && !m.expertise.includes(expertise)) return false;
        if (minRating && m.rating < minRating) return false;
        if (availability && m.availability !== availability) return false;
        return true;
      });
    }),

  // Get mentor profile
  getMentorProfile: publicProcedure
    .input(z.object({ mentorId: z.number() }))
        .query(async ({ input }: any) => {
      const { mentorId } = input;
      return {
        id: mentorId,
        name: "Expert Mentor",
        expertise: ["Python", "JavaScript", "Web Development"],
        rating: 4.8,
        reviews: 234,
        hourlyRate: 50,
        bio: "Experienced developer and educator",
        students: 189,
        responseTime: "< 1 hour",
        availability: ["Monday", "Wednesday", "Friday"],
        sessions: 456,
        successRate: 92,
        languages: ["English", "Spanish"],
        certifications: ["AWS", "Google Cloud", "Kubernetes"],
      };
    }),

  // Request mentorship session
  requestSession: protectedProcedure
    .input(
      z.object({
        mentorId: z.number(),
        topic: z.string(),
        duration: z.number(),
        preferredTime: z.string(),
      })
    )
        .mutation(async ({ input }: any) => {
      const { mentorId, topic, duration, preferredTime } = input;
      return {
        sessionId: Math.random().toString(36).substr(2, 9),
        status: "pending",
        mentorId,
        topic,
        duration,
        preferredTime,
        cost: (duration / 60) * 50,
        createdAt: new Date(),
      };
    }),

  // Get mentor matching score
  getMentorMatch: protectedProcedure
    .input(
      z.object({
        mentorId: z.number(),
        userGoals: z.string().array(),
        userLevel: z.enum(["beginner", "intermediate", "advanced"]),
      })
    )
    .query(async () => {
      const matchScore = Math.random() * 30 + 70;
      const reasons = [
        "Expertise matches your goals",
        "Similar learning style",
        "Great student reviews",
        "Flexible availability",
      ];

      return {
        matchScore: Math.round(matchScore),
        reasons: reasons.slice(0, 3),
        compatibility: matchScore > 85 ? "Excellent" : matchScore > 70 ? "Good" : "Fair",
      };
    }),

  // Get user's mentor sessions
  getUserSessions: protectedProcedure.query(async () => {
    return [
      {
        id: 1,
        mentorName: "Alice Chen",
        topic: "Python Optimization",
        date: new Date(Date.now() + 86400000),
        duration: 60,
        status: "scheduled",
        cost: 50,
      },
      {
        id: 2,
        mentorName: "Bob Johnson",
        topic: "React Patterns",
        date: new Date(Date.now() - 86400000),
        duration: 45,
        status: "completed",
        cost: 37.5,
        rating: 5,
      },
    ];
  }),

  // Rate mentor session
  rateSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        rating: z.number().min(1).max(5),
        review: z.string().optional(),
      })
    )
        .mutation(async ({ input }: any) => {
      const { sessionId, rating } = input;
      return {
        success: true,
        message: "Session rated successfully",
        sessionId,
        rating,
      };
    }),

  // Become a mentor
  becomeMentor: protectedProcedure
    .input(
      z.object({
        expertise: z.string().array(),
        hourlyRate: z.number(),
        bio: z.string(),
        availability: z.string().array(),
      })
    )
    .mutation(async () => {
      return {
        success: true,
        message: "Mentor profile created",
        mentorId: Math.floor(Math.random() * 10000),
        status: "pending_verification",
      };
    }),

  // Get mentor earnings
  getMentorEarnings: protectedProcedure.query(async () => {
    return {
      totalEarnings: 2450,
      thisMonth: 650,
      thisWeek: 150,
      sessions: 45,
      avgRating: 4.8,
      nextPayout: new Date(Date.now() + 7 * 86400000),
    };
  }),

  // Get mentor reviews
  getMentorReviews: publicProcedure
    .input(z.object({ mentorId: z.number() }))
    .query(async () => {
      return [
        {
          id: 1,
          studentName: "John Doe",
          rating: 5,
          review: "Excellent mentor! Very knowledgeable and patient.",
          date: new Date(Date.now() - 7 * 86400000),
        },
        {
          id: 2,
          studentName: "Jane Smith",
          rating: 5,
          review: "Helped me understand complex concepts easily.",
          date: new Date(Date.now() - 14 * 86400000),
        },
        {
          id: 3,
          studentName: "Mike Johnson",
          rating: 4,
          review: "Good session, very helpful for my project.",
          date: new Date(Date.now() - 21 * 86400000),
        },
      ];
    }),
});
