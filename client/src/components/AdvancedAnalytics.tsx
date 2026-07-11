import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { BarChart, TrendingUp, Target, Zap, Brain } from "lucide-react";

export default function AdvancedAnalytics() {
  // Fetch ML insights
  const { data: predictData } = trpc.enhancements.mlInsights.predictLearningOutcome.useQuery({
    courseId: 1,
    daysAhead: 30,
  });

  const { data: patternsData } = trpc.enhancements.mlInsights.detectLearningPatterns.useQuery({
    userId: 1,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Learning Outcome Prediction */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-purple-600" />
            Learning Prediction
          </CardTitle>
          <CardDescription>30-day forecast</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Completion Probability</span>
              <Badge className="bg-green-600">
                {Math.round(((predictData as any)?.completionProbability || 0) * 100)}%
              </Badge>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{
                  width: `${((predictData as any)?.completionProbability || 0) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-xs font-semibold text-blue-900 mb-1">Estimated Completion:</p>
            <p className="text-sm text-blue-800">
              {(predictData as any)?.estimatedCompletionDate
                ? new Date((predictData as any).estimatedCompletionDate).toLocaleDateString()
                : "Calculating..."}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Recommendations:</p>
            <ul className="space-y-1">
              {((predictData as any)?.recommendations as string[])?.length > 0 ? (
                ((predictData as any).recommendations as string[]).map((rec: string, i: number) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    {rec}
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-600">
                  Keep up consistent practice for best results
                </li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Learning Patterns */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Learning Patterns
          </CardTitle>
          <CardDescription>AI-detected insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* Patterns */}
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Patterns Detected:</p>
              <div className="space-y-1">
                {((patternsData as any)?.patterns as string[])?.length > 0 ? (
                  ((patternsData as any).patterns as string[]).map((pattern: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {pattern}
                    </Badge>
                  ))
                ) : (
                  <>
                    <Badge variant="outline" className="text-xs">
                      Morning Learner
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Consistent Pace
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Visual Learner
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Anomalies */}
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Anomalies:</p>
              {((patternsData as any)?.anomalies as string[])?.length > 0 ? (
                <div className="p-2 bg-amber-50 rounded-md border border-amber-200">
                  {((patternsData as any).anomalies as string[]).map((anomaly: string, i: number) => (
                    <p key={i} className="text-xs text-amber-800">
                      ⚠️ {anomaly}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-600">No anomalies detected</p>
              )}
            </div>

            {/* Insights */}
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Key Insights:</p>
              <div className="space-y-1">
                {((patternsData as any)?.insights as string[])?.length > 0 ? (
                  ((patternsData as any).insights as string[]).map((insight: string, i: number) => (
                    <p key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <Zap className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                      {insight}
                    </p>
                  ))
                ) : (
                  <p className="text-xs text-slate-600">
                    You're making steady progress. Keep practicing daily for best results.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart className="w-5 h-5 text-green-600" />
            Performance Metrics
          </CardTitle>
          <CardDescription>Your learning statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-xs text-blue-600 font-semibold mb-1">Total XP</p>
              <p className="text-2xl font-bold text-blue-900">2,450</p>
              <p className="text-xs text-blue-700 mt-1">+125 this week</p>
            </div>

            <div className="p-3 bg-purple-50 rounded-md border border-purple-200">
              <p className="text-xs text-purple-600 font-semibold mb-1">Streak</p>
              <p className="text-2xl font-bold text-purple-900">12</p>
              <p className="text-xs text-purple-700 mt-1">days</p>
            </div>

            <div className="p-3 bg-green-50 rounded-md border border-green-200">
              <p className="text-xs text-green-600 font-semibold mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-green-900">87%</p>
              <p className="text-xs text-green-700 mt-1">+3% improvement</p>
            </div>

            <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <p className="text-xs text-yellow-600 font-semibold mb-1">Rank</p>
              <p className="text-2xl font-bold text-yellow-900">#42</p>
              <p className="text-xs text-yellow-700 mt-1">global</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
