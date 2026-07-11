import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Clock, Target, Zap, AlertCircle, CheckCircle } from "lucide-react";

interface AnalyticsData {
  date: string;
  xp: number;
  lessonsCompleted: number;
  timeSpent: number;
}

interface SkillMetric {
  skill: string;
  proficiency: number;
  trend: "up" | "down" | "stable";
}

interface LearningInsight {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const analyticsData: AnalyticsData[] = [
  { date: "Mon", xp: 150, lessonsCompleted: 2, timeSpent: 45 },
  { date: "Tue", xp: 200, lessonsCompleted: 3, timeSpent: 60 },
  { date: "Wed", xp: 180, lessonsCompleted: 2, timeSpent: 50 },
  { date: "Thu", xp: 250, lessonsCompleted: 4, timeSpent: 75 },
  { date: "Fri", xp: 220, lessonsCompleted: 3, timeSpent: 65 },
  { date: "Sat", xp: 300, lessonsCompleted: 5, timeSpent: 90 },
  { date: "Sun", xp: 180, lessonsCompleted: 2, timeSpent: 55 },
];

const skillMetrics: SkillMetric[] = [
  { skill: "Python", proficiency: 75, trend: "up" },
  { skill: "JavaScript", proficiency: 60, trend: "up" },
  { skill: "SQL", proficiency: 45, trend: "stable" },
  { skill: "HTML/CSS", proficiency: 80, trend: "down" },
  { skill: "Algorithms", proficiency: 55, trend: "up" },
];

const learningInsights: LearningInsight[] = [
  {
    title: "Peak Learning Time",
    description: "You're most productive on Saturdays (90 min average)",
    icon: <Clock className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-900",
  },
  {
    title: "Strength",
    description: "HTML/CSS proficiency is 80% - your strongest skill!",
    icon: <CheckCircle className="w-5 h-5" />,
    color: "bg-green-100 text-green-900",
  },
  {
    title: "Area to Focus",
    description: "SQL needs attention - only 45% proficiency",
    icon: <AlertCircle className="w-5 h-5" />,
    color: "bg-yellow-100 text-yellow-900",
  },
  {
    title: "Momentum",
    description: "3 consecutive days of 200+ XP - keep it up!",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-900",
  },
];

const skillDistribution = [
  { name: "Python", value: 25 },
  { name: "JavaScript", value: 20 },
  { name: "HTML/CSS", value: 22 },
  { name: "SQL", value: 18 },
  { name: "Other", value: 15 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export default function LearningAnalytics() {
  const totalXP = analyticsData.reduce((sum, day) => sum + day.xp, 0);
  const totalLessons = analyticsData.reduce((sum, day) => sum + day.lessonsCompleted, 0);
  const totalTime = analyticsData.reduce((sum, day) => sum + day.timeSpent, 0);
  const avgDaily = Math.round(totalXP / analyticsData.length);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Weekly XP</p>
                <p className="text-2xl font-bold text-slate-900">{totalXP}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Lessons</p>
                <p className="text-2xl font-bold text-slate-900">{totalLessons}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Time Spent</p>
                <p className="text-2xl font-bold text-slate-900">{totalTime}m</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Daily Avg</p>
                <p className="text-2xl font-bold text-slate-900">{avgDaily} XP</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {learningInsights.map((insight, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className={`p-4 rounded-lg ${insight.color} flex items-start gap-3`}>
                {insight.icon}
                <div>
                  <p className="font-medium">{insight.title}</p>
                  <p className="text-sm opacity-90">{insight.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="progress">Weekly Progress</TabsTrigger>
          <TabsTrigger value="skills">Skill Proficiency</TabsTrigger>
          <TabsTrigger value="distribution">Time Distribution</TabsTrigger>
        </TabsList>

        {/* Weekly Progress */}
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
              <CardDescription>Your learning activity over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="xp"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="XP Earned"
                  />
                  <Line
                    type="monotone"
                    dataKey="timeSpent"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Time (min)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skill Proficiency */}
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skill Proficiency</CardTitle>
              <CardDescription>Your mastery level in each programming language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillMetrics.map((skill) => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">{skill.skill}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{skill.proficiency}%</span>
                      <Badge
                        variant="outline"
                        className={
                          skill.trend === "up"
                            ? "text-green-600 border-green-300"
                            : skill.trend === "down"
                              ? "text-red-600 border-red-300"
                              : "text-slate-600 border-slate-300"
                        }
                      >
                        {skill.trend === "up" ? "↑" : skill.trend === "down" ? "↓" : "→"}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Distribution */}
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Learning Time Distribution</CardTitle>
              <CardDescription>How you spend your learning time across languages</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
          <CardDescription>Based on your learning patterns and goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-medium text-slate-900 mb-1">📚 Focus on SQL</p>
            <p className="text-sm text-slate-700">
              Your SQL proficiency is 45%. Complete 5 more SQL exercises to reach 60%.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="font-medium text-slate-900 mb-1">⏰ Best Learning Time</p>
            <p className="text-sm text-slate-700">
              Schedule learning sessions on Saturdays when you're most productive.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="font-medium text-slate-900 mb-1">🎯 Next Challenge</p>
            <p className="text-sm text-slate-700">
              Try the "Advanced Algorithms" course to strengthen your problem-solving skills.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
