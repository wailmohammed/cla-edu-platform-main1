import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Zap } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

interface QuizResult {
  questionId: string;
  userAnswer: number;
  isCorrect: boolean;
  xpEarned: number;
}

interface MiniQuizProps {
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  chatHistory: Array<{ role: string; content: string }>;
  onComplete: (results: QuizResult[], totalXP: number) => void;
}

export default function MiniQuizGenerator({
  topic,
  difficulty,
  chatHistory,
  onComplete,
}: MiniQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<QuizResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Generate quiz based on chat history
  const generateQuiz = async () => {
    setIsLoading(true);

    // Mock quiz generation - in production, this would call an LLM
    const mockQuestions: Question[] = [
      {
        id: "q1",
        question: `What is the primary purpose of ${topic} in modern development?`,
        options: [
          "To improve code readability",
          "To enhance performance",
          "To simplify complex problems",
          "All of the above",
        ],
        correctAnswer: 3,
        explanation: `${topic} serves multiple purposes including readability, performance, and problem-solving.`,
        difficulty: "easy",
      },
      {
        id: "q2",
        question: `How would you implement best practices for ${topic}?`,
        options: [
          "Follow community standards",
          "Use established patterns",
          "Test thoroughly",
          "All of the above",
        ],
        correctAnswer: 3,
        explanation: "Best practices involve following standards, patterns, and thorough testing.",
        difficulty: "medium",
      },
      {
        id: "q3",
        question: `What are advanced considerations for ${topic}?`,
        options: [
          "Scalability and performance",
          "Security and maintainability",
          "Testing and documentation",
          "All of the above",
        ],
        correctAnswer: 3,
        explanation: "Advanced implementations consider all aspects of development.",
        difficulty: "hard",
      },
    ];

    setQuestions(mockQuestions);
    setIsLoading(false);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    const xpEarned = isCorrect
      ? currentQuestion.difficulty === "easy"
        ? 10
        : currentQuestion.difficulty === "medium"
          ? 25
          : 50
      : 0;

    const result: QuizResult = {
      questionId: currentQuestion.id,
      userAnswer: optionIndex,
      isCorrect,
      xpEarned,
    };

    setUserAnswers([...userAnswers, result]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleCompleteQuiz = () => {
    const totalXP = userAnswers.reduce((sum, result) => sum + result.xpEarned, 0);
    onComplete(userAnswers, totalXP);
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
    generateQuiz();
  };

  if (questions.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Mini Quiz: {topic}
          </h3>
          <p className="text-gray-600 mb-6">
            Test your knowledge with personalized questions based on our conversation
          </p>
          <div className="flex gap-2 justify-center mb-4">
            <Badge className="bg-purple-100 text-purple-800">
              {difficulty}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              3 questions
            </Badge>
          </div>
          <Button
            onClick={generateQuiz}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 px-8"
          >
            {isLoading ? "Generating..." : "Start Quiz"}
          </Button>
        </div>
      </Card>
    );
  }

  if (showResults) {
    const totalXP = userAnswers.reduce((sum, result) => sum + result.xpEarned, 0);
    const correctCount = userAnswers.filter((r) => r.isCorrect).length;
    const score = Math.round((correctCount / userAnswers.length) * 100);

    return (
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>
          <div className="flex justify-center gap-8 my-6">
            <div>
              <p className="text-4xl font-bold text-green-600">{score}%</p>
              <p className="text-gray-600">Score</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-600">+{totalXP}</p>
              <p className="text-gray-600">XP Earned</p>
            </div>
          </div>
        </div>

        {/* Results Details */}
        <div className="space-y-4 mb-6">
          {userAnswers.map((result, index) => {
            const question = questions.find((q) => q.id === result.questionId);
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-2">
                      {question?.question}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Your answer: <span className="font-medium">{question?.options[result.userAnswer]}</span>
                    </p>
                    {!result.isCorrect && (
                      <p className="text-sm text-gray-600 mb-2">
                        Correct answer: <span className="font-medium text-green-600">{question?.options[question.correctAnswer]}</span>
                      </p>
                    )}
                    <p className="text-sm text-gray-600 italic">{question?.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            onClick={handleCompleteQuiz}
            className="bg-green-600 hover:bg-green-700 px-8"
          >
            Claim Rewards
          </Button>
          <Button
            onClick={handleRetakeQuiz}
            variant="outline"
            className="px-8"
          >
            Retake Quiz
          </Button>
        </div>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <Badge className={`${
            currentQuestion.difficulty === "easy"
              ? "bg-green-100 text-green-800"
              : currentQuestion.difficulty === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}>
            {currentQuestion.difficulty}
          </Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        {currentQuestion.question}
      </h3>

      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              </div>
              <span className="text-gray-800">{option}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center text-sm text-gray-600">
        Take your time. Think about what you learned in our conversation.
      </div>
    </Card>
  );
}
