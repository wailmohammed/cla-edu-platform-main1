import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Trophy, Flame, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/DashboardLayout";

export default function Leaderboard() {
  const { data: weeklyLeaderboard, isLoading: loadingWeekly } = trpc.leaderboard.getWeekly.useQuery({
    limit: 100,
  });
  const { data: monthlyLeaderboard, isLoading: loadingMonthly } = trpc.leaderboard.getMonthly.useQuery({
    limit: 100,
  });
  const { data: allTimeLeaderboard, isLoading: loadingAllTime } = trpc.leaderboard.getAllTime.useQuery({
    limit: 100,
  });

  const LeaderboardTable = ({ data, isLoading }: { data: any[] | undefined; isLoading: boolean }) => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-slate-600">No rankings available yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {data.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-12 text-center">
              {index === 0 && <Trophy className="w-6 h-6 text-yellow-500 mx-auto" />}
              {index === 1 && <Trophy className="w-6 h-6 text-slate-400 mx-auto" />}
              {index === 2 && <Trophy className="w-6 h-6 text-orange-600 mx-auto" />}
              {index > 2 && <span className="font-bold text-slate-600">#{index + 1}</span>}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900">{`User ${entry.userId}`}</p>
              <p className="text-sm text-slate-600">Level {Math.floor((entry.totalXP || 0) / 1000) + 1}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-right">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold text-slate-900">{entry.totalXP || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-semibold text-slate-900">0</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-2 py-6">
        {/* Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-slate-900">Global Leaderboard</h1>
          </div>
          <p className="text-slate-600">Compete with learners worldwide and climb the ranks</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Top Scorer This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {weeklyLeaderboard?.[0]?.totalXP || 0} XP
              </div>
              <p className="text-xs text-slate-600 mt-1">User {weeklyLeaderboard?.[0]?.userId || "—"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Longest Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {monthlyLeaderboard?.length || 0} days
              </div>
              <p className="text-xs text-slate-600 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Learners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">50K+</div>
              <p className="text-xs text-slate-600 mt-1">Active this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Rankings</CardTitle>
            <CardDescription>See how you stack up against other learners</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="weekly">This Week</TabsTrigger>
                <TabsTrigger value="monthly">This Month</TabsTrigger>
                <TabsTrigger value="all-time">All Time</TabsTrigger>
              </TabsList>

              <TabsContent value="weekly" className="mt-6">
                <LeaderboardTable data={weeklyLeaderboard} isLoading={loadingWeekly} />
              </TabsContent>

              <TabsContent value="monthly" className="mt-6">
                <LeaderboardTable data={monthlyLeaderboard} isLoading={loadingMonthly} />
              </TabsContent>

              <TabsContent value="all-time" className="mt-6">
                <LeaderboardTable data={allTimeLeaderboard} isLoading={loadingAllTime} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Challenge Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Challenge Your Friends</h2>
          <p className="mb-6 opacity-90">Send challenges to friends and compete on specific courses</p>
          <Button className="bg-white text-blue-600 hover:bg-slate-100">
            Invite Friends
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
