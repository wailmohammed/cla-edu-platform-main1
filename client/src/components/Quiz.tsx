import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, totalQuestions: number) => void;
  title?: string;
}

export default function Quiz({ questions, onComplete, title = "Quiz" }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer");
      return;
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz complete
      const score = newAnswers.filter(
        (answer, index) => answer === questions[index].correctAnswer
      ).length;
      setShowResults(true);
      if (onComplete) {
        onComplete(score, questions.length);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(null));
    setShowResults(false);
    setSelectedAnswer(null);
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 text-center">
          <p className="text-slate-600">No questions available</p>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const score = answers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
          <CardDescription>{title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${passed ? "text-green-600" : "text-orange-600"}`}>
              {percentage}%
            </div>
            <div className={`text-xl font-semibold ${passed ? "text-green-600" : "text-orange-600"}`}>
              {passed ? "Great job! You passed!" : "Keep practicing!"}
            </div>
            <p className="text-slate-600">
              You got {score} out of {questions.length} questions correct
            </p>
          </div>

          {/* Detailed Results */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">Review Your Answers</h3>
            {questions.map((question, index) => {
              const isCorrect = answers[index] === question.correctAnswer;
              return (
                <div
                  key={question.id}
                  className={`p-4 border rounded-lg ${
                    isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 mb-2">{question.question}</p>
                      <p className="text-sm text-slate-600 mb-2">
                        Your answer: <span className="font-medium">{question.options[answers[index] || 0]}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-slate-600">
                          Correct answer: <span className="font-medium text-green-600">
                            {question.options[question.correctAnswer]}
                          </span>
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-sm text-slate-600 mt-2 italic">
                          💡 {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRestart} className="gap-2 flex-1">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
            <Button className="flex-1">Continue Learning</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              Question {currentQuestion + 1} of {questions.length}
            </CardDescription>
          </div>
          <div className="text-sm font-medium text-slate-600">
            {Math.round(progress)}%
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{question.question}</h3>

          {/* Options */}
          <RadioGroup value={selectedAnswer?.toString() || ""} onValueChange={(value) => handleSelectAnswer(parseInt(value))}>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1 font-normal">
                    {option}
                  </Label>
                </label>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button onClick={handleNext} className="flex-1">
            {currentQuestion === questions.length - 1 ? "Submit Quiz" : "Next Question"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
