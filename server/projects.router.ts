import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const projectsRouter = router({
  // Create a new capstone project
  createCapstoneProject: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        description: z.string().min(20).max(3000),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]),
        technologies: z.array(z.string()).min(1),
        estimatedHours: z.number().min(1).max(200),
        requirements: z.array(z.string()).min(1),
        rubric: z.record(z.string(), z.number()), // criteria: points
        courseId: z.number(),
        deadline: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Mock implementation
      return {
        success: true,
        projectId: Math.floor(Math.random() * 10000),
        message: "Capstone project created successfully",
      };
    }),

  // Get capstone projects for a course
  getCourseCapstones: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      // Mock data
      return [
        {
          id: 1,
          title: "Build a Full-Stack E-Commerce Platform",
          description: "Create a complete e-commerce system with product catalog, shopping cart, and payment integration",
          difficulty: "advanced",
          technologies: ["React", "Node.js", "MongoDB", "Stripe"],
          estimatedHours: 40,
          requirements: [
            "User authentication with JWT",
            "Product management system",
            "Shopping cart functionality",
            "Payment processing",
            "Order tracking",
            "Admin dashboard",
          ],
          courseId: input.courseId,
          submissions: 245,
          averageRating: 4.7,
        },
      ];
    }),

  // Submit a capstone project
  submitCapstone: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        githubUrl: z.string().url(),
        liveUrl: z.string().url().optional(),
        description: z.string().min(50),
        videoUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        submissionId: Math.floor(Math.random() * 10000),
        message: "Project submitted for review",
        status: "pending_review",
      };
    }),

  // Get user's capstone submissions
  getUserSubmissions: protectedProcedure.query(async ({ ctx }) => {
    return [
      {
        id: 1,
        projectId: 1,
        projectTitle: "Build a Full-Stack E-Commerce Platform",
        status: "pending_review",
        submittedAt: new Date("2024-03-10"),
        score: null,
        feedback: null,
      },
      {
        id: 2,
        projectId: 2,
        projectTitle: "Real-Time Chat Application",
        status: "completed",
        submittedAt: new Date("2024-02-15"),
        score: 92,
        feedback: "Excellent implementation with great UI/UX",
      },
    ];
  }),

  // Get capstone for peer review
  getCapstoneForReview: protectedProcedure.query(async ({ ctx }) => {
    return {
      id: 1,
      submissionId: 101,
      projectTitle: "Build a Full-Stack E-Commerce Platform",
      submitterName: "John Developer",
      githubUrl: "https://github.com/user/ecommerce",
      liveUrl: "https://ecommerce-demo.com",
      description: "Built a complete e-commerce platform with React, Node.js, and MongoDB...",
      videoUrl: "https://youtube.com/watch?v=...",
      rubric: {
        "Code Quality": 20,
        "Functionality": 30,
        "UI/UX Design": 20,
        "Documentation": 15,
        "Performance": 15,
      },
    };
  }),

  // Submit peer review
  submitPeerReview: protectedProcedure
    .input(
      z.object({
        submissionId: z.number(),
        scores: z.record(z.string(), z.number()),
        feedback: z.string().min(50).max(2000),
        rating: z.number().min(1).max(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const totalScore = Object.values(input.scores).reduce((a, b) => a + b, 0);
      return {
        success: true,
        reviewId: Math.floor(Math.random() * 10000),
        totalScore,
        message: "Peer review submitted successfully",
      };
    }),

  // Get project reviews
  getProjectReviews: publicProcedure
    .input(z.object({ submissionId: z.number() }))
    .query(async ({ input }) => {
      return [
        {
          id: 1,
          reviewerId: 5,
          reviewerName: "Alice Expert",
          scores: {
            "Code Quality": 18,
            "Functionality": 28,
            "UI/UX Design": 19,
            "Documentation": 14,
            "Performance": 14,
          },
          totalScore: 93,
          feedback: "Excellent work! The code is clean and well-organized.",
          rating: 5,
          createdAt: new Date("2024-03-15"),
        },
        {
          id: 2,
          reviewerId: 8,
          reviewerName: "Bob Reviewer",
          scores: {
            "Code Quality": 17,
            "Functionality": 29,
            "UI/UX Design": 18,
            "Documentation": 13,
            "Performance": 13,
          },
          totalScore: 90,
          feedback: "Good implementation. Could improve error handling.",
          rating: 4,
          createdAt: new Date("2024-03-16"),
        },
      ];
    }),

  // Get capstone leaderboard
  getCapstoneLearderboard: publicProcedure
    .input(z.object({ projectId: z.number(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return [
        {
          rank: 1,
          submitterName: "Alice Developer",
          projectTitle: "E-Commerce Platform",
          score: 98,
          reviews: 12,
          rating: 4.9,
          submittedAt: new Date("2024-03-10"),
        },
        {
          rank: 2,
          submitterName: "Bob Coder",
          projectTitle: "E-Commerce Platform",
          score: 95,
          reviews: 10,
          rating: 4.8,
          submittedAt: new Date("2024-03-12"),
        },
        {
          rank: 3,
          submitterName: "Charlie Dev",
          projectTitle: "E-Commerce Platform",
          score: 92,
          reviews: 8,
          rating: 4.6,
          submittedAt: new Date("2024-03-14"),
        },
      ];
    }),

  // Get real-world problem sets
  getProblemSets: publicProcedure
    .input(z.object({ courseId: z.number(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      return [
        {
          id: 1,
          title: "Build a Todo App",
          description: "Create a todo application with add, edit, delete, and filter functionality",
          difficulty: "beginner",
          technologies: ["React", "JavaScript"],
          estimatedTime: 2,
          submissions: 1250,
          successRate: 0.87,
          rating: 4.5,
        },
        {
          id: 2,
          title: "Implement a Search Algorithm",
          description: "Implement binary search, linear search, and compare performance",
          difficulty: "intermediate",
          technologies: ["Python", "Algorithms"],
          estimatedTime: 3,
          submissions: 890,
          successRate: 0.72,
          rating: 4.3,
        },
      ];
    }),

  // Get problem details
  getProblemDetails: publicProcedure
    .input(z.object({ problemId: z.number() }))
    .query(async ({ input }) => {
      return {
        id: input.problemId,
        title: "Build a Todo App",
        description: "Create a todo application with add, edit, delete, and filter functionality",
        difficulty: "beginner",
        technologies: ["React", "JavaScript"],
        estimatedTime: 2,
        fullDescription: `
# Build a Todo App

## Requirements
1. Create a React component that displays a list of todos
2. Implement add todo functionality
3. Implement edit todo functionality
4. Implement delete todo functionality
5. Implement filter by status (all, active, completed)
6. Add local storage persistence

## Acceptance Criteria
- User can add new todos
- User can mark todos as complete
- User can delete todos
- User can filter todos
- Data persists after page refresh
- UI is responsive and user-friendly

## Test Cases
- Adding a todo should appear in the list
- Completing a todo should update its status
- Deleting a todo should remove it from the list
- Filters should work correctly
        `,
        starterCode: `
import React, { useState } from 'react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  
  // TODO: Implement add, edit, delete, and filter logic
  
  return (
    <div className="todo-app">
      {/* TODO: Add UI components */}
    </div>
  );
}
        `,
        testCases: [
          {
            input: "Add todo 'Learn React'",
            expectedOutput: "Todo appears in list",
          },
          {
            input: "Mark todo as complete",
            expectedOutput: "Todo status changes to completed",
          },
          {
            input: "Delete todo",
            expectedOutput: "Todo is removed from list",
          },
        ],
      };
    }),

  // Submit problem solution
  submitProblemSolution: protectedProcedure
    .input(
      z.object({
        problemId: z.number(),
        code: z.string(),
        language: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        submissionId: Math.floor(Math.random() * 10000),
        passed: true,
        testsPassed: 5,
        totalTests: 5,
        xpEarned: 50,
        message: "All tests passed!",
      };
    }),

  // Get problem submissions
  getProblemSubmissions: protectedProcedure
    .input(z.object({ problemId: z.number() }))
    .query(async ({ input }) => {
      return [
        {
          id: 1,
          submittedAt: new Date("2024-03-10"),
          status: "passed",
          testsPassed: 5,
          totalTests: 5,
          xpEarned: 50,
        },
        {
          id: 2,
          submittedAt: new Date("2024-03-09"),
          status: "failed",
          testsPassed: 3,
          totalTests: 5,
          xpEarned: 0,
        },
      ];
    }),
});
