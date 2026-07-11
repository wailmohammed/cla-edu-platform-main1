import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Plus, Edit, Trash2, BarChart3, Users, TrendingUp, MessageSquare, Upload } from "lucide-react";

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("courses");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Mock courses data
  const courses = [
    {
      id: 1,
      title: "Python Fundamentals",
      category: "Programming",
      students: 15420,
      revenue: 769500,
      rating: 4.8,
      status: "published",
      lessons: 25,
      price: 49.99,
    },
    {
      id: 2,
      title: "React Fundamentals",
      category: "Web Development",
      students: 12340,
      revenue: 740340,
      rating: 4.7,
      status: "published",
      lessons: 28,
      price: 59.99,
    },
    {
      id: 3,
      title: "JavaScript Advanced",
      category: "Programming",
      students: 9234,
      revenue: 646266,
      rating: 4.9,
      status: "published",
      lessons: 32,
      price: 69.99,
    },
    {
      id: 4,
      title: "Machine Learning Basics",
      category: "Data Science",
      students: 7654,
      revenue: 611632,
      rating: 4.6,
      status: "published",
      lessons: 30,
      price: 79.99,
    },
    {
      id: 5,
      title: "TypeScript Mastery",
      category: "Programming",
      students: 8765,
      revenue: 525435,
      rating: 4.8,
      status: "draft",
      lessons: 26,
      price: 59.99,
    },
  ];

  // Mock analytics data
  const analyticsData = [
    { month: "Jan", enrollments: 1200, revenue: 59800, completions: 320 },
    { month: "Feb", enrollments: 1900, revenue: 89600, completions: 480 },
    { month: "Mar", enrollments: 1500, revenue: 74900, completions: 390 },
    { month: "Apr", enrollments: 2200, revenue: 109800, completions: 550 },
    { month: "May", enrollments: 2800, revenue: 139900, completions: 720 },
    { month: "Jun", enrollments: 3200, revenue: 159600, completions: 850 },
  ];

  // Mock inquiries data
  const inquiries = [
    {
      id: 1,
      studentName: "John Doe",
      email: "john@example.com",
      course: "Python Fundamentals",
      subject: "Certificate issue",
      message: "I completed the course but haven't received my certificate yet.",
      status: "open",
      date: "2026-06-05",
    },
    {
      id: 2,
      studentName: "Jane Smith",
      email: "jane@example.com",
      course: "React Fundamentals",
      subject: "Technical issue",
      message: "Having trouble with lesson 15 video playback.",
      status: "in-progress",
      date: "2026-06-04",
    },
    {
      id: 3,
      studentName: "Bob Johnson",
      email: "bob@example.com",
      course: "JavaScript Advanced",
      subject: "Refund request",
      message: "Would like to request a refund for this course.",
      status: "open",
      date: "2026-06-03",
    },
  ];

  const stats = [
    {
      label: "Total Courses",
      value: courses.length,
      icon: BarChart3,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Students",
      value: "53,415",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Revenue",
      value: "$3.3M",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Pending Inquiries",
      value: "2",
      icon: MessageSquare,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Manage courses, analytics, and student inquiries</p>
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
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="inquiries">Student Inquiries</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Course
              </Button>
            </div>

            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                        <Badge variant={course.status === "published" ? "default" : "outline"}>
                          {course.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{course.category}</p>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Students</p>
                          <p className="text-lg font-semibold text-gray-900">{course.students.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Revenue</p>
                          <p className="text-lg font-semibold text-gray-900">${(course.revenue / 1000).toFixed(1)}k</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Rating</p>
                          <p className="text-lg font-semibold text-yellow-600">⭐ {course.rating}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Lessons</p>
                          <p className="text-lg font-semibold text-gray-900">{course.lessons}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Price</p>
                          <p className="text-lg font-semibold text-gray-900">${course.price}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCourse(course)}
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enrollments Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Enrollments</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="enrollments" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Revenue Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Completions Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Course Completions</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completions" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Summary Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Total Enrollments</span>
                    <span className="text-2xl font-bold text-gray-900">14,850</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="text-2xl font-bold text-green-600">$742,630</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="text-2xl font-bold text-blue-600">34.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="text-2xl font-bold text-yellow-600">4.76 ⭐</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Student Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Student Inquiries</h2>
              <div className="flex gap-2">
                <Input placeholder="Search inquiries..." className="w-64" />
              </div>
            </div>

            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <Card key={inquiry.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{inquiry.subject}</h3>
                        <Badge
                          variant={inquiry.status === "open" ? "default" : inquiry.status === "in-progress" ? "secondary" : "outline"}
                        >
                          {inquiry.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        From <span className="font-semibold">{inquiry.studentName}</span> ({inquiry.email})
                      </p>
                      <p className="text-sm text-gray-600 mb-3">Course: {inquiry.course}</p>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded">{inquiry.message}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-4">{inquiry.date}</p>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Reply
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Course Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>Fill in the details to create a new course</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
              <Input placeholder="Enter course title" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Input placeholder="Select category" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <Input type="number" placeholder="Enter price" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Course Content</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Create Course
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
