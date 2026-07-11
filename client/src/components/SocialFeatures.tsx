import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Trophy, Flame, Send, UserPlus, Target } from "lucide-react";
import { toast } from "sonner";

interface Friend {
  id: number;
  name: string;
  avatar?: string;
  streak: number;
  level: number;
  xp: number;
}

interface Challenge {
  id: number;
  challenger: string;
  type: "streak" | "xp" | "lessons";
  duration: "7days" | "30days";
  status: "pending" | "active" | "completed";
  reward: number;
}

interface LeagueUser {
  rank: number;
  name: string;
  avatar?: string;
  league: "bronze" | "silver" | "gold" | "platinum";
  points: number;
  streak: number;
}

export default function SocialFeatures() {
  const [friends, setFriends] = useState<Friend[]>([
    { id: 1, name: "Alex Chen", streak: 15, level: 8, xp: 2450 },
    { id: 2, name: "Jordan Smith", streak: 22, level: 12, xp: 4200 },
    { id: 3, name: "Casey Lee", streak: 8, level: 5, xp: 1800 },
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 1, challenger: "Alex Chen", type: "streak", duration: "7days", status: "active", reward: 50 },
    { id: 2, challenger: "Jordan Smith", type: "xp", duration: "30days", status: "pending", reward: 200 },
  ]);

  const [leagueUsers, setLeagueUsers] = useState<LeagueUser[]>([
    { rank: 1, name: "Jordan Smith", league: "platinum", points: 8500, streak: 22 },
    { rank: 2, name: "Morgan Davis", league: "platinum", points: 7800, streak: 18 },
    { rank: 3, name: "Alex Chen", league: "gold", points: 6200, streak: 15 },
    { rank: 4, name: "You", league: "gold", points: 5100, streak: 12 },
    { rank: 5, name: "Casey Lee", league: "silver", points: 3400, streak: 8 },
  ]);

  const [friendEmail, setFriendEmail] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const handleAddFriend = () => {
    if (!friendEmail.trim()) return;
    toast.success(`Friend request sent to ${friendEmail}`);
    setFriendEmail("");
  };

  const handleChallengeAccept = (challenge: Challenge) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challenge.id ? { ...c, status: "active" } : c
      )
    );
    toast.success(`Challenge accepted! You have ${challenge.duration} to complete it.`);
  };

  const getLeagueColor = (league: string) => {
    switch (league) {
      case "bronze":
        return "bg-amber-100 text-amber-900";
      case "silver":
        return "bg-slate-100 text-slate-900";
      case "gold":
        return "bg-yellow-100 text-yellow-900";
      case "platinum":
        return "bg-blue-100 text-blue-900";
      default:
        return "bg-slate-100 text-slate-900";
    }
  };

  const getLeagueBadgeColor = (league: string) => {
    switch (league) {
      case "bronze":
        return "bg-amber-600";
      case "silver":
        return "bg-slate-400";
      case "gold":
        return "bg-yellow-500";
      case "platinum":
        return "bg-blue-600";
      default:
        return "bg-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends" className="gap-2">
            <Users className="w-4 h-4" />
            Friends
          </TabsTrigger>
          <TabsTrigger value="challenges" className="gap-2">
            <Target className="w-4 h-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="league" className="gap-2">
            <Trophy className="w-4 h-4" />
            League
          </TabsTrigger>
        </TabsList>

        {/* Friends Tab */}
        <TabsContent value="friends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Friends</CardTitle>
              <CardDescription>Connect with other learners and see their progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Friend */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter friend's email..."
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleAddFriend();
                  }}
                />
                <Button onClick={handleAddFriend} className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add
                </Button>
              </div>

              {/* Friends List */}
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar>
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{friend.name}</p>
                        <div className="flex gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-500" />
                            {friend.streak} day streak
                          </span>
                          <span>Level {friend.level}</span>
                          <span>{friend.xp} XP</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Challenge
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Challenges</CardTitle>
              <CardDescription>Compete with friends and earn rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="p-4 border border-slate-200 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{challenge.challenger}</p>
                      <p className="text-sm text-slate-600">
                        {challenge.type === "streak" && "Streak Challenge"}
                        {challenge.type === "xp" && "XP Challenge"}
                        {challenge.type === "lessons" && "Lessons Challenge"}
                        {" · "}
                        {challenge.duration === "7days" ? "7 days" : "30 days"}
                      </p>
                    </div>
                    <Badge className="bg-green-600">{challenge.reward} XP</Badge>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${challenge.status === "completed" ? 100 : challenge.status === "active" ? 60 : 0}%`,
                      }}
                    />
                  </div>

                  {challenge.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleChallengeAccept(challenge)}
                      className="w-full"
                    >
                      Accept Challenge
                    </Button>
                  )}
                  {challenge.status === "active" && (
                    <p className="text-sm text-slate-600 text-center">Challenge in progress...</p>
                  )}
                  {challenge.status === "completed" && (
                    <Badge className="w-full justify-center bg-green-100 text-green-900">
                      Challenge Completed!
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* League Tab */}
        <TabsContent value="league" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard League</CardTitle>
              <CardDescription>Climb the ranks and reach Platinum league</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* League Info */}
              <div className="grid grid-cols-4 gap-2">
                {["bronze", "silver", "gold", "platinum"].map((league) => (
                  <div
                    key={league}
                    className={`p-3 rounded-lg text-center text-sm font-medium capitalize ${getLeagueColor(league)}`}
                  >
                    {league}
                  </div>
                ))}
              </div>

              {/* Leaderboard */}
              <div className="space-y-2">
                {leagueUsers.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      user.name === "You"
                        ? "bg-blue-50 border-blue-300"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm">
                        {user.rank}
                      </div>
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className={`font-medium ${user.name === "You" ? "text-blue-900" : "text-slate-900"}`}>
                          {user.name}
                        </p>
                        <div className="flex gap-2 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-500" />
                            {user.streak}
                          </span>
                          <span>{user.points} pts</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getLeagueBadgeColor(user.league)}>
                      {user.league}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* League Info */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-slate-700">
                <p className="font-medium mb-2">📊 How Leagues Work</p>
                <ul className="space-y-1 text-xs">
                  <li>• Top 20% advance to next league each month</li>
                  <li>• Bottom 10% drop to previous league</li>
                  <li>• Earn bonus XP for league placement</li>
                  <li>• Platinum league gets exclusive badges</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
