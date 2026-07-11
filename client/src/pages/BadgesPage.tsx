import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Share2, Lock, Unlock, TrendingUp, Zap, CheckCircle2, Twitter, Linkedin, Facebook, Copy } from "lucide-react";
import { toast } from "sonner";
import BadgeDisplay from "@/components/BadgeDisplay";
import UserProfileBadges from "@/components/UserProfileBadges";

interface Badge {
  id: string;
  name: string;
  tier: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt: string | null;
  progress: number;
  requirement: number;
  current: number;
}

const mockBadges: Badge[] = [
  {
    id: "badge_bronze",
    name: "Bronze Referrer",
    tier: "Bronze",
    description: "Refer 5 friends to Codelearnify",
    icon: "🥉",
    color: "#CD7F32",
    unlockedAt: "2026-05-15T10:30:00Z",
    progress: 100,
    requirement: 5,
    current: 5,
  },
  {
    id: "badge_silver",
    name: "Silver Referrer",
    tier: "Silver",
    description: "Refer 10 friends to Codelearnify",
    icon: "🥈",
    color: "#C0C0C0",
    unlockedAt: "2026-05-28T14:45:00Z",
    progress: 100,
    requirement: 10,
    current: 10,
  },
  {
    id: "badge_gold",
    name: "Gold Referrer",
    tier: "Gold",
    description: "Refer 20 friends to Codelearnify",
    icon: "🥇",
    color: "#FFD700",
    unlockedAt: null,
    progress: 60,
    requirement: 20,
    current: 12,
  },
  {
    id: "badge_platinum",
    name: "Platinum Referrer",
    tier: "Platinum",
    description: "Refer 50 friends to Codelearnify",
    icon: "💎",
    color: "#E5E4E2",
    unlockedAt: null,
    progress: 24,
    requirement: 50,
    current: 12,
  },
  {
    id: "badge_diamond",
    name: "Diamond Referrer",
    tier: "Diamond",
    description: "Refer 100 friends to Codelearnify",
    icon: "💠",
    color: "#B9F2FF",
    unlockedAt: null,
    progress: 12,
    requirement: 100,
    current: 12,
  },
];

const displayedBadges = mockBadges.filter((b) => b.unlockedAt);
const lockedBadges = mockBadges.filter((b) => !b.unlockedAt);

