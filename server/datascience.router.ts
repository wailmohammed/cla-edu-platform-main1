import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const datascienceRouter = router({
  // Get data science tracks
  getTracks: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        title: "SQL Fundamentals",
        description: "Master SQL for data querying and manipulation",
        icon: "database",
        courses: 5,
        hours: 20,
        difficulty: "beginner",
        rating: 4.8,
        students: 45000,
      },
      {
        id: 2,
        title: "Python for Data Analysis",
        description: "Learn Python with Pandas, NumPy, and Matplotlib",
        icon: "python",
        courses: 8,
        hours: 35,
        difficulty: "intermediate",
        rating: 4.9,
        students: 38000,
      },
      {
        id: 3,
        title: "Statistics & Probability",
        description: "Essential statistics for data science",
        icon: "chart",
        courses: 6,
        hours: 25,
        difficulty: "intermediate",
        rating: 4.7,
        students: 28000,
      },
      {
        id: 4,
        title: "Machine Learning Basics",
        description: "Introduction to ML algorithms and models",
        icon: "brain",
        courses: 10,
        hours: 45,
        difficulty: "advanced",
        rating: 4.8,
        students: 22000,
      },
      {
        id: 5,
        title: "Data Visualization",
        description: "Create compelling data visualizations",
        icon: "chart-bar",
        courses: 4,
        hours: 15,
        difficulty: "intermediate",
        rating: 4.6,
        students: 18000,
      },
    ];
  }),

  // Get track details
  getTrackDetails: publicProcedure
    .input(z.object({ trackId: z.number() }))
    .query(async ({ input }) => {
      return {
        id: input.trackId,
        title: "Python for Data Analysis",
        description: "Learn Python with Pandas, NumPy, and Matplotlib",
        fullDescription: `
# Python for Data Analysis

Master Python programming for data science and analytics.

## What you'll learn
- Python fundamentals and advanced concepts
- NumPy for numerical computing
- Pandas for data manipulation
- Matplotlib and Seaborn for visualization
- Real-world data analysis projects

## Prerequisites
- Basic programming knowledge
- Familiarity with Python syntax

## Track Structure
1. Python Fundamentals (5 hours)
2. NumPy Essentials (6 hours)
3. Pandas Mastery (8 hours)
4. Data Visualization (6 hours)
5. Real-World Projects (10 hours)
        `,
        courses: 8,
        hours: 35,
        difficulty: "intermediate",
        rating: 4.9,
        students: 38000,
        instructor: "Dr. Jane Smith",
        courses_list: [
          {
            id: 1,
            title: "Python Fundamentals",
            lessons: 12,
            hours: 5,
            difficulty: "beginner",
          },
          {
            id: 2,
            title: "NumPy Essentials",
            lessons: 15,
            hours: 6,
            difficulty: "intermediate",
          },
          {
            id: 3,
            title: "Pandas Mastery",
            lessons: 18,
            hours: 8,
            difficulty: "intermediate",
          },
          {
            id: 4,
            title: "Data Visualization",
            lessons: 14,
            hours: 6,
            difficulty: "intermediate",
          },
          {
            id: 5,
            title: "Real-World Projects",
            lessons: 10,
            hours: 10,
            difficulty: "advanced",
          },
        ],
      };
    }),

  // Get SQL courses
  getSQLCourses: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        title: "SQL Basics",
        description: "Learn SELECT, WHERE, JOIN, and basic queries",
        lessons: 12,
        hours: 4,
        difficulty: "beginner",
        rating: 4.8,
      },
      {
        id: 2,
        title: "Advanced SQL",
        description: "Subqueries, window functions, and optimization",
        lessons: 15,
        hours: 6,
        difficulty: "advanced",
        rating: 4.7,
      },
      {
        id: 3,
        title: "Database Design",
        description: "Normalization, indexing, and schema design",
        lessons: 10,
        hours: 5,
        difficulty: "intermediate",
        rating: 4.6,
      },
    ];
  }),

  // Get ML courses
  getMLCourses: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        title: "ML Fundamentals",
        description: "Supervised and unsupervised learning basics",
        lessons: 16,
        hours: 8,
        difficulty: "intermediate",
        rating: 4.8,
      },
      {
        id: 2,
        title: "Regression Models",
        description: "Linear, polynomial, and logistic regression",
        lessons: 14,
        hours: 7,
        difficulty: "intermediate",
        rating: 4.7,
      },
      {
        id: 3,
        title: "Classification Algorithms",
        description: "Decision trees, random forests, SVM",
        lessons: 18,
        hours: 9,
        difficulty: "advanced",
        rating: 4.8,
      },
      {
        id: 4,
        title: "Deep Learning",
        description: "Neural networks and deep learning with TensorFlow",
        lessons: 20,
        hours: 12,
        difficulty: "advanced",
        rating: 4.9,
      },
    ];
  }),

  // Get user track progress
  getUserTrackProgress: protectedProcedure
    .input(z.object({ trackId: z.number() }))
    .query(async ({ ctx, input }) => {
      return {
        trackId: input.trackId,
        title: "Python for Data Analysis",
        progress: 65,
        coursesCompleted: 5,
        totalCourses: 8,
        hoursSpent: 23,
        totalHours: 35,
        currentCourse: {
          id: 6,
          title: "Data Visualization",
          progress: 40,
        },
        certificateEarned: false,
      };
    }),

  // Get data science projects
  getDataScienceProjects: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        title: "Titanic Survival Prediction",
        description: "Predict passenger survival using machine learning",
        difficulty: "beginner",
        dataset: "Titanic Dataset",
        techniques: ["Data Cleaning", "EDA", "Classification"],
        estimatedHours: 4,
        completions: 8500,
        rating: 4.7,
      },
      {
        id: 2,
        title: "House Price Prediction",
        description: "Build a regression model to predict house prices",
        difficulty: "intermediate",
        dataset: "Housing Dataset",
        techniques: ["Regression", "Feature Engineering", "Model Evaluation"],
        estimatedHours: 6,
        completions: 5200,
        rating: 4.8,
      },
      {
        id: 3,
        title: "Customer Segmentation",
        description: "Segment customers using clustering algorithms",
        difficulty: "intermediate",
        dataset: "Customer Dataset",
        techniques: ["Clustering", "Dimensionality Reduction", "Visualization"],
        estimatedHours: 5,
        completions: 3800,
        rating: 4.6,
      },
      {
        id: 4,
        title: "Time Series Forecasting",
        description: "Forecast stock prices using ARIMA and LSTM",
        difficulty: "advanced",
        dataset: "Stock Market Data",
        techniques: ["Time Series", "ARIMA", "Deep Learning"],
        estimatedHours: 8,
        completions: 2100,
        rating: 4.8,
      },
    ];
  }),

  // Get project details
  getProjectDetails: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      return {
        id: input.projectId,
        title: "Titanic Survival Prediction",
        description: "Predict passenger survival using machine learning",
        fullDescription: `
# Titanic Survival Prediction

Build a machine learning model to predict passenger survival on the Titanic.

## Dataset
The Titanic dataset contains 891 passenger records with features like:
- Age, Sex, Passenger Class
- Fare, Port of Embarkation
- Family relations, Cabin information

## Tasks
1. Load and explore the data
2. Handle missing values
3. Feature engineering
4. Train classification models
5. Evaluate and compare models
6. Make predictions on test set

## Expected Outcome
A trained model that predicts survival with >80% accuracy
        `,
        difficulty: "beginner",
        dataset: "Titanic Dataset",
        techniques: ["Data Cleaning", "EDA", "Classification"],
        estimatedHours: 4,
        completions: 8500,
        rating: 4.7,
        datasetUrl: "https://kaggle.com/c/titanic",
        notebookTemplate: "https://...",
      };
    }),

  // Get statistics courses
  getStatisticsCourses: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        title: "Descriptive Statistics",
        description: "Mean, median, standard deviation, and distributions",
        lessons: 12,
        hours: 5,
        difficulty: "beginner",
        rating: 4.7,
      },
      {
        id: 2,
        title: "Probability Fundamentals",
        description: "Probability theory, distributions, and Bayes theorem",
        lessons: 14,
        hours: 6,
        difficulty: "intermediate",
        rating: 4.8,
      },
      {
        id: 3,
        title: "Inferential Statistics",
        description: "Hypothesis testing, confidence intervals, regression",
        lessons: 16,
        hours: 7,
        difficulty: "intermediate",
        rating: 4.6,
      },
    ];
  }),

  // Enroll in track
  enrollInTrack: protectedProcedure
    .input(z.object({ trackId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        message: "Enrolled in track successfully",
        trackId: input.trackId,
      };
    }),

  // Get track certificate
  getTrackCertificate: protectedProcedure
    .input(z.object({ trackId: z.number() }))
    .query(async ({ ctx, input }) => {
      return {
        earned: true,
        certificateId: "DS-2024-001",
        trackTitle: "Python for Data Analysis",
        earnedDate: new Date("2024-03-15"),
        certificateUrl: "https://...",
        linkedinShareUrl: "https://...",
      };
    }),
});
