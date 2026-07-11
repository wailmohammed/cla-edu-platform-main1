import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

export const jobboardRouter = router({
  // Get available jobs
  getJobs: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        level: z.enum(["entry", "mid", "senior"]).optional(),
        remote: z.boolean().optional(),
      })
    )
    .query(async () => {
      return [
        {
          id: 1,
          title: "Junior Python Developer",
          company: "TechCorp",
          level: "entry",
          salary: "$60k-80k",
          location: "Remote",
          remote: true,
          description: "Build scalable Python applications",
          skills: ["Python", "Django", "PostgreSQL"],
          posted: new Date(Date.now() - 86400000),
          applications: 45,
        },
        {
          id: 2,
          title: "Senior React Engineer",
          company: "StartupXYZ",
          level: "senior",
          salary: "$120k-150k",
          location: "San Francisco, CA",
          remote: false,
          description: "Lead frontend architecture",
          skills: ["React", "TypeScript", "System Design"],
          posted: new Date(Date.now() - 2 * 86400000),
          applications: 120,
        },
        {
          id: 3,
          title: "Full Stack Developer",
          company: "WebAgency",
          level: "mid",
          salary: "$90k-110k",
          location: "Remote",
          remote: true,
          description: "Build web applications",
          skills: ["JavaScript", "Node.js", "React", "MongoDB"],
          posted: new Date(Date.now() - 3 * 86400000),
          applications: 78,
        },
      ];
    }),

  // Get job details
  getJobDetails: publicProcedure
    .input(z.object({ jobId: z.number() }))
    .query(async () => {
      return {
        id: 1,
        title: "Junior Python Developer",
        company: "TechCorp",
        level: "entry",
        salary: "$60k-80k",
        location: "Remote",
        remote: true,
        description: "Build scalable Python applications",
        fullDescription: "We are looking for a talented Python developer to join our team...",
        skills: ["Python", "Django", "PostgreSQL"],
        benefits: ["Health Insurance", "401k", "Remote Work", "Learning Budget"],
        posted: new Date(),
        deadline: new Date(Date.now() + 30 * 86400000),
        applications: 45,
        companyLogo: "https://example.com/logo.png",
      };
    }),

  // Apply for job
  applyForJob: protectedProcedure
    .input(
      z.object({
        jobId: z.number(),
        resume: z.string(),
        coverLetter: z.string().optional(),
      })
    )
    .mutation(async () => {
      return {
        success: true,
        message: "Application submitted successfully",
        applicationId: Math.floor(Math.random() * 100000),
        status: "pending",
      };
    }),

  // Get user's applications
  getUserApplications: protectedProcedure.query(async () => {
    return [
      {
        id: 1,
        jobTitle: "Junior Python Developer",
        company: "TechCorp",
        status: "pending",
        appliedDate: new Date(Date.now() - 5 * 86400000),
      },
      {
        id: 2,
        jobTitle: "Full Stack Developer",
        company: "WebAgency",
        status: "rejected",
        appliedDate: new Date(Date.now() - 10 * 86400000),
      },
      {
        id: 3,
        jobTitle: "Senior React Engineer",
        company: "StartupXYZ",
        status: "interview",
        appliedDate: new Date(Date.now() - 15 * 86400000),
        interviewDate: new Date(Date.now() + 7 * 86400000),
      },
    ];
  }),

  // Get career paths
  getCareerPaths: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        title: "Frontend Developer Path",
        description: "Master frontend development",
        steps: [
          { level: "Junior", salary: "$60k-80k", experience: "0-2 years" },
          { level: "Mid-level", salary: "$80k-120k", experience: "2-5 years" },
          { level: "Senior", salary: "$120k-180k", experience: "5+ years" },
          { level: "Staff", salary: "$180k-250k", experience: "8+ years" },
        ],
        skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
        courses: ["React Fundamentals", "Advanced React", "System Design"],
      },
      {
        id: 2,
        title: "Backend Developer Path",
        description: "Master backend development",
        steps: [
          { level: "Junior", salary: "$65k-85k", experience: "0-2 years" },
          { level: "Mid-level", salary: "$85k-125k", experience: "2-5 years" },
          { level: "Senior", salary: "$125k-185k", experience: "5+ years" },
          { level: "Staff", salary: "$185k-260k", experience: "8+ years" },
        ],
        skills: ["Python", "Node.js", "SQL", "System Design", "DevOps"],
        courses: ["Python Advanced", "System Design", "Database Design"],
      },
      {
        id: 3,
        title: "Full Stack Developer Path",
        description: "Master full stack development",
        steps: [
          { level: "Junior", salary: "$70k-90k", experience: "0-2 years" },
          { level: "Mid-level", salary: "$90k-130k", experience: "2-5 years" },
          { level: "Senior", salary: "$130k-190k", experience: "5+ years" },
          { level: "Staff", salary: "$190k-270k", experience: "8+ years" },
        ],
        skills: ["Frontend", "Backend", "Database", "DevOps", "System Design"],
        courses: ["Full Stack Development", "System Design", "DevOps"],
      },
    ];
  }),

  // Get salary insights
  getSalaryInsights: publicProcedure
    .input(
      z.object({
        role: z.string(),
        level: z.enum(["entry", "mid", "senior"]),
        location: z.string().optional(),
      })
    )
    .query(async () => {
      return {
        role: "Software Engineer",
        level: "mid",
        averageSalary: 105000,
        salaryRange: {
          min: 85000,
          max: 125000,
        },
        byLocation: [
          { location: "San Francisco", salary: 130000 },
          { location: "New York", salary: 120000 },
          { location: "Remote", salary: 100000 },
          { location: "Austin", salary: 95000 },
        ],
        byExperience: [
          { years: "0-2", salary: 75000 },
          { years: "2-5", salary: 105000 },
          { years: "5-10", salary: 145000 },
          { years: "10+", salary: 180000 },
        ],
        trends: "Growing 12% YoY",
      };
    }),

  // Get company profiles
  getCompanyProfiles: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        name: "TechCorp",
        industry: "Software",
        size: "1000-5000",
        founded: 2010,
        logo: "https://example.com/techcorp.png",
        description: "Leading software company",
        openJobs: 15,
        avgRating: 4.2,
        reviews: 234,
      },
      {
        id: 2,
        name: "StartupXYZ",
        industry: "AI/ML",
        size: "50-200",
        founded: 2020,
        logo: "https://example.com/startupxyz.png",
        description: "AI-powered solutions",
        openJobs: 8,
        avgRating: 4.7,
        reviews: 45,
      },
    ];
  }),

  // Get interview prep resources
  getInterviewResources: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        title: "System Design Interview",
        type: "course",
        duration: "8 hours",
        difficulty: "Advanced",
        rating: 4.8,
      },
      {
        id: 2,
        title: "Coding Interview Patterns",
        type: "course",
        duration: "10 hours",
        difficulty: "Intermediate",
        rating: 4.7,
      },
      {
        id: 3,
        title: "Behavioral Interview Guide",
        type: "guide",
        duration: "2 hours",
        difficulty: "Beginner",
        rating: 4.5,
      },
    ];
  }),

  // Get skill demand
  getSkillDemand: publicProcedure.query(async () => {
    return [
      { skill: "Python", demand: 95, growth: 15 },
      { skill: "JavaScript", demand: 92, growth: 8 },
      { skill: "React", demand: 88, growth: 12 },
      { skill: "TypeScript", demand: 85, growth: 25 },
      { skill: "System Design", demand: 82, growth: 18 },
      { skill: "AWS", demand: 80, growth: 20 },
      { skill: "Kubernetes", demand: 75, growth: 22 },
      { skill: "Go", demand: 70, growth: 30 },
    ];
  }),
});
