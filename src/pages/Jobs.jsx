import React, { useState, useEffect } from "react";
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
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import CreateJobModal from "../components/jobs/CreateJobModal";
import JobCard from "../components/jobs/JobCard";

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

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.required_skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesJobType = jobTypeFilter === "all" || job.job_type === jobTypeFilter;
    const matchesExperience = experienceFilter === "all" || job.experience_level === experienceFilter;
    const matchesLocation = locationFilter === "all" || 
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesJobType && matchesExperience && matchesLocation;
  });

  const jobStats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'open').length,
    remote: jobs.filter(j => j.location.toLowerCase().includes('remote')).length,
    thisWeek: jobs.filter(j => 
      new Date() - new Date(j.created_date) < 7 * 24 * 60 * 60 * 1000
    ).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-stone-900">Board Game Jobs</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Find opportunities in the board game industry or post your open positions
          </p>
          
          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-stone-900">{jobStats.total}</div>
              <div className="text-sm text-stone-600">Total Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{jobStats.open}</div>
              <div className="text-sm text-stone-600">Open Positions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{jobStats.remote}</div>
              <div className="text-sm text-stone-600">Remote Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{jobStats.thisWeek}</div>
              <div className="text-sm text-stone-600">This Week</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search & Filter */}
            <Card className="bg-white/70 backdrop-blur-sm border-stone-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <Input
                        placeholder="Search jobs, skills, companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white border-stone-300 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                      <SelectTrigger className="w-32 bg-white border-stone-300">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="full_time">Full Time</SelectItem>
                        <SelectItem value="part_time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                      <SelectTrigger className="w-32 bg-white border-stone-300">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
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
                      className="w-32 bg-white border-stone-300 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Job
                </Button>
              </CardContent>
            </Card>

            {/* Job Listings */}
            {loading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-stone-200 rounded-xl h-32"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {!loading && filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-stone-900 mb-2">No jobs found</h3>
                <p className="text-stone-600 mb-6">Try adjusting your search criteria or post a new job</p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Job
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Job Categories */}
            <Card className="bg-white/70 backdrop-blur-sm border-stone-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-stone-900">Popular Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: "Game Design", count: 12 },
                    { label: "Art & Illustration", count: 8 },
                    { label: "Marketing", count: 6 },
                    { label: "Development", count: 4 },
                    { label: "Publishing", count: 3 }
                  ].map((category) => (
                    <div key={category.label} className="flex items-center justify-between">
                      <span className="text-sm text-stone-700">{category.label}</span>
                      <Badge variant="outline" className="text-xs">{category.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Companies */}
            <Card className="bg-gradient-to-br from-emerald-50 to-amber-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-stone-900">Featured Employers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Fantasy Flight Games", jobs: 3 },
                    { name: "Stonemaier Games", jobs: 2 },
                    { name: "Indie Studios Collective", jobs: 4 }
                  ].map((company) => (
                    <div key={company.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-700 text-xs font-bold">
                            {company.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-stone-900">{company.name}</span>
                      </div>
                      <Badge className="bg-white text-emerald-700 border-emerald-200 text-xs">
                        {company.jobs} jobs
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-white/70 backdrop-blur-sm border-stone-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-stone-900">Job Search Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-stone-700">
                  <p>• Update your profile with relevant skills</p>
                  <p>• Showcase your portfolio and past work</p>
                  <p>• Network with other community members</p>
                  <p>• Apply quickly to new job postings</p>
                  <p>• Follow up on your applications</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateJobModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateJob}
      />
    </div>
  );
}