import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Flame, Zap, Medal, Search, TrendingUp } from "lucide-react";

interface LeaderboardUser {
  id: number;
  name: string;
  avatar?: string;
  totalXP: number;
  level: number;
  currentStreakDays: number;
  longestStreakDays: number;
}

// Mock leaderboard data
const mockLeaderboardByXP: LeaderboardUser[] = [
  { id: 1, name: "Alex Chen", totalXP: 15000, level: 15, currentStreakDays: 45, longestStreakDays: 120 },
  { id: 2, name: "Sarah Johnson", totalXP: 12500, level: 12, currentStreakDays: 32, longestStreakDays: 95 },
  { id: 3, name: "Mike Williams", totalXP: 11200, level: 11, currentStreakDays: 28, longestStreakDays: 85 },
  { id: 4, name: "Emma Davis", totalXP: 10800, level: 10, currentStreakDays: 25, longestStreakDays: 78 },
  { id: 5, name: "James Brown", totalXP: 9500, level: 9, currentStreakDays: 20, longestStreakDays: 65 },
  { id: 6, name: "Lisa Anderson", totalXP: 8900, level: 8, currentStreakDays: 18, longestStreakDays: 58 },
  { id: 7, name: "Tom Martinez", totalXP: 8200, level: 8, currentStreakDays: 15, longestStreakDays: 50 },
  { id: 8, name: "Jessica Lee", totalXP: 7600, level: 7, currentStreakDays: 12, longestStreakDays: 45 },
  { id: 9, name: "David Wilson", totalXP: 6900, level: 6, currentStreakDays: 10, longestStreakDays: 38 },
  { id: 10, name: "Rachel White", totalXP: 6200, level: 6, currentStreakDays: 8, longestStreakDays: 32 },
];

const mockLeaderboardByStreak: LeaderboardUser[] = [
  { id: 1, name: "Alex Chen", totalXP: 15000, level: 15, currentStreakDays: 45, longestStreakDays: 120 },
  { id: 2, name: "Sarah Johnson", totalXP: 12500, level: 12, currentStreakDays: 32, longestStreakDays: 95 },
  { id: 3, name: "Mike Williams", totalXP: 11200, level: 11, currentStreakDays: 28, longestStreakDays: 85 },
  { id: 4, name: "Emma Davis", totalXP: 10800, level: 10, currentStreakDays: 25, longestStreakDays: 78 },
  { id: 5, name: "James Brown", totalXP: 9500, level: 9, currentStreakDays: 20, longestStreakDays: 65 },
].sort((a, b) => b.currentStreakDays - a.currentStreakDays);

const mockLeaderboardByLevel: LeaderboardUser[] = [
  ...mockLeaderboardByXP,
].sort((a, b) => b.level - a.level);

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("xp");

  const getLeaderboardData = () => {
    switch (activeTab) {
      case "xp":
        return mockLeaderboardByXP;
      case "streak":
        return mockLeaderboardByStreak;
      case "level":
        return mockLeaderboardByLevel;
      default:
        return mockLeaderboardByXP;
    }
  };

  const filteredData = getLeaderboardData().filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="text-gray-400 font-semibold">{rank}</span>;
    }
  };

  const getLevelColor = (level: number) => {
    if (level <= 5) return "text-green-500";
    if (level <= 10) return "text-blue-500";
    if (level <= 15) return "text-purple-500";
    return "text-amber-500";
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank === 1) return "default";
    if (rank === 2) return "secondary";
    if (rank === 3) return "outline";
    return "secondary";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
            <h1 className="text-4xl font-bold text-white">Global Leaderboard</h1>
          </div>
          <p className="text-gray-400">Compete with learners worldwide and climb the rankings</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {filteredData.slice(0, 3).map((user, index) => (
            <Card
              key={user.id}
              className={`bg-gradient-to-br ${
                index === 0
                  ? "from-yellow-500/20 to-yellow-600/10 border-yellow-500/50"
                  : index === 1
                  ? "from-gray-400/20 to-gray-500/10 border-gray-400/50"
                  : "from-orange-500/20 to-orange-600/10 border-orange-500/50"
              } animate-in fade-in slide-in-from-bottom-4 duration-500`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">{getMedalIcon(index + 1)}</div>
                  <Avatar className="w-16 h-16 mx-auto border-2 border-white">
                    <AvatarFallback className="text-lg font-bold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-white text-lg">{user.name}</p>
                    <p className={`text-2xl font-bold ${getLevelColor(user.level)}`}>
                      Level {user.level}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-300">{user.totalXP.toLocaleString()} XP</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-300">{user.currentStreakDays} day streak</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search leaderboard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-gray-400"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
              <TabsTrigger value="xp" className="text-gray-300 data-[state=active]:text-white">
                <Zap className="w-4 h-4 mr-2" />
                XP Rankings
              </TabsTrigger>
              <TabsTrigger value="streak" className="text-gray-300 data-[state=active]:text-white">
                <Flame className="w-4 h-4 mr-2" />
                Streaks
              </TabsTrigger>
              <TabsTrigger value="level" className="text-gray-300 data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Levels
              </TabsTrigger>
            </TabsList>

            {/* XP Rankings Tab */}
            <TabsContent value="xp" className="space-y-4">
              <div className="space-y-2">
                {filteredData.slice(3).map((user, index) => (
                  <Card
                    key={user.id}
                    className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/20 animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: `${(index + 3) * 50}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-700">
                          <span className="text-lg font-bold text-gray-300">{index + 4}</span>
                        </div>
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="font-bold">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{user.name}</p>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span>Level {user.level}</span>
                            <span>{user.currentStreakDays} day streak</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-yellow-500">
                            {user.totalXP.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">XP</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Streaks Tab */}
            <TabsContent value="streak" className="space-y-4">
              <div className="space-y-2">
                {filteredData.map((user, index) => (
                  <Card
                    key={user.id}
                    className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/20">
                          <Flame className="w-6 h-6 text-orange-500" />
                        </div>
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="font-bold">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{user.name}</p>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span>Level {user.level}</span>
                            <span>{user.totalXP.toLocaleString()} XP</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-500">
                            {user.currentStreakDays}
                          </p>
                          <p className="text-xs text-gray-400">days</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Levels Tab */}
            <TabsContent value="level" className="space-y-4">
              <div className="space-y-2">
                {filteredData.map((user, index) => (
                  <Card
                    key={user.id}
                    className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-700">
                          <span className="text-lg font-bold text-gray-300">{index + 1}</span>
                        </div>
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="font-bold">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{user.name}</p>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span>{user.totalXP.toLocaleString()} XP</span>
                            <span>{user.currentStreakDays} day streak</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${getLevelColor(user.level)}`}>
                            {user.level}
                          </p>
                          <p className="text-xs text-gray-400">level</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Stats Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Leaderboard Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">{mockLeaderboardByXP.length}</p>
                <p className="text-sm text-gray-400 mt-2">Active Learners</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-500">
                  {Math.max(...mockLeaderboardByXP.map((u) => u.currentStreakDays))}
                </p>
                <p className="text-sm text-gray-400 mt-2">Longest Active Streak</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-500">
                  {Math.max(...mockLeaderboardByXP.map((u) => u.level))}
                </p>
                <p className="text-sm text-gray-400 mt-2">Highest Level</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
