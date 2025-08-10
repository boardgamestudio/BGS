
import React, { useState, useEffect } from "react";
import { Project, User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const roleOptions = ["artist", "graphic_designer", "editor", "playtester", "publisher"];
const complexityOptions = ["light", "medium-light", "medium", "medium-heavy", "heavy"];
const allTags = ["Abstract", "Card Game", "Cooperative", "Deck-building", "Dice Rolling", "Eurogame", "Family Game", "Legacy", "Party Game", "Solo", "Strategy", "Thematic", "Wargame"];

const emptyProject = {
    title: "",
    short_description: "",
    full_description: "",
    project_type: "",
    status: "concept",
    main_image_url: "",
    gallery_image_urls: [],
    gallery_youtube_url: "",
    player_count_min: "",
    player_count_max: "",
    playing_time_min: "",
    playing_time_max: "",
    age_range: "",
    complexity: "",
    tags: [],
    bgg_link: "",
    crowdfunding_link: "",
    seeking_collaborators: [],
    looking_for_publisher: false,
    looking_for_manufacturer: false,
    project_privacy: "public",
    estimated_release_date: "",
    sell_sheet_url: "",
    rules_url: "",
    print_and_play_url: "",
    play_online_platform: "",
    play_online_url: "",
};

export default function ProjectFormModal({ project, open, onClose, onSuccess }) {
  const [formData, setFormData] = useState(project || emptyProject);
  const [isEditing, setIsEditing] = useState(!!project);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsEditing(!!project);

    let initialDate = '';
    if (project?.estimated_release_date) {
        const d = new Date(project.estimated_release_date);
        if (!isNaN(d.getTime())) {
            initialDate = d.toISOString().split('T')[0];
        }
    }
    
    const projectData = project ? {
        ...project,
        short_description: project.short_description || project.description || "",
        project_type: project.project_type || project.category || "",
        status: project.status || "concept",
        estimated_release_date: initialDate,
        tags: project.tags || [],
        seeking_collaborators: project.seeking_collaborators || project.needed_roles || [],
        gallery_image_urls: project.gallery_image_urls || [],
        looking_for_publisher: project.looking_for_publisher || false,
        looking_for_manufacturer: project.looking_for_manufacturer || false,
        project_privacy: project.project_privacy || "public",
        sell_sheet_url: project.sell_sheet_url || "",
        rules_url: project.rules_url || "",
        print_and_play_url: project.print_and_play_url || "",
        play_online_platform: project.play_online_platform || "",
        play_online_url: project.play_online_url || "",
    } : emptyProject;
    setFormData(projectData);
  }, [project, open]);

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
  
  const handleImageUpload = async (file, field) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      handleInputChange(field, file_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleFileUpload = async (files, field) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
        const uploadPromises = Array.from(files).map(file => UploadFile({ file }));
        const results = await Promise.all(uploadPromises);
        const urls = results.map(result => result.file_url);
        handleInputChange(field, [...(formData.gallery_image_urls || []), ...urls]);
    } catch (error) {
        console.error("Error uploading images:", error);
    } finally {
        setUploading(false);
    }
  };

  const handleFileUpload = async (file, field) => {
    if (!file) return;
    setUploading(true);
    try {
        const { file_url } = await UploadFile({ file });
        handleInputChange(field, file_url);
    } catch (error) {
        console.error("Error uploading file:", error);
    } finally {
        setUploading(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    handleInputChange('gallery_image_urls', formData.gallery_image_urls.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const { id, created_by, created_date, updated_date, ...updateData } = formData;
    
    updateData.short_description = updateData.short_description || updateData.full_description?.substring(0, 250) || "No description provided";
    updateData.project_type = updateData.project_type || "strategy";
    updateData.status = updateData.status || "concept";
    
    updateData.player_count_min = parseInt(updateData.player_count_min, 10) || null;
    updateData.player_count_max = parseInt(updateData.player_count_max, 10) || null;
    updateData.playing_time_min = parseInt(updateData.playing_time_min, 10) || null;
    updateData.playing_time_max = parseInt(updateData.playing_time_max, 10) || null;
    
    updateData.tags = updateData.tags || [];
    updateData.seeking_collaborators = updateData.seeking_collaborators || [];
    updateData.gallery_image_urls = updateData.gallery_image_urls || [];
    
    delete updateData.description;
    delete updateData.category;
    delete updateData.needed_roles;
    delete updateData.team_members;
    delete updateData.budget_range;
    delete updateData.timeline;
    delete updateData.image_url;
    delete updateData.created_by_id;
    delete updateData.is_sample;
    
    try {
      if (isEditing) {
        await Project.update(id, updateData);
      } else {
        const user = await User.me();
        await Project.create({ ...updateData, collaborators: [user.id] });
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save project", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <style>{`
      .project-form-modal .ql-editor {
        color: #1E242E; /* Tailwind's text-gray-900 in default config */
      }
      .project-form-modal .ql-toolbar.ql-snow {
        border-top-left-radius: 0.375rem; /* rounded-md */
        border-top-right-radius: 0.375rem; /* rounded-md */
        border-bottom: none;
      }
      .project-form-modal .ql-container.ql-snow {
        border-bottom-left-radius: 0.375rem; /* rounded-md */
        border-bottom-right-radius: 0.375rem; /* rounded-md */
      }
    `}</style>
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-surface border-border-default text-white flex flex-col project-form-modal">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">{isEditing ? 'Edit Game Design' : 'Create New Game Design'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for your game design.' : 'Fill out the form to create a new game design.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-6 -mr-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 bg-background">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title *</Label>
                      <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="short_description">Short Description * (max 250 chars)</Label>
                        <Textarea id="short_description" value={formData.short_description} onChange={(e) => handleInputChange('short_description', e.target.value)} required maxLength={250} className="min-h-[80px]" />
                        <p className="text-xs text-text-muted text-right">{(formData.short_description || '').length}/250 characters</p>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="full_description">Full Description</Label>
                        <div className="quill-container bg-white rounded-md">
                           <ReactQuill
                             theme="snow"
                             value={formData.full_description || ''}
                             onChange={(value) => handleInputChange('full_description', value)}
                             placeholder="Detailed description of your project..."
                             modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, 3, false] }],
                                    ['bold', 'italic', 'underline'],
                                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                    ['link', 'image'],
                                    ['clean']
                                ]
                            }}
                           />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="project_type">Project Type *</Label>
                            <Select required value={formData.project_type} onValueChange={(value) => handleInputChange('project_type', value)}>
                                <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                                <SelectContent className="bg-surface border-border-default text-white">
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
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                <SelectContent className="bg-surface border-border-default text-white">
                                    <SelectItem value="concept">Concept</SelectItem>
                                    <SelectItem value="in_development">In Development</SelectItem>
                                    <SelectItem value="prototype">Prototype</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label>Player Count</Label>
                           <div className="flex gap-2">
                             <Input type="number" placeholder="Min" value={formData.player_count_min} onChange={(e) => handleInputChange('player_count_min', e.target.value ? parseInt(e.target.value, 10) : '')} />
                             <Input type="number" placeholder="Max" value={formData.player_count_max} onChange={(e) => handleInputChange('player_count_max', e.target.value ? parseInt(e.target.value, 10) : '')} />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <Label>Playing Time (minutes)</Label>
                           <div className="flex gap-2">
                             <Input type="number" placeholder="Min" value={formData.playing_time_min} onChange={(e) => handleInputChange('playing_time_min', e.target.value ? parseInt(e.target.value, 10) : '')} />
                             <Input type="number" placeholder="Max" value={formData.playing_time_max} onChange={(e) => handleInputChange('playing_time_max', e.target.value ? parseInt(e.target.value, 10) : '')} />
                           </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="age_range">Age Range</Label>
                            <Select value={formData.age_range} onValueChange={(value) => handleInputChange('age_range', value)}>
                                <SelectTrigger><SelectValue placeholder="Select age range" /></SelectTrigger>
                                <SelectContent className="bg-surface border-border-default text-white">
                                    <SelectItem value="3+">3+</SelectItem>
                                    <SelectItem value="7+">7+</SelectItem>
                                    <SelectItem value="10+">10+</SelectItem>
                                    <SelectItem value="13+">13+</SelectItem>
                                    <SelectItem value="16+">16+</SelectItem>
                                    <SelectItem value="18+">18+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="complexity">Complexity</Label>
                            <Select value={formData.complexity} onValueChange={(value) => handleInputChange('complexity', value)}>
                                <SelectTrigger><SelectValue placeholder="Select complexity" /></SelectTrigger>
                                <SelectContent className="bg-surface border-border-default text-white">
                                    {complexityOptions.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2">
                          {allTags.map(tag => (
                            <Button key={tag} type="button" variant={formData.tags.includes(tag) ? "default" : "outline"} size="sm" onClick={() => handleMultiSelect('tags', tag)}>{tag}</Button>
                          ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Label>Collaboration</Label>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                           <div className="flex items-center space-x-2">
                              <input type="checkbox" id="looking_for_publisher" checked={formData.looking_for_publisher} onChange={(e) => handleInputChange('looking_for_publisher', e.target.checked)} className="h-4 w-4 rounded bg-background border-border-default text-primary focus:ring-primary" />
                              <Label htmlFor="looking_for_publisher">Looking for Publisher</Label>
                           </div>
                           <div className="flex items-center space-x-2">
                              <input type="checkbox" id="looking_for_manufacturer" checked={formData.looking_for_manufacturer} onChange={(e) => handleInputChange('looking_for_manufacturer', e.target.checked)} className="h-4 w-4 rounded bg-background border-border-default text-primary focus:ring-primary" />
                              <Label htmlFor="looking_for_manufacturer">Looking for Manufacturer</Label>
                           </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Seeking Collaborators</Label>
                         <div className="flex flex-wrap gap-2">
                          {roleOptions.map(role => (
                            <Button key={role} type="button" variant={formData.seeking_collaborators.includes(role) ? "secondary" : "outline"} size="sm" onClick={() => handleMultiSelect('seeking_collaborators', role)} className="capitalize">{role.replace(/_/g, ' ')}</Button>
                          ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="main_image_url">Main Cover Image</Label>
                        <div className="flex items-center gap-4">
                           {formData.main_image_url && <img src={formData.main_image_url} alt="Cover" className="w-24 h-24 object-cover rounded-lg" />}
                           <input type="file" id="main-image-upload" className="hidden" onChange={(e) => handleImageUpload(e.target.files[0], 'main_image_url')} />
                           <Button type="button" variant="outline" onClick={() => document.getElementById('main-image-upload').click()} disabled={uploading}><Upload className="w-4 h-4 mr-2" />{uploading ? "Uploading..." : "Upload Image"}</Button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Gallery Images</Label>
                         <div className="grid grid-cols-3 gap-2">
                             {(formData.gallery_image_urls || []).map((url, index) => (
                                <div key={index} className="relative">
                                    <img src={url} alt={`Gallery ${index}`} className="w-full h-24 object-cover rounded-lg" />
                                    <Button type="button" size="sm" variant="destructive" className="absolute top-1 right-1 h-6 w-6 p-0" onClick={() => removeGalleryImage(index)}><X className="w-3 h-3" /></Button>
                                </div>
                             ))}
                         </div>
                        <input type="file" id="gallery-upload" className="hidden" multiple onChange={(e) => handleMultipleFileUpload(e.target.files, 'gallery_image_urls')} />
                        <Button type="button" variant="outline" onClick={() => document.getElementById('gallery-upload').click()} disabled={uploading}><Plus className="w-4 h-4 mr-2" />{uploading ? "Uploading..." : "Add Gallery Images"}</Button>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gallery_youtube_url">YouTube Video URL</Label>
                        <Input id="gallery_youtube_url" value={formData.gallery_youtube_url} onChange={(e) => handleInputChange('gallery_youtube_url', e.target.value)} placeholder="e.g. https://www.youtube.com/watch?v=..." />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label>Sell Sheet (PDF)</Label>
                            <div className="flex items-center gap-2">
                                <input type="file" id="sell-sheet-upload" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'sell_sheet_url')} />
                                <Button type="button" variant="outline" onClick={() => document.getElementById('sell-sheet-upload').click()} disabled={uploading}>{uploading ? "..." : "Upload"}</Button>
                                {formData.sell_sheet_url && <a href={formData.sell_sheet_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline truncate">View current</a>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Rules (PDF)</Label>
                            <div className="flex items-center gap-2">
                                <input type="file" id="rules-upload" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'rules_url')} />
                                <Button type="button" variant="outline" onClick={() => document.getElementById('rules-upload').click()} disabled={uploading}>{uploading ? "..." : "Upload"}</Button>
                                {formData.rules_url && <a href={formData.rules_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline truncate">View current</a>}
                            </div>
                        </div>
                     </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label>Print & Play (PDF)</Label>
                            <div className="flex items-center gap-2">
                                <input type="file" id="pnp-upload" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], 'print_and_play_url')} />
                                <Button type="button" variant="outline" onClick={() => document.getElementById('pnp-upload').click()} disabled={uploading}>{uploading ? "..." : "Upload"}</Button>
                                {formData.print_and_play_url && <a href={formData.print_and_play_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline truncate">View current</a>}
                            </div>
                        </div>
                        <div className="space-y-2">
                           <Label>Play Online</Label>
                           <div className="flex gap-2">
                             <Select value={formData.play_online_platform} onValueChange={(value) => handleInputChange('play_online_platform', value)}>
                                <SelectTrigger className="w-2/5"><SelectValue placeholder="Platform" /></SelectTrigger>
                                <SelectContent className="bg-surface border-border-default text-white">
                                    <SelectItem value="TTS">Tabletop Simulator</SelectItem>
                                    <SelectItem value="Tabletopia">Tabletopia</SelectItem>
                                    <SelectItem value="BGA">Board Game Arena</SelectItem>
                                    <SelectItem value="Custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                             <Input className="w-3/5" placeholder="URL to game" value={formData.play_online_url} onChange={(e) => handleInputChange('play_online_url', e.target.value)} />
                           </div>
                        </div>
                     </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                  <Button type="submit" disabled={saving || uploading} className="bg-primary text-black hover:bg-primary/90">
                    {saving ? 'Saving...' : (uploading ? "Uploading..." : "Save Changes")}
                  </Button>
              </div>
            </form>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
