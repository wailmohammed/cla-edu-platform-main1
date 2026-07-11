import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Zap, BookOpen, HelpCircle, Lightbulb, Target } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface TutorSession {
  id: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  messages: Message[];
  createdAt: Date;
}

export default function AITutorPage() {
  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const topics = [
    { name: "Python Basics", icon: "🐍", description: "Learn Python fundamentals" },
    { name: "JavaScript ES6+", icon: "⚡", description: "Modern JavaScript features" },
    { name: "React Hooks", icon: "⚛️", description: "React hooks and state management" },
    { name: "SQL Queries", icon: "🗄️", description: "Database queries and optimization" },
    { name: "Web Design", icon: "🎨", description: "CSS and responsive design" },
    { name: "Data Structures", icon: "📊", description: "Arrays, linked lists, trees, graphs" },
    { name: "Algorithms", icon: "🔍", description: "Sorting, searching, dynamic programming" },
    { name: "API Design", icon: "🔌", description: "RESTful APIs and GraphQL" },
  ];

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  const createNewSession = (topic: string, difficulty: "beginner" | "intermediate" | "advanced") => {
    const newSession: TutorSession = {
      id: `session-${Date.now()}`,
      topic,
      difficulty,
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I'm your AI tutor. I'm here to help you learn ${topic} at a ${difficulty} level. What would you like to know?`,
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    };

    setSessions([...sessions, newSession]);
    setCurrentSessionId(newSession.id);
    setSelectedTopic("");
    toast.success(`Started ${topic} session!`);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !currentSession) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    // Update session with user message
    setSessions(
      sessions.map((s) =>
        s.id === currentSessionId
          ? { ...s, messages: [...s.messages, userMessage] }
          : s
      )
    );

    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        `That's a great question about ${currentSession.topic}! Let me explain...`,
        `I can help you with that. Here's what you need to know...`,
        `Excellent point! Let me break this down for you...`,
        `That's a common misconception. Actually...`,
        `Great follow-up! Let me provide more context...`,
      ];

      const aiMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date(),
      };

      setSessions(
        sessions.map((s) =>
          s.id === currentSessionId
            ? { ...s, messages: [...s.messages, aiMessage] }
            : s
        )
      );

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-500 animate-bounce" />
            <h1 className="text-4xl font-bold text-white">AI Tutor</h1>
          </div>
          <p className="text-gray-400">Get personalized learning assistance powered by AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Topics and Sessions */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topics.map((topic) => (
                  <Button
                    key={topic.name}
                    onClick={() => {
                      setSelectedTopic(topic.name);
                      createNewSession(topic.name, selectedDifficulty);
                    }}
                    variant="outline"
                    className="w-full justify-start border-slate-600 text-gray-300 hover:text-white text-sm"
                  >
                    <span className="mr-2">{topic.icon}</span>
                    {topic.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            {sessions.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sessions.map((session) => (
                    <Button
                      key={session.id}
                      onClick={() => setCurrentSessionId(session.id)}
                      variant={currentSessionId === session.id ? "default" : "outline"}
                      className="w-full justify-start text-sm"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {session.topic}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            {currentSession ? (
              <Card className="bg-slate-800 border-slate-700 h-[600px] flex flex-col">
                <CardHeader className="border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{currentSession.topic}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {currentSession.difficulty} level
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {currentSession.difficulty}
                    </Badge>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto space-y-4 py-4">
                  {currentSession.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 text-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700 text-gray-200 px-4 py-2 rounded-lg">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Input */}
                <div className="border-t border-slate-700 p-4 space-y-3">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask your question..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 resize-none"
                      rows={2}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">
                    💡 Tip: Ask follow-up questions to dive deeper into topics
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-12 pb-12 text-center space-y-6">
                  <div className="flex justify-center">
                    <HelpCircle className="w-16 h-16 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Start a Learning Session
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Select a topic from the left to begin your personalized tutoring session
                    </p>
                  </div>

                  {/* Quick Start Topics */}
                  <div className="grid grid-cols-2 gap-3 mt-8">
                    {topics.slice(0, 4).map((topic) => (
                      <Button
                        key={topic.name}
                        onClick={() => createNewSession(topic.name, "beginner")}
                        variant="outline"
                        className="border-slate-600 text-gray-300 hover:text-white h-auto py-3 flex flex-col items-center gap-2"
                      >
                        <span className="text-2xl">{topic.icon}</span>
                        <span className="text-sm">{topic.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Lightbulb className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Personalized Learning</h3>
                  <p className="text-sm text-gray-400">
                    Get explanations tailored to your learning level
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Target className="w-8 h-8 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Interactive Sessions</h3>
                  <p className="text-sm text-gray-400">
                    Ask questions and get instant feedback
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <BookOpen className="w-8 h-8 text-purple-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Multiple Topics</h3>
                  <p className="text-sm text-gray-400">
                    Learn from programming to data science
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
