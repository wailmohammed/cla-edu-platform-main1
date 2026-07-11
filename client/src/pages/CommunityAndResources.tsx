import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MultiModalLearning from "@/components/MultiModalLearning";
import CommunityForum from "@/components/CommunityForum";
import PracticeChallenges from "@/components/PracticeChallenges";
import LearningPath from "@/components/LearningPath";
import { MessageCircle, Zap, BookOpen, Map } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function CommunityAndResources() {
  const [activeTab, setActiveTab] = useState("learning-path");

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-2 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Learning Hub</h1>
          <p className="text-lg text-slate-600">
            Personalized paths, practice challenges, community support, and multi-modal learning
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="learning-path" className="gap-2">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Path</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="multimodal" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
          </TabsList>

          {/* Learning Path Tab */}
          <TabsContent value="learning-path" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Learning Path</h2>
              <p className="text-slate-600">
                Follow a personalized curriculum with adaptive difficulty based on your performance
              </p>
            </div>
            <LearningPath />
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Practice Challenges</h2>
              <p className="text-slate-600">
                Solve coding problems, earn XP, and compete on the leaderboard
              </p>
            </div>
            <PracticeChallenges />
          </TabsContent>

          {/* Multi-Modal Learning Tab */}
          <TabsContent value="multimodal" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Multi-Modal Learning</h2>
              <p className="text-slate-600">
                Learn through audio, transcripts, and interactive notes
              </p>
            </div>
            <MultiModalLearning lessonId={1} title="Python Fundamentals" />
          </TabsContent>

          {/* Community Forum Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Community Forum</h2>
              <p className="text-slate-600">
                Ask questions, share knowledge, and connect with other learners
              </p>
            </div>
            <CommunityForum />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
