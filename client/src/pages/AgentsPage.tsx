import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Search, MessageSquare, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  engine?: string;
}

export default function AgentsPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const agentsQuery = trpc.agents.list.useQuery();
  const chatMutation = trpc.agents.chat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.response ?? "No response.",
          engine: data.engine,
        },
      ]);
    },
    onError: (err) => {
      toast.error("Chat failed: " + (err.message || "unknown error"));
    },
  });

  const agents = agentsQuery.data ?? [];

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = agents.filter(
      (a) =>
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.division.toLowerCase().includes(q)
    );
    const map = new Map<string, typeof agents>();
    for (const a of filtered) {
      const list = map.get(a.division) ?? [];
      list.push(a);
      map.set(a.division, list);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [agents, query]);

  const selected = agents.find((a) => a.id === selectedId) ?? null;

  const selectAgent = (id: string) => {
    setSelectedId(id);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Hi, I'm ${
          agents.find((a) => a.id === id)?.name ?? "this agent"
        }. ${agents.find((a) => a.id === id)?.description ?? ""} How can I help you today?`,
      },
    ]);
  };

  const send = () => {
    if (!input.trim() || !selected || chatMutation.isPending) return;
    const history = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    chatMutation.mutate({
      agentId: selected.id,
      message: input,
      history,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-indigo-500" />
          <div>
            <h1 className="text-3xl font-bold">AI Agents</h1>
            <p className="text-muted-foreground">
              Pick a specialist agent and chat. Powered by your local LLM (Ollama) or
              Anthropic.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent catalog */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search agents…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {grouped.map(([division, list]) => (
                <div key={division}>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    {division}
                  </p>
                  <div className="space-y-1">
                    {list.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => selectAgent(a.id)}
                        className={`w-full text-left rounded-lg border p-2 flex gap-2 items-start transition-colors ${
                          selectedId === a.id
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-border hover:border-indigo-400/50"
                        }`}
                      >
                        <span className="text-xl leading-none mt-0.5">{a.emoji}</span>
                        <span className="min-w-0">
                          <span className="block font-medium text-sm truncate">
                            {a.name}
                          </span>
                          <span className="block text-xs text-muted-foreground line-clamp-2">
                            {a.description}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {agentsQuery.isLoading && (
                <p className="text-sm text-muted-foreground">Loading agents…</p>
              )}
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2">
            <Card className="h-[72vh] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selected?.emoji ?? <Bot />}</span>
                  <div>
                    <CardTitle>{selected?.name ?? "Select an agent"}</CardTitle>
                    <CardDescription>
                      {selected
                        ? `${selected.division} · ${selected.description}`
                        : "Choose a specialist from the catalog to start chatting."}
                    </CardDescription>
                  </div>
                  {messages.find((m) => m.engine && m.engine !== "none") && (
                    <Badge variant="outline" className="ml-auto capitalize">
                      {messages.find((m) => m.engine && m.engine !== "none")?.engine}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto space-y-4 py-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{m.content}</p>
                    </div>
                  </div>
                ))}
                {chatMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-muted px-4 py-2 rounded-lg text-sm text-muted-foreground">
                      thinking…
                    </div>
                  </div>
                )}
              </CardContent>

              <div className="border-t p-4 flex gap-2">
                <Textarea
                  placeholder={selected ? "Type your message…" : "Select an agent first"}
                  value={input}
                  disabled={!selected}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={2}
                  className="resize-none"
                />
                <Button
                  onClick={send}
                  disabled={!selected || !input.trim() || chatMutation.isPending}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
