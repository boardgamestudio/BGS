
import React, { useState } from 'react';
import { User } from '@/api/entities';
import { ServiceProvider } from '@/api/entities'; // Added import for ServiceProvider
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Plus, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const skillOptions = [
    "Game Design", "Graphic Design", "Illustration", "3D Modeling", "Writing", "Editing", "Playtesting",
    "Project Management", "Marketing", "Social Media", "Photography", "Video Production", "Audio Production",
    "Programming", "Web Development", "UI/UX Design", "Animation", "Publishing", "Manufacturing"
];

const serviceOptions = [
    "Artwork & Illustration", "Graphic Design", "Writing & Editing", "Game Design Consulting", 
    "Photography", "Marketing & PR", "Project Management", "Translation", "Manufacturing", 
    "Distribution", "Legal Services", "Accounting"
];

const languageOptions = [
    "English", "Spanish", "French", "German", "Italian", "Portuguese", "Chinese", "Japanese", 
    "Korean", "Arabic", "Russian", "Dutch", "Polish", "Swedish", "Norwegian", "Danish"
];

const gameTypeOptions = [
    "Strategy Games", "Party Games", "Family Games", "Educational Games", "Card Games", "Dice Games",
    "Cooperative Games", "Abstract Games", "Thematic Games", "RPG Games", "War Games", "Euro Games",
    "Worker Placement", "Deck Building", "Area Control", "Hidden Role", "Social Deduction"
];

const gameDesignFocusOptions = [
    "Strategy Games", "Balancing", "Playtesting Coordination", "Mechanics Development",
    "Economic Systems", "Narrative Design", "World Building", "Component Design"
];

