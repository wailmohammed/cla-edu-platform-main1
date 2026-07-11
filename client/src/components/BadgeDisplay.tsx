import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Lock } from "lucide-react";
import { toast } from "sonner";

export interface BadgeData {
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

interface BadgeDisplayProps {
  badges: BadgeData[];
  onShare?: (badgeId: string) => void;
}

export function BadgeDisplay({ badges, onShare }: BadgeDisplayProps) {
  const handleShare = (badge: BadgeData) => {
    if (badge.unlockedAt) {
      onShare?.(badge.id);
      toast.success(`Shared ${badge.name} on social media!`);
    } else {
      toast.error("Unlock this badge first!");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <Card
            key={badge.id}
            className={`relative overflow-hidden transition-all hover:shadow-lg ${
              badge.unlockedAt ? "border-2 border-yellow-400" : "opacity-60"
            }`}
          >
            {/* Background gradient based on tier */}
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundColor: badge.color }}
            />

            <CardHeader className="relative">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{badge.name}</CardTitle>
                  <CardDescription>{badge.tier} Tier</CardDescription>
                </div>
                <div className="text-4xl">{badge.icon}</div>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-4">
              <p className="text-sm text-gray-600">{badge.description}</p>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">Progress</span>
                  <span className="text-gray-500">
                    {badge.current}/{badge.requirement}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r h-2 rounded-full transition-all"
                    style={{
                      width: `${badge.progress}%`,
                      backgroundColor: badge.color,
                    }}
                  />
                </div>
              </div>

              {/* Status badge */}
              <div className="flex items-center justify-between">
                {badge.unlockedAt ? (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">✓ Unlocked</Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(badge.unlockedAt).toLocaleDateString()}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Lock className="w-3 h-3" />
                      Locked
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {badge.requirement - badge.current} to go
                    </span>
                  </div>
                )}
              </div>

              {/* Share button */}
              {badge.unlockedAt && (
                <Button
                  onClick={() => handleShare(badge)}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Badge
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default BadgeDisplay;
