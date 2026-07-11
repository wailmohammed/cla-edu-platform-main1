import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Flame, Trophy, Award, BookOpen, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import StreakCalendar from "@/components/StreakCalendar";
import SpacedRepetitionWidget from "@/components/SpacedRepetitionWidget";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { data: courseProgress, isLoading: loadingProgress } = trpc.progress.listCourseProgress.useQuery();
  const { data: stats } = trpc.gamification.getStats.useQuery();
  const { data: subscription } = trpc.subscription.getStatus.useQuery();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-2 py-6">
        {/* Page heading */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-600">Welcome back, {user?.name}!</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">{subscription?.plan === "premium" ? "Premium" : "Free"}</p>
            <p className="text-xs text-slate-600">Plan</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats?.currentStreak || 0}</div>
              <p className="text-xs text-slate-600 mt-1">days</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Total XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats?.totalXP || 0}</div>
              <p className="text-xs text-slate-600 mt-1">Level {stats?.level || 1}</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-500" />
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats?.badgesCount || 0}</div>
              <p className="text-xs text-slate-600 mt-1">earned</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-green-500" />
                Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats?.certificatesCount || 0}</div>
              <p className="text-xs text-slate-600 mt-1">completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Streak Calendar & Spaced Repetition */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <StreakCalendar
              currentStreak={stats?.currentStreak || 0}
              longestStreak={stats?.longestStreak || 0}
              freezeDaysRemaining={stats?.freezeDaysRemaining || 2}
              activityDates={[]}
            />
          </div>
          <div>
            <SpacedRepetitionWidget />
          </div>
        </div>

        {/* Course Progress Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Your Courses</h2>
            <Button variant="outline" onClick={() => navigate("/courses")}>
              Browse More Courses
            </Button>
          </div>

          {loadingProgress ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-2 w-full mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : courseProgress && courseProgress.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseProgress.map((progress: any) => (
                <Card
                  key={progress.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/course/${progress.courseId}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">Course {progress.courseId}</CardTitle>
                    <CardDescription>
                      {progress.completedLessons} of {progress.totalLessons} lessons
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(progress as any).progressPercentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">{Math.round(Number((progress as any).progressPercentage))}%</span>
                        <Badge
                          variant={
                            (progress as any)?.status === "completed"
                              ? "default"
                              : (progress as any)?.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {(progress as any)?.status || "not-started"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="pt-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">You haven't started any courses yet</p>
                <Button onClick={() => navigate("/courses")}>Start Learning</Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Badges Section */}
        {stats && stats.badgesCount > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(stats.badgesCount)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="text-xs text-slate-600 text-center">Badge {i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates Section */}
        {stats && stats.certificatesCount > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Certificates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(stats.certificatesCount)].map((_, i) => (
                <Card key={i} className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Certificate of Completion</CardTitle>
                    <CardDescription>Certificate {i + 1}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4">Issued: {new Date().toLocaleDateString()}</p>
                    <Button variant="outline" size="sm">
                      Download Certificate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
