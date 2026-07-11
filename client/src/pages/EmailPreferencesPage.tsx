import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Bell, Clock, BarChart3, Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface EmailPreferences {
  streakReminders: boolean;
  referralBonuses: boolean;
  achievements: boolean;
  eventInvitations: boolean;
  certificates: boolean;
  newsletter: boolean;
  frequency: "immediate" | "daily" | "weekly";
  quietHoursStart: string;
  quietHoursEnd: string;
  timezone: string;
}

interface EmailLog {
  id: string;
  templateId: string;
  subject: string;
  sentAt: string;
  status: "delivered" | "opened" | "clicked" | "bounced";
  opens: number;
  clicks: number;
}

const mockEmailLogs: EmailLog[] = [
  {
    id: "email_1",
    templateId: "streak_reminder",
    subject: "🔥 Keep Your Streak Alive!",
    sentAt: "2026-06-06T09:00:00Z",
    status: "opened",
    opens: 1,
    clicks: 0,
  },
  {
    id: "email_2",
    templateId: "referral_bonus",
    subject: "🎉 Referral Bonus Earned!",
    sentAt: "2026-06-05T14:30:00Z",
    status: "clicked",
    opens: 1,
    clicks: 1,
  },
  {
    id: "email_3",
    templateId: "achievement_unlocked",
    subject: "🏆 Achievement Unlocked",
    sentAt: "2026-06-04T10:15:00Z",
    status: "delivered",
    opens: 0,
    clicks: 0,
  },
  {
    id: "email_4",
    templateId: "event_invitation",
    subject: "📅 You're Invited: Python Bootcamp",
    sentAt: "2026-06-03T16:45:00Z",
    status: "opened",
    opens: 1,
    clicks: 0,
  },
  {
    id: "email_5",
    templateId: "certificate_earned",
    subject: "🎓 Certificate Earned: JavaScript Mastery",
    sentAt: "2026-06-02T11:20:00Z",
    status: "opened",
    opens: 1,
    clicks: 1,
  },
];

