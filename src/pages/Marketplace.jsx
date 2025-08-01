
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ShoppingBag, 
  Palette, 
  PenTool, 
  BookOpen,
  Users,
  Star,
  Search,
  Filter,
  ArrowRight,
  Briefcase,
  Camera,
  Gamepad2,
  Megaphone,
  Plus // Added Plus icon import
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const serviceCategories = [
  {
    id: "artwork",
    title: "Artwork & Illustration",
    icon: Palette,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Custom illustrations, character design, and game art",
    count: 124
  },
  {
    id: "graphic_design", 
    title: "Graphic Design",
    icon: PenTool,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Card layouts, box design, and visual identity",
    count: 87
  },
  {
    id: "writing",
    title: "Writing & Editing",
    icon: BookOpen,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50", 
    borderColor: "border-emerald-200",
    description: "Rulebooks, flavor text, and content creation",
    count: 56
  },
  {
    id: "consulting",
    title: "Game Design Consulting",
    icon: Gamepad2,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Mechanic development and balance testing",
    count: 43
  },
  {
    id: "photography",
    title: "Photography",
    icon: Camera,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    description: "Product shots and promotional photography",
    count: 29
  },
  {
    id: "marketing",
    title: "Marketing & PR",
    icon: Megaphone,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200", 
    description: "Campaign strategy and community building",
    count: 38
  }
];

const featuredProviders = [
  {
    name: "Sarah Chen",
    role: "Illustrator & Character Designer",
    rating: 4.9,
    projects: 127,
    specialties: ["Fantasy Art", "Character Design", "Digital Illustration"],
    avatar: "SC"
  },
  {
    name: "Marcus Rodriguez",
    role: "Graphic Designer",
    rating: 4.8,
    projects: 89,
    specialties: ["Card Design", "Logo Design", "Packaging"],
    avatar: "MR"
  },
  {
    name: "Elena Kowalski",
    role: "Game Design Consultant",
    rating: 5.0,
    projects: 45,
    specialties: ["Strategy Games", "Balancing", "Playtesting"],
    avatar: "EK"
  }
];

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-stone-900">Creative Marketplace</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Connect with talented professionals to bring your board game vision to life
          </p>
        </div>

        {/* Search & Filter */}
        <Card className="bg-white/70 backdrop-blur-sm border-stone-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    placeholder="Search for services, providers, or skills..."
                    className="pl-10 bg-white border-stone-300 focus:border-emerald-500"
                  />
                </div>
              </div>
              <Button variant="outline" className="border-stone-300 hover:bg-stone-50">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Service Categories */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category) => (
              <Card key={category.id} className="bg-white/80 backdrop-blur-sm border-stone-200 hover:bg-white hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${category.bgColor} rounded-xl flex items-center justify-center border ${category.borderColor}`}>
                      <category.icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {category.count} providers
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-stone-600 mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-emerald-700 text-sm font-medium group-hover:text-emerald-800">
                    Browse providers
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Featured Providers */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-900">Featured Providers</h2>
              <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-6">
              {featuredProviders.map((provider, idx) => (
                <Card key={idx} className="bg-white/80 backdrop-blur-sm border-stone-200 hover:bg-white hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg font-semibold">
                          {provider.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-stone-900">{provider.name}</h3>
                            <p className="text-sm text-stone-600">{provider.role}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-amber-400 fill-current" />
                              <span className="text-sm font-semibold text-stone-900">{provider.rating}</span>
                            </div>
                            <p className="text-xs text-stone-500">{provider.projects} projects</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {provider.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-stone-600">
                            <div className="flex items-center space-x-1">
                              <Briefcase className="w-4 h-4" />
                              <span>Available</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>Top Rated</span>
                            </div>
                          </div>
                          <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Become a Provider */}
            <Card className="bg-gradient-to-br from-emerald-50 to-amber-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-stone-900">Join as Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-700 mb-4">
                  Share your skills with the board game community and grow your freelance business.
                </p>
                <Button className="w-full bg-emerald-700 hover:bg-emerald-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Provider Profile
                </Button>
              </CardContent>
            </Card>

            {/* How it Works */}
            <Card className="bg-white/70 backdrop-blur-sm border-stone-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-stone-900">How it Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-700 text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-900 text-sm">Browse & Connect</h4>
                      <p className="text-xs text-stone-600">Find the perfect provider for your project needs</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-700 text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-900 text-sm">Collaborate</h4>
                      <p className="text-xs text-stone-600">Work together using our project management tools</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-700 text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-900 text-sm">Launch</h4>
                      <p className="text-xs text-stone-600">Bring your board game vision to life</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Skills */}
            <Card className="bg-white/70 backdrop-blur-sm border-stone-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-stone-900">Popular Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Card Design", "Character Art", "Logo Design", "Rulebook Writing",
                    "Box Art", "Token Design", "Board Illustration", "Playtesting",
                    "Photography", "Marketing Copy", "Video Editing", "3D Modeling"
                  ].map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs cursor-pointer hover:bg-stone-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
