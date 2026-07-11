import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Share2,
  Copy,
  Users,
  Gift,
  TrendingUp,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Trophy,
  Zap,
} from "lucide-react";

export function ReferralSystem() {
  const [copiedCode, setCopiedCode] = useState(false);

  const statsQuery = trpc.referral.getReferralStats.useQuery();
  const referredUsersQuery = trpc.referral.getReferredUsers.useQuery({ limit: 20 });
  const tiersQuery = trpc.referral.getReferralTiers.useQuery();
  const rewardsHistoryQuery = trpc.referral.getRewardsHistory.useQuery({ limit: 20 });
  const leaderboardQuery = trpc.referral.getReferralLeaderboard.useQuery({ limit: 10 });
  const faqQuery = trpc.referral.getReferralFAQ.useQuery();

  const shareReferralMutation = trpc.referral.shareReferralLink.useMutation({
    onSuccess: (data) => {
      toast.success(`Shared on ${data.platform}!`);
    },
    onError: () => {
      toast.error("Failed to share referral link");
    },
  });

  const claimBonusMutation = trpc.referral.claimReferralBonus.useMutation({
    onSuccess: (data) => {
      toast.success(`Bonus claimed! +${data.bonusXP} XP`);
    },
    onError: () => {
      toast.error("Failed to claim bonus");
    },
  });

  const handleCopyCode = async () => {
    if (stats?.referralCode) {
      await navigator.clipboard.writeText(stats.referralCode);
      setCopiedCode(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleShare = async (platform: "twitter" | "facebook" | "linkedin" | "whatsapp" | "email") => {
    await shareReferralMutation.mutateAsync({
      platform,
      message: `Join me on Codelearnify and get 200 bonus XP! Use my referral code: ${stats?.referralCode}`,
    });
  };

  const stats = statsQuery.data;
  const referredUsers = referredUsersQuery.data?.referredUsers || [];
  const tiers = tiersQuery.data?.tiers || [];
  const rewardsHistory = rewardsHistoryQuery.data?.rewards || [];
  const leaderboard = leaderboardQuery.data?.leaderboard || [];
  const faqs = faqQuery.data?.faqs || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Gift className="w-8 h-8 text-purple-500" />
              Referral Program
            </h1>
            <p className="text-gray-600 mt-1">Earn rewards by inviting friends to Codelearnify</p>
          </div>
        </div>

        {/* Main Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{stats.totalReferrals}</div>
                <p className="text-xs text-gray-500 mt-1">{stats.activeReferrals} active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Bonus XP Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats.totalBonusXP}</div>
                <p className="text-xs text-gray-500 mt-1">from referrals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Courses Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.totalBonusCourses}</div>
                <p className="text-xs text-gray-500 mt-1">free courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{(stats.conversionRate * 100).toFixed(1)}%</div>
                <p className="text-xs text-gray-500 mt-1">of invites converted</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Referral Code Section */}
        {stats && (
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Your Referral Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={stats.referralCode}
                  readOnly
                  className="font-mono text-lg font-bold bg-white"
                />
                <Button
                  onClick={handleCopyCode}
                  variant="outline"
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copiedCode ? "Copied!" : "Copy"}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <Button
                  onClick={() => handleShare("twitter")}
                  variant="outline"
                  className="gap-2"
                  disabled={shareReferralMutation.isPending}
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Button>
                <Button
                  onClick={() => handleShare("facebook")}
                  variant="outline"
                  className="gap-2"
                  disabled={shareReferralMutation.isPending}
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </Button>
                <Button
                  onClick={() => handleShare("linkedin")}
                  variant="outline"
                  className="gap-2"
                  disabled={shareReferralMutation.isPending}
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Button>
                <Button
                  onClick={() => handleShare("whatsapp")}
                  variant="outline"
                  className="gap-2"
                  disabled={shareReferralMutation.isPending}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
                <Button
                  onClick={() => handleShare("email")}
                  variant="outline"
                  className="gap-2"
                  disabled={shareReferralMutation.isPending}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="referred" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="referred">Referred Users</TabsTrigger>
            <TabsTrigger value="tiers">Tier Benefits</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          {/* Referred Users Tab */}
          <TabsContent value="referred" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Your Referred Users
                </CardTitle>
                <CardDescription>Track the status of your referrals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {referredUsers.length > 0 ? (
                    referredUsers.map((user, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-gray-200 hover:border-purple-200 transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status === "active" ? "✓ Active" : "Pending"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Courses</p>
                            <p className="font-semibold text-gray-900">{user.coursesEnrolled}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">XP Earned</p>
                            <p className="font-semibold text-gray-900">{user.xpEarned}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Bonus XP</p>
                            <p className="font-semibold text-purple-600">+{user.bonusXPEarned}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Referred on {new Date(user.referralDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No referrals yet. Start sharing your code!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tier Benefits Tab */}
          <TabsContent value="tiers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Referral Tiers
                </CardTitle>
                <CardDescription>Unlock higher tiers and earn more rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      tier.achieved
                        ? "border-green-200 bg-green-50"
                        : tier.tier === tiersQuery.data?.currentTier
                          ? "border-purple-200 bg-purple-50"
                          : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{tier.tier}</h4>
                        <p className="text-sm text-gray-600">{tier.referralsNeeded} referrals needed</p>
                      </div>
                      {tier.achieved && <Badge className="bg-green-600">Achieved</Badge>}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="p-2 bg-white rounded border border-gray-200">
                        <p className="text-xs text-gray-500">Per Referral</p>
                        <p className="font-semibold text-gray-900">
                          {tier.bonusPerReferral.xp} XP
                          {tier.bonusPerReferral.courses > 0 && ` + ${tier.bonusPerReferral.courses} Course`}
                        </p>
                      </div>
                      <div className="p-2 bg-white rounded border border-gray-200">
                        <p className="text-xs text-gray-500">Tier Bonus</p>
                        <p className="font-semibold text-gray-900">
                          {tier.tierBonus.xp} XP
                          {tier.tierBonus.courses > 0 && ` + ${tier.tierBonus.courses} Courses`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Referral Leaderboard
                </CardTitle>
                <CardDescription>Top referrers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-lg font-bold text-gray-400 w-8">{entry.rank}</div>
                        <div>
                          <p className="font-medium text-gray-900">{entry.name}</p>
                          <Badge variant="secondary">{entry.tier}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{entry.referrals}</div>
                        <p className="text-xs text-gray-500">referrals</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Rewards History
                </CardTitle>
                <CardDescription>Track all your claimed rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {rewardsHistory.length > 0 ? (
                  rewardsHistory.map((reward, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-l-4 ${
                        reward.status === "claimed"
                          ? "border-l-green-500 bg-green-50"
                          : "border-l-yellow-500 bg-yellow-50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{reward.description}</p>
                          <p className="text-sm text-gray-600">{reward.type.replace(/_/g, " ")}</p>
                        </div>
                        <Badge variant={reward.status === "claimed" ? "default" : "secondary"}>
                          {reward.status === "claimed" ? "Claimed" : "Pending"}
                        </Badge>
                      </div>

                      <div className="flex gap-4 text-sm">
                        {reward.xpAwarded > 0 && (
                          <div>
                            <p className="text-gray-500">XP</p>
                            <p className="font-semibold text-purple-600">+{reward.xpAwarded}</p>
                          </div>
                        )}
                        {reward.courseAwarded && (
                          <div>
                            <p className="text-gray-500">Course</p>
                            <p className="font-semibold text-blue-600">{reward.courseAwarded}</p>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        {reward.claimedAt
                          ? `Claimed on ${new Date(reward.claimedAt).toLocaleDateString()}`
                          : "Waiting to be claimed"}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No rewards yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b pb-4 last:border-b-0">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ReferralSystem;
