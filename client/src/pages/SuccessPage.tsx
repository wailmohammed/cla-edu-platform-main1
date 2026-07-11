import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Share2, ArrowRight, Twitter, Linkedin, Copy } from "lucide-react";
import { toast } from "sonner";

export default function SuccessPage() {
  const [, navigate] = useLocation();
  const [countdown, setCountdown] = useState(5);
  const [celebrationComplete, setCelebrationComplete] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    const triggerConfetti = () => {
      // Main confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FFA500", "#FF6347", "#4169E1", "#00FF00"],
      });

      // Side bursts
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ["#FFD700", "#FFA500"],
        });
      }, 100);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ["#4169E1", "#00FF00"],
        });
      }, 200);

      setCelebrationComplete(true);
    };

    triggerConfetti();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleShare = (platform: 'twitter' | 'linkedin' | 'copy') => {
    const message = "🎉 I just upgraded to Premium on Codelearnify! Unlock exclusive features and accelerate my learning journey. Join me today!";
    const url = window.location.origin;

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}&hashtags=Codelearnify,Premium,Learning`,
          '_blank',
          'width=600,height=400'
        );
        toast.success('Opening Twitter...');
        break;

      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank',
          'width=600,height=400'
        );
        toast.success('Opening LinkedIn...');
        break;

      case 'copy':
        navigator.clipboard.writeText(`${message}\n\n${url}`);
        toast.success('Copied to clipboard!');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Main Success Card */}
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/50 shadow-2xl shadow-green-500/20 animate-in fade-in scale-in duration-500">
          <CardContent className="pt-12 pb-8">
            <div className="text-center space-y-6">
              {/* Animated Checkmark */}
              <div className="flex justify-center">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle2 className="w-24 h-24 text-green-500 animate-bounce" />
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-2">
                <h1 className="text-5xl font-bold text-white">Success! 🎉</h1>
                <p className="text-xl text-gray-300">
                  You've successfully upgraded to Premium
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-slate-800/50 rounded-lg p-6 space-y-3 border border-slate-700">
                <p className="text-sm font-semibold text-gray-300 text-left">
                  Your Premium benefits are now active:
                </p>
                <ul className="space-y-2 text-left">
                  {[
                    "Unlimited access to all courses",
                    "Ad-free learning experience",
                    "Priority support",
                    "Exclusive premium badges",
                    "Advanced analytics and insights",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Share Section */}
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Share your achievement with friends</p>
                <div className="flex gap-3 flex-wrap justify-center">
                  <Button
                    onClick={() => handleShare('twitter')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() => handleShare('linkedin')}
                    className="bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    onClick={() => handleShare('copy')}
                    variant="outline"
                    className="border-slate-600 text-gray-300 hover:text-white"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 flex-wrap justify-center pt-4">
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                  size="lg"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => navigate("/courses")}
                  variant="outline"
                  className="border-slate-600 text-gray-300 hover:text-white px-8"
                  size="lg"
                >
                  Start Learning
                </Button>
              </div>

              {/* Auto-redirect Timer */}
              <div className="pt-4">
                <p className="text-sm text-gray-400">
                  Redirecting to dashboard in{" "}
                  <Badge variant="secondary" className="ml-2">
                    {countdown}s
                  </Badge>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Next Steps */}
          <Card className="bg-slate-800 border-slate-700 animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
            <CardHeader>
              <CardTitle className="text-white text-lg">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-500 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-300">Complete Your Profile</p>
                  <p className="text-xs text-gray-400">Add a profile picture and bio</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-500 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-300">Choose Your Path</p>
                  <p className="text-xs text-gray-400">Select a learning path to get started</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-500 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-300">Start Learning</p>
                  <p className="text-xs text-gray-400">Begin your first course today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="bg-slate-800 border-slate-700 animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
            <CardHeader>
              <CardTitle className="text-white text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-300">
                Our support team is here to help you get the most out of your Premium membership.
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-gray-300 hover:text-white justify-start"
                  onClick={() => window.location.href = "mailto:support@codelearnify.com"}
                >
                  📧 Contact Support
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-gray-300 hover:text-white justify-start"
                  onClick={() => window.location.href = "/community"}
                >
                  ❓ View FAQ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