export default function BadgesPage() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showUnlockRequirements, setShowUnlockRequirements] = useState(false);

  const handleShareBadge = (badge: Badge, platform: 'twitter' | 'linkedin' | 'facebook' | 'copy') => {
    const baseUrl = window.location.origin;
    const badgeUrl = `${baseUrl}/badges/${badge.id}`;
    const shareText = `I just unlocked the ${badge.name} badge on Codelearnify! 🎉 Join me and start learning today!`;

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(badgeUrl)}&hashtags=Codelearnify,Learning,Badges`,
          '_blank',
          'width=600,height=400'
        );
        toast.success('Opening Twitter share...');
        break;

      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(badgeUrl)}`,
          '_blank',
          'width=600,height=400'
        );
        toast.success('Opening LinkedIn share...');
        break;

      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(badgeUrl)}`,
          '_blank',
          'width=600,height=400'
        );
        toast.success('Opening Facebook share...');
        break;

      case 'copy':
        const fullShareText = `${shareText}\n\n${badgeUrl}`;
        navigator.clipboard.writeText(fullShareText);
        toast.success('Badge link copied to clipboard!');
        break;
    }
  };

  const stats = {
    totalBadges: mockBadges.length,
    unlockedBadges: displayedBadges.length,
    completionRate: Math.round((displayedBadges.length / mockBadges.length) * 100),
    nextMilestone: mockBadges.find((b) => !b.unlockedAt),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
            <h1 className="text-4xl font-bold text-white">Your Badges</h1>
          </div>
          <p className="text-gray-400">Unlock badges by reaching referral milestones and completing achievements</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 animate-in fade-in slide-in-from-left-4 duration-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">{stats.unlockedBadges}</div>
                <p className="text-sm text-gray-400 mt-2">Badges Unlocked</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">{stats.totalBadges}</div>
                <p className="text-sm text-gray-400 mt-2">Total Badges</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">{stats.completionRate}%</div>
                <p className="text-sm text-gray-400 mt-2">Completion</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl">{stats.nextMilestone?.icon}</div>
                <p className="text-sm text-gray-400 mt-2">{stats.nextMilestone?.name || "All Unlocked!"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
            <TabsTrigger value="all" className="text-gray-300 data-[state=active]:text-white">
              All Badges
            </TabsTrigger>
            <TabsTrigger value="unlocked" className="text-gray-300 data-[state=active]:text-white">
              Unlocked ({displayedBadges.length})
            </TabsTrigger>
            <TabsTrigger value="locked" className="text-gray-300 data-[state=active]:text-white">
              Locked ({lockedBadges.length})
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-gray-300 data-[state=active]:text-white">
              Profile Display
            </TabsTrigger>
          </TabsList>

          {/* All Badges Tab */}
          <TabsContent value="all" className="space-y-6">
            <BadgeDisplay badges={mockBadges} onShare={(badgeId) => {
              const badge = mockBadges.find(b => b.id === badgeId);
              if (badge) handleShareBadge(badge, 'twitter');
            }} />
          </TabsContent>

          {/* Unlocked Badges Tab */}
          <TabsContent value="unlocked" className="space-y-6">
            {displayedBadges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedBadges.map((badge, index) => (
                  <Card
                    key={badge.id}
                    className="bg-slate-800 border-slate-700 cursor-pointer hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            {badge.name}
                          </CardTitle>
                          <CardDescription className="text-gray-400">{badge.tier} Tier</CardDescription>
                        </div>
                        <div className="text-4xl animate-bounce">{badge.icon}</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-300">{badge.description}</p>
                      <Badge className="bg-green-600 text-white">✓ Unlocked</Badge>
                      
                      {/* Social Sharing Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareBadge(badge, 'twitter');
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-400/10"
                          title="Share on Twitter"
                        >
                          <Twitter className="w-4 h-4 mr-1" />
                          Twitter
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareBadge(badge, 'linkedin');
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-600/10"
                          title="Share on LinkedIn"
                        >
                          <Linkedin className="w-4 h-4 mr-1" />
                          LinkedIn
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareBadge(badge, 'copy');
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-slate-600 text-gray-300 hover:text-white"
                          title="Copy share link"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-400">No badges unlocked yet. Start referring friends!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Locked Badges Tab - with unlock requirements */}
          <TabsContent value="locked" className="space-y-6">
            {lockedBadges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedBadges.map((badge, index) => (
                  <Card
                    key={badge.id}
                    className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-500 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/20 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-500 opacity-75"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => {
                      setSelectedBadge(badge);
                      setShowUnlockRequirements(true);
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-gray-400 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-slate-500" />
                            {badge.name}
                          </CardTitle>
                          <CardDescription className="text-gray-500">{badge.tier} Tier</CardDescription>
                        </div>
                        <div className="text-4xl opacity-50">{badge.icon}</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-400">{badge.description}</p>
                      <Badge variant="outline" className="border-slate-600 text-gray-400">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked
                      </Badge>

                      {/* Unlock Requirements */}
                      <div className="space-y-3 bg-slate-900 rounded-lg p-3 border border-slate-700">
                        <p className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          Requirements to Unlock
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Progress</span>
                            <span className="text-sm font-semibold text-gray-300">
                              {badge.current}/{badge.requirement}
                            </span>
                          </div>
                          <Progress value={badge.progress} className="h-2" />
                          <p className="text-xs text-gray-500">
                            {badge.requirement - badge.current} more referrals needed
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info(`Keep referring friends to unlock ${badge.name}!`);
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full border-slate-600 text-gray-400 hover:text-gray-300"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View Progress
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-400">All badges unlocked! 🎉</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Display Tab */}
          <TabsContent value="profile" className="space-y-6">
            <UserProfileBadges
              displayedBadges={displayedBadges.map((b) => ({
                id: b.id,
                name: b.name,
                tier: b.tier,
                icon: b.icon,
                color: b.color,
              }))}
              totalBadges={mockBadges.length}
              onUpdateDisplay={(badgeId, display) => {
                toast.success(display ? "Badge added to profile" : "Badge removed from profile");
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Badge Details Modal with Social Sharing */}
        {selectedBadge && (
          <Card className="bg-slate-800 border-slate-700 fixed bottom-6 right-6 w-96 max-w-[90vw] animate-in fade-in slide-in-from-bottom-4 duration-300 shadow-2xl">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-white">{selectedBadge.name}</CardTitle>
                <CardDescription className="text-gray-400">{selectedBadge.tier} Tier</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedBadge(null);
                  setShowUnlockRequirements(false);
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-6xl text-center animate-bounce">{selectedBadge.icon}</div>
              <p className="text-gray-300">{selectedBadge.description}</p>

              {/* Show unlock requirements if badge is locked */}
              {!selectedBadge.unlockedAt && showUnlockRequirements && (
                <div className="space-y-3 bg-slate-900 rounded-lg p-3 border border-slate-700">
                  <p className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Unlock Requirements
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>Refer {selectedBadge.requirement} friends to Codelearnify</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>Each referred friend must complete onboarding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>Reward: {selectedBadge.requirement * 100} XP bonus</span>
                    </li>
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-gray-300">
                    {selectedBadge.current}/{selectedBadge.requirement}
                  </span>
                </div>
                <Progress value={selectedBadge.progress} className="h-2" />
              </div>

              {/* Social Sharing Buttons in Modal */}
              {selectedBadge.unlockedAt && (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => handleShareBadge(selectedBadge, 'twitter')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() => handleShareBadge(selectedBadge, 'linkedin')}
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
                    size="sm"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              )}

              <Button
                onClick={() => {
                  setSelectedBadge(null);
                  setShowUnlockRequirements(false);
                }}
                variant="outline"
                className="w-full border-slate-600 text-gray-300 hover:text-white"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
