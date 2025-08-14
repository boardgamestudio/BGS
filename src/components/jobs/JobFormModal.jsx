
import React, { useState, useEffect } from "react";
import { Job, User, Project } from "@/api/entities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const skillOptions = [
  "Game Design", "Rulebook Writing", "Graphic Design", "Illustration", "3D Modeling", "Sculpting",
  "Playtesting Coordination", "Project Management", "Marketing", "Social Media", "Kickstarter Management",
  "Publishing", "Manufacturing", "Editing", "Translation", "Video Production", "Photography", "Logistics"
];

const specializationByCategory = {
  art: ["Character Design", "Environment Art", "Iconography", "Box Art", "Card Layout", "Logo Design"],
  design: ["Mechanics", "Systems", "Narrative", "Solo Modes", "Co-op Design", "Level Design"],
  production: ["Sourcing", "Prototyping", "Quality Control", "Shipping & Fulfillment"],
  marketing: ["Community Management", "Content Creation", "Public Relations", "Advertising"],
  writing: ["Creative Writing", "Technical Writing", "Editing & Proofreading", "Story Development"],
  other: ["Business Development", "Legal", "Licensing", "Sales"]
};

const emptyJob = {
    title: "",
    company_name: "",
    job_type: "full_time",
    job_category: "design",
    specialization: [],
    experience_level: "",
    location: "",
    remote_work: "",
    salary_min: "",
    salary_max: "",
    salary_period: "",
    project_budget_min: "",
    project_budget_max: "",
    currency: "USD",
    full_description: "",
    required_skills: [],
    minimum_qualifications: "",
    benefits: "",
    application_instructions: "",
    application_url: "",
    contact_email: "",
    associated_project: "",
    portfolio_required: false,
    application_deadline: "",
    status: "open",
    job_privacy: "public",
    featured_job: false,
    tags: [],
    applicant_requirements: ""
};

