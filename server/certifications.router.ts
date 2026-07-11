import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const certificationsRouter = router({
  // Get user certificates
  getUserCertificates: protectedProcedure.query(async ({ ctx }) => {
    return [
      {
        id: 1,
        certificateId: "CERT-2024-001",
        title: "Python for Data Analysis",
        type: "course",
        earnedDate: new Date("2024-03-15"),
        issuer: "Codelearnify",
        credentialUrl: "https://codelearnify.com/verify/CERT-2024-001",
        linkedinUrl: "https://linkedin.com/learning/...",
        skills: ["Python", "Pandas", "NumPy", "Data Analysis"],
        rating: 4.9,
      },
      {
        id: 2,
        certificateId: "CERT-2024-002",
        title: "Full-Stack Web Development",
        type: "track",
        earnedDate: new Date("2024-02-28"),
        issuer: "Codelearnify",
        credentialUrl: "https://codelearnify.com/verify/CERT-2024-002",
        linkedinUrl: "https://linkedin.com/learning/...",
        skills: ["React", "Node.js", "MongoDB", "Web Development"],
        rating: 4.8,
      },
    ];
  }),

  // Get certificate details
  getCertificateDetails: publicProcedure
    .input(z.object({ certificateId: z.string() }))
    .query(async ({ input }) => {
      return {
        id: 1,
        certificateId: input.certificateId,
        title: "Python for Data Analysis",
        type: "course",
        earnedDate: new Date("2024-03-15"),
        issuer: "Codelearnify",
        issuerLogo: "https://...",
        credentialUrl: "https://codelearnify.com/verify/" + input.certificateId,
        credentialId: input.certificateId,
        skills: ["Python", "Pandas", "NumPy", "Data Analysis"],
        coursesCompleted: 8,
        hoursSpent: 35,
        finalScore: 92,
        certificateUrl: "https://...",
        badgeUrl: "https://...",
        linkedinShareUrl: "https://linkedin.com/learning/...",
        verificationCode: "VERIFY-" + Math.random().toString(36).substring(7),
      };
    }),

  // Verify certificate
  verifyCertificate: publicProcedure
    .input(z.object({ certificateId: z.string() }))
    .query(async ({ input }) => {
      return {
        valid: true,
        certificateId: input.certificateId,
        title: "Python for Data Analysis",
        recipient: "John Developer",
        earnedDate: new Date("2024-03-15"),
        issuer: "Codelearnify",
        credentialUrl: "https://codelearnify.com/verify/" + input.certificateId,
      };
    }),

  // Get certification paths
  getCertificationPaths: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        title: "Full-Stack Web Developer",
        description: "Master front-end and back-end development",
        icon: "code",
        courses: 12,
        hours: 60,
        difficulty: "advanced",
        rating: 4.8,
        students: 25000,
        skills: ["React", "Node.js", "MongoDB", "Web Development"],
      },
      {
        id: 2,
        title: "Data Scientist",
        description: "Learn data analysis, ML, and visualization",
        icon: "chart",
        courses: 15,
        hours: 75,
        difficulty: "advanced",
        rating: 4.9,
        students: 18000,
        skills: ["Python", "SQL", "Machine Learning", "Statistics"],
      },
      {
        id: 3,
        title: "Mobile App Developer",
        description: "Build iOS and Android applications",
        icon: "smartphone",
        courses: 10,
        hours: 50,
        difficulty: "advanced",
        rating: 4.7,
        students: 15000,
        skills: ["React Native", "Swift", "Kotlin", "Mobile Dev"],
      },
      {
        id: 4,
        title: "Cloud & DevOps Engineer",
        description: "Master cloud platforms and DevOps practices",
        icon: "cloud",
        courses: 11,
        hours: 55,
        difficulty: "advanced",
        rating: 4.8,
        students: 12000,
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      },
    ];
  }),

  // Get certification path details
  getCertificationPathDetails: publicProcedure
    .input(z.object({ pathId: z.number() }))
    .query(async ({ input }) => {
      return {
        id: input.pathId,
        title: "Full-Stack Web Developer",
        description: "Master front-end and back-end development",
        fullDescription: `
# Full-Stack Web Developer Certification

Become a professional full-stack web developer with this comprehensive certification program.

## What you'll learn
- Front-end development with React
- Back-end development with Node.js
- Database design with MongoDB
- API development and integration
- Deployment and DevOps basics
- Real-world project experience

## Certification Requirements
- Complete all 12 courses
- Pass all assessments (80% minimum)
- Complete 3 capstone projects
- Maintain 75+ average score

## Career Outcomes
- Average salary: $95,000+
- Job placement rate: 92%
- Top employers: Google, Amazon, Microsoft, Meta
        `,
        courses: 12,
        hours: 60,
        difficulty: "advanced",
        rating: 4.8,
        students: 25000,
        skills: ["React", "Node.js", "MongoDB", "Web Development"],
        courses_list: [
          { id: 1, title: "JavaScript Fundamentals", hours: 5 },
          { id: 2, title: "React Essentials", hours: 8 },
          { id: 3, title: "Advanced React", hours: 7 },
          { id: 4, title: "Node.js & Express", hours: 8 },
          { id: 5, title: "MongoDB & Databases", hours: 6 },
          { id: 6, title: "API Development", hours: 6 },
          { id: 7, title: "Authentication & Security", hours: 5 },
          { id: 8, title: "Testing & Debugging", hours: 4 },
          { id: 9, title: "Deployment & DevOps", hours: 5 },
          { id: 10, title: "Capstone Project 1", hours: 8 },
          { id: 11, title: "Capstone Project 2", hours: 8 },
          { id: 12, title: "Capstone Project 3", hours: 10 },
        ],
        prerequisites: "Basic programming knowledge",
        examRequired: true,
        examDuration: 120,
        passingScore: 80,
      };
    }),

  // Enroll in certification path
  enrollInCertificationPath: protectedProcedure
    .input(z.object({ pathId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        message: "Enrolled in certification path",
        pathId: input.pathId,
        enrollmentDate: new Date(),
      };
    }),

  // Get certification exam
  getCertificationExam: protectedProcedure
    .input(z.object({ pathId: z.number() }))
    .query(async ({ ctx, input }) => {
      return {
        examId: 1,
        title: "Full-Stack Web Developer Certification Exam",
        duration: 120,
        questions: 50,
        passingScore: 80,
        totalScore: 100,
        questionTypes: ["multiple-choice", "coding", "practical"],
        topics: [
          "JavaScript Fundamentals",
          "React",
          "Node.js",
          "MongoDB",
          "API Development",
          "Security",
          "DevOps",
        ],
        sampleQuestions: [
          {
            id: 1,
            type: "multiple-choice",
            question: "What is the virtual DOM in React?",
            options: [
              "A copy of the real DOM",
              "A JavaScript representation of the DOM",
              "A server-side rendering technique",
              "A CSS optimization technique",
            ],
            correctAnswer: 1,
          },
        ],
      };
    }),

  // Submit certification exam
  submitCertificationExam: protectedProcedure
    .input(
      z.object({
        pathId: z.number(),
        answers: z.record(z.string(), z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const score = Math.floor(Math.random() * 40) + 60; // 60-100
      const passed = score >= 80;

      return {
        success: true,
        examId: Math.floor(Math.random() * 10000),
        score,
        passed,
        message: passed ? "Congratulations! You passed the exam!" : "You did not pass. Please try again.",
        certificateId: passed ? "CERT-" + Math.random().toString(36).substring(7) : null,
      };
    }),

  // Get LinkedIn certificate share
  getLinkedInCertificateShare: protectedProcedure
    .input(z.object({ certificateId: z.string() }))
    .query(async ({ input }) => {
      return {
        certificateId: input.certificateId,
        title: "Python for Data Analysis",
        linkedinShareUrl: "https://linkedin.com/learning/...",
        shareText: "I just earned the Python for Data Analysis certification from Codelearnify!",
      };
    }),

  // Add certificate to LinkedIn
  addCertificateToLinkedIn: protectedProcedure
    .input(z.object({ certificateId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return {
        success: true,
        message: "Certificate added to LinkedIn profile",
        linkedinUrl: "https://linkedin.com/in/user/details/certifications/",
      };
    }),

  // Get badge details
  getBadgeDetails: publicProcedure
    .input(z.object({ badgeId: z.string() }))
    .query(async ({ input }) => {
      return {
        badgeId: input.badgeId,
        title: "Python Expert",
        description: "Mastered Python programming",
        icon: "https://...",
        criteria: "Complete 5 Python courses and score 90+ on all assessments",
        earnedDate: new Date("2024-03-15"),
        shareUrl: "https://codelearnify.com/badges/" + input.badgeId,
      };
    }),
});
