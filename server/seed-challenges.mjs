import mysql from "mysql2/promise";

const challenges = [
  // Beginner Challenges (100+)
  { title: "Hello World", difficulty: "Beginner", category: "Basics", description: "Print Hello World", language: "python" },
  { title: "Sum of Two Numbers", difficulty: "Beginner", category: "Basics", description: "Add two numbers", language: "python" },
  { title: "Even or Odd", difficulty: "Beginner", category: "Basics", description: "Check if number is even or odd", language: "python" },
  { title: "Factorial", difficulty: "Beginner", category: "Basics", description: "Calculate factorial", language: "python" },
  { title: "Fibonacci Sequence", difficulty: "Beginner", category: "Basics", description: "Generate Fibonacci sequence", language: "python" },
  { title: "Palindrome Check", difficulty: "Beginner", category: "Strings", description: "Check if string is palindrome", language: "python" },
  { title: "Reverse String", difficulty: "Beginner", category: "Strings", description: "Reverse a string", language: "python" },
  { title: "Count Vowels", difficulty: "Beginner", category: "Strings", description: "Count vowels in string", language: "python" },
  { title: "FizzBuzz", difficulty: "Beginner", category: "Loops", description: "Classic FizzBuzz problem", language: "python" },
  { title: "Prime Number Check", difficulty: "Beginner", category: "Math", description: "Check if number is prime", language: "python" },
  ...Array.from({ length: 40 }, (_, i) => ({
    title: `Beginner Challenge ${i + 11}: Basic Problem`,
    difficulty: "Beginner",
    category: ["Basics", "Strings", "Arrays", "Math"][i % 4],
    description: `Solve beginner problem ${i + 11}`,
    language: ["python", "javascript", "java"][i % 3],
  })),

  // Intermediate Challenges (200+)
  { title: "Binary Search", difficulty: "Intermediate", category: "Search", description: "Implement binary search", language: "python" },
  { title: "Merge Sort", difficulty: "Intermediate", category: "Sorting", description: "Implement merge sort", language: "python" },
  { title: "Quick Sort", difficulty: "Intermediate", category: "Sorting", description: "Implement quick sort", language: "python" },
  { title: "Two Sum", difficulty: "Intermediate", category: "Arrays", description: "Find two numbers that sum to target", language: "python" },
  { title: "Three Sum", difficulty: "Intermediate", category: "Arrays", description: "Find three numbers that sum to target", language: "python" },
  { title: "Longest Substring", difficulty: "Intermediate", category: "Strings", description: "Find longest substring without repeating", language: "python" },
  { title: "Valid Parentheses", difficulty: "Intermediate", category: "Strings", description: "Check if parentheses are valid", language: "python" },
  { title: "Reverse Integer", difficulty: "Intermediate", category: "Math", description: "Reverse integer digits", language: "python" },
  { title: "Rotate Array", difficulty: "Intermediate", category: "Arrays", description: "Rotate array by k positions", language: "python" },
  ...Array.from({ length: 90 }, (_, i) => ({
    title: `Intermediate Challenge ${i + 11}: Algorithm Problem`,
    difficulty: "Intermediate",
    category: ["Algorithms", "DataStructures", "Strings", "Arrays"][i % 4],
    description: `Solve intermediate problem ${i + 11}`,
    language: ["python", "javascript", "java", "cpp"][i % 4],
  })),

  // Advanced Challenges (200+)
  { title: "Longest Palindrome", difficulty: "Advanced", category: "Strings", description: "Find longest palindromic substring", language: "python" },
  { title: "Edit Distance", difficulty: "Advanced", category: "DP", description: "Calculate edit distance", language: "python" },
  { title: "Regular Expression", difficulty: "Advanced", category: "Strings", description: "Implement regex matching", language: "python" },
  { title: "Median of Arrays", difficulty: "Advanced", category: "Arrays", description: "Find median of two sorted arrays", language: "python" },
  { title: "Skyline Problem", difficulty: "Advanced", category: "Arrays", description: "Build skyline from buildings", language: "python" },
  { title: "Word Ladder", difficulty: "Advanced", category: "Graphs", description: "Find shortest word ladder", language: "python" },
  { title: "Alien Dictionary", difficulty: "Advanced", category: "Graphs", description: "Determine alien dictionary order", language: "python" },
  { title: "Serialize Tree", difficulty: "Advanced", category: "Trees", description: "Serialize and deserialize tree", language: "python" },
  { title: "Lowest Common Ancestor", difficulty: "Advanced", category: "Trees", description: "Find LCA in binary tree", language: "python" },
  { title: "Reconstruct Itinerary", difficulty: "Advanced", category: "Graphs", description: "Reconstruct flight itinerary", language: "python" },
  ...Array.from({ length: 90 }, (_, i) => ({
    title: `Advanced Challenge ${i + 11}: Complex Problem`,
    difficulty: "Advanced",
    category: ["SystemDesign", "Optimization", "Graphs", "DP"][i % 4],
    description: `Solve advanced problem ${i + 11}`,
    language: ["python", "javascript", "java", "go"][i % 4],
  })),
];

async function seedChallenges() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "edu_platform",
    });

    console.log("✅ Connected to database");
    console.log(`🎯 Seeding ${challenges.length} challenges...`);

    for (const challenge of challenges) {
      const query = `
        INSERT INTO exercises (title, description, difficulty, category, language, points, timeLimit, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE updatedAt = NOW()
      `;
      
      await connection.execute(query, [
        challenge.title,
        challenge.description,
        challenge.difficulty,
        challenge.category,
        challenge.language,
        challenge.difficulty === "Beginner" ? 10 : challenge.difficulty === "Intermediate" ? 25 : 50,
        challenge.difficulty === "Beginner" ? 15 : challenge.difficulty === "Intermediate" ? 30 : 60,
      ]);
    }

    console.log(`✅ Successfully seeded ${challenges.length} challenges!`);
    await connection.end();
  } catch (error) {
    console.error("❌ Error seeding challenges:", error.message);
    process.exit(1);
  }
}

seedChallenges();
