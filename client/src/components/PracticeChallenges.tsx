import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Trophy, Clock, Users } from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  xpReward: number;
  timeLimit: number;
  attempts: number;
  successRate: number;
  participants: number;
  completed: boolean;
}

const mockChallenges: Challenge[] = [
  {
    id: 1,
    title: "Fibonacci Sequence",
    description: "Write a function to generate the nth Fibonacci number",
    difficulty: "easy",
    category: "Algorithms",
    xpReward: 50,
    timeLimit: 15,
    attempts: 3,
    successRate: 87,
    participants: 1250,
    completed: true,
  },
  {
    id: 2,
    title: "Binary Search Tree",
    description: "Implement a binary search tree with insert and search operations",
    difficulty: "medium",
    category: "Data Structures",
    xpReward: 150,
    timeLimit: 45,
    attempts: 5,
    successRate: 62,
    participants: 890,
    completed: false,
  },
  {
    id: 3,
    title: "Dynamic Programming",
    description: "Solve the longest common subsequence problem",
    difficulty: "hard",
    category: "Algorithms",
    xpReward: 250,
    timeLimit: 60,
    attempts: 10,
    successRate: 34,
    participants: 450,
    completed: false,
  },
  {
    id: 4,
    title: "String Manipulation",
    description: "Reverse a string and check for palindromes",
    difficulty: "easy",
    category: "Strings",
    xpReward: 40,
    timeLimit: 10,
    attempts: 2,
    successRate: 94,
    participants: 2100,
    completed: true,
  },
];

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

export default function PracticeChallenges() {
  const [challenges, setChallenges] = useState(mockChallenges);
  const [filter, setFilter] = useState<"all" | "easy" | "medium" | "hard">("all");

  const filteredChallenges = challenges.filter(
    (c) => filter === "all" || c.difficulty === filter
  );

  const stats = {
    completed: challenges.filter((c) => c.completed).length,
    totalXp: challenges
      .filter((c) => c.completed)
      .reduce((sum, c) => sum + c.xpReward, 0),
    streak: 7,
  };

  return (
    <div className="w-full space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Challenges Completed</p>
                <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
              </div>
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">XP Earned</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalXp}</p>
              </div>
              <Zap className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Current Streak</p>
                <p className="text-3xl font-bold text-slate-900">{stats.streak} days</p>
              </div>
              <div className="text-4xl">🔥</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "easy", "medium", "hard"] as const).map((difficulty) => (
          <Button
            key={difficulty}
            variant={filter === difficulty ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(difficulty)}
            className="capitalize"
          >
            {difficulty}
          </Button>
        ))}
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                {/* Challenge Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{challenge.title}</h3>
                    {challenge.completed && (
                      <Badge variant="secondary" className="text-xs">
                        ✓ Completed
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 mb-3">{challenge.description}</p>

                  {/* Difficulty and Category */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`text-xs capitalize ${difficultyColors[challenge.difficulty]}`}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {challenge.category}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-slate-600">XP Reward</p>
                      <p className="font-semibold text-slate-900 flex items-center gap-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        {challenge.xpReward}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Time Limit</p>
                      <p className="font-semibold text-slate-900 flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {challenge.timeLimit}m
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Success Rate</p>
                      <p className="font-semibold text-slate-900">{challenge.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Participants</p>
                      <p className="font-semibold text-slate-900 flex items-center gap-1">
                        <Users className="w-4 h-4 text-purple-500" />
                        {challenge.participants}
                      </p>
                    </div>
                  </div>

                  {/* Success Rate Progress */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600">Success Rate</span>
                      <span className="text-xs font-semibold text-slate-900">
                        {challenge.successRate}%
                      </span>
                    </div>
                    <Progress value={challenge.successRate} className="h-2" />
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  <Button
                    variant={challenge.completed ? "outline" : "default"}
                    className="whitespace-nowrap"
                  >
                    {challenge.completed ? "Retry" : "Start"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leaderboard Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Challenge Leaderboard
          </CardTitle>
          <CardDescription>Top performers this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { rank: 1, name: "Alex Chen", score: 2450, badge: "🥇" },
              { rank: 2, name: "Jordan Smith", score: 2180, badge: "🥈" },
              { rank: 3, name: "Morgan Lee", score: 1950, badge: "🥉" },
              { rank: 4, name: "Casey Johnson", score: 1750, badge: "4️⃣" },
              { rank: 5, name: "You", score: 1420, badge: "5️⃣" },
            ].map((entry) => (
              <div key={entry.rank} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{entry.badge}</span>
                  <div>
                    <p className="font-semibold text-slate-900">{entry.name}</p>
                    <p className="text-xs text-slate-600">Rank #{entry.rank}</p>
                  </div>
                </div>
                <p className="font-bold text-slate-900">{entry.score} pts</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
