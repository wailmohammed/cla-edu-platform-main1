import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/_core/hooks/useAuth";
import { BookOpen, Award, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export function UserDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock enrolled courses data
  const enrolledCourses = [
    {
      id: 1,
      title: "Python Fundamentals",
      instructor: "Sarah Chen",
      progress: 65,
      lessonsCompleted: 16,
      totalLessons: 25,
      status: "in-progress",
      lastAccessed: "2 hours ago",
      dueDate: "2026-07-15",
    },
    {
      id: 2,
      title: "React Fundamentals",
      instructor: "James Wilson",
      progress: 100,
      lessonsCompleted: 28,
      totalLessons: 28,
      status: "completed",
      completedDate: "2026-05-20",
      certificateUrl: "https://example.com/cert/react-123",
    },
    {
      id: 3,
      title: "JavaScript Advanced",
      instructor: "Michael Brown",
      progress: 32,
      lessonsCompleted: 10,
      totalLessons: 32,
      status: "in-progress",
      lastAccessed: "1 day ago",
      dueDate: "2026-08-01",
    },
    {
      id: 4,
      title: "TypeScript Mastery",
      instructor: "David Lee",
      progress: 0,
      lessonsCompleted: 0,
      totalLessons: 26,
      status: "not-started",
      enrolledDate: "2026-06-01",
    },
  ];

  const certificates = [
    {
      id: 1,
      courseName: "React Fundamentals",
      issuedDate: "2026-05-20",
      certificateUrl: "https://example.com/cert/react-123",
      instructor: "James Wilson",
    },
    {
      id: 2,
      courseName: "JavaScript Essentials",
      issuedDate: "2026-04-15",
      certificateUrl: "https://example.com/cert/js-456",
      instructor: "Michael Brown",
    },
  ];

  const recommendations = [
    {
      id: 5,
      title: "Machine Learning Basics",
      category: "Data Science",
      reason: "Based on your Python skills",
      instructor: "Dr. Emily Zhang",
      rating: 4.6,
      students: 7654,
      price: 79.99,
    },
    {
      id: 6,
      title: "Next.js Full Stack",
      category: "Web Development",
      reason: "Recommended after React",
      instructor: "Jessica Martinez",
      rating: 4.7,
      students: 9870,
      price: 79.99,
    },
    {
      id: 8,
      title: "Deep Learning Fundamentals",
      category: "Data Science",
      reason: "Popular with Python learners",
      instructor: "Prof. Alex Kumar",
      rating: 4.9,
      students: 6543,
      price: 89.99,
    },
  ];

  const stats = [
    {
      label: "Courses Enrolled",
      value: enrolledCourses.length,
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Certificates Earned",
      value: certificates.length,
      icon: Award,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Learning Streak",
      value: "12 days",
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
    },
    {
      label: "Hours Learned",
      value: "48 hrs",
      icon: Clock,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name || "Learner"}!</h1>
          <p className="text-blue-100">Continue your learning journey</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">My Courses</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          {/* My Courses Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-600">{course.instructor}</p>
                    </div>
                    <Badge
                      variant={
                        course.status === "completed"
                          ? "default"
                          : course.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {course.status === "completed"
                        ? "Completed"
                        : course.status === "in-progress"
                          ? "In Progress"
                          : "Not Started"}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  {course.status !== "not-started" && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {course.lessonsCompleted} of {course.totalLessons} lessons
                        </span>
                        <span className="text-sm font-semibold text-gray-900">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  {/* Course Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-b border-gray-200">
                    {course.status === "completed" ? (
                      <>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Completed</p>
                          <p className="text-sm font-semibold text-gray-900">{course.completedDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Certificate</p>
                          <p className="text-sm font-semibold text-green-600">✓ Earned</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Last Accessed</p>
                          <p className="text-sm font-semibold text-gray-900">{course.lastAccessed}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Due Date</p>
                          <p className="text-sm font-semibold text-gray-900">{course.dueDate}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link href={`/lesson/${course.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      {course.status === "completed" ? "Review Course" : "Continue Learning"}
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <Card key={cert.id} className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Award className="w-8 h-8 text-amber-600" />
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{cert.courseName}</h3>
                          <p className="text-sm text-gray-600">by {cert.instructor}</p>
                        </div>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>

                    <div className="mb-4 pb-4 border-b border-amber-200">
                      <p className="text-sm text-gray-600 mb-1">Issued on</p>
                      <p className="text-sm font-semibold text-gray-900">{cert.issuedDate}</p>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        View Certificate
                      </Button>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Share</Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No certificates yet. Complete a course to earn one!</p>
                <Link href="/courses">
                  <Button className="bg-blue-600 hover:bg-blue-700">Browse Courses</Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="space-y-4">
              {recommendations.map((course) => (
                <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                        <Badge variant="secondary">{course.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                      <p className="text-xs text-blue-600 font-medium">💡 {course.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 mb-2">${course.price}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <span>⭐ {course.rating}</span>
                        <span>({course.students.toLocaleString()})</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/course/${course.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Explore Course</Button>
                  </Link>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
