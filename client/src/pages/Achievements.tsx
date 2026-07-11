import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Share2, Lock, Star, Award, Zap, Target, Users, Flame } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

export function Achievements() {
  const [activeTab, setActiveTab] = useState("earned");

  const allAchievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "🚀",
      points: 10,
      rarity: "common",
      earned: true,
      unlockedAt: "2026-05-01",
    },
    {
      id: 2,
      name: "Fast Learner",
      description: "Complete 5 courses in 30 days",
      icon: "⚡",
      points: 50,
      rarity: "rare",
      earned: true,
      unlockedAt: "2026-05-15",
    },
    {
      id: 3,
      name: "Code Master",
      description: "Solve 100 code challenges",
      icon: "🧠",
      points: 100,
      rarity: "epic",
      earned: false,
      progress: 42,
      target: 100,
    },
    {
      id: 4,
      name: "Consistent",
      description: "Maintain a 30-day learning streak",
      icon: "🔥",
      points: 75,
      rarity: "rare",
      earned: true,
      unlockedAt: "2026-05-20",
    },
    {
      id: 5,
      name: "Problem Solver",
      description: "Get 10 correct solutions in a row",
      icon: "🎯",
      points: 40,
      rarity: "uncommon",
      earned: false,
      progress: 8,
      target: 10,
    },
    {
      id: 6,
      name: "Rising Star",
      description: "Reach top 10% of leaderboard",
      icon: "⭐",
      points: 150,
      rarity: "legendary",
      earned: false,
      progress: 42,
      target: 5346,
    },
    {
      id: 7,
      name: "Mentor",
      description: "Help 10 other learners",
      icon: "👨‍🏫",
      points: 80,
      rarity: "rare",
      earned: false,
      progress: 3,
      target: 10,
    },
    {
      id: 8,
      name: "Perfectionist",
      description: "Score 100% on 5 challenges",
      icon: "💯",
      points: 60,
      rarity: "uncommon",
      earned: false,
      progress: 2,
      target: 5,
    },
  ];

  const earnedAchievements = allAchievements.filter((a) => a.earned);
  const lockedAchievements = allAchievements.filter((a) => !a.earned);

  const rarityColors = {
    common: "bg-gray-100 text-gray-700 border-gray-300",
    uncommon: "bg-green-100 text-green-700 border-green-300",
    rare: "bg-blue-100 text-blue-700 border-blue-300",
    epic: "bg-purple-100 text-purple-700 border-purple-300",
    legendary: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  const AchievementCard = ({ achievement }: { achievement: any }) => (
    <Card className={`p-6 text-center transition-all hover:shadow-lg ${achievement.earned ? "" : "opacity-60"}`}>
      <div className="text-5xl mb-4">{achievement.icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{achievement.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>

      {achievement.earned ? (
        <div className="space-y-3">
          <Badge className={`${rarityColors[achievement.rarity as keyof typeof rarityColors]} border`}>
            {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
          </Badge>
          <p className="text-sm font-semibold text-gray-900">+{achievement.points} points</p>
          <p className="text-xs text-gray-600">Unlocked {achievement.unlockedAt}</p>
          <Button size="sm" variant="outline" className="w-full gap-2"
            onClick={async () => {
              const text = `I earned the "${achievement.name}" badge on Codelearnify! 🏆`;
              if (navigator.share) {
                await navigator.share({ title: achievement.name, text, url: window.location.origin });
              } else {
                navigator.clipboard.writeText(text);
                toast.success("Copied to clipboard!");
              }
            }}>
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Badge className={`${rarityColors[achievement.rarity as keyof typeof rarityColors]} border`}>
            {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
          </Badge>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Progress</span>
              <span>
                {achievement.progress}/{achievement.target}
              </span>
            </div>
            <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
          </div>
          <p className="text-sm font-semibold text-gray-900">+{achievement.points} points</p>
        </div>
      )}
    </Card>
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Award className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Achievements</h1>
              <p className="text-purple-100">Unlock badges and earn rewards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Achievements Earned</p>
                <p className="text-3xl font-bold text-gray-900">{earnedAchievements.length}</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Points</p>
                <p className="text-3xl font-bold text-gray-900">
                  {earnedAchievements.reduce((sum, a) => sum + a.points, 0)}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Completion</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round((earnedAchievements.length / allAchievements.length) * 100)}%
                </p>
              </div>
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Locked</p>
                <p className="text-3xl font-bold text-gray-900">{lockedAchievements.length}</p>
              </div>
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="earned">Earned ({earnedAchievements.length})</TabsTrigger>
            <TabsTrigger value="locked">Locked ({lockedAchievements.length})</TabsTrigger>
          </TabsList>

          {/* Earned Achievements */}
          <TabsContent value="earned">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {earnedAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>

          {/* Locked Achievements */}
          <TabsContent value="locked">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {lockedAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Achievement Tips */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Tips to Unlock More Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <Target className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Complete Courses</h4>
                <p className="text-sm text-gray-600">Finish courses to unlock course-specific achievements</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Flame className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Build Streaks</h4>
                <p className="text-sm text-gray-600">Learn every day to maintain your learning streak</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Help Others</h4>
                <p className="text-sm text-gray-600">Mentor other learners and unlock social achievements</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