export default function EmailPreferencesPage() {
  const [preferences, setPreferences] = useState<EmailPreferences>({
    streakReminders: true,
    referralBonuses: true,
    achievements: true,
    eventInvitations: true,
    certificates: true,
    newsletter: true,
    frequency: "daily",
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    timezone: "UTC",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(true);

  const handlePreferenceChange = (key: keyof EmailPreferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSavePreferences = () => {
    toast.success("Email preferences saved successfully!");
    setHasChanges(false);
  };

  const handleResetPreferences = () => {
    setPreferences({
      streakReminders: true,
      referralBonuses: true,
      achievements: true,
      eventInvitations: true,
      certificates: true,
      newsletter: true,
      frequency: "daily",
      quietHoursStart: "22:00",
      quietHoursEnd: "08:00",
      timezone: "UTC",
    });
    setHasChanges(false);
    toast.success("Preferences reset to defaults");
  };

  const handleTestEmail = () => {
    toast.success("Test email sent to your inbox!");
  };

  const handleUnsubscribe = () => {
    setIsSubscribed(false);
    toast.success("You've been unsubscribed from all emails");
  };

  const handleResubscribe = () => {
    setIsSubscribed(true);
    toast.success("You've been resubscribed to emails");
  };

  const stats = {
    totalSent: mockEmailLogs.length,
    totalOpened: mockEmailLogs.filter((e) => e.status !== "bounced").length,
    openRate: Math.round(
      (mockEmailLogs.filter((e) => e.opens > 0).length / mockEmailLogs.length) * 100
    ),
    clickRate: Math.round(
      (mockEmailLogs.filter((e) => e.clicks > 0).length / mockEmailLogs.length) * 100
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-white">Email Preferences</h1>
          </div>
          <p className="text-gray-400">Manage your email notifications and communication preferences</p>
        </div>

        {/* Subscription Status */}
        {!isSubscribed && (
          <Card className="bg-yellow-900 border-yellow-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 font-semibold">You're currently unsubscribed</p>
                  <p className="text-yellow-200 text-sm">You won't receive any emails from Codelearnify</p>
                </div>
                <Button onClick={handleResubscribe} className="bg-yellow-600 hover:bg-yellow-700">
                  Resubscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">{stats.totalSent}</div>
                <p className="text-sm text-gray-400 mt-2">Emails Sent</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">{stats.totalOpened}</div>
                <p className="text-sm text-gray-400 mt-2">Emails Opened</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">{stats.openRate}%</div>
                <p className="text-sm text-gray-400 mt-2">Open Rate</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">{stats.clickRate}%</div>
                <p className="text-sm text-gray-400 mt-2">Click Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
            <TabsTrigger value="notifications" className="text-gray-300 data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-gray-300 data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="history" className="text-gray-300 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Email Types</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose which types of emails you'd like to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Streak Reminders */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700">
                  <div className="flex-1">
                    <Label className="text-white font-semibold">🔥 Streak Reminders</Label>
                    <p className="text-sm text-gray-400 mt-1">Daily reminders to maintain your learning streak</p>
                  </div>
                  <Switch
                    checked={preferences.streakReminders}
                    onCheckedChange={(value) =>
                      handlePreferenceChange("streakReminders", value)
                    }
                  />
                </div>

                {/* Referral Bonuses */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700">
                  <div className="flex-1">
                    <Label className="text-white font-semibold">🎉 Referral Bonuses</Label>
                    <p className="text-sm text-gray-400 mt-1">Notifications when your referrals sign up</p>
                  </div>
                  <Switch
                    checked={preferences.referralBonuses}
                    onCheckedChange={(value) =>
                      handlePreferenceChange("referralBonuses", value)
                    }
                  />
                </div>

                {/* Achievements */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700">
                  <div className="flex-1">
                    <Label className="text-white font-semibold">🏆 Achievements</Label>
                    <p className="text-sm text-gray-400 mt-1">Celebrate when you unlock new achievements</p>
                  </div>
                  <Switch
                    checked={preferences.achievements}
                    onCheckedChange={(value) =>
                      handlePreferenceChange("achievements", value)
                    }
                  />
                </div>

                {/* Event Invitations */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700">
                  <div className="flex-1">
                    <Label className="text-white font-semibold">📅 Event Invitations</Label>
                    <p className="text-sm text-gray-400 mt-1">Invitations to community events and webinars</p>
                  </div>
                  <Switch
                    checked={preferences.eventInvitations}
                    onCheckedChange={(value) =>
                      handlePreferenceChange("eventInvitations", value)
                    }
                  />
                </div>

                {/* Certificates */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700">
                  <div className="flex-1">
                    <Label className="text-white font-semibold">🎓 Certificates</Label>
                    <p className="text-sm text-gray-400 mt-1">Notifications when you earn certificates</p>
                  </div>
                  <Switch
                    checked={preferences.certificates}
                    onCheckedChange={(value) =>
                      handlePreferenceChange("certificates", value)
                    }
                  />
                </div>

                {/* Newsletter */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700">
                  <div className="flex-1">
                    <Label className="text-white font-semibold">📰 Newsletter</Label>
                    <p className="text-sm text-gray-400 mt-1">Weekly digest of new courses and community highlights</p>
                  </div>
                  <Switch
                    checked={preferences.newsletter}
                    onCheckedChange={(value) =>
                      handlePreferenceChange("newsletter", value)
                    }
                  />
                </div>

                {/* Email Frequency */}
                <div className="p-4 rounded-lg bg-slate-700 space-y-3">
                  <Label className="text-white font-semibold">Email Frequency</Label>
                  <Select
                    value={preferences.frequency}
                    onValueChange={(value) =>
                      handlePreferenceChange("frequency", value as "immediate" | "daily" | "weekly")
                    }
                  >
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="immediate" className="text-white">
                        Immediate
                      </SelectItem>
                      <SelectItem value="daily" className="text-white">
                        Daily Digest
                      </SelectItem>
                      <SelectItem value="weekly" className="text-white">
                        Weekly Digest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSavePreferences}
                    disabled={!hasChanges}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save Preferences
                  </Button>
                  <Button
                    onClick={handleResetPreferences}
                    variant="outline"
                    className="flex-1 border-slate-600 text-gray-300 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quiet Hours</CardTitle>
                <CardDescription className="text-gray-400">
                  Set times when you don't want to receive emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-white font-semibold">Quiet Hours Start</Label>
                    <input
                      type="time"
                      value={preferences.quietHoursStart}
                      onChange={(e) =>
                        handlePreferenceChange("quietHoursStart", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-white font-semibold">Quiet Hours End</Label>
                    <input
                      type="time"
                      value={preferences.quietHoursEnd}
                      onChange={(e) =>
                        handlePreferenceChange("quietHoursEnd", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-semibold">Timezone</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) =>
                      handlePreferenceChange("timezone", value)
                    }
                  >
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="UTC" className="text-white">
                        UTC
                      </SelectItem>
                      <SelectItem value="EST" className="text-white">
                        Eastern Time (EST)
                      </SelectItem>
                      <SelectItem value="CST" className="text-white">
                        Central Time (CST)
                      </SelectItem>
                      <SelectItem value="MST" className="text-white">
                        Mountain Time (MST)
                      </SelectItem>
                      <SelectItem value="PST" className="text-white">
                        Pacific Time (PST)
                      </SelectItem>
                      <SelectItem value="GMT" className="text-white">
                        Greenwich Mean Time (GMT)
                      </SelectItem>
                      <SelectItem value="IST" className="text-white">
                        Indian Standard Time (IST)
                      </SelectItem>
                      <SelectItem value="JST" className="text-white">
                        Japan Standard Time (JST)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSavePreferences}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Save Schedule
                  </Button>
                  <Button
                    onClick={handleTestEmail}
                    variant="outline"
                    className="flex-1 border-slate-600 text-gray-300 hover:text-white"
                  >
                    Send Test Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Email History</CardTitle>
                <CardDescription className="text-gray-400">
                  View all emails sent to you in the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockEmailLogs.map((email) => (
                    <div
                      key={email.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-white font-semibold">{email.subject}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(email.sentAt).toLocaleDateString()} at{" "}
                          {new Date(email.sentAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-400">Opens</p>
                          <p className="text-lg font-bold text-green-500">{email.opens}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-400">Clicks</p>
                          <p className="text-lg font-bold text-blue-500">{email.clicks}</p>
                        </div>
                        <div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              email.status === "delivered"
                                ? "bg-gray-600 text-gray-200"
                                : email.status === "opened"
                                  ? "bg-green-600 text-green-200"
                                  : email.status === "clicked"
                                    ? "bg-blue-600 text-blue-200"
                                    : "bg-red-600 text-red-200"
                            }`}
                          >
                            {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <Card className="bg-red-900 border-red-700">
          <CardHeader>
            <CardTitle className="text-red-100">Danger Zone</CardTitle>
            <CardDescription className="text-red-200">
              Irreversible actions related to your email preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleUnsubscribe}
              disabled={!isSubscribed}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Unsubscribe from All Emails
            </Button>
            <p className="text-sm text-red-200">
              You can resubscribe at any time from the Notifications tab.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
