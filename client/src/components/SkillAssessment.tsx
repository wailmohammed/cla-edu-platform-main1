import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Brain, TrendingUp, Target, BookOpen, Award } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  topic: string;
}

interface SkillAssessmentProps {
  topic: string;
  questions: Question[];
  onComplete?: (results: {
    score: number;
    total: number;
    level: "beginner" | "intermediate" | "advanced";
    weakAreas: string[];
    strongAreas: string[];
  }) => void;
}

export default function SkillAssessment({ topic, questions, onComplete }: SkillAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<Array<{ questionId: number; correct: boolean; topic: string }>>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    if (isComplete && onComplete) {
      const correctCount = results.filter((r) => r.correct).length;
      const percentage = correctCount / questions.length;

      let determinedLevel: "beginner" | "intermediate" | "advanced" = "beginner";
      if (percentage >= 0.8) determinedLevel = "advanced";
      else if (percentage >= 0.5) determinedLevel = "intermediate";

      setLevel(determinedLevel);

      const topicPerformance = results.reduce((acc, result) => {
        acc[result.topic] = acc[result.topic] || { correct: 0, total: 0 };
        acc[result.topic].total++;
        if (result.correct) acc[result.topic].correct++;
        return acc;
      }, {} as Record<string, { correct: number; total: number }>);

      const weakAreas = Object.entries(topicPerformance)
        .filter(([, stats]) => stats.correct / stats.total < 0.5)
        .map(([topic]) => topic);

      const strongAreas = Object.entries(topicPerformance)
        .filter(([, stats]) => stats.correct / stats.total >= 0.8)
        .map(([topic]) => topic);

      onComplete({
        score: correctCount,
        total: questions.length,
        level: determinedLevel,
        weakAreas,
        strongAreas,
      });
    }
  }, [isComplete, results, questions.length, onComplete]);

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const correct = answerIndex === question.correctAnswer;
    if (correct) setScore((prev) => prev + 1);

    setResults((prev) => [
      ...prev,
      {
        questionId: question.id,
        correct,
        topic: question.topic,
      },
    ]);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsComplete(true);
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setResults([]);
    setIsComplete(false);
  };

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Assessment Complete
          </CardTitle>
          <CardDescription>Your {topic} skill level</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={percentage >= 70 ? "#22c55e" : percentage >= 40 ? "#eab308" : "#ef4444"}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${percentage * 3.52} 352`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{percentage}%</span>
              </div>
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900">
                {score}/{questions.length} Correct
              </p>
              <Badge className="mt-2" variant={level === "advanced" ? "default" : level === "intermediate" ? "secondary" : "outline"}>
                {level.charAt(0).toUpperCase() + level.slice(1)} Level
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Recommended Path</p>
                <p className="text-sm text-slate-600">
                  {level === "advanced"
                    ? "You're ready for advanced topics and real-world projects."
                    : level === "intermediate"
                      ? "Focus on intermediate exercises and build practical projects."
                      : "Start with the fundamentals and practice daily with guided exercises."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Next Steps</p>
                <p className="text-sm text-slate-600">
                  Complete daily exercises and review concepts you found challenging.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={restart} variant="outline" className="flex-1">
              Retake Assessment
            </Button>
            <Button onClick={() => window.location.href = "/courses"} className="flex-1">
              Start Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              {topic} Assessment
            </CardTitle>
            <CardDescription>
              Question {currentQuestion + 1} of {questions.length}
            </CardDescription>
          </div>
          <Badge variant="outline">
            Score: {score}/{questions.length}
          </Badge>
        </div>
        <Progress value={progress} />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={question.difficulty === "advanced" ? "destructive" : question.difficulty === "intermediate" ? "default" : "secondary"}>
              {question.difficulty}
            </Badge>
            <span className="text-sm text-slate-600">{question.topic}</span>
          </div>

          <p className="text-lg font-medium text-slate-900">{question.question}</p>

          <div className="space-y-2">
            {question.options.map((option: string, idx: number) => {
              let variant: "default" | "outline" | "destructive" | "secondary" = "outline";

              if (isAnswered) {
                if (idx === question.correctAnswer) variant = "default";
                else if (idx === selectedAnswer) variant = "destructive";
                else variant = "outline";
              }

              return (
                <Button
                  key={idx}
                  variant={variant}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className="w-full justify-start text-left h-auto py-3 px-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm">{option}</span>
                    {isAnswered && idx === question.correctAnswer && (
                      <CheckCircle2 className="w-4 h-4 text-white ml-auto" />
                    )}
                    {isAnswered && idx === selectedAnswer && idx !== question.correctAnswer && (
                      <XCircle className="w-4 h-4 text-white ml-auto" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
              <p className="text-sm font-medium text-blue-900">
                {selectedAnswer === question.correctAnswer ? "Correct!" : "Incorrect"}
              </p>
              <p className="text-sm text-blue-800">{question.explanation}</p>
              <Button onClick={handleNext} className="w-full mt-3">
                {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
