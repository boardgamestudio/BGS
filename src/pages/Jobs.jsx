
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Job, User } from "@/api/entities";
import { 
  Briefcase, 
  Plus,
  Search, 
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Star,
  Calendar,
  Palette,
  Gamepad2,
  BookOpen,
  Megaphone,
  LayoutGrid
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import JobFormModal from "../components/jobs/JobFormModal";
import JobCard from "../components/jobs/JobCard";
import JobDetails from "./JobDetails"; // Assuming JobDetails is in the same directory

const jobTypeColors = {
  full_time: "bg-emerald-100 text-emerald-800 border-emerald-200",
  part_time: "bg-blue-100 text-blue-800 border-blue-200",
  contract: "bg-purple-100 text-purple-800 border-purple-200",
  freelance: "bg-amber-100 text-amber-800 border-amber-200"
};

const experienceLevelColors = {
  entry: "bg-green-100 text-green-800 border-green-200",
  junior: "bg-blue-100 text-blue-800 border-blue-200",
  mid: "bg-purple-100 text-purple-800 border-purple-200", 
  senior: "bg-orange-100 text-orange-800 border-orange-200",
  lead: "bg-red-100 text-red-800 border-red-200"
};

const categoryLabels = {
  art: "Art & Graphic Design",
  design: "Game Design",
  writing: "Writing & Editing",
  production: "Production & Manufacturing",
  marketing: "Marketing & Community",
  other: "Business & Operations"
};

const jobCategoryStyles = {
  all: { icon: LayoutGrid, color: "text-slate-400", bgColor: "bg-slate-400/10", borderColor: "border-slate-400/20" },
  art: { icon: Palette, color: "text-purple-400", bgColor: "bg-purple-400/10", borderColor: "border-purple-400/20" },
  design: { icon: Gamepad2, color: "text-amber-400", bgColor: "bg-amber-400/10", borderColor: "border-amber-400/20" },
  writing: { icon: BookOpen, color: "text-emerald-400", bgColor: "bg-emerald-400/10", borderColor: "border-emerald-400/20" },
  production: { icon: Briefcase, color: "text-red-400", bgColor: "bg-red-400/10", borderColor: "border-red-400/20" },
  marketing: { icon: Megaphone, color: "text-orange-400", bgColor: "bg-orange-400/10", borderColor: "border-orange-400/20" },
  other: { icon: DollarSign, color: "text-blue-400", bgColor: "bg-blue-400/10", borderColor: "border-blue-400/20" },
};


export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all"); // New filter state
  const [showCreateModal, setShowCreateModal] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const jobId = searchParams.get('id');

  useEffect(() => {
    if (!jobId) { // Only load jobs if not viewing a specific job detail page
      loadJobs();
    }
  }, [jobId]); // Re-run effect if jobId changes (e.g., navigating to/from a job detail page)

  const loadJobs = async () => {
    setLoading(true); // Set loading to true when starting to load jobs
    try {
      const jobList = await Job.list('-created_date');
      setJobs(jobList);
    } catch (error) {
      console.error("Error loading jobs:", error);
    }
    setLoading(false);
  };

  const handleCreateJob = async () => {
    await loadJobs();
    setShowCreateModal(false);
  };

  const categoryCounts = useMemo(() => {
    const counts = { all: jobs.length };
    Object.keys(categoryLabels).forEach(key => {
        counts[key] = jobs.filter(job => job.job_category === key).length;
    });
    return counts;
  }, [jobs]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      (job.title && job.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.short_description && job.short_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.required_skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesJobType = jobTypeFilter === "all" || job.job_type === jobTypeFilter;
    const matchesExperience = experienceFilter === "all" || job.experience_level === experienceFilter;
    const matchesLocation = locationFilter === "all" || 
      (job.location && job.location.toLowerCase().includes(locationFilter.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || job.job_category === categoryFilter;
    
    return matchesSearch && matchesJobType && matchesExperience && matchesLocation && matchesCategory;
  });

  // If a jobId is present in the URL, render the JobDetails component
  if (jobId) {
    return <JobDetails />;
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold font-serif text-main mb-2">Board Game Jobs</h1>
              <p className="text-slate-300">Find opportunities in the board game industry</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Job
            </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            
            {/* Search & Filter */}
            <Card className="bg-surface border-border-default">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search jobs, skills, companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background border-border-default focus:border-primary text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                      <SelectTrigger className="w-28 sm:w-32 bg-background border-border-default text-white text-sm">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-border-default">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="full_time">Full Time</SelectItem>
                        <SelectItem value="part_time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                      <SelectTrigger className="w-24 sm:w-32 bg-background border-border-default text-white text-sm">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-border-default">
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="entry">Entry</SelectItem>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="mid">Mid</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Location..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-28 sm:w-32 bg-background border-border-default focus:border-primary text-white placeholder:text-slate-400 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Listings */}
            {loading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-surface rounded-xl h-64"></div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {!loading && filteredJobs.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No jobs found</h3>
                <p className="text-slate-300 mb-6 px-4">Try adjusting your search criteria or post a new job</p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary text-black hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Job
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:block hidden">
            
            {/* Job Categories */}
             <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">Categories</h2>
                <div className="space-y-3">
                    <Card
                        key="all"
                        className={`bg-surface border-border-default hover:border-primary/50 transition-all duration-300 group cursor-pointer ${categoryFilter === 'all' ? 'border-primary/50' : ''}`}
                        onClick={() => setCategoryFilter('all')}
                    >
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 ${jobCategoryStyles.all.bgColor} rounded-lg flex items-center justify-center border ${jobCategoryStyles.all.borderColor}`}>
                                        <jobCategoryStyles.all.icon className={`w-4 h-4 ${jobCategoryStyles.all.color}`} />
                                    </div>
                                    <h3 className="text-sm font-bold font-serif text-white group-hover:text-primary transition-colors">
                                        All Categories
                                    </h3>
                                </div>
                                <Badge variant="outline" className="border-border-default text-slate-300 bg-background">{categoryCounts.all}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {Object.entries(categoryLabels).map(([key, label]) => {
                        const style = jobCategoryStyles[key];
                        if (!style) return null;
                        return (
                            <Card
                                key={key}
                                className={`bg-surface border-border-default hover:border-primary/50 transition-all duration-300 group cursor-pointer ${categoryFilter === key ? 'border-primary/50' : ''}`}
                                onClick={() => setCategoryFilter(key)}
                            >
                                <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 ${style.bgColor} rounded-lg flex items-center justify-center border ${style.borderColor}`}>
                                                <style.icon className={`w-4 h-4 ${style.color}`} />
                                            </div>
                                            <h3 className="text-sm font-bold font-serif text-white group-hover:text-primary transition-colors">
                                                {label}
                                            </h3>
                                        </div>
                                        <Badge variant="outline" className="border-border-default text-slate-300 bg-background">{categoryCounts[key] || 0}</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
          </div>
        </div>
      </div>

      <JobFormModal
        job={null}
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateJob}
      />
    </div>
  );
}
