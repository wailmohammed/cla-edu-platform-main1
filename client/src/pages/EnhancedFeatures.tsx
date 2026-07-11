import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CopilotPanel from "@/components/CopilotPanel";
import SpacedRepetitionReview from "@/components/SpacedRepetitionReview";
import VoiceCoding from "@/components/VoiceCoding";
import NFTCertificate from "@/components/NFTCertificate";
import AdvancedAnalytics from "@/components/AdvancedAnalytics";
import MarketplaceCreator from "@/components/MarketplaceCreator";
import Gamification2 from "@/components/Gamification2";
import AdvancedSearch from "@/components/AdvancedSearch";
import MobileOptimized from "@/components/MobileOptimized";

export default function EnhancedFeatures() {
  const [activeTab, setActiveTab] = useState("copilot");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            ✨ Enhanced Features
          </h1>
          <p className="text-lg text-slate-600">
            Cutting-edge tools to supercharge your learning experience
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 mb-8">
            <TabsTrigger value="copilot" className="text-xs lg:text-sm">
              🤖 Copilot
            </TabsTrigger>
            <TabsTrigger value="spaced" className="text-xs lg:text-sm">
              🔄 Spaced Rep
            </TabsTrigger>
            <TabsTrigger value="voice" className="text-xs lg:text-sm">
              🎤 Voice
            </TabsTrigger>
            <TabsTrigger value="nft" className="text-xs lg:text-sm">
              🏆 NFT
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs lg:text-sm">
              📊 Analytics
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="text-xs lg:text-sm">
              🛍️ Market
            </TabsTrigger>
            <TabsTrigger value="gamification" className="text-xs lg:text-sm">
              🎮 Guild
            </TabsTrigger>
            <TabsTrigger value="search" className="text-xs lg:text-sm">
              🔍 Search
            </TabsTrigger>
            <TabsTrigger value="mobile" className="text-xs lg:text-sm">
              📱 Mobile
            </TabsTrigger>
          </TabsList>

          {/* Copilot Tab */}
          <TabsContent value="copilot">
            <CopilotPanel code="function hello() {\n  return 'world';\n}" language="javascript" />
          </TabsContent>

          {/* Spaced Repetition Tab */}
          <TabsContent value="spaced">
            <SpacedRepetitionReview />
          </TabsContent>

          {/* Voice Coding Tab */}
          <TabsContent value="voice">
            <VoiceCoding />
          </TabsContent>

          {/* NFT Certificate Tab */}
          <TabsContent value="nft">
            <NFTCertificate
              courseId={1}
              courseName="Python Mastery"
              completedDate={new Date()}
            />
          </TabsContent>

          {/* Advanced Analytics Tab */}
          <TabsContent value="analytics">
            <AdvancedAnalytics />
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace">
            <MarketplaceCreator />
          </TabsContent>

          {/* Gamification Tab */}
          <TabsContent value="gamification">
            <Gamification2 />
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search">
            <AdvancedSearch />
          </TabsContent>

          {/* Mobile Tab */}
          <TabsContent value="mobile">
            <MobileOptimized />
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">🤖 AI Copilot</h3>
            <p className="text-sm text-slate-600">
              Get intelligent code suggestions, analysis, and refactoring recommendations powered by AI.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">🔄 Spaced Repetition</h3>
            <p className="text-sm text-slate-600">
              Optimize your learning with scientifically-proven spaced repetition scheduling.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">🎤 Voice Coding</h3>
            <p className="text-sm text-slate-600">
              Code with your voice and enjoy full accessibility features for all learners.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">🏆 NFT Certificates</h3>
            <p className="text-sm text-slate-600">
              Earn blockchain-verified certificates and share your achievements on social media.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">📊 Advanced Analytics</h3>
            <p className="text-sm text-slate-600">
              Get ML-powered insights into your learning patterns and predictive completion rates.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">🛍️ Marketplace</h3>
            <p className="text-sm text-slate-600">
              Create and monetize your own courses on the Codelearnify marketplace.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">🎮 Guilds & Quests</h3>
            <p className="text-sm text-slate-600">
              Join guilds, compete in tournaments, and complete quests for epic rewards.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">🔍 Smart Search</h3>
            <p className="text-sm text-slate-600">
              Find courses with semantic search and get personalized recommendations.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">📱 Mobile First</h3>
            <p className="text-sm text-slate-600">
              Learn offline and sync seamlessly across all your devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
