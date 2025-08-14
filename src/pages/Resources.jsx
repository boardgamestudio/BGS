
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
    color: "text-blue-400", // Adjusted for dark theme
    count: 45
  },
  {
    id: "templates", 
    title: "Templates",
    icon: FileText,
    color: "text-emerald-400", // Adjusted for dark theme
    count: 32
  },
  {
    id: "videos",
    title: "Video Tutorials",
    icon: Video,
    color: "text-purple-400", // Adjusted for dark theme
    count: 28
  },
  {
    id: "tools",
    title: "Design Tools",
    icon: Zap,
    color: "text-amber-400", // Adjusted for dark theme
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
    tags: ["Templates", "Cards", "Professional", "Advanced", "Print Ready"]
  },
  {
    title: "Playtesting Masterclass",
    type: "video",
    description: "Learn advanced playtesting techniques from industry professionals.",
    author: "GameDev Academy",
    rating: 4.9,
    downloads: 634,
    premium: true,
    tags: ["Video", "Playtesting", "Advanced", "Feedback"]
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
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Learning Resources</h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto px-4">
            Everything you need to design, prototype, and publish amazing board games
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {resourceCategories.map((category) => (
            <Card key={category.id} className="bg-surface border-border-default hover:bg-surface/80 transition-all duration-200 cursor-pointer">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-background rounded-xl flex items-center justify-center mx-auto mb-3 border border-border-default">
                  <category.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${category.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">{category.title}</h3>
                <p className="text-xl sm:text-2xl font-bold text-white">{category.count}</p>
                <p className="text-xs text-slate-400">resources</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter */}
        <Card className="bg-surface border-border-default">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search guides, templates, videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border-default text-white placeholder:text-slate-400 focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-28 sm:w-32 bg-background border-border-default text-white text-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-border-default text-white">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="guides">Guides</SelectItem>
                    <SelectItem value="templates">Templates</SelectItem>
                    <SelectItem value="videos">Videos</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-24 sm:w-32 bg-background border-border-default text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-border-default text-white">
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
          <TabsList className="grid w-full grid-cols-4 lg:w-96 mx-auto bg-surface text-white">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All Resources</TabsTrigger>
            <TabsTrigger value="guides" className="text-xs sm:text-sm">Guides</TabsTrigger>
            <TabsTrigger value="templates" className="text-xs sm:text-sm">Templates</TabsTrigger>
            <TabsTrigger value="videos" className="text-xs sm:text-sm">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6 sm:space-y-8">
            {/* Featured Resources */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Featured Resources</h2>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {featuredResources.map((resource, idx) => (
                  <Card key={idx} className="bg-surface border-border-default hover:bg-surface/80 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={`${
                            resource.type === 'guide' ? 'bg-blue-400/20 text-blue-400 border-blue-400/30' :
                            resource.type === 'template' ? 'bg-secondary/20 text-secondary border-secondary/30' :
                            resource.type === 'video' ? 'bg-purple-400/20 text-purple-400 border-purple-400/30' :
                            'bg-primary/20 text-primary border-primary/30'
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
                          <span className="text-sm font-semibold text-white">{resource.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2">{resource.title}</h3>
                      <p className="text-sm text-slate-300 mb-3 line-clamp-2">{resource.description}</p>
                      <p className="text-xs text-slate-400 mb-3">by {resource.author}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="border-border-default text-slate-300 text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {resource.tags.length > 3 && (
                          <Badge variant="outline" className="border-border-default text-slate-300 text-xs">
                            +{resource.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-sm text-slate-400">
                          <Download className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">{resource.downloads.toLocaleString()}</span>
                        </div>
                        <Button size="sm" className="bg-primary text-black hover:bg-primary/90 text-xs sm:text-sm">
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
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Popular Video Tutorials</h2>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tutorials.map((tutorial, idx) => (
                  <Card key={idx} className="bg-surface border-border-default hover:bg-surface/80 hover:shadow-md transition-all duration-200 group cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl">{tutorial.thumbnail}</div>
                      </div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 bg-surface/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-black/50 text-white text-xs">
                          {tutorial.duration}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-1">{tutorial.title}</h3>
                      <p className="text-sm text-slate-300 mb-2">by {tutorial.instructor}</p>
                      <Badge variant="outline" className="border-border-default text-slate-300">
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
              <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Design Guides</h3>
              <p className="text-slate-300">Comprehensive guides for game design coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Templates</h3>
              <p className="text-slate-300">Professional templates for your projects coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Video Tutorials</h3>
              <p className="text-slate-300">Expert video content coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
