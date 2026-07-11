import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Search, MessageSquare, Calendar, Users2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface StudyGroup {
  id: string;
  name: string;
  topic: string;
  description: string;
  members: number;
  maxMembers: number;
  level: "beginner" | "intermediate" | "advanced";
  createdBy: string;
  createdAt: Date;
  nextMeetup?: Date;
  image?: string;
}

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  joinedAt: Date;
  role: "admin" | "member";
}

const mockGroups: StudyGroup[] = [
  {
    id: "group-1",
    name: "Python Beginners",
    topic: "Python",
    description: "Learn Python basics together with supportive peers",
    members: 24,
    maxMembers: 50,
    level: "beginner",
    createdBy: "Sarah Johnson",
    createdAt: new Date("2026-06-01"),
    nextMeetup: new Date("2026-07-05T18:00:00"),
    image: "🐍",
  },
  {
    id: "group-2",
    name: "React Advanced",
    topic: "React",
    description: "Deep dive into React hooks, context, and performance optimization",
    members: 18,
    maxMembers: 30,
    level: "advanced",
    createdBy: "Mike Chen",
    createdAt: new Date("2026-05-15"),
    nextMeetup: new Date("2026-07-06T19:00:00"),
    image: "⚛️",
  },
  {
    id: "group-3",
    name: "Data Science Enthusiasts",
    topic: "Data Science",
    description: "Explore pandas, numpy, and machine learning projects",
    members: 32,
    maxMembers: 40,
    level: "intermediate",
    createdBy: "Emily Davis",
    createdAt: new Date("2026-04-20"),
    nextMeetup: new Date("2026-07-07T17:00:00"),
    image: "📊",
  },
  {
    id: "group-4",
    name: "Web Design Collective",
    topic: "Web Design",
    description: "Share design tips, CSS tricks, and UI/UX best practices",
    members: 15,
    maxMembers: 25,
    level: "beginner",
    createdBy: "Alex Martinez",
    createdAt: new Date("2026-05-10"),
    image: "🎨",
  },
];

const mockMembers: GroupMember[] = [
  { id: "1", name: "Sarah Johnson", joinedAt: new Date("2026-06-01"), role: "admin" },
  { id: "2", name: "John Doe", joinedAt: new Date("2026-06-05"), role: "member" },
  { id: "3", name: "Jane Smith", joinedAt: new Date("2026-06-10"), role: "member" },
  { id: "4", name: "Mike Wilson", joinedAt: new Date("2026-06-15"), role: "member" },
];

export default function StudyGroupsPage() {
  const [groups, setGroups] = useState<StudyGroup[]>(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [members, setMembers] = useState<GroupMember[]>(mockMembers);

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === "all" || group.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const handleJoinGroup = (group: StudyGroup) => {
    if (group.members < group.maxMembers) {
      setGroups(
        groups.map((g) =>
          g.id === group.id ? { ...g, members: g.members + 1 } : g
        )
      );
      toast.success(`Joined ${group.name}!`);
    } else {
      toast.error("Group is full");
    }
  };

  const handleCreateGroup = () => {
    toast.info("Group creation feature coming soon!");
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      case "intermediate":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "advanced":
        return "bg-purple-500/20 text-purple-500 border-purple-500/50";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500 animate-bounce" />
              <h1 className="text-4xl font-bold text-white">Study Groups</h1>
            </div>
            <Button
              onClick={handleCreateGroup}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>
          <p className="text-gray-400">
            Join study groups, collaborate with peers, and learn together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Search and Filter */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-300">Level</p>
                  {["all", "beginner", "intermediate", "advanced"].map((level) => (
                    <Button
                      key={level}
                      onClick={() => setFilterLevel(level as any)}
                      variant={filterLevel === level ? "default" : "outline"}
                      className="w-full justify-start capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6 space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-500">{groups.length}</p>
                  <p className="text-sm text-gray-400">Active Groups</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-500">
                    {groups.reduce((acc, g) => acc + g.members, 0)}
                  </p>
                  <p className="text-sm text-gray-400">Total Members</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {selectedGroup ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="border-b border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="text-4xl">{selectedGroup.image}</div>
                      <div>
                        <CardTitle className="text-white text-2xl">{selectedGroup.name}</CardTitle>
                        <CardDescription className="text-gray-400 mt-2">
                          {selectedGroup.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleJoinGroup(selectedGroup)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Join Group
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                      <TabsTrigger value="info" className="text-gray-300 data-[state=active]:text-white">
                        Info
                      </TabsTrigger>
                      <TabsTrigger value="members" className="text-gray-300 data-[state=active]:text-white">
                        Members
                      </TabsTrigger>
                      <TabsTrigger value="chat" className="text-gray-300 data-[state=active]:text-white">
                        Chat
                      </TabsTrigger>
                    </TabsList>

                    {/* Info Tab */}
                    <TabsContent value="info" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-700 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Level</p>
                          <Badge className={getLevelColor(selectedGroup.level)}>
                            {selectedGroup.level}
                          </Badge>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Members</p>
                          <p className="text-2xl font-bold text-white">
                            {selectedGroup.members}/{selectedGroup.maxMembers}
                          </p>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Created</p>
                          <p className="text-white">{selectedGroup.createdAt.toLocaleDateString()}</p>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Admin</p>
                          <p className="text-white">{selectedGroup.createdBy}</p>
                        </div>
                      </div>

                      {selectedGroup.nextMeetup && (
                        <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <p className="font-semibold text-white">Next Meetup</p>
                          </div>
                          <p className="text-gray-300">
                            {selectedGroup.nextMeetup.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    {/* Members Tab */}
                    <TabsContent value="members" className="space-y-3">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between bg-slate-700 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-white">{member.name}</p>
                              <p className="text-xs text-gray-400">
                                Joined {member.joinedAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                            {member.role}
                          </Badge>
                        </div>
                      ))}
                    </TabsContent>

                    {/* Chat Tab */}
                    <TabsContent value="chat" className="space-y-3">
                      <div className="bg-slate-700 rounded-lg p-4 h-64 overflow-y-auto space-y-3">
                        <div className="flex gap-2">
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback>SJ</AvatarFallback>
                          </Avatar>
                          <div className="bg-slate-600 rounded-lg p-2 flex-1">
                            <p className="text-xs font-semibold text-gray-300">Sarah Johnson</p>
                            <p className="text-sm text-gray-200">Welcome to the group!</p>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <div className="bg-blue-600 rounded-lg p-2 max-w-xs">
                            <p className="text-sm text-white">Thanks for creating this group!</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                        />
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredGroups.map((group, index) => (
                  <Card
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className="bg-slate-800 border-slate-700 cursor-pointer hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 flex-1">
                          <div className="text-3xl">{group.image}</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">{group.name}</h3>
                            <p className="text-sm text-gray-400 mb-3">{group.description}</p>
                            <div className="flex gap-3 flex-wrap">
                              <Badge className={getLevelColor(group.level)}>
                                {group.level}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-gray-400">
                                <Users2 className="w-4 h-4" />
                                {group.members}/{group.maxMembers} members
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-400">
                                <TrendingUp className="w-4 h-4" />
                                {group.topic}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinGroup(group);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Join
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
