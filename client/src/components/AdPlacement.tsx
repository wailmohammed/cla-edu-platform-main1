import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { X, Zap } from "lucide-react";
import { toast } from "sonner";
import AdSenseAd from "./AdSenseAd";

interface AdPlacementProps {
  position: "sidebar" | "between-sections" | "bottom" | "top";
  sectionId?: string;
  className?: string;
}

export default function AdPlacement({
  position,
  sectionId,
  className = "",
}: AdPlacementProps) {
  const { user } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const upgradeSubscription = trpc.subscription.upgrade.useMutation();

  // Only show ads for free tier users
  if (user?.subscriptionTier !== "free") {
    return null;
  }

  const getAdSlot = () => {
    switch (position) {
      case "sidebar":
        return "1234567890"; // Sidebar ad slot
      case "between-sections":
        return "0987654321"; // Between sections ad slot
      case "bottom":
        return "5555555555"; // Bottom ad slot
      case "top":
        return "6666666666"; // Top ad slot
      default:
        return "1234567890";
    }
  };

  const getAdFormat = () => {
    switch (position) {
      case "sidebar":
        return "vertical" as const;
      case "between-sections":
        return "horizontal" as const;
      case "bottom":
        return "auto" as const;
      case "top":
        return "auto" as const;
      default:
        return "auto" as const;
    }
  };

  const handleRemoveAds = async () => {
    try {
      setIsUpgrading(true);
      const session = await upgradeSubscription.mutateAsync({ plan: "premium" });

      // Redirect to Stripe checkout
      if (session.url) {
        window.location.href = session.url;
      } else {
        toast.error("Failed to create checkout session");
        setIsUpgrading(false);
      }
    } catch (error) {
      toast.error("Failed to start upgrade. Please try again.");
      setIsUpgrading(false);
    }
  };

  return (
    <div
      className={`ad-placement ad-placement-${position} relative group ${className}`}
      data-position={position}
      data-section={sectionId}
    >
      <div className="relative">
        <AdSenseAd
          adSlot={getAdSlot()}
          adFormat={getAdFormat()}
          fullWidth={position === "between-sections" || position === "top" || position === "bottom"}
        />

        {/* Remove Ads Button Overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <Button
            onClick={handleRemoveAds}
            disabled={isUpgrading}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-1.5"
            title="Remove ads by upgrading to Premium"
          >
            {isUpgrading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Upgrading...
              </>
            ) : (
              <>
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove Ads</span>
                <span className="sm:hidden">Ad-Free</span>
              </>
            )}
          </Button>
        </div>

        {/* Premium Badge Info */}
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-md px-2 py-1 shadow-md border border-blue-200">
            <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700">
              <Zap className="w-3 h-3" />
              <span>Premium: Ad-Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle CTA for non-hover states (mobile) */}
      <div className="sm:hidden mt-2 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md p-2">
        <span className="text-xs font-medium text-blue-900">Ads powered by AdSense</span>
        <Button
          onClick={handleRemoveAds}
          disabled={isUpgrading}
          size="sm"
          variant="outline"
          className="h-6 text-xs gap-1"
        >
          {isUpgrading ? "..." : "Remove"}
        </Button>
      </div>
    </div>
  );
}
