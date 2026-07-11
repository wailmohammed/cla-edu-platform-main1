import mysql from "mysql2/promise";

const courses = [
  // Programming Languages (15 courses)
  { title: "Python Fundamentals", description: "Master Python basics", category: "Programming", difficulty: "Beginner", lessons: 25 },
  { title: "Python Advanced", description: "Advanced Python concepts", category: "Programming", difficulty: "Advanced", lessons: 30 },
  { title: "JavaScript Essentials", description: "Learn JavaScript from scratch", category: "Programming", difficulty: "Beginner", lessons: 28 },
  { title: "JavaScript Advanced", description: "Master advanced JS patterns", category: "Programming", difficulty: "Advanced", lessons: 32 },
  { title: "TypeScript Mastery", description: "Type-safe JavaScript development", category: "Programming", difficulty: "Intermediate", lessons: 24 },
  { title: "Java Fundamentals", description: "Object-oriented programming with Java", category: "Programming", difficulty: "Beginner", lessons: 30 },
  { title: "Java Advanced", description: "Enterprise Java development", category: "Programming", difficulty: "Advanced", lessons: 35 },
  { title: "C++ Essentials", description: "Systems programming with C++", category: "Programming", difficulty: "Intermediate", lessons: 28 },
  { title: "Go Programming", description: "Concurrent programming with Go", category: "Programming", difficulty: "Intermediate", lessons: 22 },
  { title: "Rust Fundamentals", description: "Memory-safe systems programming", category: "Programming", difficulty: "Intermediate", lessons: 26 },

  // Web Development (12 courses)
  { title: "React Fundamentals", description: "Build UIs with React", category: "Web", difficulty: "Beginner", lessons: 26 },
  { title: "React Advanced", description: "Advanced React patterns", category: "Web", difficulty: "Advanced", lessons: 30 },
  { title: "Vue.js Essentials", description: "Progressive JavaScript framework", category: "Web", difficulty: "Beginner", lessons: 24 },
  { title: "Angular Mastery", description: "Enterprise Angular applications", category: "Web", difficulty: "Advanced", lessons: 32 },
  { title: "Next.js Full Stack", description: "Full-stack React applications", category: "Web", difficulty: "Intermediate", lessons: 28 },

  // Data Science & AI (10 courses)
  { title: "Python for Data Science", description: "Data analysis with Python", category: "Data Science", difficulty: "Intermediate", lessons: 28 },
  { title: "Machine Learning Basics", description: "Introduction to ML algorithms", category: "Data Science", difficulty: "Intermediate", lessons: 30 },
  { title: "Deep Learning Fundamentals", description: "Neural networks and deep learning", category: "Data Science", difficulty: "Advanced", lessons: 32 },
];

async function seedCourses() {
  let connection;
  try {
    // Parse DATABASE_URL
    const dbUrl = process.env.DATABASE_URL || process.env.DRIZZLE_DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL or DRIZZLE_DATABASE_URL not set");
    }

    // Parse connection string
    const url = new URL(dbUrl);
    const config = {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.split('/')[1],
      ssl: "Amazon RDS",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    console.log(`📚 Connecting to database at ${config.host}...`);
    connection = await mysql.createConnection(config);
    console.log("✅ Connected to database");

    console.log(`📚 Seeding ${courses.length} courses...`);

    for (const course of courses) {
      try {
        const query = `
          INSERT INTO courses (title, description, category, difficulty, lessons, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `;

        await connection.execute(query, [
          course.title,
          course.description,
          course.category,
          course.difficulty,
          course.lessons,
        ]);
        console.log(`✓ Added: ${course.title}`);
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
          console.log(`⊘ Already exists: ${course.title}`);
        } else {
          console.error(`✗ Error adding ${course.title}:`, err.message);
        }
      }
    }

    console.log(`✅ Successfully seeded ${courses.length} courses!`);
  } catch (error) {
    console.error("❌ Error seeding courses:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedCourses();