export default function JobFormModal({ job, open, onClose, onSuccess }) {
  const [formData, setFormData] = useState(job || emptyJob);
  const [isEditing, setIsEditing] = useState(!!job);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  
  useEffect(() => {
    if (open) {
      loadUserData();
    }
  }, [open]);

  useEffect(() => {
    setIsEditing(!!job);
    const jobData = job ? {
      ...emptyJob, // Start with a clean slate
      ...job,
      application_deadline: job.application_deadline ? new Date(job.application_deadline).toISOString().split('T')[0] : "",
      associated_project: job.associated_project || "" 
    } : emptyJob;
    setFormData(jobData);
  }, [job, open]);

  const loadUserData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      if (!isEditing) {
        setFormData(prev => ({
          ...prev,
          company_name: user.company_name || "",
          contact_email: user.email || ""
        }));
      }

      const projects = await Project.filter({ created_by: user.email });
      setUserProjects(projects);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field, value) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    handleInputChange(field, newValues);
  };

  const handleRemoveItem = (field, item) => {
    const currentValues = formData[field] || [];
    handleInputChange(field, currentValues.filter(i => i !== item));
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      job_category: category,
      specialization: []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { id, created_by, created_date, updated_date, job_id, views_count, applications_count, applications, ...updateData } = formData;
      
      const isSalaried = ['full_time', 'part_time', 'internship'].includes(updateData.job_type);

      if (isSalaried) {
        updateData.salary_min = updateData.salary_min ? parseFloat(updateData.salary_min) : null;
        updateData.salary_max = updateData.salary_max ? parseFloat(updateData.salary_max) : null;
        updateData.project_budget_min = null;
        updateData.project_budget_max = null;
      } else { // Contract or Freelance
        updateData.project_budget_min = updateData.project_budget_min ? parseFloat(updateData.project_budget_min) : null;
        updateData.project_budget_max = updateData.project_budget_max ? parseFloat(updateData.project_budget_max) : null;
        updateData.salary_min = null;
        updateData.salary_max = null;
        updateData.salary_period = null;
      }
      
      updateData.application_deadline = updateData.application_deadline || null;

      if (updateData.associated_project === "") {
        updateData.associated_project = null;
      }
      
      if (!updateData.full_description) {
        updateData.full_description = updateData.title + " position";
      }
      if (!updateData.minimum_qualifications) {
        updateData.minimum_qualifications = "To be discussed during interview process";
      }
      if (!updateData.application_instructions) {
        updateData.application_instructions = "Please apply through this platform or contact us directly";
      }
      
      if (isEditing) {
        await Job.update(id, updateData);
      } else {
        await Job.create({ 
          ...updateData, 
          employer_id: currentUser.id,
          applications: [],
          job_id: `job_${Date.now()}`,
          views_count: 0,
          applications_count: 0
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save job", error);
    } finally {
      setSaving(false);
    }
  };

  const availableSpecializations = specializationByCategory[formData.job_category] || [];
  const isSalaried = ['full_time', 'part_time', 'internship'].includes(formData.job_type);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-surface border-border-default text-white overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">{isEditing ? 'Edit Job' : 'Post New Job'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 p-1">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Job Title *</Label>
              <Input id="title" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} placeholder="e.g., Senior Game Designer" className="bg-background border-border-default text-white" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name" className="text-white">Company/Studio Name *</Label>
              <Input id="company_name" value={formData.company_name} onChange={(e) => handleInputChange("company_name", e.target.value)} placeholder="Your company name" className="bg-background border-border-default text-white" required />
            </div>
          </div>

          {/* Job Category and Type */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Job Category *</Label>
              <Select value={formData.job_category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="bg-background border-border-default text-white"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent className="bg-surface border-border-default text-white">
                  <SelectItem value="art">Art & Graphic Design</SelectItem>
                  <SelectItem value="design">Game Design</SelectItem>
                  <SelectItem value="writing">Writing & Editing</SelectItem>
                  <SelectItem value="production">Production & Manufacturing</SelectItem>
                  <SelectItem value="marketing">Marketing & Community</SelectItem>
                  <SelectItem value="other">Business & Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Job Type *</Label>
              <Select value={formData.job_type} onValueChange={(value) => handleInputChange("job_type", value)}>
                <SelectTrigger className="bg-background border-border-default text-white"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent className="bg-surface border-border-default text-white">
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Experience Level *</Label>
              <Select value={formData.experience_level} onValueChange={(value) => handleInputChange("experience_level", value)}>
                <SelectTrigger className="bg-background border-border-default text-white"><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent className="bg-surface border-border-default text-white">
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid_level">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Specialization */}
          {availableSpecializations.length > 0 && (
            <div className="space-y-3">
              <Label className="text-white">Specialization *</Label>
              <div className="flex flex-wrap gap-2">
                {availableSpecializations.map(spec => (
                  <Button
                    key={spec}
                    type="button"
                    variant={formData.specialization.includes(spec) ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleMultiSelect('specialization', spec)}
                    className={formData.specialization.includes(spec) ? 
                      "bg-transparent text-primary border-primary hover:bg-primary/10" : 
                      "bg-primary text-black hover:bg-primary/90"
                    }
                  >
                    {spec}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Location and Remote */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Location *</Label>
              <Input id="location" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} placeholder="e.g., Remote, San Francisco, CA" className="bg-background border-border-default text-white" required />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Remote Work *</Label>
              <Select value={formData.remote_work} onValueChange={(value) => handleInputChange("remote_work", value)}>
                <SelectTrigger className="bg-background border-border-default text-white"><SelectValue placeholder="Select option" /></SelectTrigger>
                <SelectContent className="bg-surface border-border-default text-white">
                  <SelectItem value="on_site">On-site</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conditional Salary / Budget */}
          {isSalaried ? (
            <div className="space-y-4 p-4 border border-border-default rounded-lg">
              <Label className="font-semibold text-white">Salary Details</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input type="number" placeholder="Min Salary" value={formData.salary_min} onChange={(e) => handleInputChange("salary_min", e.target.value)} className="bg-background border-border-default text-white" />
                <Input type="number" placeholder="Max Salary" value={formData.salary_max} onChange={(e) => handleInputChange("salary_max", e.target.value)} className="bg-background border-border-default text-white" />
                <Select value={formData.salary_period} onValueChange={(value) => handleInputChange("salary_period", value)}>
                  <SelectTrigger className="bg-background border-border-default text-white"><SelectValue placeholder="Period" /></SelectTrigger>
                  <SelectContent className="bg-surface border-border-default text-white">
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 border border-border-default rounded-lg">
              <Label className="font-semibold text-white">Project Budget</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input type="number" placeholder="Min Budget" value={formData.project_budget_min} onChange={(e) => handleInputChange("project_budget_min", e.target.value)} className="bg-background border-border-default text-white" />
                  <Input type="number" placeholder="Max Budget" value={formData.project_budget_max} onChange={(e) => handleInputChange("project_budget_max", e.target.value)} className="bg-background border-border-default text-white" />
              </div>
               <p className="text-xs text-slate-400">Provide a budget range for this contract or freelance project.</p>
            </div>
          )}


          {/* Associated Project */}
          <div className="space-y-2">
            <Label className="text-white">Associated Game Design Project</Label>
            <Select value={formData.associated_project || ""} onValueChange={(value) => handleInputChange("associated_project", value)} disabled={userProjects.length === 0}>
                <SelectTrigger className="bg-background border-border-default text-white">
                    <SelectValue placeholder={userProjects.length > 0 ? "Select a project (optional)" : "No projects available"} />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border-default text-white">
                    <SelectItem value={null}>None</SelectItem>
                    {userProjects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                            {project.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-xs text-slate-400">Link this job to one of your game design projects</p>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Full Job Description *</Label>
              <div className="quill-container">
                <ReactQuill value={formData.full_description} onChange={(value) => handleInputChange("full_description", value)} placeholder="Detailed job description..."/>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-white">Required Skills *</Label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map(skill => (
                  <Button
                    key={skill}
                    type="button"
                    variant={formData.required_skills.includes(skill) ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleMultiSelect('required_skills', skill)}
                    className={formData.required_skills.includes(skill) ? 
                      "bg-transparent text-primary border-primary hover:bg-primary/10" :
                      "bg-primary text-black hover:bg-primary/90"
                    }
                  >
                    {skill}
                  </Button>
                ))}
              </div>
              {formData.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.required_skills.map(skill => (
                    <Badge key={skill} className="bg-primary/10 text-primary border border-primary/20">
                      {skill}
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveItem('required_skills', skill)} className="ml-2 h-auto p-0 hover:bg-transparent text-primary">
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Qualifications */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Minimum Qualifications *</Label>
              <div className="quill-container">
                <ReactQuill value={formData.minimum_qualifications} onChange={(value) => handleInputChange("minimum_qualifications", value)} placeholder="List minimum requirements..." />
              </div>
            </div>
          </div>

          {/* Application Instructions */}
          <div className="space-y-2">
            <Label className="text-white">Application Instructions *</Label>
            <div className="quill-container">
              <ReactQuill value={formData.application_instructions} onChange={(value) => handleInputChange("application_instructions", value)} placeholder="How should candidates apply..." />
            </div>
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <Label htmlFor="contact_email" className="text-white">Contact Email *</Label>
            <Input id="contact_email" type="email" value={formData.contact_email} onChange={(e) => handleInputChange("contact_email", e.target.value)} placeholder="contact@company.com" className="bg-background border-border-default text-white" required />
          </div>

          {/* Optional Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="application_deadline" className="text-white">Application Deadline</Label>
              <Input id="application_deadline" type="date" value={formData.application_deadline} onChange={(e) => handleInputChange("application_deadline", e.target.value)} className="bg-background border-border-default text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Job Privacy</Label>
              <Select value={formData.job_privacy} onValueChange={(value) => handleInputChange("job_privacy", value)}>
                <SelectTrigger className="bg-background border-border-default text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-surface border-border-default text-white">
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="members_only">Members Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Portfolio Required */}
          <div className="flex items-center space-x-2">
            <Checkbox id="portfolio_required" checked={formData.portfolio_required} onCheckedChange={(checked) => handleInputChange("portfolio_required", checked)} />
            <Label htmlFor="portfolio_required" className="text-white">Portfolio Required</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-default">
            <Button type="button" variant="outline" onClick={onClose} className="bg-background text-white border-border-default hover:bg-slate-700">Cancel</Button>
            <Button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Job"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
