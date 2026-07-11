import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const courses = [
  {
    slug: "python-fundamentals",
    title: "Python Fundamentals",
    description: "Learn the basics of Python programming",
    icon: "🐍",
    category: "programming",
    difficulty: "beginner",
    language: "python",
    totalLessons: 24,
    estimatedHours: 12,
    isPremium: false,
    displayOrder: 1,
  },
  {
    slug: "javascript-essentials",
    title: "JavaScript Essentials",
    description: "Master JavaScript from scratch",
    icon: "⚡",
    category: "programming",
    difficulty: "beginner",
    language: "javascript",
    totalLessons: 28,
    estimatedHours: 14,
    isPremium: false,
    displayOrder: 2,
  },
  {
    slug: "web-development",
    title: "Web Development",
    description: "Build complete web applications",
    icon: "🌐",
    category: "web-development",
    difficulty: "intermediate",
    language: "javascript",
    totalLessons: 32,
    estimatedHours: 20,
    isPremium: true,
    displayOrder: 3,
  },
  {
    slug: "data-science-python",
    title: "Data Science with Python",
    description: "Analyze data and build ML models",
    icon: "📊",
    category: "data-science",
    difficulty: "intermediate",
    language: "python",
    totalLessons: 26,
    estimatedHours: 18,
    isPremium: true,
    displayOrder: 4,
  },
  {
    slug: "advanced-algorithms",
    title: "Advanced Algorithms",
    description: "Master complex algorithmic problems",
    icon: "🧮",
    category: "algorithms",
    difficulty: "advanced",
    language: "python",
    totalLessons: 20,
    estimatedHours: 25,
    isPremium: true,
    displayOrder: 5,
  },
  {
    slug: "sql-database",
    title: "SQL & Databases",
    description: "Learn database design and SQL",
    icon: "🗄️",
    category: "databases",
    difficulty: "intermediate",
    language: "sql",
    totalLessons: 22,
    estimatedHours: 15,
    isPremium: false,
    displayOrder: 6,
  },
  {
    slug: "html-css",
    title: "HTML & CSS Mastery",
    description: "Build beautiful responsive websites",
    icon: "🎨",
    category: "web-development",
    difficulty: "beginner",
    language: "html",
    totalLessons: 18,
    estimatedHours: 10,
    isPremium: false,
    displayOrder: 7,
  },
  {
    slug: "react-advanced",
    title: "Advanced React",
    description: "Build complex React applications",
    icon: "⚛️",
    category: "web-development",
    difficulty: "advanced",
    language: "javascript",
    totalLessons: 30,
    estimatedHours: 22,
    isPremium: true,
    displayOrder: 8,
  },
  {
    slug: "mathematics-basics",
    title: "Mathematics for Programmers",
    description: "Essential math concepts for coding",
    icon: "📐",
    category: "mathematics",
    difficulty: "beginner",
    language: "python",
    totalLessons: 20,
    estimatedHours: 16,
    isPremium: false,
    displayOrder: 9,
  },
  {
    slug: "devops-docker",
    title: "DevOps & Docker",
    description: "Deploy applications with Docker",
    icon: "🐳",
    category: "devops",
    difficulty: "advanced",
    language: "python",
    totalLessons: 24,
    estimatedHours: 20,
    isPremium: true,
    displayOrder: 10,
  },
];

const badges = [
  {
    slug: "first-lesson",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "🎯",
    badgeType: "achievement",
    criteria: JSON.stringify({ type: "completion", count: 1 }),
  },
  {
    slug: "week-streak",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    badgeType: "streak",
    criteria: JSON.stringify({ type: "streak", days: 7 }),
  },
  {
    slug: "month-streak",
    title: "Month Master",
    description: "Maintain a 30-day streak",
    icon: "🌟",
    badgeType: "streak",
    criteria: JSON.stringify({ type: "streak", days: 30 }),
  },
  {
    slug: "course-complete",
    title: "Course Conqueror",
    description: "Complete an entire course",
    icon: "🏆",
    badgeType: "completion",
    criteria: JSON.stringify({ type: "course_completion", count: 1 }),
  },
  {
    slug: "xp-1000",
    title: "XP Collector",
    description: "Earn 1000 XP",
    icon: "💎",
    badgeType: "milestone",
    criteria: JSON.stringify({ type: "xp", amount: 1000 }),
  },
];

try {
  console.log("Seeding courses...");
  for (const course of courses) {
    await connection.execute(
      `INSERT INTO courses (slug, title, description, icon, category, difficulty, language, totalLessons, estimatedHours, isPremium, displayOrder) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        course.slug,
        course.title,
        course.description,
        course.icon,
        course.category,
        course.difficulty,
        course.language,
        course.totalLessons,
        course.estimatedHours,
        course.isPremium,
        course.displayOrder,
      ]
    );
  }
  console.log(`✓ Seeded ${courses.length} courses`);

  console.log("Seeding badges...");
  for (const badge of badges) {
    await connection.execute(
      `INSERT INTO badges (slug, title, description, icon, badgeType, criteria) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [badge.slug, badge.title, badge.description, badge.icon, badge.badgeType, badge.criteria]
    );
  }
  console.log(`✓ Seeded ${badges.length} badges`);

  console.log("✓ Database seeding complete!");
} catch (error) {
  console.error("Error seeding database:", error);
  process.exit(1);
} finally {
  await connection.end();
}
