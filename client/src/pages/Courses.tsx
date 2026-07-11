import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { BookOpen, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "wouter";

export default function Courses() {
  const { data: courses, isLoading } = trpc.courses.list.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  }) || [];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-2 py-6">
        {/* Search and Filter */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedDifficulty === null ? "default" : "outline"}
                onClick={() => setSelectedDifficulty(null)}
                size="sm"
              >
                All Levels
              </Button>
              <Button
                variant={selectedDifficulty === "beginner" ? "default" : "outline"}
                onClick={() => setSelectedDifficulty("beginner")}
                size="sm"
              >
                Beginner
              </Button>
              <Button
                variant={selectedDifficulty === "intermediate" ? "default" : "outline"}
                onClick={() => setSelectedDifficulty("intermediate")}
                size="sm"
              >
                Intermediate
              </Button>
              <Button
                variant={selectedDifficulty === "advanced" ? "default" : "outline"}
                onClick={() => setSelectedDifficulty("advanced")}
                size="sm"
              >
                Advanced
              </Button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-slate-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl">{course.icon || "📚"}</span>
                    {course.isPremium && <Badge className="bg-yellow-500">Premium</Badge>}
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{course.totalLessons} lessons</span>
                    <Badge
                      variant={
                        course.difficulty === "beginner"
                          ? "default"
                          : course.difficulty === "intermediate"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {course.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{course.enrollmentCount} students</span>
                    {course.estimatedHours && <span>{course.estimatedHours} hours</span>}
                  </div>
                  <Button className="w-full" onClick={() => navigate(`/course/${course.id}`)}>Enroll Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="pt-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No courses found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
