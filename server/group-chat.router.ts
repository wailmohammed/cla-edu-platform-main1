import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

export const groupChatRouter = router({
  /**
   * Create a new group chat room
   */
  createRoom: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        category: z.enum(["course", "team", "study-group", "project"]),
        isPrivate: z.boolean().default(false),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        roomId: `room_${Date.now()}`,
        name: input.name,
        description: input.description,
        category: input.category,
        isPrivate: input.isPrivate,
        createdAt: new Date().toISOString(),
      };
    }),

  /**
   * Get list of group chat rooms
   */
  listRooms: protectedProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async (opts: any) => {
      const input = opts.input;
      return {
        rooms: [
          {
            id: "room_1",
            name: "React Developers",
            description: "Discussion for React course learners",
            category: "course",
            memberCount: 234,
            messageCount: 1200,
            lastMessage: "Great discussion on hooks!",
            lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "room_2",
            name: "Python Study Group",
            description: "Collaborative learning for Python",
            category: "study-group",
            memberCount: 156,
            messageCount: 890,
            lastMessage: "Anyone working on the project?",
            lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
          },
        ],
        total: 2,
      };
    }),

  /**
   * Send message to group chat
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        content: z.string().min(1).max(2000),
        mentions: z.array(z.string()).optional(),
        attachments: z.array(z.string()).optional(),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        messageId: `msg_${Date.now()}`,
        roomId: input.roomId,
        content: input.content,
        mentions: input.mentions || [],
        attachments: input.attachments || [],
        timestamp: new Date().toISOString(),
        status: "sent",
      };
    }),

  /**
   * Get group chat messages
   */
  getMessages: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        limit: z.number().default(50),
        offset: z.number().default(0),
        search: z.string().optional(),
      })
    )
    .query(async (opts: any) => {
      const input = opts.input;
      return {
        messages: [
          {
            id: "msg_1",
            author: "Alex Chen",
            authorId: "user_1",
            content: "Great discussion on hooks!",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            mentions: [],
            reactions: { "👍": 5, "❤️": 2 },
            isPinned: false,
          },
          {
            id: "msg_2",
            author: "Sarah Johnson",
            authorId: "user_2",
            content: "@Alex Thanks for the explanation!",
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            mentions: ["user_1"],
            reactions: { "👍": 3 },
            isPinned: false,
          },
        ],
        total: 2,
      };
    }),

  /**
   * Pin message in group chat
   */
  pinMessage: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        messageId: z.string(),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        messageId: input.messageId,
        pinned: true,
        pinnedAt: new Date().toISOString(),
      };
    }),

  /**
   * Unpin message from group chat
   */
  unpinMessage: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        messageId: z.string(),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        messageId: input.messageId,
        pinned: false,
      };
    }),

  /**
   * Get pinned messages in room
   */
  getPinnedMessages: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async (opts: any) => {
      const input = opts.input;
      return {
        pinnedMessages: [
          {
            id: "msg_5",
            author: "Admin",
            content: "Important: Course deadline is next Friday",
            pinnedAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
        total: 1,
      };
    }),

  /**
   * Search messages in room
   */
  searchMessages: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        query: z.string().min(1),
        limit: z.number().default(20),
      })
    )
    .query(async (opts: any) => {
      const input = opts.input;
      return {
        results: [
          {
            id: "msg_1",
            author: "Alex Chen",
            content: "Great discussion on hooks!",
            timestamp: new Date().toISOString(),
            highlight: "Great discussion on <mark>hooks</mark>!",
          },
        ],
        total: 1,
      };
    }),

  /**
   * Add reaction to group message
   */
  addReaction: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        messageId: z.string(),
        emoji: z.string(),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        messageId: input.messageId,
        emoji: input.emoji,
        count: 1,
      };
    }),

  /**
   * Join group chat room
   */
  joinRoom: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        roomId: input.roomId,
        joined: true,
        joinedAt: new Date().toISOString(),
      };
    }),

  /**
   * Leave group chat room
   */
  leaveRoom: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        roomId: input.roomId,
        left: true,
      };
    }),

  /**
   * Get room members
   */
  getRoomMembers: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async (opts: any) => {
      const input = opts.input;
      return {
        members: [
          {
            id: "user_1",
            name: "Alex Chen",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            role: "admin",
            joinedAt: new Date(Date.now() - 2592000000).toISOString(),
          },
          {
            id: "user_2",
            name: "Sarah Johnson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            role: "member",
            joinedAt: new Date(Date.now() - 1209600000).toISOString(),
          },
        ],
        total: 2,
      };
    }),

  /**
   * Mention user in message
   */
  mentionUser: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        messageId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        messageId: input.messageId,
        mentionedUser: input.userId,
        notificationSent: true,
      };
    }),

  /**
   * Get room statistics
   */
  getRoomStats: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async (opts: any) => {
      const input = opts.input;
      return {
        roomId: input.roomId,
        totalMembers: 234,
        totalMessages: 1200,
        activeToday: 45,
        averageMessagesPerDay: 15.2,
        createdAt: new Date(Date.now() - 2592000000).toISOString(),
        lastActivityAt: new Date(Date.now() - 3600000).toISOString(),
      };
    }),

  /**
   * Delete message from room
   */
  deleteMessage: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        messageId: z.string(),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        messageId: input.messageId,
        deleted: true,
      };
    }),

  /**
   * Edit message in room
   */
  editMessage: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
        messageId: z.string(),
        content: z.string().min(1).max(2000),
      })
    )
    .mutation(async (opts: any) => {
      const input = opts.input;
      return {
        success: true,
        messageId: input.messageId,
        content: input.content,
        editedAt: new Date().toISOString(),
      };
    }),
});
