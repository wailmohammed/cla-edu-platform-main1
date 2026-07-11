import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { TrendingUp, Award, Zap, Target, Download, Share2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AnalyticsData {
  date: string;
  xp: number;
  lessonsCompleted: number;
  quizScore: number;
}

interface TopicData {
  name: string;
  value: number;
  lessons: number;
}

interface WeeklyActivity {
  day: string;
  hours: number;
  lessons: number;
}

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

const topicDistribution: TopicData[] = [
  { name: "React",      value: 2500, lessons: 25 },
  { name: "Python",     value: 1800, lessons: 18 },
  { name: "JavaScript", value: 2200, lessons: 22 },
  { name: "SQL",        value: 1200, lessons: 12 },
  { name: "CSS",        value:  900, lessons:  9 },
];

const weeklyActivity: WeeklyActivity[] = [
  { day: "Mon", hours: 2,   lessons: 3 },
  { day: "Tue", hours: 3,   lessons: 4 },
  { day: "Wed", hours: 1.5, lessons: 2 },
  { day: "Thu", hours: 2.5, lessons: 3 },
  { day: "Fri", hours: 3.5, lessons: 5 },
  { day: "Sat", hours: 4,   lessons: 6 },
  { day: "Sun", hours: 2,   lessons: 3 },
];

export default function ProgressAnalyticsEnhanced() {
  const { data: statsData } = trpc.gamification.getStats.useQuery();
  const { data: courseProgress } = trpc.progress.listCourseProgress.useQuery();

  const xpGrowthData: AnalyticsData[] = useMemo(() => {
    const data: AnalyticsData[] = [];
    const base = new Date();
    for (let i = 30; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      data.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        xp: Math.floor(Math.random() * 500) + 200,
        lessonsCompleted: Math.floor(Math.random() * 5) + 1,
        quizScore: Math.floor(Math.random() * 40) + 60,
      });
    }
    return data;
  }, []);

  const stats = [
    { label: "Total XP",      value: statsData?.totalXP?.toLocaleString() ?? "0", icon: Zap,        color: "bg-yellow-100 text-yellow-600" },
    { label: "Current Level", value: String(statsData?.level ?? 1),               icon: TrendingUp, color: "bg-blue-100 text-blue-600"   },
    { label: "Streak Days",   value: String(statsData?.currentStreak ?? 0),        icon: Award,      color: "bg-red-100 text-red-600"     },
    { label: "Badges Earned", value: String(statsData?.badgesCount ?? 0),          icon: Target,     color: "bg-green-100 text-green-600" },
  ];

  const handleExportPDF = () => {
    toast.info("Opening print dialog — choose 'Save as PDF'");
    window.print();
  };

  const handleShare = async () => {
    const text = `I've earned ${statsData?.totalXP ?? 0} XP and reached Level ${statsData?.level ?? 1} on Codelearnify! 🚀`;
    const url  = window.location.origin + "/analytics";
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Learning Progress", text, url });
        return;
      } catch { /* user cancelled or not supported */ }
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    toast.success("Progress link copied to clipboard!");
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-2 py-6 print:px-0">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-1">Learning Analytics</h1>
            <p className="text-gray-600">Track your learning progress and achievements</p>
          </div>
          <div className="flex gap-3 print:hidden">
            <Button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Download className="w-4 h-4" />
              Export as PDF
            </Button>
            <Button onClick={handleShare} variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Progress
            </Button>
          </div>
        </div>

        {/* Stats — real DB data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Real course progress */}
        {courseProgress && courseProgress.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Course Progress</h2>
            <div className="space-y-4">
              {courseProgress.map((p: any) => (
                <div key={p.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Course #{p.courseId}</span>
                    <span className="text-gray-500">{Math.round(Number(p.progressPercentage))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Number(p.progressPercentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">XP Growth Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={xpGrowthData}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="xp" stroke="#3b82f6" fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Learning by Topic</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topicDistribution}
                  cx="50%" cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  dataKey="value"
                >
                  {topicDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hours"   fill="#3b82f6" name="Learning Hours"     />
                <Bar dataKey="lessons" fill="#8b5cf6" name="Lessons Completed"  />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quiz Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={xpGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone" dataKey="quizScore"
                  stroke="#10b981" name="Average Score"
                  dot={false} activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Topic table */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Detailed Topic Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Topic","Lessons","Total XP","Progress","Status"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topicDistribution.map((topic, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{topic.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{topic.lessons}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{topic.value.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(topic.value / 2500) * 100}%` }} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">In Progress</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
}
