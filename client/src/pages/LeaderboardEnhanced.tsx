import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Trophy, TrendingUp, Users, Zap, Filter } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  coursesCompleted: number;
  streak: number;
  category?: string;
}

export function LeaderboardEnhanced() {
  const [timeFilter, setTimeFilter] = useState<"weekly" | "monthly" | "alltime">("weekly");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Web Development", "Mobile", "Data Science", "AI/ML", "DevOps"];

  // Mock data for different time periods
  const leaderboardData: Record<string, LeaderboardUser[]> = {
    weekly: [
      {
        rank: 1,
        name: "Alex Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        xp: 12500,
        coursesCompleted: 3,
        streak: 7,
        category: "Web Development",
      },
      {
        rank: 2,
        name: "Sarah Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        xp: 11200,
        coursesCompleted: 2,
        streak: 5,
        category: "Data Science",
      },
      {
        rank: 3,
        name: "Mike Davis",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
        xp: 10800,
        coursesCompleted: 2,
        streak: 6,
        category: "Mobile",
      },
      {
        rank: 4,
        name: "Emma Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        xp: 9500,
        coursesCompleted: 1,
        streak: 4,
        category: "AI/ML",
      },
      {
        rank: 5,
        name: "John Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        xp: 8900,
        coursesCompleted: 1,
        streak: 3,
        category: "DevOps",
      },
    ],
    monthly: [
      {
        rank: 1,
        name: "Alex Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        xp: 45230,
        coursesCompleted: 12,
        streak: 23,
        category: "Web Development",
      },
      {
        rank: 2,
        name: "Sarah Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        xp: 42100,
        coursesCompleted: 10,
        streak: 18,
        category: "Data Science",
      },
      {
        rank: 3,
        name: "Mike Davis",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
        xp: 38900,
        coursesCompleted: 9,
        streak: 15,
        category: "Mobile",
      },
      {
        rank: 4,
        name: "Emma Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        xp: 35600,
        coursesCompleted: 8,
        streak: 12,
        category: "AI/ML",
      },
      {
        rank: 5,
        name: "John Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        xp: 32400,
        coursesCompleted: 7,
        streak: 10,
        category: "DevOps",
      },
    ],
    alltime: [
      {
        rank: 1,
        name: "Alex Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        xp: 245230,
        coursesCompleted: 24,
        streak: 23,
        category: "Web Development",
      },
      {
        rank: 2,
        name: "Sarah Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        xp: 212100,
        coursesCompleted: 21,
        streak: 18,
        category: "Data Science",
      },
      {
        rank: 3,
        name: "Mike Davis",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
        xp: 198900,
        coursesCompleted: 19,
        streak: 15,
        category: "Mobile",
      },
      {
        rank: 4,
        name: "Emma Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        xp: 185600,
        coursesCompleted: 18,
        streak: 12,
        category: "AI/ML",
      },
      {
        rank: 5,
        name: "John Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        xp: 172400,
        coursesCompleted: 16,
        streak: 10,
        category: "DevOps",
      },
    ],
  };

  const getLeaderboardData = () => {
    let data = leaderboardData[timeFilter] || [];

    // Apply category filter
    if (categoryFilter !== "all") {
      data = data.filter((user) => user.category?.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Apply search filter
    if (searchQuery) {
      data = data.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return data;
  };

  const filteredData = getLeaderboardData();

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-slate-900">Leaderboard</h1>
          </div>
          <p className="text-slate-600">Compete with learners worldwide and climb the ranks</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Your Rank</p>
                <p className="text-3xl font-bold text-blue-600">#42</p>
              </div>
              <Trophy className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Your XP</p>
                <p className="text-3xl font-bold text-green-600">45.2K</p>
              </div>
              <Zap className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Streak</p>
                <p className="text-3xl font-bold text-purple-600">23 🔥</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Courses</p>
                <p className="text-3xl font-bold text-orange-600">24</p>
              </div>
              <Users className="w-8 h-8 text-orange-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Users</label>
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Time Tabs */}
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="weekly" onClick={() => setTimeFilter("weekly")}>
              This Week
            </TabsTrigger>
            <TabsTrigger value="monthly" onClick={() => setTimeFilter("monthly")}>
              This Month
            </TabsTrigger>
            <TabsTrigger value="alltime" onClick={() => setTimeFilter("alltime")}>
              All Time
            </TabsTrigger>
          </TabsList>

          {/* Leaderboard Table */}
          <TabsContent value={timeFilter} className="w-full">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Category</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">XP</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Courses</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((user, idx) => (
                      <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-2xl">{getRankBadge(user.rank)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-semibold text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-500">
                                {user.rank === 1 && "🌟 Top Learner"}
                                {user.rank === 2 && "⭐ Rising Star"}
                                {user.rank === 3 && "✨ Achiever"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary">{user.category}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-slate-900">{user.xp.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-slate-900">{user.coursesCompleted}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-orange-600">{user.streak} 🔥</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredData.length === 0 && (
                <div className="p-8 text-center">
                  <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No users found matching your filters</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Your Position */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Position</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-600 mb-1">Rank Change</p>
              <p className="text-2xl font-bold text-green-600">↑ 5 places</p>
              <p className="text-xs text-slate-500">Last week</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">XP to Next Rank</p>
              <p className="text-2xl font-bold text-blue-600">2,500 XP</p>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "60%" }} />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Percentile</p>
              <p className="text-2xl font-bold text-purple-600">Top 15%</p>
              <p className="text-xs text-slate-500">Among all learners</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
