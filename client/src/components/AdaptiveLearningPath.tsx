import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Lock, Play, BookOpen, Trophy, Flame, Zap, Target } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface LearningStep {
  id: string;
  title: string;
  description: string;
  type: "lesson" | "exercise" | "quiz" | "project";
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  prerequisites: string[];
  completed: boolean;
  locked: boolean;
  estimatedMinutes: number;
}

interface AdaptiveLearningPathProps {
  topic: string;
  userLevel: "beginner" | "intermediate" | "advanced";
  onComplete?: () => void;
}

export default function AdaptiveLearningPath({ topic, userLevel, onComplete }: AdaptiveLearningPathProps) {
  const [steps, setSteps] = useState<LearningStep[]>([]);
  const [currentStep, setCurrentStep] = useState<LearningStep | null>(null);
  const [totalXP, setTotalXP] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const generatePath = async () => {
      const generatedSteps: LearningStep[] = [
          {
            id: "1",
            title: `Introduction to ${topic}`,
            description: "Learn the fundamentals and core concepts",
            type: "lesson",
            difficulty: "beginner",
            xpReward: 50,
            prerequisites: [],
            completed: false,
            locked: false,
            estimatedMinutes: 15,
          },
          {
            id: "2",
            title: "Basic Syntax & Patterns",
            description: "Practice writing basic code patterns",
            type: "exercise",
            difficulty: "beginner",
            xpReward: 75,
            prerequisites: ["1"],
            completed: false,
            locked: false,
            estimatedMinutes: 20,
          },
          {
            id: "3",
            title: "Knowledge Check",
            description: "Test your understanding with a quiz",
            type: "quiz",
            difficulty: "beginner",
            xpReward: 25,
            prerequisites: ["2"],
            completed: false,
            locked: false,
            estimatedMinutes: 10,
          },
          {
            id: "4",
            title: "Intermediate Concepts",
            description: "Deepen your understanding with advanced topics",
            type: "lesson",
            difficulty: "intermediate",
            xpReward: 100,
            prerequisites: ["3"],
            completed: false,
            locked: true,
            estimatedMinutes: 25,
          },
          {
            id: "5",
            title: "Build a Project",
            description: "Apply your skills to a real-world project",
            type: "project",
            difficulty: "intermediate",
            xpReward: 200,
            prerequisites: ["4"],
            completed: false,
            locked: true,
            estimatedMinutes: 45,
          },
          {
            id: "6",
            title: "Advanced Techniques",
            description: "Master expert-level patterns and optimizations",
            type: "lesson",
            difficulty: "advanced",
            xpReward: 150,
            prerequisites: ["5"],
            completed: false,
            locked: true,
            estimatedMinutes: 30,
          },
        ];

        setSteps(generatedSteps);
        const firstUnlocked = generatedSteps.find((s) => !s.locked && !s.completed);
        if (firstUnlocked) setCurrentStep(firstUnlocked);
      };

    generatePath();
  }, [topic, userLevel]);

  const completeStep = (stepId: string) => {
    setSteps((prev) => {
      const updated = prev.map((step) => {
        if (step.id === stepId) {
          return { ...step, completed: true };
        }

        if (step.prerequisites.includes(stepId) && !step.locked) {
          return { ...step, locked: false };
        }

        return step;
      });

      const nextStep = updated.find((s) => !s.completed && !s.locked);
      if (nextStep) setCurrentStep(nextStep);

      const completed = updated.filter((s) => s.completed);
      setCompletedCount(completed.length);
      setTotalXP(completed.reduce((sum, s) => sum + s.xpReward, 0));

      if (completed.length === updated.length) {
        onComplete?.();
      }

      return updated;
    });
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return <BookOpen className="w-5 h-5" />;
      case "exercise":
        return <Zap className="w-5 h-5" />;
      case "quiz":
        return <Trophy className="w-5 h-5" />;
      case "project":
        return <Flame className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const overallProgress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Your Learning Path
            </CardTitle>
            <CardDescription>
              Personalized journey to master {topic}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">{totalXP} XP</p>
            <p className="text-xs text-slate-600">{completedCount}/{steps.length} completed</p>
          </div>
        </div>
        <Progress value={overallProgress} />
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className={`relative flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                step.completed
                  ? "bg-green-50 border-green-200"
                  : step.locked
                    ? "bg-slate-50 border-slate-200 opacity-60"
                    : currentStep?.id === step.id
                      ? "bg-blue-50 border-blue-300 shadow-md"
                      : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Step indicator */}
              <div className="flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : step.locked
                        ? "bg-slate-300 text-slate-500"
                        : "bg-blue-500 text-white"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : step.locked ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    getStepIcon(step.type)
                  )}
                </div>
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-medium ${step.locked ? "text-slate-500" : "text-slate-900"}`}>
                    {step.title}
                  </h3>
                  <Badge variant="outline" className={`text-xs ${getDifficultyColor(step.difficulty)}`}>
                    {step.difficulty}
                  </Badge>
                </div>

                <p className="text-sm text-slate-600 mb-2">{step.description}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    +{step.xpReward} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {step.estimatedMinutes} min
                  </span>
                  <span className="capitalize">{step.type}</span>
                </div>

                {!step.completed && !step.locked && currentStep?.id === step.id && (
                  <Button
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => completeStep(step.id)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start {step.type}
                  </Button>
                )}

                {step.completed && (
                  <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                    Completed
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
