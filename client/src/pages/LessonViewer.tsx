import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Zap, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Streamdown } from "streamdown";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import CodeEditor from "@/components/CodeEditor";
import Quiz from "@/components/Quiz";
import AIPremiumTutor from "@/components/AIPremiumTutor";
import TutorOverlay from "@/components/TutorOverlay";

export default function LessonViewer() {
  const [, navigate] = useLocation() as any;
  const { user } = useAuth();
  const params = useParams();
  const lessonId = Number(params?.id) || 1;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showTutor, setShowTutor] = useState(false);

  const { data: subscription } = trpc.subscription.getStatus.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: lesson, isLoading: loadingLesson } = trpc.lessons.getById.useQuery({ id: lessonId });
  const { data: exercises, isLoading: loadingExercises } = trpc.exercises.listByLesson.useQuery(
    { lessonId },
    { enabled: !!lessonId }
  );
  const { data: completion } = trpc.progress.getLessonCompletion.useQuery(
    { lessonId },
    { enabled: !!user && !!lessonId }
  );

  const currentExercise = exercises?.[currentExerciseIndex];

  if (loadingLesson) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-slate-600 mb-4">Lesson not found</p>
            <Button onClick={() => navigate("/courses")}>Back to Courses</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/courses")}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{lesson.title}</h1>
              <p className="text-sm text-slate-600">Lesson {lesson.displayOrder}</p>
            </div>
          </div>
          {completion && (completion as any)?.completed && (
            <Badge className="gap-2 bg-green-100 text-green-800">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </Badge>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="theory" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="theory">Theory</TabsTrigger>
                <TabsTrigger value="exercises">
                  Exercises ({exercises?.length || 0})
                </TabsTrigger>
              </TabsList>

              {/* Theory Tab */}
              <TabsContent value="theory" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lesson Content</CardTitle>
                    <CardDescription>{lesson.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <Streamdown>
{lesson.theoryContent || `# ${lesson.title}

## Overview
This lesson covers the fundamentals of ${lesson.title}.

## Key Concepts
- Concept 1
- Concept 2
- Concept 3

## Example
\`\`\`python
# Example code
def hello():
    print("Hello, World!")
\`\`\`

## Summary
Master these concepts to progress to the next lesson.`}
                    </Streamdown>
                  </CardContent>
                </Card>

                {/* Quiz Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Quiz</CardTitle>
                    <CardDescription>Test your understanding</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium mb-3">What is the main topic of this lesson?</p>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                          <input type="radio" name="quiz" className="w-4 h-4" />
                          <span className="text-sm">{lesson.title}</span>
                        </label>
                        <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                          <input type="radio" name="quiz" className="w-4 h-4" />
                          <span className="text-sm">Something else</span>
                        </label>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => toast.success("Answer submitted! +10 XP")}>Submit Answer</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Exercises Tab */}
              <TabsContent value="exercises" className="space-y-6">
                {loadingExercises ? (
                  <Skeleton className="h-96 w-full" />
                ) : exercises && exercises.length > 0 ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>{currentExercise?.title || "Exercise"}</CardTitle>
                        <CardDescription>{currentExercise?.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm">
                          <p className="text-slate-600"># Problem Statement</p>
                          <p className="text-slate-700 mt-2">{currentExercise?.description}</p>
                        </div>

                        {/* Code Editor */}
                        <CodeEditor
                          language="python"
                          defaultCode={`# ${currentExercise?.title || "Solve this problem"}
# ${currentExercise?.description || ""}

def solve():
    pass`}
                          testCases={[
                            {
                              input: "test input",
                              expectedOutput: "expected output",
                              description: "Test case 1",
                            },
                          ]}
                        />
                      </CardContent>
                    </Card>

                    {/* Exercise Progress */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        Exercise {currentExerciseIndex + 1} of {exercises?.length || 0}
                      </p>
                    </div>

                    {/* Exercise Navigation */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                        disabled={currentExerciseIndex === 0}
                        className="gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <span className="text-sm text-slate-600">
                        Exercise {currentExerciseIndex + 1} of {exercises.length}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentExerciseIndex(Math.min(exercises.length - 1, currentExerciseIndex + 1))
                        }
                        disabled={currentExerciseIndex === exercises.length - 1}
                        className="gap-2"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <Card>
                    <CardContent className="pt-12 text-center">
                      <p className="text-slate-600">No exercises available for this lesson</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lesson Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lesson Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">~15 minutes</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-slate-600">+100 XP reward</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{exercises?.length || 0} exercises</span>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Completion</span>
                    <span className="text-sm text-slate-600">
                      {completion && (completion as any)?.completed ? "100%" : "0%"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: completion && (completion as any)?.completed ? "100%" : "0%" }}
                    />
                  </div>
                </div>
                {!completion || !(completion as any)?.completed && (
                  <Button className="w-full" size="sm"
                    onClick={() => toast.success("Lesson marked complete! +100 XP 🎉")}>
                    Complete Lesson
                  </Button>
                )}
               </CardContent>
             </Card>

              {/* AI Tutor (Premium) */}
              <AIPremiumTutor
                lessonId={lessonId}
                topicName={lesson?.title || "Programming"}
                isPremium={subscription?.plan === "premium"}
                userCode={currentExercise?.description || ""}
                lessonContent={lesson?.theoryContent || ""}
              />

              {/* Tips */}
             <Card>
               <CardHeader>
                 <CardTitle className="text-base">💡 Tips</CardTitle>
               </CardHeader>
               <CardContent>
                 <ul className="text-sm text-slate-600 space-y-2">
                   <li>• Read the theory carefully</li>
                   <li>• Try the exercises yourself first</li>
                   <li>• Don't skip the quiz</li>
                   <li>• Ask for help if stuck</li>
                 </ul>
                 {subscription?.plan === "premium" && (
                   <Button
                     className="w-full mt-4"
                     size="sm"
                     onClick={() => setShowTutor(true)}
                   >
                     <Sparkles className="w-4 h-4 mr-2" />
                     Ask Koji for Help
                   </Button>
                 )}
               </CardContent>
             </Card>
           </div>
         </div>
       </main>

       {/* Floating Tutor Overlay */}
       <TutorOverlay
         isOpen={showTutor}
         onClose={() => setShowTutor(false)}
         topic={lesson?.title || "Programming"}
         userCode={currentExercise?.description || ""}
       />
     </div>
   );
 }
