import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp, Flag, Search } from "lucide-react";

interface ForumPost {
  id: number;
  title: string;
  author: string;
  avatar: string;
  category: string;
  replies: number;
  views: number;
  likes: number;
  timestamp: string;
  solved: boolean;
}

const mockPosts: ForumPost[] = [
  {
    id: 1,
    title: "How to optimize Python code for performance?",
    author: "Alex Chen",
    avatar: "AC",
    category: "Python",
    replies: 12,
    views: 234,
    likes: 45,
    timestamp: "2 hours ago",
    solved: true,
  },
  {
    id: 2,
    title: "Best practices for JavaScript async/await",
    author: "Jordan Smith",
    avatar: "JS",
    category: "JavaScript",
    replies: 8,
    views: 156,
    likes: 32,
    timestamp: "4 hours ago",
    solved: false,
  },
  {
    id: 3,
    title: "SQL query optimization tips",
    author: "Morgan Lee",
    avatar: "ML",
    category: "SQL",
    replies: 15,
    views: 312,
    likes: 67,
    timestamp: "1 day ago",
    solved: true,
  },
  {
    id: 4,
    title: "Understanding React hooks",
    author: "Casey Johnson",
    avatar: "CJ",
    category: "React",
    replies: 6,
    views: 89,
    likes: 18,
    timestamp: "2 days ago",
    solved: false,
  },
];

export default function CommunityForum() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [posts, setPosts] = useState(mockPosts);

  const categories = ["all", "Python", "JavaScript", "React", "SQL", "HTML/CSS"];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Community Forum</h2>
          <p className="text-slate-600">Ask questions, share knowledge, and help others</p>
        </div>
        <Button>New Discussion</Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forum Posts */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-slate-600">No discussions found. Be the first to start one!</p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <Avatar>
                    <AvatarFallback className="bg-blue-500 text-white">
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 hover:text-blue-600 line-clamp-2">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-slate-600">{post.author}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-sm text-slate-600">{post.timestamp}</span>
                          {post.solved && (
                            <>
                              <span className="text-xs text-slate-400">•</span>
                              <Badge variant="secondary" className="text-xs">
                                ✓ Solved
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Category Badge */}
                      <Badge variant="outline" className="flex-shrink-0">
                        {post.category}
                      </Badge>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mt-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.replies} replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👁</span>
                        <span>{post.views} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredPosts.length > 0 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button size="sm">2</Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
