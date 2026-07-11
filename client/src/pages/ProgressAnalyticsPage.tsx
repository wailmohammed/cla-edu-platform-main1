import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target, Award, Clock, Zap } from "lucide-react";

interface CourseProgress {
  name: string;
  progress: number;
  lessons: number;
  completed: number;
  difficulty: string;
}

interface LearningStats {
  totalHours: number;
  lessonsCompleted: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
}

const mockCourseProgress: CourseProgress[] = [
  { name: "Python Basics", progress: 85, lessons: 20, completed: 17, difficulty: "Beginner" },
  { name: "JavaScript ES6+", progress: 60, lessons: 25, completed: 15, difficulty: "Intermediate" },
  { name: "React Hooks", progress: 40, lessons: 30, completed: 12, difficulty: "Advanced" },
  { name: "SQL Mastery", progress: 75, lessons: 18, completed: 14, difficulty: "Intermediate" },
  { name: "Web Design", progress: 90, lessons: 15, completed: 14, difficulty: "Beginner" },
];

const mockStats: LearningStats = {
  totalHours: 156,
  lessonsCompleted: 72,
  averageScore: 87.5,
  currentStreak: 32,
  longestStreak: 45,
};

const weeklyData = [
  { day: "Mon", hours: 2.5, lessons: 3 },
  { day: "Tue", hours: 3.0, lessons: 4 },
  { day: "Wed", hours: 1.5, lessons: 2 },
  { day: "Thu", hours: 4.0, lessons: 5 },
  { day: "Fri", hours: 2.0, lessons: 3 },
  { day: "Sat", hours: 3.5, lessons: 4 },
  { day: "Sun", hours: 2.5, lessons: 3 },
];

const topicsData = [
  { topic: "Python", percentage: 25, color: "bg-blue-500" },
  { topic: "JavaScript", percentage: 20, color: "bg-yellow-500" },
  { topic: "React", percentage: 18, color: "bg-cyan-500" },
  { topic: "SQL", percentage: 15, color: "bg-green-500" },
  { topic: "Web Design", percentage: 22, color: "bg-purple-500" },
];

export default function ProgressAnalyticsPage() {
  const maxHours = Math.max(...weeklyData.map((d) => d.hours));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-500 animate-bounce" />
            <h1 className="text-4xl font-bold text-white">Learning Analytics</h1>
          </div>
          <p className="text-gray-400">Track your progress and learning insights</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 animate-in fade-in slide-in-from-left-4 duration-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{mockStats.totalHours}</p>
                <p className="text-sm text-gray-400 mt-1">Total Hours</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{mockStats.lessonsCompleted}</p>
                <p className="text-sm text-gray-400 mt-1">Lessons Done</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{mockStats.averageScore}%</p>
                <p className="text-sm text-gray-400 mt-1">Avg Score</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{mockStats.currentStreak}</p>
                <p className="text-sm text-gray-400 mt-1">Current Streak</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 animate-in fade-in slide-in-from-left-4 duration-500 delay-400">
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{mockStats.longestStreak}</p>
                <p className="text-sm text-gray-400 mt-1">Best Streak</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
            <TabsTrigger value="courses" className="text-gray-300 data-[state=active]:text-white">
              Course Progress
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-gray-300 data-[state=active]:text-white">
              Weekly Activity
            </TabsTrigger>
            <TabsTrigger value="topics" className="text-gray-300 data-[state=active]:text-white">
              Topic Distribution
            </TabsTrigger>
          </TabsList>

          {/* Course Progress Tab */}
          <TabsContent value="courses" className="space-y-4">
            {mockCourseProgress.map((course, index) => (
              <Card
                key={course.name}
                className="bg-slate-800 border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{course.name}</h3>
                        <p className="text-sm text-gray-400">
                          {course.completed}/{course.lessons} lessons completed
                        </p>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {course.difficulty}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white font-semibold">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Weekly Activity Tab */}
          <TabsContent value="weekly" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Weekly Learning Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {weeklyData.map((day, index) => (
                  <div
                    key={day.day}
                    className="animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{day.day}</span>
                      <span className="text-sm text-gray-400">
                        {day.hours}h • {day.lessons} lessons
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="bg-blue-500 rounded-full h-8 transition-all duration-300 hover:bg-blue-600"
                        style={{ width: `${(day.hours / maxHours) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-blue-500">
                    {weeklyData.reduce((acc, d) => acc + d.hours, 0).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">Total Hours This Week</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-green-500">
                    {weeklyData.reduce((acc, d) => acc + d.lessons, 0)}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">Total Lessons This Week</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Topic Distribution Tab */}
          <TabsContent value="topics" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Learning by Topic</CardTitle>
                <CardDescription className="text-gray-400">
                  Distribution of your learning time across topics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {topicsData.map((item, index) => (
                  <div
                    key={item.topic}
                    className="animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{item.topic}</span>
                      <span className="text-sm text-gray-400">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pie Chart Alternative */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Topic Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {topicsData.map((item) => (
                    <div key={item.topic} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-300">
                        {item.topic} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recommendations */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3 p-3 bg-slate-700 rounded-lg">
              <div className="text-2xl">💡</div>
              <div>
                <p className="font-semibold text-white">Continue React Hooks</p>
                <p className="text-sm text-gray-400">You're 40% through. Keep the momentum!</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-slate-700 rounded-lg">
              <div className="text-2xl">🎯</div>
              <div>
                <p className="font-semibold text-white">Challenge: 100-Day Streak</p>
                <p className="text-sm text-gray-400">You're 32 days in. 68 more to go!</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-slate-700 rounded-lg">
              <div className="text-2xl">🏆</div>
              <div>
                <p className="font-semibold text-white">Unlock Advanced Badge</p>
                <p className="text-sm text-gray-400">Complete 5 more advanced courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