export default function EditProfileForm({ user, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        ...user,
        user_roles: user.user_roles || [],
        skills: user.skills || [],
        languages: user.languages || [],
        portfolio: user.portfolio || [],
        work_experience: user.work_experience || [],
        education: user.education || [],
        profile_visibility: user.profile_visibility || 'public',
        show_in_marketplace: user.show_in_marketplace !== undefined ? user.show_in_marketplace : true,
        // Service provider specific fields
        services: user.services || [],
        game_type_specialization: user.game_type_specialization || [],
        company_description: user.company_description || '',
        contact_email: user.contact_email || '',
        contact_number: user.contact_number || '',
        company_website: user.company_website || '',
        twitter_url: user.twitter_url || '',
        facebook_url: user.facebook_url || '',
        linkedin_url: user.linkedin_url || '',
        instagram_url: user.instagram_url || '',
        youtube_url: user.youtube_url || '',
        year_founded: user.year_founded || null,
        employee_count: user.employee_count || '',
        // Game Designer specific fields
        game_design_focus: user.game_design_focus || []
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

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

    const handleRoleToggle = (role) => {
        let currentRoles = [...(formData.user_roles || [])];

        // Learner is exclusive
        if (role === 'learner') {
            currentRoles = currentRoles.includes('learner') ? [] : ['learner'];
        } else {
            // Remove 'learner' if a professional role is selected
            currentRoles = currentRoles.filter(r => r !== 'learner');

            const isCurrentlySelected = currentRoles.includes(role);

            if (isCurrentlySelected) {
                // Deselect the role
                currentRoles = currentRoles.filter(r => r !== role);
            } else {
                // Select the role
                currentRoles.push(role);
                // Enforce exclusivity between freelancer and service_provider
                if (role === 'freelancer') {
                    currentRoles = currentRoles.filter(r => r !== 'service_provider');
                } else if (role === 'service_provider') {
                    currentRoles = currentRoles.filter(r => r !== 'freelancer');
                }
            }
        }
        
        handleInputChange('user_roles', currentRoles);
    };

    const handleImageUpload = async (file, field) => {
        if (!file) return;
        setUploading(true);
        try {
            const { file_url } = await UploadFile({ file });
            if (field === 'profile_picture' || field === 'company_logo' || field === 'profile_banner') {
                handleInputChange(field, file_url);
            } else if (field === 'portfolio') {
                handleInputChange(field, [...formData.portfolio, file_url]);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setUploading(false);
        }
    };

    const removePortfolioImage = (urlToRemove) => {
        handleInputChange('portfolio', formData.portfolio.filter(url => url !== urlToRemove));
    };

    const addWorkExperience = () => {
        handleInputChange('work_experience', [
            ...formData.work_experience,
            { company: '', position: '', start_date: '', end_date: '', description: '' }
        ]);
    };

    const updateWorkExperience = (index, field, value) => {
        const updated = [...formData.work_experience];
        updated[index][field] = value;
        handleInputChange('work_experience', updated);
    };

    const removeWorkExperience = (index) => {
        handleInputChange('work_experience', formData.work_experience.filter((_, i) => i !== index));
    };

    const addEducation = () => {
        handleInputChange('education', [
            ...(formData.education || []),
            { institution: '', degree: '', field_of_study: '', graduation_year: '' }
        ]);
    };

    const updateEducation = (index, field, value) => {
        const updated = [...(formData.education || [])];
        updated[index][field] = value;
        handleInputChange('education', updated);
    };

    const removeEducation = (index) => {
        handleInputChange('education', (formData.education || []).filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            // Update user profile first
            await User.updateMyUserData(formData);
            
            // Handle ServiceProvider entity if user has service_provider role
            const isServiceProvider = formData.user_roles.includes('service_provider');
            
            if (isServiceProvider) {
                // Check if ServiceProvider record exists
                const existingServiceProviders = await ServiceProvider.filter({ user_id: formData.id });
                
                const serviceProviderData = {
                    user_id: formData.id,
                    company_name: formData.company_name || formData.display_name || `${formData.first_name} ${formData.last_name}`,
                    company_logo: formData.company_logo || null,
                    company_description: formData.company_description || formData.bio || '',
                    services: formData.services || [],
                    contact_email: formData.contact_email || formData.email,
                    contact_number: formData.contact_number || '',
                    company_website: formData.company_website || '',
                    twitter_url: formData.twitter_url || '',
                    facebook_url: formData.facebook_url || '',
                    linkedin_url: formData.linkedin_url || '',
                    instagram_url: formData.instagram_url || '',
                    youtube_url: formData.youtube_url || '',
                    year_founded: formData.year_founded || null,
                    employee_count: formData.employee_count || '',
                    game_type_specialization: formData.game_type_specialization || []
                };
                
                if (existingServiceProviders.length > 0) {
                    // Update existing ServiceProvider record
                    await ServiceProvider.update(existingServiceProviders[0].id, serviceProviderData);
                } else {
                    // Create new ServiceProvider record
                    await ServiceProvider.create(serviceProviderData);
                }
            }
            
            onSave();
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setSaving(false);
        }
    };

    const userRoles = formData.user_roles || [];
    const hasRole = (role) => userRoles.includes(role);
    const showProfessionalTab = hasRole('freelancer') || hasRole('game_designer') || hasRole('service_provider');
    const showServiceTab = hasRole('service_provider');
    const canHavePortfolio = hasRole('freelancer') || hasRole('game_designer') || hasRole('service_provider');
    const isGameDesigner = hasRole('game_designer');

    const tabCount = 1 + (showProfessionalTab ? 1 : 0) + (showServiceTab ? 1 : 0);

    return (
        <Card className="bg-surface border-border-default max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-main">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs defaultValue="personal" className="space-y-6">
                        <TabsList className={`grid w-full grid-cols-${tabCount} bg-background`}>
                            <TabsTrigger value="personal" className="text-white data-[state=active]:text-black">Personal</TabsTrigger>
                            {showProfessionalTab && <TabsTrigger value="professional" className="text-white data-[state=active]:text-black">Professional</TabsTrigger>}
                            {showServiceTab && <TabsTrigger value="service" className="text-white data-[state=active]:text-black">Service Profile</TabsTrigger>}
                        </TabsList>

                        <TabsContent value="personal" className="space-y-6">
                            {/* User Roles */}
                            <div className="space-y-3">
                                <Label className="text-base font-medium text-white">Member Type</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'learner', label: 'Learner', desc: 'Basic profile, limited features' },
                                        { id: 'freelancer', label: 'Freelancer/Creative', desc: 'Professional services' },
                                        { id: 'game_designer', label: 'Game Designer', desc: 'Full platform access' },
                                        { id: 'service_provider', label: 'Service Provider', desc: 'Business services' }
                                    ].map(role => (
                                        <div key={role.id} className="border border-border-default rounded-lg p-3 bg-background">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <Checkbox
                                                    id={role.id}
                                                    checked={userRoles.includes(role.id)}
                                                    onCheckedChange={() => handleRoleToggle(role.id)}
                                                />
                                                <Label htmlFor={role.id} className="font-medium text-white">{role.label}</Label>
                                            </div>
                                            <p className="text-xs text-text-muted">{role.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name" className="text-white">First Name *</Label>
                                    <Input
                                        id="first_name"
                                        value={formData.first_name || ''}
                                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                                        className="bg-background border-border-default focus:border-primary text-white placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name" className="text-white">Last Name *</Label>
                                    <Input
                                        id="last_name"
                                        value={formData.last_name || ''}
                                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                                        className="bg-background border-border-default focus:border-primary text-white placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="display_name" className="text-white">Display Name</Label>
                                <Input
                                    id="display_name"
                                    value={formData.display_name || ''}
                                    onChange={(e) => handleInputChange('display_name', e.target.value)}
                                    className="bg-background border-border-default focus:border-primary text-white placeholder:text-gray-400"
                                    placeholder="How you want to be shown publicly"
                                />
                            </div>

                            {/* Profile Images */}
                            <div className="space-y-4">
                                {/* Profile Picture */}
                                <div className="space-y-3">
                                    <Label className="text-white">Profile Picture</Label>
                                    <div className="flex items-center space-x-4">
                                        {formData.profile_picture && (
                                            <img src={formData.profile_picture} alt="Profile" className="w-16 h-16 rounded-lg object-cover" />
                                        )}
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e.target.files[0], 'profile_picture')}
                                                className="hidden"
                                                id="profile-picture-upload"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('profile-picture-upload').click()}
                                                disabled={uploading}
                                                className="border-border-default bg-background text-white hover:bg-slate-700"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                {uploading ? 'Uploading...' : 'Upload Image'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Banner */}
                                <div className="space-y-3">
                                    <Label className="text-white">Profile Banner</Label>
                                    <div className="flex items-center space-x-4">
                                        {formData.profile_banner && (
                                            <img src={formData.profile_banner} alt="Banner" className="w-32 h-16 rounded-lg object-cover" />
                                        )}
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e.target.files[0], 'profile_banner')}
                                                className="hidden"
                                                id="profile-banner-upload"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('profile-banner-upload').click()}
                                                disabled={uploading}
                                                className="border-border-default bg-background text-white hover:bg-slate-700"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                {uploading ? 'Uploading...' : 'Upload Banner'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-white">City</Label>
                                    <Input
                                        id="city"
                                        value={formData.city || ''}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        className="bg-background border-border-default focus:border-primary text-white placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country" className="text-white">Country</Label>
                                    <Input
                                        id="country"
                                        value={formData.country || ''}
                                        onChange={(e) => handleInputChange('country', e.target.value)}
                                        className="bg-background border-border-default focus:border-primary text-white placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <Label htmlFor="bio" className="text-white">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio || ''}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    className="bg-background border-border-default focus:border-primary min-h-[100px] text-white placeholder:text-gray-400"
                                    placeholder="Tell us about yourself..."
                                    maxLength={1000}
                                />
                                <p className="text-xs text-text-muted">{(formData.bio || '').length}/1000 characters</p>
                            </div>

                            {/* Privacy Settings */}
                            <div className="space-y-4 p-4 border border-border-default rounded-lg">
                                <h3 className="text-lg font-semibold text-main">Privacy Settings</h3>
                                
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label className="text-white">Profile Visibility</Label>
                                        <Select 
                                            value={formData.profile_visibility || 'public'} 
                                            onValueChange={(value) => handleInputChange('profile_visibility', value)}
                                        >
                                            <SelectTrigger className="bg-background border-border-default text-white">
                                                <SelectValue placeholder="Select visibility" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-surface border-border-default text-white">
                                                <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                                                <SelectItem value="members_only">Members Only - Only logged in users can see your profile</SelectItem>
                                                <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="show_in_marketplace" 
                                            checked={formData.show_in_marketplace !== false}
                                            onCheckedChange={(checked) => handleInputChange('show_in_marketplace', checked)} 
                                        />
                                        <Label htmlFor="show_in_marketplace" className="text-white">Show in marketplace/services section</Label>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="space-y-4">
                                <Label className="text-base font-medium text-white">Social Links</Label>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { field: 'website_url', label: 'Website' },
                                        { field: 'twitter_url', label: 'Twitter' },
                                        { field: 'discord_url', label: 'Discord' },
                                        { field: 'bgg_profile_url', label: 'BoardGameGeek' },
                                        { field: 'linkedin_url', label: 'LinkedIn' },
                                        { field: 'facebook_url', label: 'Facebook' },
                                        { field: 'instagram_url', label: 'Instagram' },
                                        { field: 'youtube_url', label: 'YouTube' }
                                    ].map(social => (
                                        <div key={social.field} className="space-y-1">
                                            <Label htmlFor={social.field} className="text-sm text-white">{social.label}</Label>
                                            <Input
                                                id={social.field}
                                                value={formData[social.field] || ''}
                                                onChange={(e) => handleInputChange(social.field, e.target.value)}
                                                className="bg-background border-border-default focus:border-primary text-white placeholder:text-gray-400"
                                                placeholder={`Your ${social.label} URL`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        {showProfessionalTab && (
                            <TabsContent value="professional" className="space-y-6">
                                {/* Professional Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="job_title" className="text-white">Job Title</Label>
                                        <Input
                                            id="job_title"
                                            value={formData.job_title || ''}
                                            onChange={(e) => handleInputChange('job_title', e.target.value)}
                                            className="bg-background border-border-default focus:border-primary text-white placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company_name" className="text-white">Company/Studio</Label>
                                        <Input
                                            id="company_name"
                                            value={formData.company_name || ''}
                                            onChange={(e) => handleInputChange('company_name', e.target.value)}
                                            className="bg-background border-border-default focus:border-primary text-white placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tagline" className="text-white">Professional Tagline</Label>
                                    <Input
                                        id="tagline"
                                        value={formData.tagline || ''}
                                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                                        className="bg-background border-border-default focus:border-primary text-white placeholder:text-gray-400"
                                        placeholder="Brief professional description"
                                        maxLength={100}
                                    />
                                    <p className="text-xs text-text-muted">{(formData.tagline || '').length}/100 characters</p>
                                </div>

                                {/* Game Design Focus - for game designer role */}
                                {isGameDesigner && (
                                    <div className="space-y-3">
                                        <Label className="text-white">Game Design Focus</Label>
                                        <p className="text-sm text-text-muted">Select your areas of specialization in game design.</p>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {gameDesignFocusOptions.map(focus => (
                                                <Button
                                                    key={focus}
                                                    type="button"
                                                    variant={formData.game_design_focus.includes(focus) ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handleMultiSelect('game_design_focus', focus)}
                                                    className={formData.game_design_focus.includes(focus) ?
                                                        "bg-secondary text-background" :
                                                        "bg-background text-white border-border-default hover:bg-slate-700"
                                                    }
                                                >
                                                    {focus}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}


                                {/* Skills */}
                                <div className="space-y-3">
                                    <Label className="text-white">Skills</Label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {skillOptions.map(skill => (
                                            <Button
                                                key={skill}
                                                type="button"
                                                variant={formData.skills.includes(skill) ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleMultiSelect('skills', skill)}
                                                className={formData.skills.includes(skill) ? 
                                                    "bg-primary text-background" : 
                                                    "bg-background text-white border-border-default hover:bg-slate-700"
                                                }
                                            >
                                                {skill}
                                            </Button>
                                        ))}
                                    </div>
                                    {formData.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.skills.map(skill => (
                                                <Badge key={skill} className="bg-primary/10 text-primary border-primary/20">
                                                    {skill}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMultiSelect('skills', skill)}
                                                        className="ml-2 h-auto p-0 hover:bg-transparent text-primary"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Languages */}
                                <div className="space-y-3">
                                    <Label className="text-white">Languages</Label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {languageOptions.map(language => (
                                            <Button
                                                key={language}
                                                type="button"
                                                variant={formData.languages.includes(language) ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleMultiSelect('languages', language)}
                                                className={formData.languages.includes(language) ? 
                                                    "bg-secondary text-background" : 
                                                    "bg-background text-white border-border-default hover:bg-slate-700"
                                                }
                                            >
                                                {language}
                                            </Button>
                                        ))}
                                    </div>
                                    {formData.languages.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.languages.map(language => (
                                                <Badge key={language} className="bg-secondary/10 text-secondary border-secondary/20">
                                                    {language}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMultiSelect('languages', language)}
                                                        className="ml-2 h-auto p-0 hover:bg-transparent text-secondary"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Portfolio - for creative roles */}
                                {canHavePortfolio && (
                                    <div className="space-y-3">
                                        <Label className="text-white">Portfolio</Label>
                                        <div className="grid grid-cols-3 gap-3 mb-3">
                                            {formData.portfolio.map((url, index) => (
                                                <div key={index} className="relative">
                                                    <img src={url} alt={`Portfolio ${index + 1}`} className="w-full aspect-square object-cover rounded-lg" />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removePortfolioImage(url)}
                                                        className="absolute top-1 right-1 h-6 w-6 p-0"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e.target.files[0], 'portfolio')}
                                                className="hidden"
                                                id="portfolio-upload"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('portfolio-upload').click()}
                                                disabled={uploading}
                                                className="border-border-default bg-background text-white hover:bg-slate-700"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                {uploading ? 'Uploading...' : 'Add Portfolio Image'}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Work Experience */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-medium text-white">Work Experience</Label>
                                        <Button type="button" variant="outline" size="sm" className="bg-background text-white border-border-default hover:bg-slate-700" onClick={addWorkExperience}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Experience
                                        </Button>
                                    </div>
                                    {formData.work_experience.map((exp, index) => (
                                        <Card key={index} className="border-border-default bg-background">
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <Label className="text-sm font-medium text-white">Experience #{index + 1}</Label>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeWorkExperience(index)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Input
                                                        placeholder="Company"
                                                        value={exp.company || ''}
                                                        onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                                                        className="bg-background border-border-default text-white placeholder:text-gray-400"
                                                    />
                                                    <Input
                                                        placeholder="Position"
                                                        value={exp.position || ''}
                                                        onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                                                        className="bg-background border-border-default text-white placeholder:text-gray-400"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Input
                                                        type="date"
                                                        placeholder="Start Date"
                                                        value={exp.start_date || ''}
                                                        onChange={(e) => updateWorkExperience(index, 'start_date', e.target.value)}
                                                        className="bg-background border-border-default text-white placeholder:text-gray-400"
                                                    />
                                                    <Input
                                                        type="date"
                                                        placeholder="End Date"
                                                        value={exp.end_date || ''}
                                                        onChange={(e) => updateWorkExperience(index, 'end_date', e.target.value)}
                                                        className="bg-background border-border-default text-white placeholder:text-gray-400"
                                                    />
                                                </div>
                                                <Textarea
                                                    placeholder="Description"
                                                    value={exp.description || ''}
                                                    onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                                                    className="bg-background border-border-default text-white placeholder:text-gray-400"
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Education */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-medium text-white">Education</Label>
                                        <Button type="button" variant="outline" size="sm" className="bg-background text-white border-border-default hover:bg-slate-700" onClick={addEducation}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Education
                                        </Button>
                                    </div>
                                    {(formData.education || []).map((edu, index) => (
                                        <Card key={index} className="border-border-default bg-background">
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <Label className="text-sm font-medium text-white">Education #{index + 1}</Label>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeEducation(index)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Input
                                                        placeholder="Institution"
                                                        value={edu.institution || ''}
                                                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                                        className="bg-background border-border-default text-white placeholder:text-gray-400"
                                                    />
                                                    <Input
                                                        placeholder="Degree"
                                                        value={edu.degree || ''}
                                                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                        className="bg-background border-border-default text-white placeholder:text-gray-400"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Input
                                                        placeholder="Field of Study"
                                                        value={edu.field_of_study || ''}
                                                        onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                                                        className="bg-background border-border-default text-white placeholder:text-gray-400"
                                                    />
                                                    <Input
                                                        type="number"
                                                        placeholder="Graduation Year"
                                                        value={edu.graduation_year || ''}
                                                        onChange={(e) => updateEducation(index, 'graduation_year', e.target.value ? parseInt(e.target.value) : '')}
                                                        className="bg-background border-border-default text-white placeholder:text-gray-400"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                        )}

                        {showServiceTab && (
                            <TabsContent value="service" className="space-y-6">
                                {/* Company Logo */}
                                <div className="space-y-3">
                                    <Label className="text-white">Company Logo</Label>
                                    <div className="flex items-center space-x-4">
                                        {formData.company_logo && (
                                            <img src={formData.company_logo} alt="Company Logo" className="w-16 h-16 rounded-lg object-cover" />
                                        )}
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e.target.files[0], 'company_logo')}
                                                className="hidden"
                                                id="company-logo-upload"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('company-logo-upload').click()}
                                                disabled={uploading}
                                                className="border-border-default bg-background text-white hover:bg-slate-700"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                {uploading ? 'Uploading...' : 'Upload Logo'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="company_description" className="text-white">Company Description *</Label>
                                    <Textarea
                                        id="company_description"
                                        value={formData.company_description || ''}
                                        onChange={(e) => handleInputChange('company_description', e.target.value)}
                                        className="bg-background border-border-default focus:border-primary min-h-[120px] text-white placeholder:text-gray-400"
                                        placeholder="Describe your company and services..."
                                        required
                                    />
                                </div>

                                {/* Services */}
                                <div className="space-y-3">
                                    <Label className="text-white">Services Offered *</Label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {serviceOptions.map(service => (
                                            <Button
                                                key={service}
                                                type="button"
                                                variant={formData.services?.includes(service) ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleMultiSelect('services', service)}
                                                className={formData.services?.includes(service) ? 
                                                    "bg-amber-500 text-background" : 
                                                    "bg-background text-white border-border-default hover:bg-slate-700"
                                                }
                                            >
                                                {service}
                                            </Button>
                                        ))}
                                    </div>
                                    {formData.services?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.services.map(service => (
                                                <Badge key={service} className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                                                    {service}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMultiSelect('services', service)}
                                                        className="ml-2 h-auto p-0 hover:bg-transparent text-amber-500"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Contact Information */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_email" className="text-white">Contact Email *</Label>
                                        <Input
                                            id="contact_email"
                                            type="email"
                                            value={formData.contact_email || ''}
                                            onChange={(e) => handleInputChange('contact_email', e.target.value)}
                                            className="bg-background border-border-default focus:border-primary text-white placeholder:text-gray-400"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_number" className="text-white">Contact Number *</Label>
                                        <Input
                                            id="contact_number"
                                            type="tel"
                                            value={formData.contact_number || ''}
                                            onChange={(e) => handleInputChange('contact_number', e.target.value)}
                                            className="bg-background border-border-default focus:border-primary text-white placeholder:text-gray-400"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_website" className="text-white">Company Website *</Label>
                                    <Input
                                        id="company_website"
                                        type="url"
                                        value={formData.company_website || ''}
                                        onChange={(e) => handleInputChange('company_website', e.target.value)}
                                        className="bg-background border-border-default focus:border-primary text-white placeholder:text-gray-400"
                                        placeholder="https://your-website.com"
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-4">
                                    <Label className="text-base font-medium text-white">Company Social Links</Label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { field: 'twitter_url', label: 'Twitter' },
                                            { field: 'facebook_url', label: 'Facebook' },
                                            { field: 'linkedin_url', label: 'LinkedIn' },
                                            { field: 'instagram_url', label: 'Instagram' },
                                            { field: 'youtube_url', label: 'YouTube' }
                                        ].map(social => (
                                            <div key={social.field} className="space-y-1">
                                                <Label htmlFor={`service_${social.field}`} className="text-sm text-white">{social.label}</Label>
                                                <Input
                                                    id={`service_${social.field}`}
                                                    value={formData[social.field] || ''}
                                                    onChange={(e) => handleInputChange(social.field, e.target.value)}
                                                    className="bg-background border-border-default focus:border-primary text-white placeholder:text-gray-400"
                                                    placeholder={`Your company's ${social.label} URL`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                {/* Company Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="year_founded" className="text-white">Year Founded</Label>
                                        <Input
                                            id="year_founded"
                                            type="number"
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            value={formData.year_founded || ''}
                                            onChange={(e) => handleInputChange('year_founded', parseInt(e.target.value))}
                                            className="bg-background border-border-default focus:border-primary text-white placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-white">Number of Employees</Label>
                                        <Select 
                                            value={formData.employee_count || ''} 
                                            onValueChange={(value) => handleInputChange('employee_count', value)}
                                        >
                                            <SelectTrigger className="bg-background border-border-default text-white">
                                                <SelectValue placeholder="Select range" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-surface border-border-default text-white">
                                                <SelectItem value="1-10">1-10</SelectItem>
                                                <SelectItem value="11-50">11-50</SelectItem>
                                                <SelectItem value="51-200">51-200</SelectItem>
                                                <SelectItem value="200+">200+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Game Type Specialization */}
                                <div className="space-y-3">
                                    <Label className="text-white">Game Type Specialization</Label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {gameTypeOptions.map(gameType => (
                                            <Button
                                                key={gameType}
                                                type="button"
                                                variant={formData.game_type_specialization?.includes(gameType) ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleMultiSelect('game_type_specialization', gameType)}
                                                className={formData.game_type_specialization?.includes(gameType) ? 
                                                    "bg-info text-background" : 
                                                    "bg-background text-white border-border-default hover:bg-slate-700"
                                                }
                                            >
                                                {gameType}
                                            </Button>
                                        ))}
                                    </div>
                                    {formData.game_type_specialization?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.game_type_specialization.map(gameType => (
                                                <Badge key={gameType} className="bg-info/10 text-info border-info/20">
                                                    {gameType}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMultiSelect('game_type_specialization', gameType)}
                                                        className="ml-2 h-auto p-0 hover:bg-transparent text-info"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        )}
                    </Tabs>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-border-default">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onCancel}
                            className="bg-background text-white border-border-default hover:bg-slate-700"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={saving} 
                            className="btn-primary"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
