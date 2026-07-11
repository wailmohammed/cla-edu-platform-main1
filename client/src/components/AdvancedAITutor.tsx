import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Sparkles, AlertCircle, Lightbulb, BookOpen, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant" | "hint" | "explanation";
  content: string;
  timestamp: Date;
  type?: "message" | "hint" | "explanation" | "concept";
}

interface AdvancedAITutorProps {
  lessonId?: number;
  topicName?: string;
  isPremium?: boolean;
  difficulty?: "beginner" | "intermediate" | "advanced";
}

export default function AdvancedAITutor({
  lessonId,
  topicName = "Programming",
  isPremium = false,
  difficulty = "beginner",
}: AdvancedAITutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hi! I'm your adaptive AI tutor. I'll help you master ${topicName} at your pace. Ask me questions, request hints, or ask for explanations!`,
      timestamp: new Date(),
      type: "message",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [learningMode, setLearningMode] = useState<"chat" | "step-by-step">("chat");

  if (!isPremium) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Advanced AI Tutor (Premium)</CardTitle>
            </div>
            <Badge className="bg-blue-600">Premium</Badge>
          </div>
          <CardDescription>Adaptive learning with hints and step-by-step guidance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-900">Premium Feature</p>
              <p className="text-xs text-slate-600">Upgrade to access AI tutor with adaptive learning</p>
            </div>
          </div>
          <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      type: "message",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Great question about ${topicName}! Here's an explanation tailored to your ${difficulty} level: [Adaptive response based on your learning style]. Would you like a hint, a step-by-step breakdown, or more examples?`,
        timestamp: new Date(),
        type: "message",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error("Failed to get AI response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestHint = async () => {
    if (hintsUsed >= 3) {
      toast.error("You've used all available hints for this problem");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const hintMessage: Message = {
        id: Date.now().toString(),
        role: "hint",
        content: `💡 Hint ${hintsUsed + 1}/3: Think about the core concept here. Try breaking the problem into smaller parts.`,
        timestamp: new Date(),
        type: "hint",
      };

      setMessages((prev) => [...prev, hintMessage]);
      setHintsUsed((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestExplanation = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const explanationMessage: Message = {
        id: Date.now().toString(),
        role: "explanation",
        content: `📚 Concept Explanation: Let me break down the key concepts step-by-step:\n\n1. **Foundation**: Start with the basics...\n2. **Building Block**: Then understand how it connects...\n3. **Application**: Finally, see how it works in practice...`,
        timestamp: new Date(),
        type: "explanation",
      };

      setMessages((prev) => [...prev, explanationMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: `Hi! I'm your adaptive AI tutor. I'll help you master ${topicName} at your pace. Ask me questions, request hints, or ask for explanations!`,
        timestamp: new Date(),
        type: "message",
      },
    ]);
    setHintsUsed(0);
    setInput("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">Advanced AI Tutor</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {difficulty}
            </Badge>
            <Badge className="bg-blue-600 text-xs">Premium</Badge>
          </div>
        </div>
        <CardDescription>Adaptive learning with hints and personalized guidance</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Learning Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={learningMode === "chat" ? "default" : "outline"}
            size="sm"
            onClick={() => setLearningMode("chat")}
          >
            Chat Mode
          </Button>
          <Button
            variant={learningMode === "step-by-step" ? "default" : "outline"}
            size="sm"
            onClick={() => setLearningMode("step-by-step")}
          >
            Step-by-Step
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-96 border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : message.type === "hint"
                        ? "bg-yellow-50 border border-yellow-200 text-slate-900 rounded-bl-none"
                        : message.type === "explanation"
                          ? "bg-green-50 border border-green-200 text-slate-900 rounded-bl-none"
                          : "bg-white border border-slate-200 text-slate-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-slate-500"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="max-w-xs rounded-lg px-4 py-2 bg-white border border-slate-200 rounded-bl-none">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Hints Counter */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Hints remaining: {3 - hintsUsed}/3</span>
          <div className="w-full bg-slate-200 rounded-full h-2 ml-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((3 - hintsUsed) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRequestHint}
            disabled={isLoading || hintsUsed >= 3}
            className="gap-1"
          >
            <Lightbulb className="w-4 h-4" />
            Hint
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRequestExplanation}
            disabled={isLoading}
            className="gap-1"
          >
            <BookOpen className="w-4 h-4" />
            Explain
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask your tutor a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </Button>
        </div>

        {/* Info */}
        <p className="text-xs text-slate-600 text-center">
          🎯 The AI tutor adapts to your {difficulty} level and learning style. Use hints strategically!
        </p>
      </CardContent>
    </Card>
  );
}
