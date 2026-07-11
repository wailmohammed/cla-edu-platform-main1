import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Users, Trophy, Swords, Zap, Crown, Flame } from "lucide-react";
import { toast } from "sonner";

export default function Gamification2() {
  const [activeTab, setActiveTab] = useState("guilds");
  const [showCreateGuild, setShowCreateGuild] = useState(false);
  const [guildName, setGuildName] = useState("");

  // Gamification mutations
  const createGuildMutation = trpc.enhancements.gamification2.createGuild.useMutation();
  const startTournamentMutation = trpc.enhancements.gamification2.startTournament.useMutation();
  const { data: quests } = trpc.enhancements.gamification2.getAvailableQuests.useQuery();

  const handleCreateGuild = async () => {
    try {
      if (!guildName) {
        toast.error("Please enter a guild name");
        return;
      }

      await createGuildMutation.mutateAsync({
        name: guildName,
        description: "A new guild for learning together",
        maxMembers: 50,
      });

      toast.success("Guild created!");
      setGuildName("");
      setShowCreateGuild(false);
    } catch (error) {
      toast.error("Failed to create guild");
    }
  };

  const handleStartTournament = async () => {
    try {
      await startTournamentMutation.mutateAsync({
        name: "Weekly Challenge",
        duration: 7 * 24, // 7 days in hours
        maxParticipants: 100,
      });

      toast.success("Tournament started!");
    } catch (error) {
      toast.error("Failed to start tournament");
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guilds">Guilds</TabsTrigger>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          <TabsTrigger value="quests">Quests</TabsTrigger>
        </TabsList>

        {/* Guilds Tab */}
        <TabsContent value="guilds" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Guilds
                  </CardTitle>
                  <CardDescription>Join or create a learning guild</CardDescription>
                </div>
                <Button
                  onClick={() => setShowCreateGuild(!showCreateGuild)}
                  size="sm"
                  variant="outline"
                >
                  {showCreateGuild ? "Cancel" : "Create Guild"}
                </Button>
              </div>
            </CardHeader>

            {showCreateGuild && (
              <CardContent className="space-y-3 border-t border-slate-200 pt-4">
                <input
                  type="text"
                  placeholder="Guild name"
                  className="w-full p-2 border border-slate-200 rounded-md text-sm"
                  value={guildName}
                  onChange={(e) => setGuildName(e.target.value)}
                />
                <Button
                  onClick={handleCreateGuild}
                  disabled={createGuildMutation.isPending}
                  className="w-full"
                >
                  {createGuildMutation.isPending ? "Creating..." : "Create Guild"}
                </Button>
              </CardContent>
            )}

            <CardContent className="space-y-3">
              {[
                { name: "Python Masters", members: 234, level: "Gold", xp: 45000 },
                { name: "Web Warriors", members: 156, level: "Silver", xp: 32000 },
                { name: "Data Wizards", members: 89, level: "Bronze", xp: 18000 },
              ].map((guild, i) => (
                <div key={i} className="p-3 border border-slate-200 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">{guild.name}</h4>
                    <Badge
                      className={
                        guild.level === "Gold"
                          ? "bg-yellow-600"
                          : guild.level === "Silver"
                            ? "bg-slate-400"
                            : "bg-orange-600"
                      }
                    >
                      {guild.level}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>👥 {guild.members} members</span>
                    <span>⚡ {guild.xp.toLocaleString()} XP</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    Join Guild
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tournaments Tab */}
        <TabsContent value="tournaments" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    Tournaments
                  </CardTitle>
                  <CardDescription>Compete with other learners</CardDescription>
                </div>
                <Button onClick={handleStartTournament} size="sm" variant="outline">
                  Start Tournament
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {[
                {
                  name: "Weekly Challenge",
                  participants: 234,
                  prize: "$500",
                  status: "active",
                  daysLeft: 3,
                },
                {
                  name: "Algorithm Sprint",
                  participants: 156,
                  prize: "$1000",
                  status: "active",
                  daysLeft: 5,
                },
                {
                  name: "Code Golf",
                  participants: 89,
                  prize: "$250",
                  status: "upcoming",
                  daysLeft: 7,
                },
              ].map((tournament, i) => (
                <div key={i} className="p-3 border border-slate-200 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Swords className="w-4 h-4 text-red-600" />
                      {tournament.name}
                    </h4>
                    <Badge variant={tournament.status === "active" ? "default" : "outline"}>
                      {tournament.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                    <span>👥 {tournament.participants} participants</span>
                    <span>🏆 {tournament.prize}</span>
                    <span>⏱️ {tournament.daysLeft}d left</span>
                  </div>
                  <Button size="sm" className="w-full">
                    {tournament.status === "active" ? "Join Now" : "Notify Me"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quests Tab */}
        <TabsContent value="quests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Available Quests
              </CardTitle>
              <CardDescription>Complete quests to earn XP and rewards</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {[
                {
                  name: "Complete 5 Python Exercises",
                  xp: 500,
                  reward: "Python Master Badge",
                  difficulty: "Easy",
                  progress: 3,
                },
                {
                  name: "Solve Algorithm Challenge",
                  xp: 1000,
                  reward: "Algorithm Solver Badge",
                  difficulty: "Hard",
                  progress: 0,
                },
                {
                  name: "Help 3 Community Members",
                  xp: 750,
                  reward: "Mentor Badge",
                  difficulty: "Medium",
                  progress: 1,
                },
                {
                  name: "7-Day Learning Streak",
                  xp: 2000,
                  reward: "Consistency Badge",
                  difficulty: "Medium",
                  progress: 5,
                },
              ].map((quest, i) => (
                <div key={i} className="p-3 border border-slate-200 rounded-md">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{quest.name}</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Reward: {quest.reward} • {quest.xp} XP
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        quest.difficulty === "Easy"
                          ? "text-green-600"
                          : quest.difficulty === "Medium"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }
                    >
                      {quest.difficulty}
                    </Badge>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(quest.progress / (quest.difficulty === "Easy" ? 5 : 10)) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    Progress: {quest.progress}/{quest.difficulty === "Easy" ? 5 : 10}
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    {quest.progress > 0 ? "Continue" : "Start Quest"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
