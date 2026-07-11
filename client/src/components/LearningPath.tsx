import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Lock, Zap, TrendingUp } from "lucide-react";

interface PathNode {
  id: number;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  status: "completed" | "in-progress" | "locked" | "available";
  xpReward: number;
  estimatedTime: number;
  prerequisites: number[];
  progress: number;
}

const mockPath: PathNode[] = [
  {
    id: 1,
    title: "Python Basics",
    description: "Learn variables, data types, and operators",
    difficulty: "beginner",
    status: "completed",
    xpReward: 100,
    estimatedTime: 120,
    prerequisites: [],
    progress: 100,
  },
  {
    id: 2,
    title: "Control Flow",
    description: "Master if/else statements and loops",
    difficulty: "beginner",
    status: "completed",
    xpReward: 120,
    estimatedTime: 90,
    prerequisites: [1],
    progress: 100,
  },
  {
    id: 3,
    title: "Functions & Modules",
    description: "Write reusable code with functions",
    difficulty: "intermediate",
    status: "in-progress",
    xpReward: 150,
    estimatedTime: 150,
    prerequisites: [2],
    progress: 65,
  },
  {
    id: 4,
    title: "Object-Oriented Programming",
    description: "Learn classes, inheritance, and polymorphism",
    difficulty: "intermediate",
    status: "available",
    xpReward: 180,
    estimatedTime: 180,
    prerequisites: [3],
    progress: 0,
  },
  {
    id: 5,
    title: "Data Structures",
    description: "Explore lists, dictionaries, and sets",
    difficulty: "intermediate",
    status: "available",
    xpReward: 160,
    estimatedTime: 140,
    prerequisites: [3],
    progress: 0,
  },
  {
    id: 6,
    title: "Advanced Algorithms",
    description: "Master sorting, searching, and optimization",
    difficulty: "advanced",
    status: "locked",
    xpReward: 250,
    estimatedTime: 240,
    prerequisites: [4, 5],
    progress: 0,
  },
];

const statusIcons = {
  completed: <CheckCircle2 className="w-6 h-6 text-green-500" />,
  "in-progress": <Circle className="w-6 h-6 text-blue-500 animate-pulse" />,
  available: <Circle className="w-6 h-6 text-slate-400" />,
  locked: <Lock className="w-6 h-6 text-slate-400" />,
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

export default function LearningPath() {
  const [nodes] = useState(mockPath);
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);

  const completedCount = nodes.filter((n) => n.status === "completed").length;
  const totalXp = nodes
    .filter((n) => n.status === "completed")
    .reduce((sum, n) => sum + n.xpReward, 0);

  const currentNode = nodes.find((n) => n.status === "in-progress");

  return (
    <div className="w-full space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600 mb-1">Progress</p>
            <p className="text-3xl font-bold text-slate-900 mb-3">
              {completedCount}/{nodes.length}
            </p>
            <Progress value={(completedCount / nodes.length) * 100} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600 mb-1">Total XP Earned</p>
            <p className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-8 h-8 text-yellow-500" />
              {totalXp}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600 mb-1">Current Level</p>
            <p className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              Level 5
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Course */}
      {currentNode && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="text-blue-600">Continue Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">{currentNode.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{currentNode.description}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Progress</span>
                  <span className="font-semibold text-slate-900">{currentNode.progress}%</span>
                </div>
                <Progress value={currentNode.progress} />
              </div>
              <Button className="w-full">Continue Lesson</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Path Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Path</CardTitle>
          <CardDescription>Complete lessons to unlock advanced topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nodes.map((node, idx) => (
              <div key={node.id}>
                {/* Connection Line */}
                {idx < nodes.length - 1 && (
                  <div className="flex justify-center mb-2">
                    <div className="w-1 h-6 bg-slate-200" />
                  </div>
                )}

                {/* Node */}
                <div
                  onClick={() => node.status !== "locked" && setSelectedNode(node)}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    node.status === "locked"
                      ? "bg-slate-50 border-slate-200 cursor-not-allowed opacity-60"
                      : selectedNode?.id === node.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {statusIcons[node.status]}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900">{node.title}</h4>
                        <Badge
                          className={`text-xs capitalize flex-shrink-0 ${
                            difficultyColors[node.difficulty]
                          }`}
                        >
                          {node.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{node.description}</p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span>⏱ {node.estimatedTime}m</span>
                        <span>⭐ {node.xpReward} XP</span>
                        {node.status === "in-progress" && (
                          <span className="text-blue-600 font-semibold">
                            {node.progress}% complete
                          </span>
                        )}
                      </div>

                      {/* Progress Bar for In-Progress */}
                      {node.status === "in-progress" && (
                        <div className="mt-3">
                          <Progress value={node.progress} className="h-1.5" />
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {node.status !== "locked" && (
                      <Button
                        variant={node.status === "completed" ? "outline" : "default"}
                        size="sm"
                        className="flex-shrink-0"
                      >
                        {node.status === "completed"
                          ? "Review"
                          : node.status === "in-progress"
                            ? "Continue"
                            : "Start"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
          <CardDescription>Based on your learning pace and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Adaptive Suggestion:</strong> You're progressing well! Consider taking on
                "Data Structures" alongside "Functions & Modules" to reinforce your learning.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-900">
                <strong>Performance Insight:</strong> Your success rate on intermediate topics is
                78%. Keep up the great work!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
