import React, { useState, useEffect } from "react";
import { ForumPost, User } from "@/api/entities";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  TrendingUp,
  Users,
  Star,
  Calendar,
  ArrowUp,
  MessageCircle,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreatePostModal from "../components/community/CreatePostModal";
import PostCard from "../components/community/PostCard";

const categoryLabels = {
  general: "General Discussion",
  design_theory: "Design Theory",
  mechanics: "Game Mechanics", 
  artwork: "Artwork & Design",
  publishing: "Publishing",
  playtesting: "Playtesting",
  rules: "Rules & Instructions",
  marketing: "Marketing"
};

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [sortBy]);

  const loadPosts = async () => {
    try {
      const sortOrder = sortBy === "popular" ? "-upvotes" : "-created_date";
      const postList = await ForumPost.list(sortOrder);
      setPosts(postList);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
    setLoading(false);
  };

  const handleCreatePost = async () => {
    await loadPosts();
    setShowCreateModal(false);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const featuredStats = [
    { label: "Active Members", value: "2,347", icon: Users, color: "text-emerald-600" },
    { label: "Discussions", value: "1,892", icon: MessageSquare, color: "text-blue-600" },
    { label: "This Week", value: "156", icon: TrendingUp, color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-stone-900">Community Forum</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Connect with fellow creators, share ideas, and learn from the board game community
          </p>
          
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-8">
            {featuredStats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-stone-900">{stat.value}</div>
                <div className="text-sm text-stone-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Controls */}
            <Card className="bg-white/70 backdrop-blur-sm border-stone-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <Input
                        placeholder="Search discussions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white border-stone-300 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-48 bg-white border-stone-300">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32 bg-white border-stone-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Recent</SelectItem>
                        <SelectItem value="popular">Popular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start Discussion
                </Button>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-stone-200 rounded-xl h-32"></div>
                ))
              ) : (
                filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>

            {!loading && filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-stone-900 mb-2">No discussions found</h3>
                <p className="text-stone-600 mb-6">Be the first to start a conversation!</p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start Discussion
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Popular Categories */}
            <Card className="bg-white/70 backdrop-blur-sm border-stone-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-stone-900 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-amber-500" />
                  Popular Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(categoryLabels).slice(0, 6).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setCategoryFilter(key)}
                      className="w-full text-left p-3 rounded-lg hover:bg-stone-50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900">
                          {label}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(Math.random() * 50) + 10}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="bg-gradient-to-br from-emerald-50 to-amber-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-stone-900">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-stone-700 space-y-2">
                  <p>• Be respectful and constructive</p>
                  <p>• Share knowledge and experience</p>
                  <p>• Help newcomers learn</p>
                  <p>• Keep discussions on-topic</p>
                  <p>• No spam or self-promotion</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/70 backdrop-blur-sm border-stone-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-stone-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                          U{i + 1}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-600 truncate">
                          User commented on "Game balance tips"
                        </p>
                        <p className="text-xs text-stone-500">{i + 1}h ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreatePostModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreatePost}
      />
    </div>
  );
}