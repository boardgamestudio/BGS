import React, { useState } from "react";
import { Job, User } from "@/api/entities";
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
import { X } from "lucide-react";

const skillOptions = [
  "Game Design", "Art Direction", "Illustration", "Graphic Design", "Marketing",
  "Business Development", "Project Management", "Writing", "Editing", "Playtesting",
  "Manufacturing", "Distribution", "Community Management", "Video Production"
];

export default function CreateJobModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    job_type: "",
    location: "",
    salary_min: "",
    salary_max: "",
    currency: "USD",
    required_skills: [],
    preferred_skills: [],
    experience_level: "",
    application_deadline: ""
  });
  const [creating, setCreating] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = (skill, type) => {
    if (!formData[type].includes(skill)) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], skill]
      }));
    }
  };

  const handleRemoveSkill = (skill, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const user = await User.me();
      
      const jobData = {
        ...formData,
        employer_id: user.id,
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        applications: []
      };

      await Job.create(jobData);

      onSuccess();
      setFormData({
        title: "",
        description: "",
        job_type: "",
        location: "",
        salary_min: "",
        salary_max: "",
        currency: "USD",
        required_skills: [],
        preferred_skills: [],
        experience_level: "",
        application_deadline: ""
      });
    } catch (error) {
      console.error("Error creating job:", error);
    }
    setCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-stone-900">Post New Job</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Senior Game Designer"
              className="bg-white border-stone-300 focus:border-emerald-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="bg-white border-stone-300 focus:border-emerald-500 min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Type</Label>
              <Select value={formData.job_type} onValueChange={(value) => handleInputChange("job_type", value)}>
                <SelectTrigger className="bg-white border-stone-300">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select value={formData.experience_level} onValueChange={(value) => handleInputChange("experience_level", value)}>
                <SelectTrigger className="bg-white border-stone-300">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead/Principal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g., Remote, San Francisco, CA"
              className="bg-white border-stone-300 focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_min">Min Salary</Label>
              <Input
                id="salary_min"
                type="number"
                min="0"
                value={formData.salary_min}
                onChange={(e) => handleInputChange("salary_min", e.target.value)}
                placeholder="50000"
                className="bg-white border-stone-300 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_max">Max Salary</Label>
              <Input
                id="salary_max"
                type="number"
                min="0"
                value={formData.salary_max}
                onChange={(e) => handleInputChange("salary_max", e.target.value)}
                placeholder="80000"
                className="bg-white border-stone-300 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                <SelectTrigger className="bg-white border-stone-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="application_deadline">Application Deadline (Optional)</Label>
            <Input
              id="application_deadline"
              type="date"
              value={formData.application_deadline}
              onChange={(e) => handleInputChange("application_deadline", e.target.value)}
              className="bg-white border-stone-300 focus:border-emerald-500"
            />
          </div>

          {/* Required Skills */}
          <div className="space-y-2">
            <Label>Required Skills</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill, 'required_skills')}
                  disabled={formData.required_skills.includes(skill)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    formData.required_skills.includes(skill)
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200 cursor-not-allowed'
                      : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {formData.required_skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.required_skills.map((skill) => (
                  <Badge key={skill} className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill, 'required_skills')}
                      className="ml-2 hover:bg-emerald-200 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Skills */}
          <div className="space-y-2">
            <Label>Preferred Skills (Optional)</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skillOptions.filter(skill => !formData.required_skills.includes(skill)).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill, 'preferred_skills')}
                  disabled={formData.preferred_skills.includes(skill)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    formData.preferred_skills.includes(skill)
                      ? 'bg-blue-100 text-blue-800 border-blue-200 cursor-not-allowed'
                      : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {formData.preferred_skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.preferred_skills.map((skill) => (
                  <Badge key={skill} className="bg-blue-100 text-blue-800 border-blue-200">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill, 'preferred_skills')}
                      className="ml-2 hover:bg-blue-200 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creating}
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              {creating ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}