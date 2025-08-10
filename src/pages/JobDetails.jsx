
import React, { useState, useEffect } from "react";
import { Job, User, Project } from "@/api/entities";
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Star,
  Calendar,
  ExternalLink,
  ChevronLeft,
  Edit // Added Edit icon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, formatDistanceToNow } from "date-fns";
import JobApplicationModal from "../components/jobs/JobApplicationModal";
import JobFormModal from "../components/jobs/JobFormModal"; // Added JobFormModal import

const jobTypeColors = {
  full_time: "bg-secondary/20 text-secondary border-secondary/30",
  part_time: "bg-blue-400/20 text-blue-400 border-blue-400/30",
  contract: "bg-purple-400/20 text-purple-400 border-purple-400/30",
  freelance: "bg-primary/20 text-primary border-primary/30",
  internship: "bg-info/20 text-info border-info/30"
};

const experienceLevelColors = {
  entry: "bg-green-400/20 text-green-400 border-green-400/30",
  junior: "bg-blue-400/20 text-blue-400 border-blue-400/30",
  mid_level: "bg-purple-400/20 text-purple-400 border-purple-400/30", 
  senior: "bg-orange-400/20 text-orange-400 border-orange-400/30",
  expert: "bg-destructive/20 text-destructive border-destructive/30"
};

