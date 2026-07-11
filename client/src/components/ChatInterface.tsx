import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Smile, Paperclip, MoreVertical, Search, Phone, Video } from "lucide-react";

interface Message {
  id: number;
  from: string;
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  reactions?: { emoji: string; count: number }[];
}

interface ChatInterfaceProps {
  friendId?: string;
  friendName?: string;
  friendAvatar?: string;
  friendStatus?: "online" | "away" | "offline";
}

export function ChatInterface({
  friendId = "user_2",
  friendName = "Sarah Johnson",
  friendAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  friendStatus = "online",
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "user_1",
      content: "Hey! How's learning going?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "read",
    },
    {
      id: 2,
      from: "user_2",
      content: "Great! Just completed React course",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: "read",
    },
    {
      id: 3,
      from: "user_1",
      content: "That's awesome! Which course next?",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      status: "read",
    },
  ]);

  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        from: "user_1",
        content: messageInput,
        timestamp: new Date().toISOString(),
        status: "sent",
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");
      setIsTyping(false);
    }
  };

  const handleTyping = (value: string) => {
    setMessageInput(value);
    setIsTyping(value.length > 0);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const addReaction = (messageId: number, emoji: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            existingReaction.count++;
          } else {
            reactions.push({ emoji, count: 1 });
          }
          return { ...msg, reactions };
        }
        return msg;
      })
    );
  };

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={friendAvatar} alt={friendName} className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="font-semibold">{friendName}</h3>
            <p className="text-xs text-blue-100 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${friendStatus === "online" ? "bg-green-400" : "bg-gray-400"}`} />
              {friendStatus}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
            <Phone className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
            <Video className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.from === "user_1" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-xs ${message.from === "user_1" ? "bg-blue-500 text-white" : "bg-white border border-slate-200"} rounded-lg p-3`}>
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                {message.from === "user_1" && (
                  <span className="text-xs">
                    {message.status === "sent" && "✓"}
                    {message.status === "delivered" && "✓✓"}
                    {message.status === "read" && "✓✓"}
                  </span>
                )}
              </div>

              {/* Message Reactions */}
              {message.reactions && message.reactions.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {message.reactions.map((reaction) => (
                    <Badge key={reaction.emoji} variant="secondary" className="text-xs">
                      {reaction.emoji} {reaction.count}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Reaction Picker */}
              {selectedReaction === message.id && (
                <div className="flex gap-1 mt-2 bg-white rounded p-2 border border-slate-200">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        addReaction(message.id, emoji);
                        setSelectedReaction(null);
                      }}
                      className="hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reaction Button */}
            <button
              onClick={() => setSelectedReaction(selectedReaction === message.id ? null : message.id)}
              className="ml-2 opacity-0 hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 p-4 bg-white">
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="text-slate-600">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button size="sm" variant="ghost" className="text-slate-600">
            <Smile className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
