import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Star, Users, Clock, Search, Filter } from "lucide-react";
import { Link } from "wouter";
import { EnrollmentFlow } from "@/components/EnrollmentFlow";

export function CoursesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  // Get all courses - using a mock data approach since we're building the UI
  const allCourses = useMemo(() => [
    // Top 10 Featured Courses
    {
      id: 1,
      title: "Python Fundamentals",
      description: "Master Python basics and become proficient in one of the most popular programming languages",
      category: "Programming",
      difficulty: "Beginner",
      lessons: 25,
      instructor: "Sarah Chen",
      rating: 4.8,
      students: 15420,
      price: 49.99,
      duration: "40 hours",
    },
    {
      id: 2,
      title: "React Fundamentals",
      description: "Learn React from scratch and build modern web applications with reusable components",
      category: "Web Development",
      difficulty: "Beginner",
      lessons: 28,
      instructor: "James Wilson",
      rating: 4.7,
      students: 12340,
      price: 59.99,
      duration: "42 hours",
    },
    {
      id: 3,
      title: "JavaScript Advanced",
      description: "Master advanced JavaScript concepts including async/await, closures, and functional programming",
      category: "Programming",
      difficulty: "Advanced",
      lessons: 32,
      instructor: "Michael Brown",
      rating: 4.9,
      students: 9234,
      price: 69.99,
      duration: "50 hours",
    },
    {
      id: 4,
      title: "Machine Learning Basics",
      description: "Introduction to machine learning with Python, covering supervised and unsupervised learning",
      category: "Data Science",
      difficulty: "Intermediate",
      lessons: 30,
      instructor: "Dr. Emily Zhang",
      rating: 4.6,
      students: 7654,
      price: 79.99,
      duration: "45 hours",
    },
    {
      id: 5,
      title: "TypeScript Mastery",
      description: "Master TypeScript for building scalable and type-safe applications",
      category: "Programming",
      difficulty: "Intermediate",
      lessons: 26,
      instructor: "David Lee",
      rating: 4.8,
      students: 8765,
      price: 59.99,
      duration: "38 hours",
    },
    {
      id: 6,
      title: "Next.js Full Stack",
      description: "Build full-stack web applications with Next.js, React, and modern databases",
      category: "Web Development",
      difficulty: "Intermediate",
      lessons: 35,
      instructor: "Jessica Martinez",
      rating: 4.7,
      students: 9870,
      price: 79.99,
      duration: "55 hours",
    },
    {
      id: 7,
      title: "Java Fundamentals",
      description: "Learn Java programming from basics to object-oriented concepts",
      category: "Programming",
      difficulty: "Beginner",
      lessons: 24,
      instructor: "Robert Kim",
      rating: 4.6,
      students: 11200,
      price: 49.99,
      duration: "36 hours",
    },
    {
      id: 8,
      title: "Deep Learning Fundamentals",
      description: "Introduction to deep learning with TensorFlow and neural networks",
      category: "Data Science",
      difficulty: "Advanced",
      lessons: 28,
      instructor: "Prof. Alex Kumar",
      rating: 4.9,
      students: 6543,
      price: 89.99,
      duration: "52 hours",
    },
    {
      id: 9,
      title: "Vue.js Essentials",
      description: "Learn Vue.js for building interactive and dynamic web applications",
      category: "Web Development",
      difficulty: "Beginner",
      lessons: 22,
      instructor: "Lisa Anderson",
      rating: 4.7,
      students: 8234,
      price: 54.99,
      duration: "35 hours",
    },
    {
      id: 10,
      title: "Angular Mastery",
      description: "Master Angular framework for enterprise-level web applications",
      category: "Web Development",
      difficulty: "Advanced",
      lessons: 33,
      instructor: "Thomas White",
      rating: 4.8,
      students: 7890,
      price: 74.99,
      duration: "48 hours",
    },
    // Additional 50+ Courses
    ...Array.from({ length: 50 }, (_, i) => ({
      id: 11 + i,
      title: generateCourseTitle(i),
      description: generateCourseDescription(i),
      category: getRandomCategory(i),
      difficulty: getRandomDifficulty(i),
      lessons: Math.floor(Math.random() * 30) + 15,
      instructor: generateInstructorName(i),
      rating: parseFloat((Math.random() * 0.4 + 4.5).toFixed(1)),
      students: Math.floor(Math.random() * 15000) + 1000,
      price: (Math.floor(Math.random() * 5) + 4) * 10 + 0.99,
      duration: Math.floor(Math.random() * 30) + 30 + " hours",
    })),
  ], []);

  const filteredCourses = useMemo(() => {
    let filtered = allCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "all" || course.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort
    if (sortBy === "popular") {
      filtered.sort((a, b) => b.students - a.students);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating as number) - (a.rating as number));
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [allCourses, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const categories = ["all", "Programming", "Web Development", "Data Science", "Mobile Development", "DevOps"];
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>
          <p className="text-blue-100 text-lg">Choose from 60+ courses and start learning today</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-base"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff === "all" ? "All Levels" : diff}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                  setSortBy("popular");
                }}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredCourses.length}</span> of{" "}
            <span className="font-semibold">{allCourses.length}</span> courses
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link key={course.id} href={`/course/${String(course.id)}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                  {/* Course Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-32 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl font-bold mb-2">{course.id}</div>
                      <Badge variant="secondary">{course.category}</Badge>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                    {/* Instructor */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-xs text-gray-600">Instructor</p>
                      <p className="text-sm font-semibold text-gray-900">{course.instructor}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">{(course.students / 1000).toFixed(1)}k</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">{course.duration}</span>
                      </div>
                      <div>
                        <Badge variant="outline">{course.difficulty}</Badge>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600">{course.lessons} lessons</p>
                        <p className="text-2xl font-bold text-gray-900">${course.price}</p>
                      </div>
                      <EnrollmentFlow
                        courseId={course.id}
                        courseName={course.title}
                        coursePrice={course.price}
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No courses found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedDifficulty("all");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions to generate course data
function generateCourseTitle(index: number): string {
  const titles = [
    "Python Advanced",
    "JavaScript Essentials",
    "C++ Programming",
    "Go Language",
    "Rust Fundamentals",
    "Swift for iOS",
    "Kotlin Development",
    "PHP Backend",
    "Ruby on Rails",
    "Scala Programming",
    "Haskell Basics",
    "Clojure Fundamentals",
    "Elixir Programming",
    "Erlang Basics",
    "R for Data Analysis",
    "MATLAB Essentials",
    "SQL Mastery",
    "NoSQL Databases",
    "MongoDB Advanced",
    "PostgreSQL Optimization",
    "Docker Essentials",
    "Kubernetes Mastery",
    "AWS Cloud Computing",
    "Azure Fundamentals",
    "Google Cloud Platform",
    "CI/CD Pipelines",
    "Git & GitHub",
    "Linux Administration",
    "Bash Scripting",
    "PowerShell Mastery",
    "GraphQL Fundamentals",
    "REST API Design",
    "Microservices Architecture",
    "System Design",
    "Software Architecture",
    "Design Patterns",
    "Clean Code",
    "Testing & QA",
    "Performance Optimization",
    "Security Fundamentals",
    "Blockchain Basics",
    "Web3 Development",
    "Smart Contracts",
    "Solidity Programming",
    "IoT Development",
    "Embedded Systems",
    "Game Development",
    "Unity 3D",
    "Unreal Engine",
    "AR/VR Development",
  ];
  return titles[index % titles.length];
}

function generateCourseDescription(index: number): string {
  const descriptions = [
    "Master this technology and take your skills to the next level",
    "Comprehensive guide to becoming an expert developer",
    "Learn industry best practices and real-world applications",
    "From basics to advanced concepts in one complete course",
    "Build production-ready applications with confidence",
    "Expert-led training with hands-on projects",
    "Accelerate your career with this in-demand skill",
    "Complete mastery of the fundamentals and beyond",
    "Real-world projects and practical experience",
    "Industry-recognized certification included",
  ];
  return descriptions[index % descriptions.length];
}

function getRandomCategory(index: number): string {
  const categories = ["Programming", "Web Development", "Data Science", "Mobile Development", "DevOps", "Cloud Computing"];
  return categories[index % categories.length];
}

function getRandomDifficulty(index: number): string {
  const difficulties = ["Beginner", "Intermediate", "Advanced"];
  return difficulties[index % difficulties.length];
}

function generateInstructorName(index: number): string {
  const firstNames = ["John", "Sarah", "Michael", "Emily", "David", "Jessica", "Robert", "Lisa", "James", "Maria"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
  const first = firstNames[index % firstNames.length];
  const last = lastNames[(index + 5) % lastNames.length];
  return `${first} ${last}`;
}
