import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { users, challenges } from "../drizzle/schema";

export const socialRouter = router({
  // Get user friends
  getFriends: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return {
        friends: [
          { id: "user_2", name: "Sarah Johnson", status: "online", coursesCompleted: 11 },
          { id: "user_3", name: "Mike Rodriguez", status: "away", coursesCompleted: 10 },
          { id: "user_4", name: "Emma Wilson", status: "offline", coursesCompleted: 9 },
        ],
        total: 3,
      };
    }),

  // Add friend
  addFriend: protectedProcedure
    .input(z.object({ userId: z.string(), friendId: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        friendId: input.friendId,
        status: "pending",
        message: "Friend request sent",
      };
    }),

  // Remove friend
  removeFriend: protectedProcedure
    .input(z.object({ userId: z.string(), friendId: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        friendId: input.friendId,
        message: "Friend removed",
      };
    }),

  // Get friend requests
  getFriendRequests: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return {
        requests: [
          { id: "user_5", name: "John Doe", sentAt: new Date().toISOString() },
          { id: "user_6", name: "Jane Smith", sentAt: new Date(Date.now() - 86400000).toISOString() },
        ],
        total: 2,
      };
    }),

  // Accept friend request
  acceptFriendRequest: protectedProcedure
    .input(z.object({ userId: z.string(), requesterId: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        friendId: input.requesterId,
        status: "accepted",
      };
    }),

  // Create challenge
  createChallenge: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        challengeName: z.string(),
        description: z.string(),
        courseId: z.string(),
        durationDays: z.number(),
        maxParticipants: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return {
        success: true,
        challengeId: `challenge_${Date.now()}`,
        name: input.challengeName,
        createdBy: input.userId,
        status: "active",
        createdAt: new Date().toISOString(),
      };
    }),

  sendChallenge: protectedProcedure
    .input(
      z.object({
        challengedId: z.number(),
        exerciseId: z.number().optional(),
        courseId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(challenges).values({
        challengerId: input.challengedId,
        challengedId: input.challengedId,
        exerciseId: input.exerciseId,
        courseId: input.courseId,
        status: "pending",
        startedAt: new Date(),
      });

      return { success: true, challengeId: result };
    }),

  respondToChallenge: protectedProcedure
    .input(
      z.object({
        challengeId: z.number(),
        accept: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(challenges)
        .set({
          status: input.accept ? "accepted" : "declined",
        })
        .where(eq(challenges.id, input.challengeId));

      return { success: true };
    }),

  // Get active challenges
  getActiveChallenges: publicProcedure.query(async () => {
    return {
      challenges: [
        {
          id: "challenge_1",
          name: "Python Mastery Challenge",
          description: "Complete 5 Python courses in 30 days",
          participants: 234,
          daysLeft: 15,
          reward: "500 XP",
        },
        {
          id: "challenge_2",
          name: "React Sprint",
          description: "Build 3 React projects",
          participants: 156,
          daysLeft: 8,
          reward: "400 XP",
        },
      ],
      total: 2,
    };
  }),

  // Join challenge
  joinChallenge: protectedProcedure
    .input(z.object({ userId: z.string(), challengeId: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        challengeId: input.challengeId,
        status: "joined",
        joinedAt: new Date().toISOString(),
      };
    }),

  // Get challenge leaderboard
  getChallengeLeaderboard: publicProcedure
    .input(z.object({ challengeId: z.string() }))
    .query(async ({ input }) => {
      return {
        challengeId: input.challengeId,
        leaderboard: [
          { rank: 1, userName: "Alex Chen", score: 850, progress: 100 },
          { rank: 2, userName: "Sarah Johnson", score: 780, progress: 85 },
          { rank: 3, userName: "Mike Rodriguez", score: 720, progress: 75 },
        ],
      };
    }),

  // Create team
  createTeam: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        teamName: z.string(),
        description: z.string(),
        maxMembers: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return {
        success: true,
        teamId: `team_${Date.now()}`,
        name: input.teamName,
        createdBy: input.userId,
        members: 1,
        createdAt: new Date().toISOString(),
      };
    }),

  // Get user teams
  getUserTeams: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return {
        teams: [
          { id: "team_1", name: "Python Developers", members: 12, role: "owner" },
          { id: "team_2", name: "React Enthusiasts", members: 8, role: "member" },
        ],
        total: 2,
      };
    }),

  // Invite to team
  inviteToTeam: protectedProcedure
    .input(z.object({ userId: z.string(), teamId: z.string(), inviteeId: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        teamId: input.teamId,
        inviteeId: input.inviteeId,
        status: "pending",
      };
    }),

  // Get team members
  getTeamMembers: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input }) => {
      return {
        teamId: input.teamId,
        members: [
          { id: "user_1", name: "Alex Chen", role: "owner", joinedAt: new Date().toISOString() },
          { id: "user_2", name: "Sarah Johnson", role: "member", joinedAt: new Date().toISOString() },
        ],
        total: 2,
      };
    }),

  // Get team leaderboard
  getTeamLeaderboard: publicProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input }) => {
      return {
        teamId: input.teamId,
        leaderboard: [
          { rank: 1, userName: "Alex Chen", teamPoints: 2500 },
          { rank: 2, userName: "Sarah Johnson", teamPoints: 2200 },
        ],
      };
    }),

  // Get team statistics
  getTeamStats: publicProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input }) => {
      return {
        teamId: input.teamId,
        stats: {
          totalMembers: 12,
          totalCoursesCompleted: 45,
          totalXP: 125000,
          averageXPPerMember: 10417,
          createdAt: new Date().toISOString(),
        },
      };
    }),

  // Send message to friend
  sendMessage: protectedProcedure
    .input(z.object({ userId: z.string(), friendId: z.string(), message: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        messageId: `msg_${Date.now()}`,
        from: input.userId,
        to: input.friendId,
        sentAt: new Date().toISOString(),
      };
    }),

  // Get messages with friend
  getMessages: protectedProcedure
    .input(z.object({ userId: z.string(), friendId: z.string(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return {
        messages: [
          { id: 1, from: input.userId, text: "Hey! How's learning going?", timestamp: new Date().toISOString() },
          { id: 2, from: input.friendId, text: "Great! Just completed React course", timestamp: new Date().toISOString() },
        ],
        total: 2,
      };
    }),

  // Get social feed
  getSocialFeed: protectedProcedure
    .input(z.object({ userId: z.string(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      return {
        feed: [
          {
            id: 1,
            type: "achievement",
            actor: "Sarah Johnson",
            action: "unlocked Fast Learner achievement",
            timestamp: new Date().toISOString(),
          },
          {
            id: 2,
            type: "course_completed",
            actor: "Mike Rodriguez",
            action: "completed Python Fundamentals",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 3,
            type: "rank_change",
            actor: "Alex Chen",
            action: "climbed to rank #42",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
          },
        ],
        total: 3,
      };
    }),
});
