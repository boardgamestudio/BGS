import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUp, MessageCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const categoryColors = {
  general: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  design_theory: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  mechanics: "bg-secondary/10 text-secondary border-secondary/20",
  artwork: "bg-destructive/10 text-destructive border-destructive/20",
  publishing: "bg-primary/10 text-primary border-primary/20",
  playtesting: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  rules: "bg-indigo-400/10 text-indigo-400 border-indigo-400/20",
  marketing: "bg-orange-400/10 text-orange-400 border-orange-400/20"
};

const categoryLabels = {
  general: "General",
  design_theory: "Design Theory",
  mechanics: "Mechanics",
  artwork: "Artwork",
  publishing: "Publishing", 
  playtesting: "Playtesting",
  rules: "Rules",
  marketing: "Marketing"
};

export default function PostCard({ post }) {
  return (
    <Card className="bg-surface border-border-default hover:border-primary transition-all duration-200 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold font-serif text-main line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <Badge className={`ml-3 ${categoryColors[post.category]} capitalize text-xs`}>
                {categoryLabels[post.category]}
              </Badge>
            </div>
            
            <p className="text-text-muted text-sm line-clamp-2 mb-4">
              {post.content}
            </p>

            <div className="flex items-center justify-between text-sm text-text-muted">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {post.created_by?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">by {post.created_by?.split('@')[0] || 'User'}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">
                    {formatDistanceToNow(new Date(post.created_date))} ago
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-xs font-semibold">
                    {post.upvotes || 0}
                    </span>
                </div>
                <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">
                    {post.replies?.length || 0}
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}