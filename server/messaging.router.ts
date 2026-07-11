import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

export const messagingRouter = router({
  // Send message
  sendMessage: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        recipientId: z.string(),
        content: z.string(),
        attachments: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return {
        success: true,
        messageId: `msg_${Date.now()}`,
        from: input.userId,
        to: input.recipientId,
        content: input.content,
        sentAt: new Date().toISOString(),
        status: "delivered",
      };
    }),

  // Get conversation
  getConversation: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        friendId: z.string(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return {
        conversation: [
          {
            id: 1,
            from: input.userId,
            to: input.friendId,
            content: "Hey! How's learning going?",
            sentAt: new Date().toISOString(),
            status: "read",
          },
          {
            id: 2,
            from: input.friendId,
            to: input.userId,
            content: "Great! Just completed React course",
            sentAt: new Date(Date.now() - 60000).toISOString(),
            status: "read",
          },
        ],
        total: 2,
      };
    }),

  // Get conversations list
  getConversations: protectedProcedure
    .input(z.object({ userId: z.string(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      return {
        conversations: [
          {
            id: 1,
            friendId: "user_2",
            friendName: "Sarah Johnson",
            lastMessage: "Great! Just completed React course",
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          },
          {
            id: 2,
            friendId: "user_3",
            friendName: "Mike Rodriguez",
            lastMessage: "See you at the challenge!",
            lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
            unreadCount: 2,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
          },
        ],
        total: 2,
      };
    }),

  // Mark message as read
  markAsRead: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        messageId: input.messageId,
        status: "read",
      };
    }),

  // Mark conversation as read
  markConversationAsRead: protectedProcedure
    .input(z.object({ userId: z.string(), friendId: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        conversationId: `conv_${input.userId}_${input.friendId}`,
        allMessagesRead: true,
      };
    }),

  // Send typing indicator
  sendTypingIndicator: protectedProcedure
    .input(z.object({ userId: z.string(), recipientId: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        from: input.userId,
        to: input.recipientId,
        isTyping: true,
      };
    }),

  // Get typing status
  getTypingStatus: protectedProcedure
    .input(z.object({ userId: z.string(), friendId: z.string() }))
    .query(async ({ input }) => {
      return {
        friendId: input.friendId,
        isTyping: false,
      };
    }),

  // Delete message
  deleteMessage: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        messageId: input.messageId,
        deleted: true,
      };
    }),

  // Edit message
  editMessage: protectedProcedure
    .input(z.object({ messageId: z.string(), content: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        messageId: input.messageId,
        content: input.content,
        editedAt: new Date().toISOString(),
      };
    }),

  // Get unread count
  getUnreadCount: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return {
        totalUnread: 2,
        conversations: [
          { friendId: "user_3", unreadCount: 2 },
        ],
      };
    }),

  // Search messages
  searchMessages: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        query: z.string(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      return {
        results: [
          {
            id: 1,
            from: "user_2",
            content: "Great! Just completed React course",
            sentAt: new Date().toISOString(),
          },
        ],
        total: 1,
      };
    }),

  // Get message reactions
  getMessageReactions: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .query(async ({ input }) => {
      return {
        messageId: input.messageId,
        reactions: [
          { emoji: "👍", count: 2, users: ["user_1", "user_2"] },
          { emoji: "❤️", count: 1, users: ["user_3"] },
        ],
      };
    }),

  // Add message reaction
  addMessageReaction: protectedProcedure
    .input(z.object({ messageId: z.string(), emoji: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        messageId: input.messageId,
        emoji: input.emoji,
        added: true,
      };
    }),

  // Remove message reaction
  removeMessageReaction: protectedProcedure
    .input(z.object({ messageId: z.string(), emoji: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        messageId: input.messageId,
        emoji: input.emoji,
        removed: true,
      };
    }),

  // Pin message
  pinMessage: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        messageId: input.messageId,
        pinned: true,
      };
    }),

  // Get pinned messages
  getPinnedMessages: protectedProcedure
    .input(z.object({ userId: z.string(), friendId: z.string() }))
    .query(async ({ input }) => {
      return {
        pinnedMessages: [
          {
            id: 1,
            content: "Important: Challenge starts tomorrow!",
            pinnedAt: new Date().toISOString(),
          },
        ],
        total: 1,
      };
    }),

  // Block user
  blockUser: protectedProcedure
    .input(z.object({ userId: z.string(), blockedUserId: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        blockedUserId: input.blockedUserId,
        blocked: true,
      };
    }),

  // Unblock user
  unblockUser: protectedProcedure
    .input(z.object({ userId: z.string(), blockedUserId: z.string() }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        blockedUserId: input.blockedUserId,
        unblocked: true,
      };
    }),

  // Get blocked users
  getBlockedUsers: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return {
        blockedUsers: [],
        total: 0,
      };
    }),
});
