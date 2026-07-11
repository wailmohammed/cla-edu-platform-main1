import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";

export const portfolioRouter = router({
  // Create a new portfolio project
  createProject: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        description: z.string().min(10).max(2000),
        technologies: z.array(z.string()).min(1),
        githubUrl: z.string().url().optional(),
        liveUrl: z.string().url().optional(),
        imageUrl: z.string().url().optional(),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In a real implementation, this would insert into a portfolio_projects table
      // For now, we return a mock response
      return {
        success: true,
        projectId: Math.floor(Math.random() * 10000),
        message: "Portfolio project created successfully",
      };
    }),

  // Get user's portfolio projects
  getUserProjects: protectedProcedure.query(async ({ ctx }) => {
    // Mock data - in production, fetch from database
    return [
      {
        id: 1,
        title: "E-Commerce Platform",
        description: "Full-stack e-commerce platform built with React and Node.js",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        githubUrl: "https://github.com/user/ecommerce",
        liveUrl: "https://ecommerce-demo.com",
        imageUrl: "https://via.placeholder.com/400x300",
        featured: true,
        createdAt: new Date("2024-01-15"),
      },
      {
        id: 2,
        title: "Weather App",
        description: "Real-time weather application with geolocation",
        technologies: ["React", "OpenWeather API", "Tailwind CSS"],
        githubUrl: "https://github.com/user/weather-app",
        liveUrl: "https://weather-app-demo.com",
        imageUrl: "https://via.placeholder.com/400x300",
        featured: true,
        createdAt: new Date("2024-02-20"),
      },
    ];
  }),

  // Get public portfolio
  getPublicPortfolio: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      // Mock data - in production, fetch from database
      return [
        {
          id: 1,
          title: "E-Commerce Platform",
          description: "Full-stack e-commerce platform built with React and Node.js",
          technologies: ["React", "Node.js", "MongoDB", "Stripe"],
          githubUrl: "https://github.com/user/ecommerce",
          liveUrl: "https://ecommerce-demo.com",
          imageUrl: "https://via.placeholder.com/400x300",
          createdAt: new Date("2024-01-15"),
        },
      ];
    }),

  // Update project
  updateProject: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        title: z.string().min(1).max(200).optional(),
        description: z.string().min(10).max(2000).optional(),
        technologies: z.array(z.string()).optional(),
        githubUrl: z.string().url().optional(),
        liveUrl: z.string().url().optional(),
        imageUrl: z.string().url().optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return { success: true, message: "Project updated successfully" };
    }),

  // Delete project
  deleteProject: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return { success: true, message: "Project deleted successfully" };
    }),

  // Get portfolio statistics
  getPortfolioStats: protectedProcedure.query(async ({ ctx }) => {
    return {
      totalProjects: 5,
      featuredProjects: 3,
      totalViews: 1250,
      totalClicks: 340,
    };
  }),

  // Get featured projects for showcase
  getFeaturedProjects: publicProcedure
    .input(z.object({ limit: z.number().default(6) }))
    .query(async ({ input }) => {
      // Mock data - in production, fetch from database
      return [
        {
          id: 1,
          title: "E-Commerce Platform",
          description: "Full-stack e-commerce platform built with React and Node.js",
          technologies: ["React", "Node.js", "MongoDB", "Stripe"],
          liveUrl: "https://ecommerce-demo.com",
          imageUrl: "https://via.placeholder.com/400x300",
          createdAt: new Date("2024-01-15"),
          authorName: "John Developer",
        },
        {
          id: 2,
          title: "AI Chat Application",
          description: "Real-time chat app with AI-powered responses",
          technologies: ["React", "WebSocket", "OpenAI API", "Express"],
          liveUrl: "https://ai-chat-demo.com",
          imageUrl: "https://via.placeholder.com/400x300",
          createdAt: new Date("2024-02-10"),
          authorName: "Jane Coder",
        },
      ];
    }),

  // Get project details
  getProjectDetails: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      return {
        id: input.projectId,
        title: "E-Commerce Platform",
        description: "Full-stack e-commerce platform built with React and Node.js with payment integration",
        technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
        githubUrl: "https://github.com/user/ecommerce",
        liveUrl: "https://ecommerce-demo.com",
        imageUrl: "https://via.placeholder.com/400x300",
        featured: true,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-03-10"),
        authorName: "John Developer",
        views: 450,
        likes: 125,
      };
    }),

  // Add project review/feedback
  addProjectReview: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().min(5).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        message: "Review added successfully",
        reviewId: Math.floor(Math.random() * 10000),
      };
    }),

  // Get project reviews
  getProjectReviews: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      return [
        {
          id: 1,
          rating: 5,
          comment: "Amazing project! Great UI and functionality.",
          authorName: "Alice",
          createdAt: new Date("2024-03-01"),
        },
        {
          id: 2,
          rating: 4,
          comment: "Very well done. Could use some performance optimization.",
          authorName: "Bob",
          createdAt: new Date("2024-03-05"),
        },
      ];
    }),
});
