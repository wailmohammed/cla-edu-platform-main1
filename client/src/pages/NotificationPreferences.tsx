import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, Smartphone, Clock, Volume2, Eye } from "lucide-react";

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    achievements: true,
    rankChanges: true,
    friendRequests: true,
    messages: true,
    courseDeadlines: true,
    recommendations: true,
    challengeUpdates: true,
    teamActivity: true,
  });

  const [channels, setChannels] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const [frequency, setFrequency] = useState({
    achievements: "instant",
    rankChanges: "instant",
    friendRequests: "instant",
    messages: "instant",
    courseDeadlines: "daily",
    recommendations: "weekly",
    challengeUpdates: "instant",
    teamActivity: "daily",
  });

  const [quietHours, setQuietHours] = useState({
    enabled: true,
    startTime: "22:00",
    endTime: "08:00",
  });

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChannelChange = (key: keyof typeof channels) => {
    setChannels((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleFrequencyChange = (key: keyof typeof frequency, value: string) => {
    setFrequency((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Notification Preferences</h1>
          </div>
          <p className="text-slate-600">Customize how and when you receive notifications</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
            <TabsTrigger value="quiet-hours">Quiet Hours</TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Notification Types</h2>
              <div className="space-y-4">
                {/* Achievement Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-900">Achievement Notifications</h3>
                    <p className="text-sm text-slate-600">Get notified when you unlock achievements</p>
                  </div>
                  <Switch
                    checked={preferences.achievements}
                    onChange={() => handlePreferenceChange("achievements")}
                  />
                </div>

                {/* Rank Change Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-900">Rank Change Notifications</h3>
                    <p className="text-sm text-slate-600">Get notified when your rank changes</p>
                  </div>
                  <Switch
                    checked={preferences.rankChanges}
                    onChange={() => handlePreferenceChange("rankChanges")}
                  />
                </div>

                {/* Friend Request Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-900">Friend Request Notifications</h3>
                    <p className="text-sm text-slate-600">Get notified about friend requests</p>
                  </div>
                  <Switch
                    checked={preferences.friendRequests}
                    onChange={() => handlePreferenceChange("friendRequests")}
                  />
                </div>

                {/* Message Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-900">Message Notifications</h3>
                    <p className="text-sm text-slate-600">Get notified about new messages</p>
                  </div>
                  <Switch
                    checked={preferences.messages}
                    onChange={() => handlePreferenceChange("messages")}
                  />
                </div>

                {/* Course Deadline Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-900">Course Deadline Notifications</h3>
                    <p className="text-sm text-slate-600">Get notified about upcoming deadlines</p>
                  </div>
                  <Switch
                    checked={preferences.courseDeadlines}
                    onChange={() => handlePreferenceChange("courseDeadlines")}
                  />
                </div>

                {/* Course Recommendation Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-900">Course Recommendations</h3>
                    <p className="text-sm text-slate-600">Get notified about recommended courses</p>
                  </div>
                  <Switch
                    checked={preferences.recommendations}
                    onChange={() => handlePreferenceChange("recommendations")}
                  />
                </div>

                {/* Challenge Update Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-900">Challenge Updates</h3>
                    <p className="text-sm text-slate-600">Get notified about challenge status changes</p>
                  </div>
                  <Switch
                    checked={preferences.challengeUpdates}
                    onChange={() => handlePreferenceChange("challengeUpdates")}
                  />
                </div>

                {/* Team Activity Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-900">Team Activity</h3>
                    <p className="text-sm text-slate-600">Get notified about team activity</p>
                  </div>
                  <Switch
                    checked={preferences.teamActivity}
                    onChange={() => handlePreferenceChange("teamActivity")}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Notification Channels</h2>
              <div className="space-y-4">
                {/* Push Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Push Notifications</h3>
                      <p className="text-sm text-slate-600">Receive browser push notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={channels.pushNotifications}
                    onChange={() => handleChannelChange("pushNotifications")}
                  />
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Email Notifications</h3>
                      <p className="text-sm text-slate-600">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={channels.emailNotifications}
                    onChange={() => handleChannelChange("emailNotifications")}
                  />
                </div>

                {/* SMS Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-slate-900">SMS Notifications</h3>
                      <p className="text-sm text-slate-600">Receive text message notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={channels.smsNotifications}
                    onChange={() => handleChannelChange("smsNotifications")}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Frequency Tab */}
          <TabsContent value="frequency" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Notification Frequency</h2>
              <div className="space-y-4">
                {[
                  { key: "achievements", label: "Achievements" },
                  { key: "rankChanges", label: "Rank Changes" },
                  { key: "friendRequests", label: "Friend Requests" },
                  { key: "messages", label: "Messages" },
                  { key: "courseDeadlines", label: "Course Deadlines" },
                  { key: "recommendations", label: "Recommendations" },
                  { key: "challengeUpdates", label: "Challenge Updates" },
                  { key: "teamActivity", label: "Team Activity" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <label className="font-semibold text-slate-900">{item.label}</label>
                    <select
                      value={frequency[item.key as keyof typeof frequency]}
                      onChange={(e) => handleFrequencyChange(item.key as keyof typeof frequency, e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="instant">Instant</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Quiet Hours Tab */}
          <TabsContent value="quiet-hours" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Quiet Hours</h2>
              <p className="text-slate-600 mb-6">
                Pause non-urgent notifications during your quiet hours. Urgent notifications will still come through.
              </p>

              <div className="space-y-6">
                {/* Enable Quiet Hours */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-900">Enable Quiet Hours</h3>
                    <p className="text-sm text-slate-600">Pause notifications during specific times</p>
                  </div>
                  <Switch
                    checked={quietHours.enabled}
                    onChange={() =>
                      setQuietHours((prev) => ({
                        ...prev,
                        enabled: !prev.enabled,
                      }))
                    }
                  />
                </div>

                {quietHours.enabled && (
                  <>
                    {/* Start Time */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Quiet Hours Start
                      </label>
                      <input
                        type="time"
                        value={quietHours.startTime}
                        onChange={(e) =>
                          setQuietHours((prev) => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>

                    {/* End Time */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Quiet Hours End
                      </label>
                      <input
                        type="time"
                        value={quietHours.endTime}
                        onChange={(e) =>
                          setQuietHours((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        Quiet hours: {quietHours.startTime} - {quietHours.endTime}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-8 flex gap-3">
          <Button className="px-8">Save Preferences</Button>
          <Button variant="outline">Reset to Default</Button>
        </div>
      </div>
    </div>
  );
}