export default function JobDetails() {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [employer, setEmployer] = useState(null);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // Added showEditModal state
    const [hasApplied, setHasApplied] = useState(false);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const jobId = searchParams.get('id');

    useEffect(() => {
        loadJobDetails();
    }, [jobId]);

    const loadJobDetails = async () => {
        setLoading(true);
        try {
            const [jobData, userData] = await Promise.all([
                Job.filter({ id: jobId }),
                User.me().catch(() => null)
            ]);

            if (jobData.length > 0) {
                let jobItem = jobData[0];
                setCurrentUser(userData);

                let needsDataFix = false;
                let fixedApplications = jobItem.applications || [];
                if (fixedApplications.length > 0 && typeof fixedApplications[0] === 'string') {
                    needsDataFix = true;
                    fixedApplications = fixedApplications.map(applicantId => ({
                        applicant_id: applicantId,
                        message: 'Legacy application data.',
                        profile_link: '',
                        attached_files: [],
                        applied_date: jobItem.created_date || new Date().toISOString(),
                        status: 'pending'
                    }));
                }

                if (needsDataFix) {
                    jobItem.applications = fixedApplications;
                }
                setJob(jobItem);
                
                if (userData && jobItem.applications) {
                    const userApplication = jobItem.applications.find(app => app.applicant_id === userData.id);
                    setHasApplied(!!userApplication);
                }

                if (jobItem.employer_id) {
                    const employerData = await User.filter({ id: jobItem.employer_id });
                    if (employerData.length > 0) {
                        setEmployer(employerData[0]);
                    }
                }
                
                const updatePayload = {
                    views_count: (jobItem.views_count || 0) + 1
                };

                if (needsDataFix) {
                    updatePayload.applications = fixedApplications;
                }
                
                try {
                    await Job.update(jobId, updatePayload);
                } catch (updateError) {
                    console.warn("Could not update job record:", updateError);
                }

            }
        } catch (error) {
            console.error("Error loading job details:", error);
        }
        setLoading(false);
    };

    const handleApplicationSubmitted = () => {
        setShowApplicationModal(false);
        setHasApplied(true);
        loadJobDetails();
    };

    const handleEditSuccess = () => { // Added handleEditSuccess function
        setShowEditModal(false);
        loadJobDetails();
    };

    const handleLoginAndApply = async () => {
        await User.loginWithRedirect(window.location.href);
    }

    const renderApplyButton = () => {
        const isOwnJob = currentUser && employer && currentUser.id === employer.id;
        
        if (isOwnJob) {
            return (
                <div className="space-y-2">
                    <Button disabled className="w-full">This is your job posting</Button>
                    <Button onClick={() => setShowEditModal(true)} variant="outline" className="w-full bg-background text-white border-border-default hover:bg-slate-700">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit this job posting
                    </Button>
                </div>
            );
        }
        if (job.status !== 'open') {
            return <Button disabled className="w-full">Applications are closed</Button>;
        }
        if (!currentUser) {
            return <Button onClick={handleLoginAndApply} className="btn-primary w-full">Login to Apply</Button>;
        }
        if (hasApplied) {
            return <Button disabled className="w-full">Already Applied</Button>;
        }
        return (
            <Button
                onClick={() => setShowApplicationModal(true)}
                className="btn-primary w-full"
            >
                Apply Now
            </Button>
        );
    }

    if (loading) {
        return <div className="text-center p-12 text-text-muted">Loading job details...</div>;
    }

    if (!job) {
        return <div className="text-center p-12 text-text-muted">Job not found.</div>;
    }

    const formatCompensation = () => {
        const isSalaried = ['full_time', 'part_time', 'internship'].includes(job.job_type);
        if (isSalaried) {
            if (!job.salary_min && !job.salary_max) return "Not specified";
            const min = job.salary_min ? `$${job.salary_min.toLocaleString()}` : '';
            const max = job.salary_max ? `$${job.salary_max.toLocaleString()}` : '';
            const range = (min && max && min !== max) ? `${min} - ${max}` : (min || max);
            return `${range} ${job.salary_period ? `per ${job.salary_period}` : ''}`;
        } else { // Contract or Freelance
            if (!job.project_budget_min && !job.project_budget_max) return "Not specified";
            const min = job.project_budget_min ? `$${job.project_budget_min.toLocaleString()}` : '';
            const max = job.project_budget_max ? `$${job.project_budget_max.toLocaleString()}` : '';
            const range = (min && max && min !== max) ? `${min} - ${max}` : (min || max);
            return `${range} per project`;
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 text-white">
            <div className="max-w-5xl mx-auto space-y-8">
                
                <Link to={createPageUrl('Jobs')} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    Back to all jobs
                </Link>

                {/* Job Header */}
                <Card className="bg-surface border-border-default">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex-1">
                                <div className="flex items-start gap-4 mb-4">
                                    {job.company_logo && (
                                        <img src={job.company_logo} alt="Company Logo" className="w-16 h-16 rounded-lg object-contain bg-white/10 p-2" />
                                    )}
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold font-serif text-white mb-2">{job.title}</h1>
                                        <div className="flex flex-wrap items-center gap-4 text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                <span>{job.company_name || 'Company'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>Posted {job.created_date ? formatDistanceToNow(new Date(job.created_date)) + ' ago' : 'recently'}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <Badge className={`${jobTypeColors[job.job_type]} capitalize`}>
                                                {job.job_type?.replace(/_/g, ' ')}
                                            </Badge>
                                            <Badge className={`${experienceLevelColors[job.experience_level]} capitalize`}>
                                                {job.experience_level?.replace(/_/g, ' ')}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full md:w-auto">
                                {renderApplyButton()}
                                {job.application_url && (
                                    <Button variant="outline" asChild className="bg-background text-white border-border-default">
                                        <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            External Application
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {job.full_description && (
                            <Card className="bg-surface border-border-default">
                                <CardHeader><CardTitle className="font-serif">Job Description</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: job.full_description }}></div>
                                </CardContent>
                            </Card>
                        )}

                        {job.required_skills && job.required_skills.length > 0 && (
                            <Card className="bg-surface border-border-default">
                                <CardHeader><CardTitle className="font-serif">Required Skills</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {job.required_skills.map(skill => (
                                            <Badge key={skill} variant="outline" className="border-primary/50 bg-primary/10 text-primary">{skill}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                         {job.minimum_qualifications && (
                            <Card className="bg-surface border-border-default">
                                <CardHeader><CardTitle className="font-serif">Minimum Qualifications</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: job.minimum_qualifications }}></div>
                                </CardContent>
                            </Card>
                        )}
                        
                         {job.preferred_qualifications && (
                            <Card className="bg-surface border-border-default">
                                <CardHeader><CardTitle className="font-serif">Preferred Qualifications</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: job.preferred_qualifications }}></div>
                                </CardContent>
                            </Card>
                        )}

                         {job.benefits && (
                            <Card className="bg-surface border-border-default">
                                <CardHeader><CardTitle className="font-serif">Benefits</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: job.benefits }}></div>
                                </CardContent>
                            </Card>
                        )}

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-surface border-border-default">
                            <CardHeader><CardTitle className="font-serif text-lg">Job Summary</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <DollarSign className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <p className="font-semibold text-white">Salary / Budget</p>
                                        <p className="text-slate-300">{formatCompensation()}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Users className="w-5 h-5 text-primary mt-1" />
                                    <div>
                                        <p className="font-semibold text-white">Applications</p>
                                        <p className="text-slate-300">{job.applications_count || 0} received</p>
                                    </div>
                                </div>
                                {job.application_deadline && (
                                     <div className="flex items-start gap-4">
                                        <Calendar className="w-5 h-5 text-primary mt-1" />
                                        <div>
                                            <p className="font-semibold text-white">Apply By</p>
                                            <p className="text-slate-300">{format(new Date(job.application_deadline), "MMMM d, yyyy")}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        
                        {employer && (
                             <Card className="bg-surface border-border-default">
                                <CardHeader><CardTitle className="font-serif text-lg">About {employer.company_name || 'the company'}</CardTitle></CardHeader>
                                <CardContent className="flex items-center gap-4">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={employer.profile_picture} />
                                        <AvatarFallback>{(employer.display_name || 'C').charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-white">{employer.display_name}</p>
                                        <Link to={createPageUrl(`Profile?id=${employer.id}`)} className="text-sm text-primary hover:underline">View Profile</Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

            </div>

            {showApplicationModal && (
                <JobApplicationModal
                    job={job}
                    open={showApplicationModal}
                    onClose={() => setShowApplicationModal(false)}
                    onSuccess={handleApplicationSubmitted}
                />
            )}

            {showEditModal && ( // Conditionally render JobFormModal
                <JobFormModal
                    job={job}
                    open={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
}
