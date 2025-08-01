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
    project_privacy: "public",
    estimated_release_date: "",
};

export default function ProjectFormModal({ project, open, onClose, onSuccess }) {
  const [formData, setFormData] = useState(project || emptyProject);
  const [isEditing, setIsEditing] = useState(!!project);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsEditing(!!project);
    setFormData(project || emptyProject);
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
      if (field === 'main_image_url') {
        handleInputChange(field, file_url);
      } else if (field === 'gallery_image_urls') {
         handleInputChange(field, [...(formData.gallery_image_urls || []), file_url]);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (urlToRemove) => {
    handleInputChange('gallery_image_urls', formData.gallery_image_urls.filter(url => url !== urlToRemove));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const { id, created_by, created_date, updated_date, ...updateData } = formData;
    
    updateData.player_count_min = parseInt(updateData.player_count_min, 10) || null;
    updateData.player_count_max = parseInt(updateData.player_count_max, 10) || null;
    updateData.playing_time_min = parseInt(updateData.playing_time_min, 10) || null;
    updateData.playing_time_max = parseInt(updateData.playing_time_max, 10) || null;
    
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-gray-900 border-gray-700 text-slate-200 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{isEditing ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          <DialogDescription>{isEditing ? 'Make changes to your project details.' : 'Fill out the details for your new project.'}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex-grow overflow-hidden flex flex-col">
            <Tabs defaultValue="general" className="w-full flex-grow flex flex-col overflow-hidden">
                <TabsList className="grid w-full grid-cols-5 bg-gray-800">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="details">Details & Tags</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="team">Links & Team</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    <TabsContent value="general" className="mt-0 space-y-4">
                        <div><Label>Project Title</Label><Input required value={formData.title} onChange={e => handleInputChange('title', e.target.value)} className="bg-gray-800 border-gray-700" /></div>
                        <div><Label>Short Description (max 250 chars)</Label><Textarea required value={formData.short_description} onChange={e => handleInputChange('short_description', e.target.value)} maxLength="250" className="bg-gray-800 border-gray-700" /></div>
                        <div>
                            <Label>Full Description</Label>
                            <div className="bg-white text-gray-900 rounded-md mt-1 quill-container">
                                <ReactQuill theme="snow" value={formData.full_description} onChange={val => handleInputChange('full_description', val)} />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="details" className="mt-0 grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                          <Label>Project Type</Label>
                          <Select required value={formData.project_type} onValueChange={(value) => handleInputChange("project_type", value)}>
                            <SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue placeholder="Select type..." /></SelectTrigger>
                            <SelectContent><SelectItem value="strategy">Strategy</SelectItem><SelectItem value="party">Party</SelectItem><SelectItem value="family">Family</SelectItem><SelectItem value="educational">Educational</SelectItem><SelectItem value="card_game">Card Game</SelectItem><SelectItem value="dice_game">Dice Game</SelectItem><SelectItem value="cooperative">Cooperative</SelectItem><SelectItem value="abstract">Abstract</SelectItem><SelectItem value="thematic">Thematic</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                            <SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="concept">Concept</SelectItem><SelectItem value="in_development">In Development</SelectItem><SelectItem value="prototype">Prototype</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Player Count</Label>
                            <div className="flex items-center gap-2">
                                <Input type="number" placeholder="Min" value={formData.player_count_min || ''} onChange={e => handleInputChange('player_count_min', e.target.value)} className="bg-gray-800 border-gray-700"/>
                                <Input type="number" placeholder="Max" value={formData.player_count_max || ''} onChange={e => handleInputChange('player_count_max', e.target.value)} className="bg-gray-800 border-gray-700"/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Playing Time (minutes)</Label>
                            <div className="flex items-center gap-2">
                                <Input type="number" placeholder="Min" value={formData.playing_time_min || ''} onChange={e => handleInputChange('playing_time_min', e.target.value)} className="bg-gray-800 border-gray-700"/>
                                <Input type="number" placeholder="Max" value={formData.playing_time_max || ''} onChange={e => handleInputChange('playing_time_max', e.target.value)} className="bg-gray-800 border-gray-700"/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Age Range</Label>
                           <Select value={formData.age_range} onValueChange={(value) => handleInputChange("age_range", value)}>
                                <SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue placeholder="Select age..." /></SelectTrigger>
                                <SelectContent><SelectItem value="3+">3+</SelectItem><SelectItem value="7+">7+</SelectItem><SelectItem value="10+">10+</SelectItem><SelectItem value="13+">13+</SelectItem><SelectItem value="16+">16+</SelectItem><SelectItem value="18+">18+</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Complexity</Label>
                          <Select value={formData.complexity} onValueChange={(value) => handleInputChange("complexity", value)}>
                            <SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue placeholder="Select complexity..." /></SelectTrigger>
                            <SelectContent>{complexityOptions.map(o => <SelectItem key={o} value={o} className="capitalize">{o}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label>Tags</Label>
                             <div className="flex flex-wrap gap-2 p-2 mt-2 rounded-md border border-gray-700 min-h-[40px]">
                                {formData.tags?.map(tag => (
                                    <Badge key={tag} className="bg-yellow-400/20 text-yellow-300">{tag} <X onClick={() => handleMultiSelect('tags', tag)} className="w-3 h-3 ml-2 cursor-pointer" /></Badge>
                                ))}
                            </div>
                            <Select onValueChange={(val) => val && handleMultiSelect('tags', val)}>
                                <SelectTrigger className="bg-gray-800 border-gray-700 mt-2"><SelectValue placeholder="Add a tag..." /></SelectTrigger>
                                <SelectContent>{allTags.filter(t => !formData.tags?.includes(t)).map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </TabsContent>
                    
                     <TabsContent value="media" className="mt-0 space-y-6">
                        <div>
                            <Label>Main Project Image</Label>
                            {formData.main_image_url && <img src={formData.main_image_url} alt="Main project image" className="w-48 h-auto rounded-lg my-2" />}
                            <Input id="main-image-upload" type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], 'main_image_url')} className="bg-gray-800 border-gray-700" />
                            <Label htmlFor="main-image-upload" className="sr-only">Upload Main Image</Label>
                        </div>
                         <div><Label>YouTube Video URL</Label><Input value={formData.gallery_youtube_url || ''} onChange={e => handleInputChange('gallery_youtube_url', e.target.value)} className="bg-gray-800 border-gray-700" placeholder="https://youtube.com/watch?v=..." /></div>
                        <div>
                            <Label>Gallery Images</Label>
                            <div className="grid grid-cols-3 gap-4 my-2">
                                {formData.gallery_image_urls?.map((url, i) => (
                                    <div key={i} className="relative group">
                                        <img src={url} alt={`Gallery item ${i+1}`} className="w-full h-24 object-cover rounded-md" />
                                        <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeGalleryImage(url)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Input id="gallery-image-upload" type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], 'gallery_image_urls')} className="bg-gray-800 border-gray-700" />
                             <Label htmlFor="gallery-image-upload" className="sr-only">Upload Gallery Image</Label>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="team" className="mt-0 grid grid-cols-2 gap-6">
                        <div><Label>BoardGameGeek Link</Label><Input value={formData.bgg_link || ''} onChange={e => handleInputChange('bgg_link', e.target.value)} className="bg-gray-800 border-gray-700" /></div>
                        <div><Label>Crowdfunding Link</Label><Input value={formData.crowdfunding_link || ''} onChange={e => handleInputChange('crowdfunding_link', e.target.value)} className="bg-gray-800 border-gray-700" /></div>
                        <div className="col-span-2">
                           <Label>Seeking Collaborators</Label>
                             <div className="flex flex-wrap gap-2 p-2 mt-2 rounded-md border border-gray-700 min-h-[40px]">
                                {formData.seeking_collaborators?.map(role => (
                                    <Badge key={role} className="bg-purple-400/20 text-purple-300 capitalize">{role.replace(/_/g, ' ')} <X onClick={() => handleMultiSelect('seeking_collaborators', role)} className="w-3 h-3 ml-2 cursor-pointer" /></Badge>
                                ))}
                            </div>
                            <Select onValueChange={(val) => val && handleMultiSelect('seeking_collaborators', val)}>
                                <SelectTrigger className="bg-gray-800 border-gray-700 mt-2"><SelectValue placeholder="Add a role..." /></SelectTrigger>
                                <SelectContent>{roleOptions.filter(r => !formData.seeking_collaborators?.includes(r)).map(role => <SelectItem key={role} value={role} className="capitalize">{role.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <p className="text-sm text-slate-400 col-span-2">Collaborator management is coming soon.</p>
                    </TabsContent>
                    
                    <TabsContent value="settings" className="mt-0 space-y-4">
                        <div>
                          <Label>Project Privacy</Label>
                          <Select value={formData.project_privacy} onValueChange={(value) => handleInputChange("project_privacy", value)}>
                            <SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="public">Public</SelectItem><SelectItem value="members_only">Members Only</SelectItem><SelectItem value="private">Private</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Estimated Release Date</Label>
                          <Input type="date" value={formData.estimated_release_date || ''} onChange={e => handleInputChange('estimated_release_date', e.target.value)} className="bg-gray-800 border-gray-700"/>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" id="looking_for_publisher" checked={formData.looking_for_publisher} onChange={e => handleInputChange('looking_for_publisher', e.target.checked)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-600" />
                            <Label htmlFor="looking_for_publisher">Looking for Publisher?</Label>
                        </div>
                    </TabsContent>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800 px-6 pb-4">
                    <Button type="button" variant="outline" onClick={onClose} className="bg-gray-700 hover:bg-gray-600">Cancel</Button>
                    <Button type="submit" disabled={saving || uploading} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      {saving ? "Saving..." : (uploading ? "Uploading..." : (isEditing ? "Save Changes" : "Create Project"))}
                    </Button>
                </div>
            </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
}