import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";

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
}

export default function AITutorEnhanced() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTutorTyping, setIsTutorTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [showNewSession, setShowNewSession] = useState(false);

  useEffect(() => {
    const demoSession: TutorSession = {
      id: "demo-1",
      topic: "React Hooks",
      difficulty: "intermediate",
      messages: [
        {
          id: "1",
          role: "assistant",
          content: "Hello! I'm your AI tutor. I'm here to help you learn React Hooks. What would you like to know?",
          timestamp: new Date(),
        },
      ],
    };
    setSessions([demoSession]);
    setActiveSessionId(demoSession.id);
    setMessages(demoSession.messages);
    setShowNewSession(false);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const tutorMutation = {
    mutateAsync: async (data: any) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return "That's a great question! Let me explain this concept step by step...";
    },
  };
  const createSessionMutation = {
    mutateAsync: async (data: any) => ({
      id: Date.now().toString(),
      topic: data.topic,
      difficulty: data.difficulty,
      messages: [],
    }),
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTutorTyping]);

  const handleCreateSession = async () => {
    if (!selectedTopic.trim()) return;
    try {
      setIsLoading(true);
      const session = await createSessionMutation.mutateAsync({ topic: selectedTopic, difficulty });
      setSessions([...sessions, session]);
      setActiveSessionId(session.id);
      setMessages([]);
      setShowNewSession(false);
      setSelectedTopic("");
    } catch (error) {
      console.error("Failed to create session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeSessionId) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsTutorTyping(true);
    try {
      const response = await tutorMutation.mutateAsync({
        sessionId: activeSessionId,
        message: inputValue,
        conversationHistory: messages,
      });
      setIsTutorTyping(false);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to get tutor response:", error);
      setIsTutorTyping(false);
    }
  };

  const handleSelectSession = (session: TutorSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setShowNewSession(false);
  };

  const handleNewSession = () => {
    setShowNewSession(true);
    setActiveSessionId(null);
    setMessages([]);
    setSelectedTopic("");
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar - Sessions List */}
          <div className="md:col-span-1">
            <Card className="p-4 sticky top-6">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Sessions</h2>
              <Button onClick={handleNewSession} className="w-full mb-4 bg-blue-600 hover:bg-blue-700">
                + New Session
              </Button>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeSessionId === session.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="font-semibold text-sm truncate">{session.topic}</div>
                    <div className="text-xs opacity-75">{session.difficulty}</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="md:col-span-3">
            <Card className="h-full flex flex-col">
              {showNewSession ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                      Start Learning with AI Tutor
                    </h1>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What would you like to learn?
                        </label>
                        <Input
                          value={selectedTopic}
                          onChange={(e) => setSelectedTopic(e.target.value)}
                          placeholder="e.g., Python Basics, React Hooks, etc."
                          className="w-full"
                          onKeyPress={(e) => e.key === "Enter" && handleCreateSession()}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Difficulty Level
                        </label>
                        <select
                          value={difficulty}
                          onChange={(e) =>
                            setDifficulty(e.target.value as "beginner" | "intermediate" | "advanced")
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      <Button
                        onClick={handleCreateSession}
                        disabled={isLoading || !selectedTopic.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isLoading ? "Creating..." : "Start Session"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 && (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Start the conversation by asking a question!</p>
                      </div>
                    )}
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                            message.role === "user"
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-gray-200 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isTutorTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t border-gray-200 p-4">
                    <div className="flex gap-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Ask your tutor a question..."
                        disabled={isLoading || isTutorTyping}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={isLoading || isTutorTyping || !inputValue.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6"
                      >
                        {isLoading || isTutorTyping ? (
                          <Spinner className="w-4 h-4" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
