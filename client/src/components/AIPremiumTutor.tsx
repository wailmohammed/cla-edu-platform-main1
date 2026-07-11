import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Sparkles, AlertCircle, Mic, MicOff, Lightbulb, BookOpen, Target } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIPremiumTutorProps {
  lessonId?: number;
  topicName?: string;
  isPremium?: boolean;
  userCode?: string;
  lessonContent?: string;
}

export default function AIPremiumTutor({
  lessonId,
  topicName = "Programming",
  isPremium = false,
  userCode = "",
  lessonContent = "",
}: AIPremiumTutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hi! I'm your AI tutor. I can see you're learning about ${topicName}. What would you like to explore?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const chatMutation = trpc.aiTutor.chat.useMutation();
  const hintMutation = trpc.aiTutor.getHint.useMutation();
  const analyzeMutation = trpc.aiTutor.analyzeCode.useMutation();

  if (!isPremium) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">AI Tutor (Premium)</CardTitle>
            </div>
            <Badge className="bg-blue-600">Premium</Badge>
          </div>
          <CardDescription>Get personalized help from our AI tutor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-900">Premium Feature</p>
              <p className="text-xs text-slate-600">Upgrade to access personalized AI tutoring</p>
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
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      const result = await chatMutation.mutateAsync({
        message: input,
        topic: topicName,
        userCode,
        lessonContent,
        history,
      });

      if (result.success && result.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        toast.error("Failed to get AI response");
      }
    } catch (error) {
      toast.error("Failed to get AI response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetHint = async () => {
    if (hintMutation.isPending) return;

    setIsLoading(true);
    try {
      const result = await hintMutation.mutateAsync({
        topic: topicName,
        userCode,
        lessonContent,
        hintLevel: "moderate",
      });

      if (result.success && result.hint) {
        const hintMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `💡 Hint: ${result.hint}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, hintMessage]);
      }
    } catch (error) {
      toast.error("Failed to get hint");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeCode = async () => {
    if (!userCode.trim() || analyzeMutation.isPending) return;

    setIsLoading(true);
    try {
      const result = await analyzeMutation.mutateAsync({
        code: userCode,
        language: "python",
      });

      if (result.success && result.feedback) {
        const feedbackMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `📝 Code Review: ${result.feedback}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, feedbackMessage]);
      }
    } catch (error) {
      toast.error("Failed to analyze code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Voice input not supported in this browser");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Voice input failed");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Tutor</CardTitle>
              <CardDescription className="text-xs">Ask me anything about {topicName}</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleGetHint}
              disabled={isLoading}
              className="text-xs gap-1"
            >
              <Lightbulb className="w-3 h-3" />
              Hint
            </Button>
            {userCode && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleAnalyzeCode}
                disabled={isLoading}
                className="text-xs gap-1"
              >
                <BookOpen className="w-3 h-3" />
                Review Code
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 min-h-0">
        {/* Messages */}
        <ScrollArea className="flex-1 border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div className="space-y-4" id="chat-messages">
            {messages.map((message, idx) => (
              <div
                key={message.id || idx}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
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
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-[80%] rounded-lg px-4 py-3 bg-white border border-slate-200">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInput("Can you explain this concept to me?")}
            className="text-xs"
          >
            Explain concept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInput("I'm stuck, can you help?")}
            className="text-xs"
          >
            I'm stuck
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleGetHint}
            disabled={isLoading}
            className="text-xs gap-1"
          >
            <Lightbulb className="w-3 h-3" />
            Give me a hint
          </Button>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleVoiceInput}
            disabled={isLoading}
            className={isListening ? "text-red-500 animate-pulse" : "text-slate-400"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Input
            placeholder="Ask your tutor anything..."
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
            {isLoading ? (
              <Skeleton className="h-4 w-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Info */}
        <p className="text-xs text-slate-500 text-center">
          <Sparkles className="w-3 h-3 inline mr-1" />
          Your AI tutor can see what you're working on and provide contextual help
        </p>
      </CardContent>
    </Card>
  );
}
