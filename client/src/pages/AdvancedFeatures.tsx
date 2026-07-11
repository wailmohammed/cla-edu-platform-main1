import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LearningAnalytics from "@/components/LearningAnalytics";
import DeveloperTools from "@/components/DeveloperTools";
import AdvancedAITutor from "@/components/AdvancedAITutor";
import InteractiveVisualizer from "@/components/InteractiveVisualizer";
import SocialFeatures from "@/components/SocialFeatures";
import { Zap, Brain, Code, Users, BarChart3 } from "lucide-react";

export default function AdvancedFeatures() {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Advanced Learning Features</h1>
          <p className="text-lg text-slate-600">
            Unlock premium tools to accelerate your learning journey
          </p>
        </div>

        {/* Feature Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="ai-tutor" className="gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">AI Tutor</span>
            </TabsTrigger>
            <TabsTrigger value="visualizer" className="gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Visualizer</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-2">
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Tools</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Learning Analytics</h2>
              <p className="text-slate-600">
                Track your progress, identify strengths and weaknesses, and get personalized recommendations
              </p>
            </div>
            <LearningAnalytics />
          </TabsContent>

          {/* AI Tutor Tab */}
          <TabsContent value="ai-tutor" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">AI-Powered Tutor</h2>
              <p className="text-slate-600">
                Get personalized hints, explanations, and adaptive learning paths powered by AI
              </p>
            </div>
            <AdvancedAITutor />
          </TabsContent>

          {/* Visualizer Tab */}
          <TabsContent value="visualizer" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Interactive Visualizer</h2>
              <p className="text-slate-600">
                Visualize complex concepts with interactive diagrams and simulations
              </p>
            </div>
            <InteractiveVisualizer type="math" title="Quadratic Function Visualizer" />
          </TabsContent>

          {/* Developer Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Developer Tools</h2>
              <p className="text-slate-600">
                Access cheat sheets, code snippets, and comprehensive API references
              </p>
            </div>
            <DeveloperTools />
          </TabsContent>

          {/* Social Features Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Social Learning</h2>
              <p className="text-slate-600">
                Challenge friends, join leaderboards, and collaborate with other learners
              </p>
            </div>
            <SocialFeatures />
          </TabsContent>
        </Tabs>

        {/* Feature Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Detailed Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Comprehensive insights into your learning patterns, skill proficiency, and progress trends
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                AI-Powered Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Personalized hints, adaptive explanations, and intelligent problem recommendations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Interactive Visualizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Learn complex concepts through interactive diagrams, simulations, and visual tools
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-green-500" />
                Developer Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Curated cheat sheets, code snippets, and API references for every language
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" />
                Social Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Challenge friends, compete on leaderboards, and collaborate with peers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Premium Unlocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                All advanced features available with your premium subscription
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
