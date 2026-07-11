import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Plus } from "lucide-react";

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface ChatMessage {
  id: string;
  sender: GroupMember;
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface StudyGroup {
  id: string;
  name: string;
  topic: string;
  description: string;
  members: GroupMember[];
  messages: ChatMessage[];
  maxMembers: number;
  level: "beginner" | "intermediate" | "advanced";
  createdAt: Date;
}

export default function StudyGroupsEnhanced() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [inputValue, setInputValue] = useState("");
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: "",
    topic: "",
    description: "",
    level: "beginner" as const,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with demo groups
  useEffect(() => {
    const demoGroups: StudyGroup[] = [
      {
        id: "group-1",
        name: "React Masters",
        topic: "React",
        description: "Advanced React patterns and best practices",
        level: "advanced",
        maxMembers: 10,
        createdAt: new Date(),
        members: [
          { id: "user-1", name: "Alice", avatar: "A", isOnline: true },
          { id: "user-2", name: "Bob", avatar: "B", isOnline: true },
          { id: "user-3", name: "Charlie", avatar: "C", isOnline: false },
        ],
        messages: [
          {
            id: "msg-1",
            sender: { id: "user-1", name: "Alice", avatar: "A", isOnline: true },
            content: "Hey everyone! Who wants to discuss React hooks?",
            timestamp: new Date(Date.now() - 300000),
          },
          {
            id: "msg-2",
            sender: { id: "user-2", name: "Bob", avatar: "B", isOnline: true },
            content: "I'm interested! I've been struggling with useEffect dependencies.",
            timestamp: new Date(Date.now() - 240000),
          },
        ],
      },
      {
        id: "group-2",
        name: "Python Beginners",
        topic: "Python",
        description: "Learning Python from scratch",
        level: "beginner",
        maxMembers: 15,
        createdAt: new Date(),
        members: [
          { id: "user-4", name: "Diana", avatar: "D", isOnline: true },
          { id: "user-5", name: "Eve", avatar: "E", isOnline: true },
        ],
        messages: [],
      },
    ];

    setGroups(demoGroups);
    setActiveGroupId(demoGroups[0].id);
    setMessages(demoGroups[0].messages);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const activeGroup = groups.find((g) => g.id === activeGroupId);

  const handleSelectGroup = (groupId: string) => {
    setActiveGroupId(groupId);
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      setMessages(group.messages);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !activeGroup) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: {
        id: "current-user",
        name: "You",
        avatar: "Y",
        isOnline: true,
      },
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate other users typing
    setTimeout(() => {
      const typingUser = activeGroup.members[0];
      if (typingUser) {
        setTypingUsers(new Set([typingUser.id]));
        setTimeout(() => {
          setTypingUsers(new Set());
          const response: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: typingUser,
            content: "That's a great point! Let me think about that...",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, response]);
        }, 2000);
      }
    }, 500);
  };

  const handleCreateGroup = () => {
    if (!newGroupData.name.trim() || !newGroupData.topic.trim()) return;

    const group: StudyGroup = {
      id: `group-${Date.now()}`,
      name: newGroupData.name,
      topic: newGroupData.topic,
      description: newGroupData.description,
      level: newGroupData.level,
      maxMembers: 10,
      createdAt: new Date(),
      members: [
        { id: "current-user", name: "You", avatar: "Y", isOnline: true },
      ],
      messages: [],
    };

    setGroups([...groups, group]);
    setActiveGroupId(group.id);
    setMessages([]);
    setShowNewGroup(false);
    setNewGroupData({ name: "", topic: "", description: "", level: "beginner" });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Groups Sidebar */}
          <div className="md:col-span-1">
            <Card className="p-4 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Groups</h2>
                <Button
                  size="sm"
                  onClick={() => setShowNewGroup(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => handleSelectGroup(group.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeGroupId === group.id
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="font-semibold text-sm truncate">{group.name}</div>
                    <div className="text-xs opacity-75 flex items-center gap-1 mt-1">
                      <Users className="w-3 h-3" />
                      {group.members.length}/{group.maxMembers}
                    </div>
                    <Badge
                      className={`text-xs mt-2 ${getLevelColor(group.level)}`}
                      variant="outline"
                    >
                      {group.level}
                    </Badge>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="md:col-span-3">
            {showNewGroup ? (
              <Card className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Study Group</h1>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group Name
                    </label>
                    <Input
                      value={newGroupData.name}
                      onChange={(e) =>
                        setNewGroupData({ ...newGroupData, name: e.target.value })
                      }
                      placeholder="e.g., React Study Group"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic
                    </label>
                    <Input
                      value={newGroupData.topic}
                      onChange={(e) =>
                        setNewGroupData({ ...newGroupData, topic: e.target.value })
                      }
                      placeholder="e.g., React"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newGroupData.description}
                      onChange={(e) =>
                        setNewGroupData({ ...newGroupData, description: e.target.value })
                      }
                      placeholder="Describe your group..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level
                    </label>
                    <select
                      value={newGroupData.level}
                      onChange={(e) =>
                        setNewGroupData({
                          ...newGroupData,
                          level: (e.target.value as any),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateGroup}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      Create Group
                    </Button>
                    <Button
                      onClick={() => setShowNewGroup(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            ) : activeGroup ? (
              <Card className="h-full flex flex-col">
                {/* Group Header */}
                <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                  <h1 className="text-2xl font-bold text-gray-800">{activeGroup.name}</h1>
                  <p className="text-gray-600 text-sm mt-1">{activeGroup.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge className={getLevelColor(activeGroup.level)}>
                      {activeGroup.level}
                    </Badge>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {activeGroup.members.length} members
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                        {message.sender.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            {message.sender.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {!message.sender.isOnline && (
                            <span className="text-xs text-gray-400">(offline)</span>
                          )}
                        </div>
                        <p className="text-gray-700 mt-1">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicators */}
                  {typingUsers.size > 0 && (
                    <div className="flex gap-3">
                      {Array.from(typingUsers).map((userId) => {
                        const user = activeGroup.members.find((m) => m.id === userId);
                        return user ? (
                          <div key={userId} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-bold">
                              {user.avatar}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-600">{user.name} is typing</span>
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
