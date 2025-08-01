import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from "date-fns";

const jobTypeColors = {
  full_time: "bg-secondary/10 text-secondary border-secondary/20",
  part_time: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  contract: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  freelance: "bg-primary/10 text-primary border-primary/20"
};

const experienceLevelColors = {
  entry: "bg-green-400/10 text-green-400 border-green-400/20",
  junior: "bg-blue-400/10 text-blue-400 border-blue-400/20", 
  mid: "bg-purple-400/10 text-purple-400 border-purple-400/20", 
  senior: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  lead: "bg-destructive/10 text-destructive border-destructive/20"
};

export default function JobCard({ job }) {
  const timeAgo = job.created_date ? formatDistanceToNow(new Date(job.created_date), { addSuffix: true }) : '';

  return (
    <Card className="bg-surface border-border-default hover:border-primary transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold font-serif text-main mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {job.title}
            </h3>
            <Badge className={`${jobTypeColors[job.job_type] || 'bg-slate-700'} capitalize`}>{job.job_type?.replace(/_/g, ' ')}</Badge>
        </div>
        <p className="text-sm text-text-muted mb-4">{job.company_name || "A Company"} • {job.location}</p>

        <div className="flex flex-wrap gap-2 mb-4">
            {job.required_skills?.slice(0, 3).map(skill => (
                <Badge key={skill} variant="outline" className="border-border-default text-text-muted">{skill}</Badge>
            ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-text-muted">
             <span>{timeAgo}</span>
             {(job.salary_min && job.salary_max) && (
                 <span>${job.salary_min/1000}k - ${job.salary_max/1000}k</span>
             )}
        </div>
      </CardContent>
    </Card>
  );
}