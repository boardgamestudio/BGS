import React, { useState } from "react";
import { 
  BookOpen, 
  Download, 
  Video, 
  Users,
  Star,
  Search,
  Filter,
  Play,
  FileText,
  Lightbulb,
  Target,
  Zap,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const resourceCategories = [
  {
    id: "guides",
    title: "Design Guides",
    icon: BookOpen,
    color: "text-blue-600",
    count: 45
  },
  {
    id: "templates", 
    title: "Templates",
    icon: FileText,
    color: "text-emerald-600",
    count: 32
  },
  {
    id: "videos",
    title: "Video Tutorials",
    icon: Video,
    color: "text-purple-600",
    count: 28
  },
  {
    id: "tools",
    title: "Design Tools",
    icon: Zap,
    color: "text-amber-600",
    count: 19
  }
];

const featuredResources = [
  {
    title: "Complete Game Design Framework",
    type: "guide",
    description: "A comprehensive guide covering every aspect of board game design from concept to publication.",
    author: "Dr. Sarah Mitchell",
    rating: 4.9,
    downloads: 1247,
    premium: false,
    tags: ["Beginner", "Design Theory", "Complete Guide"]
  },
  {
    title: "Card Design Template Pack",
    type: "template", 
    description: "Professional InDesign and Photoshop templates for creating stunning playing cards.",
    author: "Design Studio Pro",
    rating: 4.8,
    downloads: 892,
    premium: true,
    tags: ["Templates", "Cards", "Professional"]
  },
  {
    title: "Playtesting Masterclass",
    type: "video",
    description: "Learn advanced playtesting techniques from industry professionals.",
    author: "GameDev Academy",
    rating: 4.9,
    downloads: 634,
    premium: true,
    tags: ["Video", "Playtesting", "Advanced"]
  },
  {
    title: "Prototype Toolkit",
    type: "tool",
    description: "Essential tools and resources for creating professional game prototypes.",
    author: "Maker Tools",
    rating: 4.7,
    downloads: 456,
    premium: false,
    tags: ["Tools", "Prototyping", "DIY"]
  }
];

const tutorials = [
  {
    title: "Game Mechanics Deep Dive",
    duration: "45 min",
    level: "Intermediate", 
    thumbnail: "🎯",
    instructor: "Mark Chen"
  },
  {
    title: "Art Direction for Board Games",
    duration: "32 min",
    level: "Beginner",
    thumbnail: "🎨",
    instructor: "Lisa Rodriguez"
  },
  {
    title: "Publishing Your First Game",
    duration: "58 min", 
    level: "Advanced",
    thumbnail: "📚",
    instructor: "Alex Turner"
  }
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-stone-900">Learning Resources</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Everything you need to design, prototype, and publish amazing board games
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {resourceCategories.map((category) => (
            <Card key={category.id} className="bg-white/70 backdrop-blur-sm border-stone-200 hover:bg-white transition-all duration-200 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-stone-200">
                  <category.icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <h3 className="font-semibold text-stone-900 mb-1">{category.title}</h3>
                <p className="text-2xl font-bold text-stone-900">{category.count}</p>
                <p className="text-xs text-stone-500">resources</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter */}
        <Card className="bg-white/70 backdrop-blur-sm border-stone-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    placeholder="Search guides, templates, videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-stone-300 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40 bg-white border-stone-300">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="guides">Guides</SelectItem>
                    <SelectItem value="templates">Templates</SelectItem>
                    <SelectItem value="videos">Videos</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 bg-white border-stone-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-96 mx-auto">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {/* Featured Resources */}
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Featured Resources</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredResources.map((resource, idx) => (
                  <Card key={idx} className="bg-white/80 backdrop-blur-sm border-stone-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={`${
                            resource.type === 'guide' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            resource.type === 'template' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                            resource.type === 'video' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            'bg-amber-100 text-amber-800 border-amber-200'
                          } border text-xs`}>
                            {resource.type}
                          </Badge>
                          {resource.premium && (
                            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                          <span className="text-sm font-semibold">{resource.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-stone-900 mb-2">{resource.title}</h3>
                      <p className="text-sm text-stone-600 mb-3 line-clamp-2">{resource.description}</p>
                      <p className="text-xs text-stone-500 mb-3">by {resource.author}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-sm text-stone-500">
                          <Download className="w-4 h-4" />
                          <span>{resource.downloads.toLocaleString()}</span>
                        </div>
                        <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                          {resource.premium ? 'Get Premium' : 'Download Free'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Video Tutorials */}
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Popular Video Tutorials</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {tutorials.map((tutorial, idx) => (
                  <Card key={idx} className="bg-white/80 backdrop-blur-sm border-stone-200 hover:bg-white hover:shadow-md transition-all duration-200 group cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-emerald-100 to-purple-100 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl">{tutorial.thumbnail}</div>
                      </div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-stone-700 ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-black/50 text-white text-xs">
                          {tutorial.duration}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-stone-900 mb-1">{tutorial.title}</h3>
                      <p className="text-sm text-stone-600 mb-2">by {tutorial.instructor}</p>
                      <Badge variant="outline" className="text-xs">
                        {tutorial.level}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guides">
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-900 mb-2">Design Guides</h3>
              <p className="text-stone-600">Comprehensive guides for game design coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-900 mb-2">Templates</h3>
              <p className="text-stone-600">Professional templates for your projects coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-900 mb-2">Video Tutorials</h3>
              <p className="text-stone-600">Expert video content coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}