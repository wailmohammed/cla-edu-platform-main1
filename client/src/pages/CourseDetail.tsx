import { useParams } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Star, Users, Clock, BookOpen, Code } from "lucide-react";
import { EnrollmentFlow } from "@/components/EnrollmentFlow";

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || "1");
  const [selectedTab, setSelectedTab] = useState<"overview" | "lessons" | "code">("overview");

  const { data: course, isLoading } = trpc.courseContent.getCourseContent.useQuery({
    courseId,
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading course...</div>;
  }

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
              <p className="text-blue-100 text-lg mb-4">{course.description}</p>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                  <span className="font-semibold">{course.rating} ({course.students.toLocaleString()} students)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <Badge variant="secondary">{course.difficulty}</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold mb-4">${course.price}</p>
              <EnrollmentFlow
                courseId={courseId}
                courseName={course.title}
                coursePrice={course.price}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {[
            { id: "overview", label: "Overview", icon: BookOpen },
            { id: "lessons", label: "Lessons", icon: Clock },
            { id: "code", label: "Code Examples", icon: Code },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                selectedTab === id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {selectedTab === "overview" && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
                <div className="prose prose-sm max-w-none">
                  {course.detailedDescription.split("\n").map((line, i) => (
                    <p key={i} className="text-gray-700 mb-3 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Instructor</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {course.instructor.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{course.instructor}</p>
                      <p className="text-gray-600">Expert Instructor</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {selectedTab === "lessons" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Lessons</h2>
                {course.lessons && Array.isArray(course.lessons) && course.lessons.map((lesson: any, index: number) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">Lesson {lesson.number}</Badge>
                          <span className="text-sm text-gray-600">{lesson.duration}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{lesson.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          {lesson.topics && Array.isArray(lesson.topics) && lesson.topics.map((topic: string) => (
                            <Badge key={topic} variant="secondary">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" className="ml-4">
                        Preview
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {selectedTab === "code" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Code Examples</h2>
                {course.codeExamples && Array.isArray(course.codeExamples) && course.codeExamples.map((example: any, index: number) => (
                  <Card key={index} className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{example.title}</h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{example.code}</pre>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card className="p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Course Details</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="font-semibold text-gray-900">{course.category}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Level</p>
                  <Badge>{course.difficulty}</Badge>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="font-semibold text-gray-900">{course.duration}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Lessons</p>
                  <p className="font-semibold text-gray-900">{typeof course.lessons === 'number' ? course.lessons : course.lessons?.length || 0}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Students</p>
                  <p className="font-semibold text-gray-900">{course.students.toLocaleString()}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">What you'll learn:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-gray-700">Master core concepts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-gray-700">Build real projects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-gray-700">Get certified</span>
                    </li>
                  </ul>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 mt-6">
                  Enroll for ${course.price}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
