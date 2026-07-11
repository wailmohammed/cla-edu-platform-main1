import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Trash2, Archive, CheckCircle, AlertCircle, Info, Trophy, Users, MessageSquare } from "lucide-react";

export function NotificationCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [filterRead, setFilterRead] = useState("all");

  const allNotifications = [
    {
      id: 1,
      type: "achievement",
      title: "Achievement Unlocked",
      message: "You unlocked the 'Fast Learner' achievement!",
      icon: Trophy,
      read: false,
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      type: "rank",
      title: "Rank Updated",
      message: "You climbed to rank #42 on the leaderboard",
      icon: Trophy,
      read: false,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 3,
      type: "friend",
      title: "Friend Request",
      message: "John Doe sent you a friend request",
      icon: Users,
      read: false,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 4,
      type: "message",
      title: "New Message",
      message: "Sarah Johnson: Hey! How's learning going?",
      icon: MessageSquare,
      read: true,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 5,
      type: "course",
      title: "Course Deadline",
      message: "Reminder: Python Fundamentals deadline in 3 days",
      icon: AlertCircle,
      read: true,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 6,
      type: "recommendation",
      title: "Course Recommendation",
      message: "We recommend: Machine Learning Basics based on your interests",
      icon: Info,
      read: true,
      timestamp: new Date(Date.now() - 259200000).toISOString(),
    },
  ];

  const filteredNotifications = allNotifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || notif.type === filterType;
    const matchesRead = filterRead === "all" || (filterRead === "unread" ? !notif.read : notif.read);
    return matchesSearch && matchesType && matchesRead;
  });

  const unreadCount = allNotifications.filter((n) => !n.read).length;
  const selectedCount = selectedNotifications.length;

  const toggleNotification = (id: number) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedCount === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Notification Center</h1>
                <p className="text-slate-600">Manage all your notifications in one place</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-lg px-3 py-1">
                {unreadCount} Unread
              </Badge>
            )}
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />

            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="achievement">Achievements</option>
                  <option value="rank">Rankings</option>
                  <option value="friend">Friends</option>
                  <option value="message">Messages</option>
                  <option value="course">Courses</option>
                  <option value="recommendation">Recommendations</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Status</label>
                <select
                  value={filterRead}
                  onChange={(e) => setFilterRead(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <Card className="mb-6 p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-blue-900">
                {selectedCount} notification{selectedCount !== 1 ? "s" : ""} selected
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Mark as Read
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Archive className="w-4 h-4" />
                  Archive
                </Button>
                <Button size="sm" variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No notifications found</p>
              <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or search query</p>
            </Card>
          ) : (
            <>
              {/* Select All */}
              <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-slate-200">
                <Checkbox
                  checked={selectedCount === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={toggleAll}
                />
                <span className="text-sm text-slate-600">
                  {selectedCount === filteredNotifications.length && filteredNotifications.length > 0
                    ? "All selected"
                    : "Select all"}
                </span>
              </div>

              {/* Notification Items */}
              {filteredNotifications.map((notif) => {
                const Icon = notif.icon;
                return (
                  <Card
                    key={notif.id}
                    className={`p-4 hover:shadow-md transition-all cursor-pointer ${
                      !notif.read ? "bg-blue-50 border-blue-200" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedNotifications.includes(notif.id)}
                        onChange={() => toggleNotification(notif.id)}
                        className="mt-1"
                      />

                      <div className={`p-3 rounded-lg ${!notif.read ? "bg-blue-100" : "bg-slate-100"}`}>
                        <Icon className={`w-5 h-5 ${!notif.read ? "text-blue-600" : "text-slate-600"}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{notif.title}</h3>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{notif.message}</p>
                        <p className="text-xs text-slate-500">{formatTime(notif.timestamp)}</p>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Archive className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          )}
        </div>

        {/* Notification Preferences */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-slate-50 to-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Notification Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Achievement Notifications</p>
                <p className="text-sm text-slate-600">Get notified when you unlock achievements</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Rank Change Notifications</p>
                <p className="text-sm text-slate-600">Get notified when your rank changes</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Friend Requests</p>
                <p className="text-sm text-slate-600">Get notified about friend requests</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Course Deadlines</p>
                <p className="text-sm text-slate-600">Get notified about upcoming deadlines</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Email Notifications</p>
                <p className="text-sm text-slate-600">Receive notifications via email</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Push Notifications</p>
                <p className="text-sm text-slate-600">Receive browser push notifications</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </div>
          <Button className="mt-6">Save Preferences</Button>
        </Card>
      </div>
    </div>
  );
}
