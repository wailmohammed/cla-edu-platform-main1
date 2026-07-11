import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Search, Sparkles, TrendingUp, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export default function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Search queries
  const { data: recommendations } = trpc.enhancements.search.getRecommendations.useQuery({
    type: "courses",
  });
  const { data: trending } = trpc.enhancements.search.getTrendingContent.useQuery();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    try {
      setIsSearching(true);
      // Simulate search - in real app would call API
      setSearchResults({
        totalCount: 12,
        results: [
          {
            title: "Python Basics",
            description: "Learn Python fundamentals",
            category: "Programming",
            rating: 4.8,
            students: 1234,
          },
          {
            title: "Web Development",
            description: "Master web development",
            category: "Web",
            rating: 4.6,
            students: 892,
          },
          {
            title: "Data Science Intro",
            description: "Introduction to data science",
            category: "Data",
            rating: 4.7,
            students: 654,
          },
        ],
      });
      toast.success("Search completed!");
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="recommendations">For You</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Semantic Search
              </CardTitle>
              <CardDescription>Find courses, challenges, and resources with AI</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for courses, challenges, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
                  <Search className="w-4 h-4" />
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>

              {/* Search Filters */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {["Beginner", "Intermediate", "Advanced", "Free", "Paid"].map((filter) => (
                    <Badge
                      key={filter}
                      variant="outline"
                      className="cursor-pointer hover:bg-slate-100"
                    >
                      {filter}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Search Results */}
              {searchResults && (
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700">
                    Found {searchResults.totalCount} results
                  </p>
                  {searchResults.results.map((result: any, i: number) => (
                    <div key={i} className="p-3 border border-slate-200 rounded-md hover:bg-slate-50">
                      <h4 className="font-semibold text-slate-900">{result.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{result.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {result.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ⭐ {result.rating}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          👥 {result.students}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                Personalized Recommendations
              </CardTitle>
              <CardDescription>Curated just for you based on your learning</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {(recommendations as any)?.length > 0 ? (
                (recommendations as any).map((rec: any, i: number) => (
                  <div key={i} className="p-3 border border-slate-200 rounded-md">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{rec.title || "Course"}</h4>
                      <Badge className="bg-blue-600">Recommended</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">
                      {rec.description || "Matches your learning goals"}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {rec.difficulty || "Intermediate"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        👥 {rec.students || "100"}+ students
                      </Badge>
                    </div>
                    <Button size="sm" className="w-full mt-2">
                      Explore
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    Complete more courses to get personalized recommendations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trending Tab */}
        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Trending Now
              </CardTitle>
              <CardDescription>Most popular courses and challenges this week</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {(trending as any)?.length > 0 ? (
                (trending as any).map((item: any, i: number) => (
                  <div key={i} className="p-3 border border-slate-200 rounded-md">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-400">#{i + 1}</span>
                        <h4 className="font-semibold text-slate-900">{item.title || "Course"}</h4>
                      </div>
                      <Badge className="bg-red-600">🔥 Trending</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">
                      {item.description || "Popular course"}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        👥 {item.students || "1000"}+ enrolled
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ⭐ {item.rating || "4.8"}
                      </Badge>
                    </div>
                    <Button size="sm" className="w-full mt-2">
                      View
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Loading trending content...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
