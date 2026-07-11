import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { Calendar, Flame, BookOpen, Clock, ChevronRight, Zap } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

interface ReviewItem {
  id: string;
  title: string;
  dueDate: Date;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

interface ReviewStats {
  totalReviews: number;
  completedToday: number;
  dueToday: number;
  currentStreak: number;
  longestStreak: number;
  retentionRate: number;
  nextReviewTime?: Date;
}

export default function SpacedRepetitionWidget() {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [upcomingReviews, setUpcomingReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockStats: ReviewStats = {
        totalReviews: 127,
        completedToday: 8,
        dueToday: 15,
        currentStreak: 12,
        longestStreak: 28,
        retentionRate: 87.5,
        nextReviewTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      };

      const mockUpcoming: ReviewItem[] = [
        {
          id: "1",
          title: "Python: List Comprehensions",
          dueDate: new Date(Date.now() + 30 * 60 * 1000),
          interval: 3,
          easeFactor: 2.5,
          repetitions: 5,
        },
        {
          id: "2",
          title: "JavaScript: Async/Await",
          dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
          interval: 7,
          easeFactor: 2.3,
          repetitions: 4,
        },
        {
          id: "3",
          title: "React: Hooks",
          dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
          interval: 14,
          easeFactor: 2.6,
          repetitions: 6,
        },
        {
          id: "4",
          title: "SQL: Joins",
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          interval: 21,
          easeFactor: 2.4,
          repetitions: 5,
        },
      ];

      setStats(mockStats);
      setUpcomingReviews(mockUpcoming);
      setIsLoading(false);
    }, 500);
  }, []);

  const formatTimeUntil = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 85) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-orange-500";
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="h-6 bg-slate-200 rounded animate-pulse w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const completionPercentage = (stats.completedToday / stats.dueToday) * 100;

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Spaced Repetition
            </CardTitle>
            <CardDescription>SM-2 Algorithm Review Schedule</CardDescription>
          </div>
          <Link href="/enhanced?tab=spaced-repetition">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Streak Section */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-purple-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-slate-600">Current Streak</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-purple-700">{stats.currentStreak}</span>
              <span className="text-xs text-slate-500">days</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Best: {stats.longestStreak} days</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium text-slate-600">Retention</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-700">{stats.retentionRate.toFixed(1)}%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Memory strength</p>
          </div>
        </div>

        {/* Daily Progress */}
        <div className="bg-white rounded-lg p-3 border border-purple-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">Today's Progress</span>
            <Badge variant="outline" className="text-xs">
              {stats.completedToday}/{stats.dueToday}
            </Badge>
          </div>
          <Progress
            value={Math.min(completionPercentage, 100)}
          />
          <p className="text-xs text-slate-500">
            {stats.dueToday - stats.completedToday} reviews remaining
          </p>
        </div>

        {/* Upcoming Reviews */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Upcoming Reviews
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {upcomingReviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-md p-2.5 border border-slate-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">
                      {review.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">
                        Due in {formatTimeUntil(review.dueDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs h-5">
                      {review.repetitions}x
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-white rounded-lg p-3 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Total Reviews</span>
            <span className="font-semibold text-slate-900">{stats.totalReviews}</span>
          </div>
          {stats.nextReviewTime && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Next Review</span>
              <span className="font-semibold text-slate-900">
                {formatTimeUntil(stats.nextReviewTime)} from now
              </span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Link href="/enhanced?tab=spaced-repetition">
          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white gap-2">
            <BookOpen className="w-4 h-4" />
            Start Review Session
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
