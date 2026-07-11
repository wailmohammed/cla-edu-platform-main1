import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { RotateCcw, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function SpacedRepetitionReview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Fetch review items
  const { data: reviewData, isLoading } = trpc.enhancements.spacedRepetition.getReviewItems.useQuery(
    { limit: 10 }
  );

  // Record review mutation
  const recordMutation = trpc.enhancements.spacedRepetition.recordReview.useMutation();

  const items = (reviewData?.items as any[]) || [];
  const currentItem = items[currentIndex] as any;
  const progress = items.length > 0 ? ((currentIndex + 1) / items.length) * 100 : 0;

  const handleReview = async (difficulty: "easy" | "medium" | "hard") => {
    try {
      if (!currentItem) return;

      await recordMutation.mutateAsync({
        itemId: currentItem.id,
        difficulty,
        timeSpent: 30, // placeholder
      });

      toast.success(`Marked as ${difficulty}!`);

      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        toast.success("Review session complete!");
        setCurrentIndex(0);
      }
    } catch (error) {
      toast.error("Failed to record review");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-slate-600">Loading review items...</p>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            All Caught Up!
          </CardTitle>
          <CardDescription>No items due for review right now</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Your next review items will be available based on your learning schedule.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-blue-600" />
              Spaced Repetition Review
            </CardTitle>
            <CardDescription>
              {currentIndex + 1} of {items.length} items
            </CardDescription>
          </div>
          <Badge variant="outline">{Math.round(progress)}%</Badge>
        </div>
        <Progress value={progress} />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        {currentItem && (
          <div className="space-y-4">
            {/* Question Card */}
            <Card className="bg-slate-50">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-900 mb-2">Question:</p>
                <p className="text-base text-slate-700">{(currentItem as any)?.question || "Review this item"}</p>
              </CardContent>
            </Card>

            {/* Answer Card */}
            {showAnswer && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-green-900 mb-2">Answer:</p>
                  <p className="text-base text-green-800">{(currentItem as any)?.answer || "Good job!"}</p>
                </CardContent>
              </Card>
            )}

            {/* Show Answer Button */}
            {!showAnswer && (
              <Button onClick={() => setShowAnswer(true)} variant="outline" className="w-full">
                Show Answer
              </Button>
            )}

            {/* Difficulty Buttons */}
            {showAnswer && (
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleReview("hard")}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  disabled={recordMutation.isPending}
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Hard
                </Button>
                <Button
                  onClick={() => handleReview("medium")}
                  variant="outline"
                  className="text-amber-600 border-amber-200 hover:bg-amber-50"
                  disabled={recordMutation.isPending}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Medium
                </Button>
                <Button
                  onClick={() => handleReview("easy")}
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  disabled={recordMutation.isPending}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Easy
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Stats Footer */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 mt-4">
          <div className="text-center">
            <p className="text-xs text-slate-600">Next Review</p>
            <p className="text-sm font-semibold text-slate-900">
              {reviewData?.nextReviewTime
                ? new Date(reviewData.nextReviewTime).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600">Streak</p>
            <p className="text-sm font-semibold text-slate-900">7 days</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600">Retention</p>
            <p className="text-sm font-semibold text-slate-900">85%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
