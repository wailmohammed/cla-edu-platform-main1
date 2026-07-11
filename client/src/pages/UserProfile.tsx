import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trophy, BookOpen, Target, TrendingUp, Share2, MessageSquare, UserPlus } from "lucide-react";

export function UserProfile() {
  const [isOwnProfile] = useState(true);

  const userStats = {
    name: "Alex Chen",
    title: "Full Stack Developer",
    bio: "Passionate about learning and teaching coding. Currently mastering React and Node.js.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    joinDate: "2025-06-15",
    coursesCompleted: 24,
    totalXP: 45230,
    currentRank: 42,
    friends: 156,
    followers: 342,
    following: 89,
  };

  const engagementMetrics = {
    thisMonth: {
      coursesCompleted: 3,
      lessonsCompleted: 47,
      challengesSolved: 28,
      hoursLearned: 156,
      streakDays: 23,
    },
    thisYear: {
      coursesCompleted: 24,
      lessonsCompleted: 412,
      challengesSolved: 234,
      hoursLearned: 1240,
      certificatesEarned: 12,
    },
    allTime: {
      coursesCompleted: 24,
      lessonsCompleted: 412,
      challengesSolved: 234,
      hoursLearned: 1240,
      certificatesEarned: 12,
      achievements: 34,
    },
  };

  const recentActivity = [
    { date: "2 hours ago", action: "Completed React Hooks course", type: "course" },
    { date: "1 day ago", action: "Solved 5 algorithm challenges", type: "challenge" },
    { date: "2 days ago", action: "Unlocked 'Fast Learner' achievement", type: "achievement" },
    { date: "3 days ago", action: "Climbed to rank #42", type: "rank" },
    { date: "1 week ago", action: "Joined 'Python Developers' team", type: "team" },
  ];

  const topCourses = [
    { name: "React Fundamentals", progress: 100, xp: 2500 },
    { name: "JavaScript Advanced", progress: 95, xp: 2400 },
    { name: "Node.js Backend", progress: 85, xp: 2100 },
  ];

  const achievements = [
    { name: "Fast Learner", icon: "⚡", earned: true },
    { name: "Challenge Master", icon: "🏆", earned: true },
    { name: "Team Player", icon: "👥", earned: true },
    { name: "Streak Warrior", icon: "🔥", earned: true },
    { name: "Mentor", icon: "🎓", earned: false },
    { name: "Course Completionist", icon: "📚", earned: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-start gap-6 mb-8">
            <img
              src={userStats.avatar}
              alt={userStats.name}
              className="w-24 h-24 rounded-full border-4 border-white"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{userStats.name}</h1>
              <p className="text-blue-100 text-lg mb-3">{userStats.title}</p>
              <p className="text-blue-100 mb-4">{userStats.bio}</p>
              <div className="flex gap-3 flex-wrap">
                {isOwnProfile ? (
                  <>
                    <Button variant="secondary">Edit Profile</Button>
                    <Button variant="outline" className="text-white border-white hover:bg-white/10">
                      Settings
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </Button>
                    <Button variant="outline" className="text-white border-white hover:bg-white/10 gap-2">
                      <UserPlus className="w-4 h-4" />
                      Add Friend
                    </Button>
                    <Button variant="outline" className="text-white border-white hover:bg-white/10 gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Member since</p>
              <p className="text-white font-semibold">{userStats.joinDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{userStats.coursesCompleted}</p>
            <p className="text-sm text-slate-600">Courses Completed</p>
          </Card>
          <Card className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{userStats.totalXP.toLocaleString()}</p>
            <p className="text-sm text-slate-600">Total XP</p>
          </Card>
          <Card className="p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">#{userStats.currentRank}</p>
            <p className="text-sm text-slate-600">Current Rank</p>
          </Card>
          <Card className="p-6 text-center">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{userStats.friends}</p>
            <p className="text-sm text-slate-600">Friends</p>
          </Card>
          <Card className="p-6 text-center">
            <Target className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{engagementMetrics.thisMonth.streakDays}</p>
            <p className="text-sm text-slate-600">Day Streak</p>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* This Month */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">This Month</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Courses Completed</span>
                    <span className="font-semibold text-slate-900">{engagementMetrics.thisMonth.coursesCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lessons Completed</span>
                    <span className="font-semibold text-slate-900">{engagementMetrics.thisMonth.lessonsCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Challenges Solved</span>
                    <span className="font-semibold text-slate-900">{engagementMetrics.thisMonth.challengesSolved}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Hours Learned</span>
                    <span className="font-semibold text-slate-900">{engagementMetrics.thisMonth.hoursLearned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Day Streak</span>
                    <span className="font-semibold text-orange-600">{engagementMetrics.thisMonth.streakDays} 🔥</span>
                  </div>
                </div>
              </Card>

              {/* This Year */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">This Year</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Courses Completed</span>
                    <span className="font-semibold text-slate-900">{engagementMetrics.thisYear.coursesCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lessons Completed</span>
                    <span className="font-semibold text-slate-900">{engagementMetrics.thisYear.lessonsCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Challenges Solved</span>
                    <span className="font-semibold text-slate-900">{engagementMetrics.thisYear.challengesSolved}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Hours Learned</span>
                    <span className="font-semibold text-slate-900">{engagementMetrics.thisYear.hoursLearned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Certificates Earned</span>
                    <span className="font-semibold text-slate-900">{engagementMetrics.thisYear.certificatesEarned}</span>
                  </div>
                </div>
              </Card>

              {/* All Time */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">All Time</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Courses Completed</span>
                    <span className="font-semibold text-slate-900">{engagementMetrics.allTime.coursesCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lessons Completed</span>
                    <span className="font-semibold text-slate-900">{engagementMetrics.allTime.lessonsCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Challenges Solved</span>
                    <span className="font-semibold text-slate-900">{engagementMetrics.allTime.challengesSolved}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Hours Learned</span>
                    <span className="font-semibold text-slate-900">{engagementMetrics.allTime.hoursLearned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Achievements</span>
                    <span className="font-semibold text-slate-900">{engagementMetrics.allTime.achievements}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Top Courses</h3>
              <div className="space-y-4">
                {topCourses.map((course, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{course.name}</h4>
                      <span className="text-sm font-medium text-slate-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-slate-600 mt-2">{course.xp.toLocaleString()} XP earned</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievements.map((achievement, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg text-center ${
                      achievement.earned
                        ? "bg-yellow-50 border-2 border-yellow-300"
                        : "bg-slate-100 border-2 border-slate-300 opacity-50"
                    }`}
                  >
                    <p className="text-4xl mb-2">{achievement.icon}</p>
                    <p className="font-semibold text-slate-900 text-sm">{achievement.name}</p>
                    {achievement.earned && <Badge className="mt-2 bg-yellow-500">Earned</Badge>}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900">{activity.action}</p>
                      <p className="text-sm text-slate-600">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
