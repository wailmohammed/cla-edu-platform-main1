import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Settings, Share2 } from "lucide-react";
import { toast } from "sonner";

export interface UserBadge {
  id: string;
  name: string;
  tier: string;
  icon: string;
  color: string;
  position?: number;
}

interface UserProfileBadgesProps {
  displayedBadges: UserBadge[];
  totalBadges: number;
  onUpdateDisplay?: (badgeId: string, display: boolean) => void;
}

export function UserProfileBadges({
  displayedBadges,
  totalBadges,
  onUpdateDisplay,
}: UserProfileBadgesProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleShare = () => {
    const badgeText = displayedBadges.map((b) => `${b.icon} ${b.name}`).join(", ");
    navigator.clipboard.writeText(
      `Check out my badges on Codelearnify: ${badgeText} 🎓`
    );
    toast.success("Badges copied to clipboard!");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <div>
              <CardTitle>Your Badges</CardTitle>
              <CardDescription>
                {displayedBadges.length} of {totalBadges} badges displayed
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              {isEditing ? "Done" : "Edit"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Displayed Badges */}
        <div>
          <h3 className="font-semibold mb-4">Displayed Badges</h3>
          {displayedBadges.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {displayedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all hover:shadow-md"
                  style={{ borderColor: badge.color }}
                >
                  <div className="text-4xl">{badge.icon}</div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">{badge.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {badge.tier}
                    </Badge>
                  </div>
                  {isEditing && (
                    <Button
                      onClick={() => {
                        onUpdateDisplay?.(badge.id, false);
                        toast.success("Badge removed from display");
                      }}
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No badges displayed yet</p>
              <p className="text-sm">Unlock badges to display them on your profile</p>
            </div>
          )}
        </div>

        {/* Badge Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-gray-50">
            <div className="text-2xl font-bold text-yellow-600">
              {displayedBadges.length}
            </div>
            <p className="text-sm text-gray-600">Displayed</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-gray-50">
            <div className="text-2xl font-bold text-purple-600">
              {totalBadges}
            </div>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-gray-50">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((displayedBadges.length / totalBadges) * 100)}%
            </div>
            <p className="text-sm text-gray-600">Completion</p>
          </div>
        </div>

        {/* Badge Showcase */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Badges</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="text-sm text-gray-600">
              Collect badges by reaching referral milestones and completing achievements.
            </div>
          </TabsContent>

          <TabsContent value="locked" className="space-y-4">
            <div className="text-sm text-gray-600">
              Keep referring friends to unlock new badge tiers!
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default UserProfileBadges;
