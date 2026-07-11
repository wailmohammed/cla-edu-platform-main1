import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { Smartphone, Wifi, WifiOff, Download, Upload, Zap } from "lucide-react";
import { toast } from "sonner";

export default function MobileOptimized() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [syncProgress, setSyncProgress] = useState(0);

  // Mobile mutations
  const syncMutation = trpc.enhancements.mobile.syncData.useMutation();
  const { data: offlineData } = trpc.enhancements.mobile.getOfflineData.useQuery();
  const notifyMutation = trpc.enhancements.mobile.requestPushNotification.useMutation();

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      setSyncProgress(0);

      // Simulate sync progress
      for (let i = 0; i <= 100; i += 10) {
        setSyncProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      await syncMutation.mutateAsync({
        lastSyncTime: new Date(),
        changes: [],
      });

      toast.success("Sync complete!");
    } catch (error) {
      toast.error("Sync failed");
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  const handleRequestNotification = async (type: "streak" | "challenge" | "achievement") => {
    try {
      await notifyMutation.mutateAsync({
        title: "Codelearnify Update",
        message: `You have a new ${type}!`,
        type,
      });
      toast.success("Notification requested!");
    } catch (error) {
      toast.error("Failed to request notification");
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                Mobile Status
              </CardTitle>
              <CardDescription>Offline-first synchronization</CardDescription>
            </div>
            <Badge className={isOnline ? "bg-green-600" : "bg-red-600"}>
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Sync Section */}
          <div className="space-y-3 p-3 bg-slate-50 rounded-md border border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Data Synchronization</p>
              <Badge variant="outline" className="text-xs">
                {isSyncing ? "Syncing..." : "Ready"}
              </Badge>
            </div>

            {isSyncing && (
              <div className="space-y-2">
                <Progress value={syncProgress} className="h-2" />
                <p className="text-xs text-slate-600">{syncProgress}% complete</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-white rounded border border-slate-200">
                <p className="text-slate-600">Courses</p>
                <p className="font-semibold text-slate-900">12</p>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <p className="text-slate-600">Lessons</p>
                <p className="font-semibold text-slate-900">
                  {(offlineData as any)?.lessons?.length || 0}
                </p>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <p className="text-slate-600">Exercises</p>
                <p className="font-semibold text-slate-900">
                  {(offlineData as any)?.exercises?.length || 0}
                </p>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <p className="text-slate-600">Storage</p>
                <p className="font-semibold text-slate-900">245 MB</p>
              </div>
            </div>

            <Button
              onClick={handleSync}
              disabled={isSyncing || !isOnline}
              className="w-full"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              {isSyncing ? "Syncing..." : "Sync Now"}
            </Button>
          </div>

          {/* Offline Features */}
          <div className="space-y-2 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-sm font-medium text-blue-900">Offline Features</p>
            <ul className="space-y-1 text-xs text-blue-800">
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                Access downloaded courses offline
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                Complete exercises and quizzes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                Auto-sync when online
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Push Notifications
          </CardTitle>
          <CardDescription>Stay motivated with timely reminders</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={() => handleRequestNotification("streak")}
              variant="outline"
              className="justify-start"
            >
              <span className="text-lg mr-2">🔥</span>
              <div className="text-left">
                <p className="text-sm font-medium">Streak Reminder</p>
                <p className="text-xs text-slate-600">Don't break your learning streak</p>
              </div>
            </Button>

            <Button
              onClick={() => handleRequestNotification("challenge")}
              variant="outline"
              className="justify-start"
            >
              <span className="text-lg mr-2">🎯</span>
              <div className="text-left">
                <p className="text-sm font-medium">Daily Challenge</p>
                <p className="text-xs text-slate-600">New challenge available</p>
              </div>
            </Button>

            <Button
              onClick={() => handleRequestNotification("achievement")}
              variant="outline"
              className="justify-start"
            >
              <span className="text-lg mr-2">🏆</span>
              <div className="text-left">
                <p className="text-sm font-medium">Achievement Unlocked</p>
                <p className="text-xs text-slate-600">You've earned a new badge</p>
              </div>
            </Button>
          </div>

          <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
            <p className="text-xs font-semibold text-amber-900 mb-1">💡 Tip:</p>
            <p className="text-xs text-amber-800">
              Enable notifications to get reminders about your learning goals and achievements.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Offline Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-green-600" />
            Downloaded Content
          </CardTitle>
          <CardDescription>Available for offline learning</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {(offlineData as any)?.courses?.length > 0 ? (
            (offlineData as any).courses.map((course: any, i: number) => (
              <div key={i} className="p-3 border border-slate-200 rounded-md">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-slate-900">{course.title || "Course"}</h4>
                  <Badge variant="outline" className="text-xs">
                    {course.size || "45"} MB
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  {course.lessonsCount || 12} lessons • {course.exercisesCount || 24} exercises
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  <Upload className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600 text-center py-4">
              No courses downloaded yet. Download courses to study offline.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
