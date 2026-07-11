import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Flame, Clock, Trophy, TrendingUp, Bell, Settings } from "lucide-react";

export function StreakNotifications() {
  const [reminderTime, setReminderTime] = useState("09:00");
  const [timezone, setTimezone] = useState("UTC");
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [quietHoursStart, setQuietHoursStart] = useState("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00");

  const streakStatsQuery = trpc.streakNotifications.getStreakStats.useQuery();
  const streakSettingsQuery = trpc.streakNotifications.getStreakSettings.useQuery();
  const milestonesQuery = trpc.streakNotifications.getStreakMilestones.useQuery();
  const leaderboardQuery = trpc.streakNotifications.getStreakLeaderboard.useQuery({
    limit: 10,
    period: "alltime",
  });
  const insightsQuery = trpc.streakNotifications.getStreakInsights.useQuery();

  const updatePreferencesMutation = trpc.streakNotifications.updateStreakPreferences.useMutation({
    onSuccess: () => {
      toast.success("Preferences updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update preferences");
    },
  });

  const recordActivityMutation = trpc.streakNotifications.recordLearningActivity.useMutation({
    onSuccess: (data) => {
      toast.success(`Great! You earned ${data.totalXPEarned} XP!`);
    },
    onError: () => {
      toast.error("Failed to record activity");
    },
  });

  const handleUpdatePreferences = async () => {
    await updatePreferencesMutation.mutateAsync({
      remindersEnabled,
      reminderTime,
      timezone,
      quietHoursStart,
      quietHoursEnd,
      notificationChannels: ["push", "email"],
    });
  };

  const handleRecordActivity = async () => {
    await recordActivityMutation.mutateAsync({
      courseId: "course_1",
      duration: 30,
      type: "lesson",
    });
  };

  const stats = streakStatsQuery.data;
  const milestones = milestonesQuery.data?.milestones || [];
  const leaderboard = leaderboardQuery.data?.leaderboard || [];
  const insights = insightsQuery.data?.insights || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Flame className="w-8 h-8 text-orange-500" />
              Learning Streaks
            </h1>
            <p className="text-gray-600 mt-1">Keep your learning momentum going with streak tracking and reminders</p>
          </div>
        </div>

        {/* Main Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{stats.currentStreak}</div>
                <p className="text-xs text-gray-500 mt-1">days in a row</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Longest Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{stats.longestStreak}</div>
                <p className="text-xs text-gray-500 mt-1">personal best</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Days Learned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats.totalDaysLearned}</div>
                <p className="text-xs text-gray-500 mt-1">total days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Next Milestone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.nextMilestone}</div>
                <p className="text-xs text-gray-500 mt-1">{stats.daysUntilMilestone} days away</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Customize how and when you receive streak reminders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Enable Reminders */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Enable Reminders</p>
                    <p className="text-sm text-gray-500">Get daily reminders to maintain your streak</p>
                  </div>
                  <Switch checked={remindersEnabled} onCheckedChange={setRemindersEnabled} />
                </div>

                {remindersEnabled && (
                  <>
                    {/* Reminder Time */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Reminder Time</label>
                      <div className="flex gap-2">
                        <Input
                          type="time"
                          value={reminderTime}
                          onChange={(e) => setReminderTime(e.target.value)}
                          className="flex-1"
                        />
                        <Select value={timezone} onValueChange={setTimezone}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="EST">EST</SelectItem>
                            <SelectItem value="CST">CST</SelectItem>
                            <SelectItem value="MST">MST</SelectItem>
                            <SelectItem value="PST">PST</SelectItem>
                            <SelectItem value="IST">IST</SelectItem>
                            <SelectItem value="SGT">SGT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Quiet Hours */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Quiet Hours</label>
                      <p className="text-xs text-gray-500 mb-2">No reminders during these hours</p>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-gray-600">From</label>
                          <Input
                            type="time"
                            value={quietHoursStart}
                            onChange={(e) => setQuietHoursStart(e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-600">To</label>
                          <Input
                            type="time"
                            value={quietHoursEnd}
                            onChange={(e) => setQuietHoursEnd(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Button onClick={handleUpdatePreferences} className="w-full bg-orange-600 hover:bg-orange-700">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>

            {/* Record Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Record Learning Activity
                </CardTitle>
                <CardDescription>Log your learning to maintain your streak</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleRecordActivity}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={recordActivityMutation.isPending}
                >
                  {recordActivityMutation.isPending ? "Recording..." : "Record 30-min Lesson"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Streak Milestones
                </CardTitle>
                <CardDescription>Unlock badges and rewards as you reach streak milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      milestone.achieved
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-orange-600">{milestone.days}</span>
                          <div>
                            <p className="font-medium text-gray-900">Day Streak</p>
                            <p className="text-sm text-gray-600">{milestone.reward}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={milestone.achieved ? "default" : "outline"}>
                          {milestone.achieved ? "✓ Achieved" : `+${milestone.xp} XP`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Streak Leaderboard
                </CardTitle>
                <CardDescription>See how your streak compares to other learners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-lg font-bold text-gray-400 w-8">{entry.rank}</div>
                        <div>
                          <p className="font-medium text-gray-900">{entry.name}</p>
                          <Badge variant="secondary" className="mt-1">
                            {entry.badge} Badge
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">{entry.streak}</div>
                        <p className="text-xs text-gray-500">day streak</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Learning Insights
                </CardTitle>
                <CardDescription>Personalized recommendations to improve your learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                    <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                    <p className="text-sm text-blue-600 font-medium">💡 {insight.recommendation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default StreakNotifications;
