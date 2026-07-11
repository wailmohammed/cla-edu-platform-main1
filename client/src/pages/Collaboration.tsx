import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Video, MessageSquare, Share2, Eye, Edit } from "lucide-react";
import { toast } from "sonner";

export default function Collaboration() {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");

  const handleStartSession = () => {
    setActiveSession("session-" + Date.now());
    toast.success("Collaboration session started!");
  };

  const handleInvite = () => {
    if (!inviteEmail) {
      toast.error("Please enter an email");
      return;
    }
    toast.success(`Invite sent to ${inviteEmail}`);
    setInviteEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🤝 Real-Time Collaboration
          </h1>
          <p className="text-lg text-slate-600">
            Learn together with real-time code sharing and live chat
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Session */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-blue-600" />
                  Shared Code Editor
                </CardTitle>
                <CardDescription>
                  {activeSession ? "Live collaboration active" : "No active session"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {activeSession ? (
                  <>
                    <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <div className="text-green-400">{"// Shared Code Editor"}</div>
                      <div className="text-yellow-400">
                        {"function "}
                        <span className="text-blue-400">{"collaborate"}</span>
                        {"() {"}
                      </div>
                      <div className="ml-4">
                        {"console.log('"}
                        <span className="text-green-400">{"Learning together!"}</span>
                        {"');"}
                      </div>
                      <div>{"}"}</div>
                    </div>

                    {/* Collaborators */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700">Active Collaborators:</p>
                      <div className="flex gap-2">
                        {[
                          { name: "You", color: "bg-blue-600" },
                          { name: "Alice", color: "bg-purple-600" },
                          { name: "Bob", color: "bg-green-600" },
                        ].map((user) => (
                          <div key={user.name} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full ${user.color}`} />
                            <span className="text-sm text-slate-700">{user.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 gap-2">
                        <Video className="w-4 h-4" />
                        Video Call
                      </Button>
                      <Button variant="outline" className="flex-1 gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Chat
                      </Button>
                      <Button
                        onClick={() => setActiveSession(null)}
                        variant="destructive"
                        className="flex-1"
                      >
                        End Session
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">
                      Start a collaboration session to code together
                    </p>
                    <Button onClick={handleStartSession} className="gap-2">
                      <Users className="w-4 h-4" />
                      Start Session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Invite & Sessions */}
          <div className="space-y-4">
            {/* Invite */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-green-600" />
                  Invite Collaborators
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <Input
                  placeholder="Enter email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <Button onClick={handleInvite} className="w-full">
                  Send Invite
                </Button>

                {activeSession && (
                  <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 mb-2">Session Link:</p>
                    <code className="text-xs text-blue-800 break-all">
                      learncode.io/collab/{activeSession}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `learncode.io/collab/${activeSession}`
                        );
                        toast.success("Link copied!");
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Sessions</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                {[
                  { name: "Python Basics with Alice", date: "Today", participants: 2 },
                  { name: "Web Dev Project", date: "Yesterday", participants: 3 },
                  { name: "Algorithm Study", date: "2 days ago", participants: 2 },
                ].map((session, i) => (
                  <div key={i} className="p-2 border border-slate-200 rounded-md hover:bg-slate-50">
                    <p className="text-sm font-medium text-slate-900">{session.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-slate-600">{session.date}</span>
                      <Badge variant="outline" className="text-xs">
                        {session.participants} people
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">📝 Live Code Editing</h3>
            <p className="text-sm text-slate-600">
              See changes in real-time as collaborators type
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">💬 Integrated Chat</h3>
            <p className="text-sm text-slate-600">
              Discuss code and ideas without leaving the editor
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">🎥 Video Calls</h3>
            <p className="text-sm text-slate-600">
              Built-in video conferencing for pair programming
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">👁️ Cursor Tracking</h3>
            <p className="text-sm text-slate-600">
              See where your collaborators are working
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">💾 Auto Save</h3>
            <p className="text-sm text-slate-600">
              All changes are automatically saved to the cloud
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">📊 Session History</h3>
            <p className="text-sm text-slate-600">
              Access all your past collaboration sessions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
