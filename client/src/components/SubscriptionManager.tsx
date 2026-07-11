import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, ArrowRight, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export function SubscriptionManager() {
  const { data: subscription, isLoading } = trpc.subscription.getStatus.useQuery();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const upgradeSubscription = trpc.subscription.upgrade.useMutation();

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      const session = await upgradeSubscription.mutateAsync({ plan: 'premium' });
      
      // Redirect to Stripe checkout
      if (session.url) {
        window.location.href = session.url;
      } else {
        toast.error('Failed to create checkout session');
        setIsUpgrading(false);
      }
    } catch (error) {
      toast.error('Failed to start upgrade. Please try again.');
      setIsUpgrading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
        <CardHeader>
          <div className="h-6 bg-slate-200 rounded animate-pulse w-32" />
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-48" />
        </CardContent>
      </Card>
    );
  }

  const isFree = subscription?.plan === "free";
  const isPremium = subscription?.plan === "premium";

  return (
    <Card className={`border-2 ${isFree ? "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300" : "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300"}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className={`w-5 h-5 ${isPremium ? "text-amber-500" : "text-slate-400"}`} />
              Current Plan
            </CardTitle>
            <CardDescription>
              {isFree ? "Upgrade to unlock premium features" : "You have access to all premium features"}
            </CardDescription>
          </div>
          <Badge variant={isPremium ? "default" : "secondary"} className="text-lg px-3 py-1">
            {subscription?.plan?.charAt(0).toUpperCase()}{subscription?.plan?.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Plan Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-slate-600">Status</p>
            <p className="text-lg font-semibold text-slate-900 capitalize">
              {subscription?.status || "Active"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Billing Cycle</p>
            <p className="text-lg font-semibold text-slate-900">Monthly</p>
          </div>
        </div>

        {/* Free Tier Features */}
        {isFree && (
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <p className="text-sm font-semibold text-slate-900">Free Tier Includes:</p>
            <ul className="space-y-2">
              {["Access to 50+ courses", "Basic code editor", "Community support", "Progress tracking"].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Premium Tier Features */}
        {isPremium && (
          <div className="space-y-3 pt-4 border-t border-amber-200">
            <p className="text-sm font-semibold text-slate-900">Premium Features:</p>
            <ul className="space-y-2">
              {[
                "All free tier features",
                "Advanced AI tutor",
                "Priority support",
                "Certificate generation",
                "Advanced analytics",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-2">
          {isFree ? (
            <Button 
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold"
            >
              {isUpgrading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Upgrade to Premium
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          )}
        </div>

        {/* Next Billing Date */}
        <p className="text-xs text-slate-500 text-center">
          {isFree ? "No billing information" : "Next billing date: " + new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}
        </p>

        {/* Upgrade Info */}
        {isFree && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            <p className="font-semibold mb-1">💡 Premium Benefits:</p>
            <p>Unlock advanced features, priority support, and exclusive content to accelerate your learning journey.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
