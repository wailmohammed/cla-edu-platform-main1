import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Zap, Trophy, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";

export function LearningProgress() {
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const [displayXP, setDisplayXP] = useState(0);
  const [displayLevel, setDisplayLevel] = useState(1);

  // Animate XP counter
  useEffect(() => {
    if (!user?.totalXP) return;
    
    const interval = setInterval(() => {
      setDisplayXP((prev) => {
        const target = user.totalXP || 0;
        const increment = Math.ceil((target - prev) / 20);
        return Math.min(prev + increment, target);
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [user?.totalXP]);

  // Animate level change
  useEffect(() => {
    if (!user?.level) return;
    
    const timeout = setTimeout(() => {
      setDisplayLevel(user.level || 1);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [user?.level]);

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="h-6 bg-blue-200 rounded animate-pulse w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-blue-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-blue-200 rounded animate-pulse w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate XP progress to next level (assuming 1000 XP per level)
  const xpPerLevel = 1000;
  const currentLevelXP = (user.totalXP || 0) % xpPerLevel;
  const xpProgress = (currentLevelXP / xpPerLevel) * 100;

  // Level color based on level
  const getLevelColor = (level: number) => {
    if (level <= 5) return "text-green-600";
    if (level <= 10) return "text-blue-600";
    if (level <= 20) return "text-purple-600";
    return "text-amber-600";
  };

  // Level badge variant
  const getLevelBadgeVariant = (level: number) => {
    if (level <= 5) return "default";
    if (level <= 10) return "secondary";
    return "destructive";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Main Progress Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 md:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 animate-pulse" />
            Your Learning Progress
          </CardTitle>
          <CardDescription>Track your growth and achievements</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Level and XP Overview */}
          <div className="grid grid-cols-3 gap-4">
            {/* Level - with scale animation */}
            <div className="bg-white rounded-lg p-4 border border-blue-100 transition-all duration-500 hover:shadow-lg hover:scale-105">
              <p className="text-xs font-medium text-slate-600 mb-2">Current Level</p>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
                <span className={`text-3xl font-bold ${getLevelColor(displayLevel)} transition-all duration-500 tabular-nums`}>
                  {displayLevel}
                </span>
              </div>
            </div>

            {/* Total XP - with animated counter */}
            <div className="bg-white rounded-lg p-4 border border-blue-100 transition-all duration-500 hover:shadow-lg hover:scale-105">
              <p className="text-xs font-medium text-slate-600 mb-2">Total XP</p>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
                <span className="text-2xl font-bold text-yellow-600 tabular-nums transition-all duration-300">
                  {displayXP.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Current Streak - with flame animation */}
            <div className="bg-white rounded-lg p-4 border border-blue-100 transition-all duration-500 hover:shadow-lg hover:scale-105">
              <p className="text-xs font-medium text-slate-600 mb-2">Current Streak</p>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 animate-bounce" />
                <span className="text-2xl font-bold text-orange-600 tabular-nums">
                  {user.currentStreakDays || 0}
                </span>
                <span className="text-xs text-slate-500">days</span>
              </div>
            </div>
          </div>

          {/* XP Progress to Next Level - with smooth animation */}
          <div className="bg-white rounded-lg p-4 border border-blue-100 space-y-3 transition-all duration-500 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Progress to Level {displayLevel + 1}</p>
              <span className="text-xs font-semibold text-slate-600 transition-all duration-300">
                {Math.round(xpProgress)}%
              </span>
            </div>
            <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${xpProgress}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
            </div>
            <p className="text-xs text-slate-500">
              {Math.max(0, xpPerLevel - currentLevelXP)} XP needed for next level
            </p>
          </div>

          {/* Streak Information */}
          <div className="bg-white rounded-lg p-4 border border-blue-100 space-y-2 transition-all duration-500 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Longest Streak</p>
              <Badge variant="outline" className="text-orange-600 border-orange-300 transition-all duration-300 hover:scale-110">
                {user.longestStreakDays || 0} days
              </Badge>
            </div>
            <p className="text-xs text-slate-600">
              {user.freezeDaysRemaining || 0} freeze days remaining this month
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats - with stagger animation */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
        <CardHeader>
          <CardTitle className="text-base">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between transition-all duration-300 hover:translate-x-1">
            <span className="text-sm text-slate-600">Onboarding</span>
            <Badge variant={user.onboardingCompleted ? "default" : "secondary"}>
              {user.onboardingCompleted ? "Complete" : "Pending"}
            </Badge>
          </div>
          <div className="flex items-center justify-between transition-all duration-300 hover:translate-x-1">
            <span className="text-sm text-slate-600">Account Age</span>
            <span className="text-sm font-semibold text-slate-900 tabular-nums">
              {user.createdAt
                ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                : 0}{" "}
              days
            </span>
          </div>
          <div className="flex items-center justify-between transition-all duration-300 hover:translate-x-1">
            <span className="text-sm text-slate-600">Last Active</span>
            <span className="text-sm font-semibold text-slate-900">
              {user.lastActivityDate
                ? new Date(user.lastActivityDate).toLocaleDateString()
                : "Never"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Milestone Tracker - with stagger animation */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
        <CardHeader>
          <CardTitle className="text-base">Milestones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Level 5", achieved: (user.level || 1) >= 5 },
            { label: "Level 10", achieved: (user.level || 1) >= 10 },
            { label: "1000 XP", achieved: (user.totalXP || 0) >= 1000 },
            { label: "7-Day Streak", achieved: (user.longestStreakDays || 0) >= 7 },
          ].map((milestone, index) => (
            <div 
              key={milestone.label} 
              className="flex items-center gap-2 transition-all duration-300 hover:translate-x-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  milestone.achieved 
                    ? "bg-purple-500 scale-125 shadow-lg shadow-purple-300" 
                    : "bg-slate-300"
                }`}
              />
              <span className={`text-sm transition-all duration-300 ${milestone.achieved ? "text-slate-900 font-medium" : "text-slate-500"}`}>
                {milestone.label}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
