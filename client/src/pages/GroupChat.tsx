import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Pin, Search, Send, Users, Hash } from "lucide-react";

interface Message {
  id: string;
  author: string;
  authorId: string;
  content: string;
  timestamp: string;
  mentions: string[];
  reactions: Record<string, number>;
  isPinned: boolean;
}

interface Room {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  messageCount: number;
}

export function GroupChat() {
  const [selectedRoom, setSelectedRoom] = useState<string>("room_1");
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPinned, setShowPinned] = useState(false);

  const rooms: Room[] = [
    {
      id: "room_1",
      name: "React Developers",
      description: "Discussion for React course learners",
      category: "course",
      memberCount: 234,
      messageCount: 1200,
    },
    {
      id: "room_2",
      name: "Python Study Group",
      description: "Collaborative learning for Python",
      category: "study-group",
      memberCount: 156,
      messageCount: 890,
    },
    {
      id: "room_3",
      name: "Web Dev Team",
      description: "Full-stack development project",
      category: "project",
      memberCount: 45,
      messageCount: 234,
    },
  ];

  const messages: Message[] = [
    {
      id: "msg_1",
      author: "Alex Chen",
      authorId: "user_1",
      content: "Great discussion on hooks!",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      mentions: [],
      reactions: { "👍": 5, "❤️": 2 },
      isPinned: false,
    },
    {
      id: "msg_2",
      author: "Sarah Johnson",
      authorId: "user_2",
      content: "@Alex Thanks for the explanation!",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      mentions: ["user_1"],
      reactions: { "👍": 3 },
      isPinned: false,
    },
    {
      id: "msg_3",
      author: "Admin",
      authorId: "admin",
      content: "Important: Course deadline is next Friday",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      mentions: [],
      reactions: {},
      isPinned: true,
    },
  ];

  const pinnedMessages = messages.filter((m) => m.isPinned);
  const filteredMessages = searchQuery
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const currentRoom = rooms.find((r) => r.id === selectedRoom);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto h-screen flex gap-4 p-4">
        {/* Sidebar - Rooms List */}
        <div className="w-64 bg-white rounded-lg shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Rooms
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                  selectedRoom === room.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  <Hash className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{room.name}</p>
                    <p className="text-xs text-slate-500 truncate">{room.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {room.memberCount} members
                      </Badge>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{currentRoom?.name}</h1>
              <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                <Users className="w-4 h-4" />
                {currentRoom?.memberCount} members
              </p>
            </div>

            <Button
              variant={showPinned ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPinned(!showPinned)}
              className="flex items-center gap-2"
            >
              <Pin className="w-4 h-4" />
              Pinned ({pinnedMessages.length})
            </Button>
          </div>

          {/* Pinned Messages Section */}
          {showPinned && pinnedMessages.length > 0 && (
            <div className="bg-yellow-50 border-b border-yellow-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Pin className="w-4 h-4" />
                Pinned Messages
              </h3>
              <div className="space-y-2">
                {pinnedMessages.map((msg) => (
                  <div key={msg.id} className="bg-white p-3 rounded border border-yellow-200">
                    <p className="text-sm font-semibold text-slate-900">{msg.author}</p>
                    <p className="text-sm text-slate-700 mt-1">{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="flex gap-3 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {msg.author.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{msg.author}</p>
                    <span className="text-xs text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    {msg.isPinned && (
                      <Pin className="w-3 h-3 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-slate-700 mt-1 break-words">{msg.content}</p>
                  {Object.keys(msg.reactions).length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm transition-colors"
                        >
                          {emoji} {count}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message... (use @ to mention)"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    setMessageInput("");
                  }
                }}
              />
              <Button
                onClick={() => setMessageInput("")}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              💡 Tip: Use @username to mention someone
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
