import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ProjectCard({ project }) {
  
  return (
    <Link to={createPageUrl(`ProjectDetails?id=${project.id}`)} className="group">
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
                <p className="text-sm text-text-muted line-clamp-2 mb-4">
                    {project.short_description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                     <Badge className="bg-secondary/10 text-secondary border-secondary/20 capitalize font-medium">
                        {project.project_type?.replace(/_/g, ' ')}
                    </Badge>
                     <p className="text-xs text-text-muted">by {project.created_by.split('@')[0]}</p>
                </div>
            </CardContent>
        </Card>
    </Link>
  );
}