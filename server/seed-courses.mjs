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
  { title: "Ruby on Rails", description: "Web development with Ruby", category: "Programming", difficulty: "Intermediate", lessons: 25 },
  { title: "PHP Web Development", description: "Server-side web development", category: "Programming", difficulty: "Beginner", lessons: 23 },
  { title: "Kotlin for Android", description: "Modern Android development", category: "Programming", difficulty: "Intermediate", lessons: 27 },
  { title: "Swift iOS Development", description: "Native iOS app development", category: "Programming", difficulty: "Intermediate", lessons: 29 },
  { title: "C# & .NET", description: "Enterprise application development", category: "Programming", difficulty: "Intermediate", lessons: 31 },

  // Web Development (12 courses)
  { title: "HTML5 Mastery", description: "Modern HTML5 development", category: "Web", difficulty: "Beginner", lessons: 18 },
  { title: "CSS3 Advanced", description: "Advanced styling and animations", category: "Web", difficulty: "Intermediate", lessons: 22 },
  { title: "React Fundamentals", description: "Build UIs with React", category: "Web", difficulty: "Beginner", lessons: 26 },
  { title: "React Advanced", description: "Advanced React patterns", category: "Web", difficulty: "Advanced", lessons: 30 },
  { title: "Vue.js Essentials", description: "Progressive JavaScript framework", category: "Web", difficulty: "Beginner", lessons: 24 },
  { title: "Angular Mastery", description: "Enterprise Angular applications", category: "Web", difficulty: "Advanced", lessons: 32 },
  { title: "Next.js Full Stack", description: "Full-stack React applications", category: "Web", difficulty: "Intermediate", lessons: 28 },
  { title: "Svelte & SvelteKit", description: "Reactive web development", category: "Web", difficulty: "Intermediate", lessons: 20 },
  { title: "Tailwind CSS", description: "Utility-first CSS framework", category: "Web", difficulty: "Beginner", lessons: 16 },
  { title: "Bootstrap Mastery", description: "Responsive design with Bootstrap", category: "Web", difficulty: "Beginner", lessons: 18 },
  { title: "WebGL & Three.js", description: "3D graphics on the web", category: "Web", difficulty: "Advanced", lessons: 25 },
  { title: "Progressive Web Apps", description: "Build offline-capable web apps", category: "Web", difficulty: "Intermediate", lessons: 21 },

  // Data Science & AI (10 courses)
  { title: "Python for Data Science", description: "Data analysis with Python", category: "Data Science", difficulty: "Intermediate", lessons: 28 },
  { title: "Machine Learning Basics", description: "Introduction to ML algorithms", category: "Data Science", difficulty: "Intermediate", lessons: 30 },
  { title: "Deep Learning Fundamentals", description: "Neural networks and deep learning", category: "Data Science", difficulty: "Advanced", lessons: 32 },
  { title: "Natural Language Processing", description: "Text processing and NLP", category: "Data Science", difficulty: "Advanced", lessons: 28 },
  { title: "Computer Vision", description: "Image processing and vision", category: "Data Science", difficulty: "Advanced", lessons: 30 },
  { title: "Statistics for Data Science", description: "Statistical foundations", category: "Data Science", difficulty: "Intermediate", lessons: 24 },
  { title: "SQL for Analytics", description: "Data querying and analysis", category: "Data Science", difficulty: "Beginner", lessons: 22 },
  { title: "Pandas & NumPy", description: "Data manipulation libraries", category: "Data Science", difficulty: "Intermediate", lessons: 20 },
  { title: "TensorFlow & Keras", description: "Deep learning frameworks", category: "Data Science", difficulty: "Advanced", lessons: 28 },
  { title: "Tableau & Power BI", description: "Data visualization tools", category: "Data Science", difficulty: "Beginner", lessons: 18 },

  // DevOps & Cloud (8 courses)
  { title: "Docker Essentials", description: "Containerization with Docker", category: "DevOps", difficulty: "Intermediate", lessons: 22 },
  { title: "Kubernetes Mastery", description: "Container orchestration", category: "DevOps", difficulty: "Advanced", lessons: 28 },
  { title: "AWS Fundamentals", description: "Amazon Web Services basics", category: "DevOps", difficulty: "Intermediate", lessons: 26 },
  { title: "Azure Cloud Services", description: "Microsoft Azure platform", category: "DevOps", difficulty: "Intermediate", lessons: 24 },
  { title: "Google Cloud Platform", description: "GCP services and tools", category: "DevOps", difficulty: "Intermediate", lessons: 25 },
  { title: "CI/CD Pipelines", description: "Continuous integration and deployment", category: "DevOps", difficulty: "Intermediate", lessons: 20 },
  { title: "Infrastructure as Code", description: "Terraform and CloudFormation", category: "DevOps", difficulty: "Advanced", lessons: 22 },
  { title: "Monitoring & Logging", description: "System monitoring and observability", category: "DevOps", difficulty: "Intermediate", lessons: 18 },

  // Databases (6 courses)
  { title: "SQL Fundamentals", description: "Relational database basics", category: "Databases", difficulty: "Beginner", lessons: 24 },
  { title: "PostgreSQL Advanced", description: "Advanced PostgreSQL features", category: "Databases", difficulty: "Advanced", lessons: 26 },
  { title: "MongoDB Essentials", description: "NoSQL database with MongoDB", category: "Databases", difficulty: "Intermediate", lessons: 22 },
  { title: "Redis Caching", description: "In-memory data store", category: "Databases", difficulty: "Intermediate", lessons: 18 },
  { title: "Database Design", description: "Schema design and optimization", category: "Databases", difficulty: "Advanced", lessons: 20 },
  { title: "GraphQL APIs", description: "Query language for APIs", category: "Databases", difficulty: "Intermediate", lessons: 21 },

  // Mobile Development (5 courses)
  { title: "React Native Basics", description: "Cross-platform mobile apps", category: "Mobile", difficulty: "Intermediate", lessons: 24 },
  { title: "Flutter Development", description: "Build apps with Flutter", category: "Mobile", difficulty: "Intermediate", lessons: 26 },
  { title: "Android Development", description: "Native Android apps", category: "Mobile", difficulty: "Intermediate", lessons: 28 },
  { title: "iOS Development", description: "Native iOS apps with Swift", category: "Mobile", difficulty: "Intermediate", lessons: 27 },
  { title: "Mobile App Design", description: "UX/UI for mobile apps", category: "Mobile", difficulty: "Beginner", lessons: 20 },

  // Career & Soft Skills (4 courses)
  { title: "Career Development", description: "Advance your tech career", category: "Career", difficulty: "Beginner", lessons: 15 },
  { title: "Interview Preparation", description: "Ace your tech interviews", category: "Career", difficulty: "Intermediate", lessons: 18 },
  { title: "Leadership for Developers", description: "Lead technical teams", category: "Career", difficulty: "Advanced", lessons: 16 },
  { title: "Freelancing & Entrepreneurship", description: "Build your own tech business", category: "Career", difficulty: "Intermediate", lessons: 14 },
];

async function seedCourses() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "edu_platform",
    });

    console.log("✅ Connected to database");
    console.log(`📚 Seeding ${courses.length} courses...`);

    for (const course of courses) {
      const query = `
        INSERT INTO courses (title, description, category, difficulty, lessons, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE updatedAt = NOW()
      `;
      
      await connection.execute(query, [
        course.title,
        course.description,
        course.category,
        course.difficulty,
        course.lessons,
      ]);
    }

    console.log(`✅ Successfully seeded ${courses.length} courses!`);
    await connection.end();
  } catch (error) {
    console.error("❌ Error seeding courses:", error.message);
    process.exit(1);
  }
}

seedCourses();
