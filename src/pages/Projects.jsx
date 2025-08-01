
import React, { useState, useEffect } from "react";
import { Project, User } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plus,
  Search, 
  FilterIcon,
  Users,
  Clock,
  DollarSign,
  Star,
  MapPin,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProjectFormModal from "../components/projects/ProjectFormModal";
import ProjectCard from "../components/projects/ProjectCard";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectTypeFilter, setProjectTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectList = await Project.list('-updated_date');
      setProjects(projectList);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
    setLoading(false);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadProjects();
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProjectType = projectTypeFilter === "all" || project.project_type === projectTypeFilter;
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesProjectType && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold font-serif text-main mb-2">Projects</h1>
            <p className="text-text-muted">Discover and collaborate on amazing board game projects</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-surface border-border-default">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border-default focus:border-primary text-main"
                  />
                </div>
              </div>
              <Select value={projectTypeFilter} onValueChange={setProjectTypeFilter}>
                <SelectTrigger className="w-full md:w-48 bg-background border-border-default text-main">
                  <SelectValue placeholder="Project Type" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border-default text-main">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="strategy">Strategy</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="card_game">Card Game</SelectItem>
                  <SelectItem value="dice_game">Dice Game</SelectItem>
                  <SelectItem value="cooperative">Cooperative</SelectItem>
                  <SelectItem value="abstract">Abstract</SelectItem>
                  <SelectItem value="thematic">Thematic</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-background border-border-default text-main">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border-default text-main">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="concept">Concept</SelectItem>
                  <SelectItem value="in_development">In Development</SelectItem>
                  <SelectItem value="prototype">Prototype</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-surface rounded-lg h-80"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-xl font-semibold text-main mb-2">No projects found</h3>
            <p className="text-text-muted mb-6">Try adjusting your search criteria or create a new project</p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        )}
      </div>

      <ProjectFormModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
