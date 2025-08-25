
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProjectCard({ project, author, projectAuthors = {} }) {

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0].charAt(0) + (names[names.length - 1].charAt(0) || '');
    }
    return name.charAt(0);
  };

  // Try multiple ways to find the author
  const actualAuthor = author || projectAuthors[project.created_by] || projectAuthors[project.created_by_id] || projectAuthors[project.author_id];
  
  return (
    <Link to={`/projects/${project.id}`} className="group">
        <Card className="bg-surface border-border-default hover:border-primary transition-all duration-300 flex flex-col h-full overflow-hidden">
            <div className="aspect-video bg-background relative overflow-hidden">
                {project.main_image_url ? (
                <img 
                    src={project.main_image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="text-4xl font-serif text-primary">🎲</div>
                </div>
                )}
            </div>
            
            <CardContent className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold font-serif text-main mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {project.title}
                </h3>
                <p className="text-sm text-slate-300 line-clamp-2 mb-4">
                    {project.short_description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                     <Badge className="bg-secondary/10 text-secondary border-secondary/20 capitalize font-medium">
                        {project.project_type?.replace(/_/g, ' ')}
                    </Badge>
                     
                     <div 
                        className="flex items-center"
                        title={actualAuthor?.display_name || actualAuthor?.full_name || 'Unknown Author'}
                     >
                        <Avatar className="w-10 h-10 border-2 border-surface">
                            <AvatarImage src={actualAuthor?.profile_picture} />
                            <AvatarFallback className="text-sm bg-slate-700 text-slate-300">
                                {getInitials(actualAuthor?.display_name || actualAuthor?.full_name || 'U')}
                            </AvatarFallback>
                        </Avatar>
                     </div>
                </div>
            </CardContent>
        </Card>
    </Link>
  );
}
