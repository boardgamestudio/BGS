import React, { useState } from 'react';
import { User } from '@/api/entities';
import { UploadFile } from "@/api/integrations";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus, Upload } from 'lucide-react';

// Import management components
import ManageProjects from './content/ManageProjects';
import ManageJobs from './content/ManageJobs';
import ManageEvents from './content/ManageEvents';
import ManagePosts from './content/ManagePosts';
import ManageGroups from './content/ManageGroups';

// Predefined options
const userTypeOptions = ["learner", "creative", "designer", "service"];
const englishLevelOptions = ["basic", "conversational", "fluent", "native"];
const allSkills = ["Game Design", "Illustration", "Graphic Design", "Writing", "Editing", "Marketing", "3D Modeling", "Prototyping", "Rulebook Writing", "Playtesting Coordination"];
const gameDesignFocusOptions = ["Strategy", "Party", "Family", "Educational", "Card Game", "Dice Game", "Cooperative", "Abstract", "Thematic"];
const languageOptions = ["English", "Spanish", "German", "French", "Mandarin", "Japanese"];

const Section = ({ title, description, children }) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && <p className="text-sm text-slate-400 mt-1 mb-4">{description}</p>}
        <div className="space-y-4">{children}</div>
    </div>
);

export default function EditProfileForm({ user, onSave, onCancel }) {
    const [formData, setFormData] = useState({ 
        ...user,
        skills: user.skills || [],
        languages: user.languages || [],
        game_design_focus: user.game_design_focus || [],
        work_experience: user.work_experience || [],
        education: user.education || [],
        portfolio: user.portfolio || [],
        notification_preferences: user.notification_preferences || { email: true, site: true },
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleNestedChange = (collection, index, field, value) => {
        const updatedCollection = [...(formData[collection] || [])];
        updatedCollection[index] = { ...updatedCollection[index], [field]: value };
        setFormData(prev => ({ ...prev, [collection]: updatedCollection }));
    };

    const addNestedItem = (collection, newItem) => {
        setFormData(prev => ({ ...prev, [collection]: [...(prev[collection] || []), newItem] }));
    };

    const removeNestedItem = (collection, index) => {
        const updatedCollection = (formData[collection] || []).filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [collection]: updatedCollection }));
    };
    
    const handleMultiSelect = (field, value) => {
        const currentValues = formData[field] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value];
        handleInputChange(field, newValues);
    };

    const handleProfilePicUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const { file_url } = await UploadFile({ file });
            handleInputChange('profile_picture', file_url);
        } catch (error) {
            console.error("Error uploading profile picture:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handlePortfolioUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const { file_url } = await UploadFile({ file });
            const newPortfolio = [...(formData.portfolio || []), file_url];
            handleInputChange('portfolio', newPortfolio);
        } catch (error) {
            console.error("Error uploading portfolio image:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const removePortfolioImage = (urlToRemove) => {
        const newPortfolio = (formData.portfolio || []).filter(url => url !== urlToRemove);
        handleInputChange('portfolio', newPortfolio);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const { id, created_date, updated_date, email, role, full_name, ...updateData } = formData;
        
        try {
            await User.updateMyUserData(updateData);
            onSave();
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row justify-between items-center sticky top-0 bg-gray-800 z-10 p-4 border-b border-gray-700">
                    <div>
                        <CardTitle className="text-white">Edit Profile</CardTitle>
                        <CardDescription>Update your personal and professional information.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                         <Button type="button" variant="outline" onClick={onCancel} className="bg-gray-700 hover:bg-gray-600">Cancel</Button>
                         <Button type="submit" disabled={isSaving || isUploading} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                            {isSaving ? 'Saving...' : (isUploading ? 'Uploading...' : 'Save Changes')}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="grid w-full grid-cols-7 p-2 bg-gray-900/50">
                            <TabsTrigger value="personal">Personal</TabsTrigger>
                            <TabsTrigger value="professional">Professional</TabsTrigger>
                            <TabsTrigger value="projects">Projects</TabsTrigger>
                            <TabsTrigger value="jobs">Job Postings</TabsTrigger>
                            <TabsTrigger value="events">Events</TabsTrigger>
                            <TabsTrigger value="posts">Posts</TabsTrigger>
                            <TabsTrigger value="groups">Groups</TabsTrigger>
                        </TabsList>
                        
                        <div className="p-6">
                            {/* PERSONAL TAB */}
                            <TabsContent value="personal" className="space-y-6 mt-0">
                                <Section title="General Information">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><Label>First Name</Label><Input value={formData.first_name || ''} onChange={e => handleInputChange('first_name', e.target.value)} className="bg-gray-700 border-gray-600 text-white" /></div>
                                        <div><Label>Last Name</Label><Input value={formData.last_name || ''} onChange={e => handleInputChange('last_name', e.target.value)} className="bg-gray-700 border-gray-600 text-white" /></div>
                                    </div>
                                    <div><Label>Display Name</Label><Input value={formData.display_name || ''} onChange={e => handleInputChange('display_name', e.target.value)} className="bg-gray-700 border-gray-600 text-white" /></div>
                                    <div><Label>Profile Picture</Label><Input type="file" onChange={handleProfilePicUpload} className="bg-gray-700 border-gray-600 text-white" /></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><Label>City</Label><Input value={formData.city || ''} onChange={e => handleInputChange('city', e.target.value)} className="bg-gray-700 border-gray-600 text-white" /></div>
                                        <div><Label>Country</Label><Input value={formData.country || ''} onChange={e => handleInputChange('country', e.target.value)} className="bg-gray-700 border-gray-600 text-white" /></div>
                                    </div>
                                </Section>

                                <Section title="Portfolio & Social Links">
                                    <Label>Portfolio Images</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                        {formData.portfolio?.map(url => (
                                            <div key={url} className="relative group">
                                                <img src={url} alt="Portfolio item" className="w-full h-32 object-cover rounded-md" />
                                                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removePortfolioImage(url)}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Label htmlFor="portfolio-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-700/50">
                                            <Upload className="w-8 h-8 text-gray-500" />
                                            <span className="text-sm text-gray-500">Upload Image</span>
                                        </Label>
                                        <Input id="portfolio-upload" type="file" accept="image/*" className="hidden" onChange={handlePortfolioUpload} />
                                    </div>
                                    <div><Label>Website URL</Label><Input value={formData.website_url || ''} onChange={e => handleInputChange('website_url', e.target.value)} className="bg-gray-700 border-gray-600" placeholder="https://your-site.com" /></div>
                                    <div><Label>BoardGameGeek Profile URL</Label><Input value={formData.bgg_profile_url || ''} onChange={e => handleInputChange('bgg_profile_url', e.target.value)} className="bg-gray-700 border-gray-600" placeholder="https://boardgamegeek.com/user/..." /></div>
                                    <div><Label>LinkedIn Profile URL</Label><Input value={formData.linkedin_url || ''} onChange={e => handleInputChange('linkedin_url', e.target.value)} className="bg-gray-700 border-gray-600" placeholder="https://linkedin.com/in/..." /></div>
                                    <div><Label>Twitter Profile URL</Label><Input value={formData.twitter_url || ''} onChange={e => handleInputChange('twitter_url', e.target.value)} className="bg-gray-700 border-gray-600" placeholder="https://twitter.com/..." /></div>
                                    <div><Label>Facebook Profile URL</Label><Input value={formData.facebook_url || ''} onChange={e => handleInputChange('facebook_url', e.target.value)} className="bg-gray-700 border-gray-600" placeholder="https://facebook.com/..." /></div>
                                    <div><Label>Instagram Profile URL</Label><Input value={formData.instagram_url || ''} onChange={e => handleInputChange('instagram_url', e.target.value)} className="bg-gray-700 border-gray-600" placeholder="https://instagram.com/..." /></div>
                                    <div><Label>YouTube Channel URL</Label><Input value={formData.youtube_url || ''} onChange={e => handleInputChange('youtube_url', e.target.value)} className="bg-gray-700 border-gray-600" placeholder="https://youtube.com/c/..." /></div>
                                </Section>

                                <Section title="Settings">
                                     <div>
                                        <Label>Profile Visibility</Label>
                                        <Select value={formData.profile_visibility || 'public'} onValueChange={v => handleInputChange('profile_visibility', v)}>
                                            <SelectTrigger className="bg-gray-700 border-gray-600"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="public">Public</SelectItem>
                                                <SelectItem value="members_only">Members Only</SelectItem>
                                                <SelectItem value="private">Private</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Notification Preferences</Label>
                                        <div className="space-y-2 mt-2">
                                            <div className="flex items-center gap-2">
                                                <Checkbox id="email-notifications" checked={formData.notification_preferences?.email || false} onCheckedChange={c => setFormData(p => ({...p, notification_preferences: {...p.notification_preferences, email: c}}))} />
                                                <Label htmlFor="email-notifications">Receive email notifications</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Checkbox id="site-notifications" checked={formData.notification_preferences?.site || false} onCheckedChange={c => setFormData(p => ({...p, notification_preferences: {...p.notification_preferences, site: c}}))} />
                                                <Label htmlFor="site-notifications">Receive on-site notifications</Label>
                                            </div>
                                        </div>
                                    </div>
                                </Section>
                            </TabsContent>

                            {/* PROFESSIONAL TAB */}
                            <TabsContent value="professional" className="space-y-6 mt-0">
                               <Section title="Professional Details">
                                   <div><Label>Job Title</Label><Input value={formData.job_title || ''} onChange={e => handleInputChange('job_title', e.target.value)} className="bg-gray-700 border-gray-600 text-white" /></div>
                                   <div><Label>Company/Studio</Label><Input value={formData.company_name || ''} onChange={e => handleInputChange('company_name', e.target.value)} className="bg-gray-700 border-gray-600 text-white" /></div>
                                   <div><Label>Tagline (max 100 characters)</Label><Input value={formData.tagline || ''} maxLength="100" onChange={e => handleInputChange('tagline', e.target.value)} className="bg-gray-700 border-gray-600 text-white" /></div>
                                   <div><Label>Bio (max 1000 characters)</Label><Textarea value={formData.bio || ''} maxLength="1000" onChange={e => handleInputChange('bio', e.target.value)} className="bg-gray-700 border-gray-600 text-white" rows={5} /></div>
                                   <div>
                                        <Label>User Type</Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {userTypeOptions.map(type => (
                                                <div key={type} onClick={() => handleMultiSelect('user_type', type)} className={`p-2 px-4 rounded-md cursor-pointer border ${formData.user_type?.includes(type) ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300' : 'bg-gray-700 border-gray-600'}`}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                   <div><Label>Years of Experience</Label><Input type="number" value={formData.years_experience || ''} onChange={e => handleInputChange('years_experience', e.target.value)} className="bg-gray-700 border-gray-600 text-white" /></div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><Label>Minimum Hourly Rate ($)</Label><Input type="number" value={formData.hourly_rate_min || ''} onChange={e => handleInputChange('hourly_rate_min', e.target.value)} className="bg-gray-700 border-gray-600 text-white" /></div>
                                        <div><Label>Maximum Hourly Rate ($)</Label><Input type="number" value={formData.hourly_rate_max || ''} onChange={e => handleInputChange('hourly_rate_max', e.target.value)} className="bg-gray-700 border-gray-600 text-white" /></div>
                                    </div>
                                   <div>
                                        <Label>Skills</Label>
                                        <div className="flex flex-wrap gap-2 p-2 mt-2 rounded-md border border-gray-600">
                                            {formData.skills?.map(skill => (
                                                <Badge key={skill} className="bg-yellow-400/20 text-yellow-300">{skill} <X onClick={() => handleMultiSelect('skills', skill)} className="w-3 h-3 ml-2 cursor-pointer" /></Badge>
                                            ))}
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                        <Select onValueChange={(val) => val && handleMultiSelect('skills', val)}>
                                                <SelectTrigger className="bg-gray-700 border-gray-600"><SelectValue placeholder="Add a skill from list" /></SelectTrigger>
                                                <SelectContent>
                                                    {allSkills.filter(s => !formData.skills.includes(s)).map(skill => <SelectItem key={skill} value={skill}>{skill}</SelectItem>)}
                                                </SelectContent>
                                        </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Game Design Focus</Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {gameDesignFocusOptions.map(focus => (
                                                <div key={focus} onClick={() => handleMultiSelect('game_design_focus', focus)} className={`p-2 px-4 rounded-md cursor-pointer border ${formData.game_design_focus?.includes(focus) ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300' : 'bg-gray-700 border-gray-600'}`}>
                                                    {focus}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>English Level</Label>
                                            <Select value={formData.english_level} onValueChange={v => handleInputChange('english_level', v)}>
                                                <SelectTrigger className="bg-gray-700 border-gray-600"><SelectValue placeholder="Select level" /></SelectTrigger>
                                                <SelectContent>
                                                    {englishLevelOptions.map(lvl => <SelectItem key={lvl} value={lvl}>{lvl.charAt(0).toUpperCase() + lvl.slice(1)}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Other Languages</Label>
                                            <div className="flex flex-wrap gap-2 p-2 mt-2 rounded-md border border-gray-600 min-h-[40px]">
                                                {formData.languages?.map(lang => (
                                                    <Badge key={lang} className="bg-blue-400/20 text-blue-300">{lang} <X onClick={() => handleMultiSelect('languages', lang)} className="w-3 h-3 ml-2 cursor-pointer" /></Badge>
                                                ))}
                                            </div>
                                            <Select onValueChange={(val) => val && handleMultiSelect('languages', val)}>
                                                <SelectTrigger className="bg-gray-700 border-gray-600 mt-2"><SelectValue placeholder="Add a language" /></SelectTrigger>
                                                <SelectContent>
                                                    {languageOptions.filter(l => !formData.languages.includes(l)).map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                                                </SelectContent>
                                        </Select>
                                        </div>
                                    </div>
                               </Section>

                               <Section title="Work Experience">
                                {formData.work_experience?.map((exp, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-4 border p-4 rounded-md mb-4 border-gray-700 relative">
                                        <Input placeholder="Company" value={exp.company || ''} onChange={e => handleNestedChange('work_experience', index, 'company', e.target.value)} className="bg-gray-700 border-gray-600"/>
                                        <Input placeholder="Position" value={exp.position || ''} onChange={e => handleNestedChange('work_experience', index, 'position', e.target.value)} className="bg-gray-700 border-gray-600"/>
                                        <Input placeholder="Start Date" type="date" value={exp.start_date || ''} onChange={e => handleNestedChange('work_experience', index, 'start_date', e.target.value)} className="bg-gray-700 border-gray-600"/>
                                        <Input placeholder="End Date" type="date" value={exp.end_date || ''} onChange={e => handleNestedChange('work_experience', index, 'end_date', e.target.value)} className="bg-gray-700 border-gray-600"/>
                                        <Textarea placeholder="Description" value={exp.description || ''} onChange={e => handleNestedChange('work_experience', index, 'description', e.target.value)} className="col-span-2 bg-gray-700 border-gray-600"/>
                                        <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => removeNestedItem('work_experience', index)}><X className="w-4 h-4" /></Button>
                                    </div>
                                ))}
                                <Button type="button" onClick={() => addNestedItem('work_experience', { company: '', position: '', start_date: '', end_date: '', description: '' })}><Plus className="w-4 h-4 mr-2" />Add Experience</Button>
                               </Section>
                                <Section title="Education">
                                {formData.education?.map((edu, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-4 border p-4 rounded-md mb-4 border-gray-700 relative">
                                        <Input placeholder="Institution" value={edu.institution || ''} onChange={e => handleNestedChange('education', index, 'institution', e.target.value)} className="bg-gray-700 border-gray-600"/>
                                        <Input placeholder="Degree" value={edu.degree || ''} onChange={e => handleNestedChange('education', index, 'degree', e.target.value)} className="bg-gray-700 border-gray-600"/>
                                        <Input placeholder="Field of Study" value={edu.field_of_study || ''} onChange={e => handleNestedChange('education', index, 'field_of_study', e.target.value)} className="bg-gray-700 border-gray-600"/>
                                        <Input placeholder="Graduation Year" type="number" value={edu.graduation_year || ''} onChange={e => handleNestedChange('education', index, 'graduation_year', e.target.value)} className="bg-gray-700 border-gray-600"/>
                                        <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => removeNestedItem('education', index)}><X className="w-4 h-4" /></Button>
                                    </div>
                                ))}
                                <Button type="button" onClick={() => addNestedItem('education', { institution: '', degree: '', field_of_study: '', graduation_year: '' })}><Plus className="w-4 h-4 mr-2"/>Add Education</Button>
                                </Section>
                            </TabsContent>
                            
                            <TabsContent value="projects" className="mt-0"><ManageProjects user={user} /></TabsContent>
                            <TabsContent value="jobs" className="mt-0"><ManageJobs user={user} /></TabsContent>
                            <TabsContent value="events" className="mt-0"><ManageEvents user={user} /></TabsContent>
                            <TabsContent value="posts" className="mt-0"><ManagePosts user={user} /></TabsContent>
                            <TabsContent value="groups" className="mt-0"><ManageGroups /></TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </form>
    );
}