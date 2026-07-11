import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";

export default function Pricing() {
  const { user, isAuthenticated, getLoginUrl } = useAuth();
  const [, navigate] = useLocation();
  const { data: subscription } = trpc.subscription.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleUpgrade = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    navigate("/payment");
  };

  const handleGetStarted = () => {
    if (isAuthenticated) { navigate("/courses"); } else { navigate("/signup"); }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "Forever",
      description: "Perfect for getting started",
      cta: "Get Started",
      features: [
        { name: "Access to beginner courses", included: true },
        { name: "Basic Python & JavaScript courses", included: true },
        { name: "Limited exercises (5 per course)", included: true },
        { name: "Daily streaks & XP tracking", included: true },
        { name: "Basic badges", included: true },
        { name: "Community leaderboard", included: true },
        { name: "Advanced courses", included: false },
        { name: "AI tutor assistance", included: false },
        { name: "Priority support", included: false },
        { name: "Unlimited exercises", included: false },
      ],
      highlighted: false,
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "per month",
      description: "For serious learners",
      cta: "Upgrade Now",
      features: [
        { name: "Access to all courses", included: true },
        { name: "All programming languages", included: true },
        { name: "Unlimited exercises", included: true },
        { name: "Daily streaks & XP tracking", included: true },
        { name: "All badges & achievements", included: true },
        { name: "Global leaderboard", included: true },
        { name: "Advanced courses (Data Science, DevOps)", included: true },
        { name: "AI tutor assistance", included: true },
        { name: "Priority support", included: true },
        { name: "Certificate downloads", included: true },
      ],
      highlighted: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Simple, Transparent Pricing</h1>
          <p className="text-slate-600 mt-1">Choose the plan that fits your learning goals</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.highlighted
                  ? "border-2 border-blue-500 shadow-xl scale-105 md:scale-100"
                  : "border-slate-200"
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-6">
                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600">/{plan.period}</span>
                  </div>
                </div>

                {/* CTA Button */}
                 <Button
                   className="w-full"
                   variant={plan.highlighted ? "default" : "outline"}
                   size="lg"
                   onClick={() => plan.name === "Premium" ? handleUpgrade() : handleGetStarted()}
                   disabled={isAuthenticated && subscription?.plan === plan.name.toLowerCase()}
                 >
                   {(isAuthenticated && subscription?.plan === plan.name.toLowerCase())
                     ? "Current Plan"
                     : plan.cta}
                 </Button>

                {/* Features */}
                <div className="space-y-3 pt-6 border-t border-slate-200">
                  {plan.features.map((feature) => (
                    <div key={feature.name} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-slate-700" : "text-slate-400"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: "Can I change my plan anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "Is there a free trial?",
                a: "The Free plan is our permanent trial. Get started with beginner courses at no cost.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, and digital payment methods through Stripe.",
              },
              {
                q: "Can I get a refund?",
                a: "Yes, we offer a 7-day money-back guarantee if you're not satisfied with Premium.",
              },
              {
                q: "Do you offer team or group discounts?",
                a: "Contact our support team for bulk pricing and team subscription options.",
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. We use industry-standard encryption and security practices to protect your data.",
              },
            ].map((faq, i) => (
              <div key={i}>
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to level up your coding skills?</h2>
          <p className="mb-6 opacity-90">Join thousands of learners mastering programming with Codelearnify</p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-slate-100"
            onClick={() => {
              if (isAuthenticated) {
                window.location.href = "/dashboard";
              } else {
                window.location.href = "/";
              }
            }}
          >
            Get Started Today
          </Button>
        </div>
      </main>
    </div>
  );
}
