
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from "date-fns";
import { FolderKanban, DollarSign } from 'lucide-react';
import { Project } from '@/api/entities';

const jobTypeColors = {
  full_time: "bg-secondary/20 text-secondary border-secondary/30",
  part_time: "bg-blue-400/20 text-blue-400 border-blue-400/30",
  contract: "bg-purple-400/20 text-purple-400 border-purple-400/30",
  freelance: "bg-primary/20 text-primary border-primary/30"
};

const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export default function JobCard({ job }) {
  const [associatedProject, setAssociatedProject] = useState(null);

  useEffect(() => {
    const loadAssociatedProject = async () => {
      if (job.associated_project) {
        try {
          const projects = await Project.filter({ id: job.associated_project });
          if (projects.length > 0) {
            setAssociatedProject(projects[0]);
          }
        } catch (error) {
          console.error("Error loading associated project:", error);
        }
      }
    };
    loadAssociatedProject();
  }, [job.associated_project]);

  const timeAgo = isValidDate(job.created_date) ?
  formatDistanceToNow(new Date(job.created_date), { addSuffix: true }) :
  'Recently posted';

  const formatCompensation = () => {
    const isSalaried = ['full_time', 'part_time', 'internship'].includes(job.job_type);
    const currencySymbol = '$';

    const formatValue = (val) => {
        if (val === null || typeof val === 'undefined') return null;
        if (val >= 1000) {
            return `${currencySymbol}${Math.round(val / 1000)}k`;
        }
        return `${currencySymbol}${val}`;
    };

    if (isSalaried) {
        const min = formatValue(job.salary_min);
        const max = formatValue(job.salary_max);
        if (!min && !max) return null;
        if (min && max && min !== max) return `${min} - ${max}`;
        const singleValue = min || max;
        return singleValue ? `${singleValue} ${job.salary_period ? `/ ${job.salary_period.slice(0, 2)}` : ''}`.trim() : null;
    } else { // Contract / Freelance
        const min = formatValue(job.project_budget_min);
        const max = formatValue(job.project_budget_max);
        if (!min && !max) return null;
        if (min && max && min !== max) return `${min} - ${max}`;
        const singleValue = min || max;
        return singleValue ? `${singleValue} Project` : null;
    }
  };
  
  const compensation = formatCompensation();

  return (
    <Link to={createPageUrl(`Jobs?id=${job.id}`)} className="group">
        <Card className="bg-surface text-card-foreground group rounded-lg border shadow-sm border-border-default hover:border-primary transition-all duration-300 h-full flex flex-col">
          <CardContent className="p-6 flex-grow flex flex-col">
            <h3 className="text-lg font-bold font-serif text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {job.title}
            </h3>
            <p className="text-sm text-slate-300 mb-4">{job.company_name || "A Company"} • {job.location}</p>

            {/* Associated Project Link */}
            {associatedProject &&
          <div className="mb-3">
                <Link
              to={createPageUrl(`ProjectDetails?id=${associatedProject.id}`)}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 bg-primary/10 px-2 py-1 rounded-full border border-primary/20">

                  <FolderKanban className="w-3 h-3" />
                  <span className="truncate max-w-32">{associatedProject.title}</span>
                </Link>
              </div>
          }

            <div className="flex flex-wrap gap-2 mb-4 h-16">
                {job.required_skills?.slice(0, 3).map((skill) =>
            <Badge key={skill} variant="outline" className="border-slate-500 text-slate-300 bg-slate-600/20 rounded-md h-6">{skill}</Badge>
            )}
            </div>
            
            <div className="mt-auto flex items-end justify-between text-sm text-slate-300">
                <div>
                    <Badge className={`${jobTypeColors[job.job_type] || 'bg-slate-600/30 text-slate-300'} capitalize`}>{job.job_type?.replace(/_/g, ' ')}</Badge>
                     {compensation && (
                      <div className="flex items-center gap-2 text-primary mt-2">
                        <DollarSign className="w-4 h-4 text-primary/80" />
                        <span className="font-semibold text-sm">{compensation}</span>
                      </div>
                    )}
                </div>
                 <span className="text-right">{timeAgo}</span>
            </div>
          </CardContent>
        </Card>
    </Link>);

}
