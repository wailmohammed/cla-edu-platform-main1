import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trophy, Target, MessageSquare, UserPlus, Check, X } from "lucide-react";

export function Social() {
  const [activeTab, setActiveTab] = useState("friends");

  const friends = [
    { id: 1, name: "Sarah Johnson", status: "online", coursesCompleted: 11, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { id: 2, name: "Mike Rodriguez", status: "away", coursesCompleted: 10, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
    { id: 3, name: "Emma Wilson", status: "offline", coursesCompleted: 9, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
  ];

  const friendRequests = [
    { id: 4, name: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
    { id: 5, name: "Jane Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
  ];

  const challenges = [
    {
      id: 1,
      name: "Python Mastery Challenge",
      description: "Complete 5 Python courses in 30 days",
      participants: 234,
      daysLeft: 15,
      reward: "500 XP",
      joined: true,
    },
    {
      id: 2,
      name: "React Sprint",
      description: "Build 3 React projects",
      participants: 156,
      daysLeft: 8,
      reward: "400 XP",
      joined: false,
    },
    {
      id: 3,
      name: "Algorithm Master",
      description: "Solve 50 algorithm challenges",
      participants: 89,
      daysLeft: 22,
      reward: "600 XP",
      joined: false,
    },
  ];

  const teams = [
    { id: 1, name: "Python Developers", members: 12, role: "owner", createdAt: "2026-01-15" },
    { id: 2, name: "React Enthusiasts", members: 8, role: "member", createdAt: "2026-02-20" },
  ];

  const teamInvites = [
    { id: 3, name: "JavaScript Masters", invitedBy: "Alex Chen", members: 15 },
    { id: 4, name: "Web Development", invitedBy: "Sarah Johnson", members: 22 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Users className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Social Hub</h1>
              <p className="text-purple-100">Connect, compete, and collaborate with learners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="feed">Feed</TabsTrigger>
          </TabsList>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Friends List */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Friends ({friends.length})</h2>
                  <div className="space-y-4">
                    {friends.map((friend) => (
                      <div key={friend.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full" />
                          <div>
                            <h3 className="font-semibold text-slate-900">{friend.name}</h3>
                            <p className="text-sm text-slate-600">
                              {friend.coursesCompleted} courses completed
                            </p>
                          </div>
                          <Badge variant={friend.status === "online" ? "default" : "secondary"}>
                            {friend.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Friend Requests */}
              <div>
                <Card className="p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Friend Requests ({friendRequests.length})</h2>
                  <div className="space-y-4">
                    {friendRequests.map((request) => (
                      <div key={request.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <img src={request.avatar} alt={request.name} className="w-10 h-10 rounded-full" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{request.name}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="default" className="h-8 w-8 p-0">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Active Challenges</h2>
              <Button className="gap-2">
                <Target className="w-4 h-4" />
                Create Challenge
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{challenge.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{challenge.description}</p>
                    </div>
                    {challenge.joined && <Badge className="bg-green-500">Joined</Badge>}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Participants</span>
                      <span className="font-semibold text-slate-900">{challenge.participants}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Time Left</span>
                      <span className="font-semibold text-slate-900">{challenge.daysLeft} days</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Reward</span>
                      <span className="font-semibold text-orange-600">{challenge.reward}</span>
                    </div>
                  </div>

                  <Button className="w-full" variant={challenge.joined ? "outline" : "default"}>
                    {challenge.joined ? "View Challenge" : "Join Challenge"}
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* My Teams */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">My Teams ({teams.length})</h2>
                    <Button className="gap-2">
                      <Users className="w-4 h-4" />
                      Create Team
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {teams.map((team) => (
                      <div key={team.id} className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-slate-900">{team.name}</h3>
                          <Badge variant="secondary">{team.role}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>{team.members} members</span>
                          <span>Created {team.createdAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Team Invites */}
              <div>
                <Card className="p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Team Invites ({teamInvites.length})</h2>
                  <div className="space-y-4">
                    {teamInvites.map((invite) => (
                      <div key={invite.id} className="p-3 bg-slate-50 rounded-lg">
                        <p className="font-medium text-slate-900 mb-1">{invite.name}</p>
                        <p className="text-xs text-slate-600 mb-3">Invited by {invite.invitedBy}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="default" className="flex-1">
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Social Feed</h2>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-sm text-slate-600 mb-1">Sarah Johnson</p>
                  <p className="font-medium text-slate-900">unlocked the 'Fast Learner' achievement</p>
                  <p className="text-xs text-slate-500 mt-2">2 hours ago</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm text-slate-600 mb-1">Mike Rodriguez</p>
                  <p className="font-medium text-slate-900">completed Python Fundamentals course</p>
                  <p className="text-xs text-slate-500 mt-2">4 hours ago</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-sm text-slate-600 mb-1">Alex Chen</p>
                  <p className="font-medium text-slate-900">climbed to rank #42 on the leaderboard</p>
                  <p className="text-xs text-slate-500 mt-2">6 hours ago</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-purple-500">
                  <p className="text-sm text-slate-600 mb-1">Emma Wilson</p>
                  <p className="font-medium text-slate-900">joined the 'Python Developers' team</p>
                  <p className="text-xs text-slate-500 mt-2">1 day ago</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
