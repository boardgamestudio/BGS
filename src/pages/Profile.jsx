
import React, { useState, useEffect } from 'react';
import { User, Project, Job, Event } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from
'@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Edit,
  Link as LinkIcon,
  Star,
  Plus,
  Briefcase,
  Calendar,
  Users,
  MessageSquare, // Keep for now, but its usage will be replaced by custom SVG
  Palette,
  Building2,
  Globe,
  Mail,
  Phone,
  Award, // Keep for now, but its usage will be replaced by custom SVG
  ChevronLeft, // For gallery navigation
  ChevronRight, // For gallery navigation
  X // For closing gallery
} from 'lucide-react';
import EditProfileForm from '../components/profile/EditProfileForm';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ManageProjects from '../components/profile/content/ManageProjects';
import ManageJobs from '../components/profile/content/ManageJobs';
import ManageEvents from '../components/profile/content/ManageEvents';
import ManageGroups from '../components/profile/content/ManageGroups';
import ImageGalleryModal from '../components/profile/ImageGalleryModal'; // New import for the moved component
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from '@/components/ui/dialog';


const SocialLink = ({ url, icon }) => {
  if (!url) return null;
  const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-white hover:text-primary hover:bg-surface transition-colors" title={domain}>
            {icon}
        </a>);

};

const RoleBadge = ({ role }) => {
  const roleColors = {
    learner: "bg-blue-600 text-white",
    freelancer: "bg-purple-600 text-white",
    game_designer: "bg-emerald-600 text-white",
    service_provider: "bg-amber-600 text-white"
  };

  const roleLabels = {
    learner: "Learner",
    freelancer: "Freelancer",
    game_designer: "Game Designer",
    service_provider: "Service Provider"
  };

  return (
    <Badge className={`${roleColors[role]} text-xs font-medium`}>
            {roleLabels[role]}
        </Badge>);

};

export default function Profile() {
  const [profileUser, setProfileUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userContent, setUserContent] = useState({ projects: [], jobs: [], events: [] });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // Keep activeTab state for controlled component
  const [activeContentTab, setActiveContentTab] = useState("projects");
  const [galleryOpen, setGalleryOpen] = useState(0); // Renamed from true/false to index 0
  const [galleryIndex, setGalleryIndex] = useState(0);

  const location = useLocation();

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const me = await User.me();
      setCurrentUser(me);

      const searchParams = new URLSearchParams(location.search);
      const userId = searchParams.get('id');

      let userToLoad = me;
      if (userId && userId !== me.id) {
        const results = await User.filter({ id: userId });
        if (results.length > 0) userToLoad = results[0];
      }

      setProfileUser(userToLoad);

      if (userToLoad) {
        const [projects, jobs, events] = await Promise.all([
        Project.filter({ created_by: userToLoad.email }, '-created_date'),
        Job.filter({ employer_id: userToLoad.id }, '-created_date'),
        Event.filter({ organizer_id: userToLoad.id }, '-created_date')]
        );
        setUserContent({ projects, jobs, events });
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserProfile();
  }, [location.search]);

  const handleUpdateSuccess = async () => {
    await loadUserProfile();
    setEditMode(false);
  };

  const openGallery = (index) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  if (loading) {
    return <div className="text-center p-10 text-main">Loading profile...</div>;
  }

  if (!profileUser) {
    return <div className="text-center p-10 text-main">Could not load profile. Please try again or log in.</div>;
  }

  const isOwnProfile = currentUser && profileUser && currentUser.id === profileUser.id;
  const displayName = profileUser.display_name || profileUser.full_name || 'User';
  const userRoles = profileUser.user_roles || [];
  const hasRole = (role) => userRoles.includes(role);

  const canCreateProjects = true; // All roles can create projects
  const canCreateEvents = hasRole('game_designer') || hasRole('service_provider');
  const canCreateJobs = hasRole('game_designer') || hasRole('service_provider');
  const canCreateGroups = hasRole('game_designer') || hasRole('service_provider');
  const canHavePortfolio = hasRole('freelancer') || hasRole('game_designer') || hasRole('service_provider');
  const showProfessionalInfo = hasRole('freelancer') || hasRole('game_designer') || hasRole('service_provider');
  const showServiceProviderInfo = hasRole('service_provider');

  const getManagementOptions = () => {
    const options = [];

    if (canCreateProjects) {
      options.push({
        title: "Game Designs", icon: Plus, count: userContent.projects.length,
        action: () => {setActiveTab('my-content');setActiveContentTab('projects');}
      });
    }
    if (canCreateEvents) {
      options.push({
        title: "Events", icon: Calendar, count: userContent.events.length,
        action: () => {setActiveTab('my-content');setActiveContentTab('events');}
      });
    }
    if (canCreateJobs) {
      options.push({
        title: "Jobs", icon: Briefcase, count: userContent.jobs.length,
        action: () => {setActiveTab('my-content');setActiveContentTab('jobs');}
      });
    }
    if (canCreateGroups) {
      options.push({
        title: "Groups", icon: Users, count: 0,
        action: () => {setActiveTab('my-content');setActiveContentTab('groups');}
      });
    }
    return options;
  };

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
            {editMode ?
      <EditProfileForm user={profileUser} onSave={handleUpdateSuccess} onCancel={() => setEditMode(false)} /> :

      <>
                    {/* Profile Header */}
                    <Card className="bg-surface border-border-default overflow-hidden">
                        <div className="h-32 sm:h-48 bg-gradient-to-r from-gray-700 to-gray-800 relative">
                           <img
              src={profileUser.profile_banner || "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop"}
              className="w-full h-full object-cover"
              alt="Profile Cover" />

                        </div>
                        <CardContent className="p-4 sm:p-6 relative">
                            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-24 space-y-4 sm:space-y-0 sm:space-x-6">
                                <div className="relative">
                                    <div className="w-40 h-44 sm:w-47 sm:h-42 relative">
                                        <div
                    className="w-full h-full overflow-hidden border-4 border-surface"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                    }}>

                                            {profileUser.profile_picture ?
                    <img
                      src={profileUser.profile_picture}
                      alt={displayName} className="w-full h-full object-cover" /> :



                    <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary text-2xl sm:text-4xl font-bold">
                                                    {displayName.charAt(0).toUpperCase()}
                                                </div>
                    }
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
                                        <div>
                                            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-main">{displayName}</h1>
                                            <p className="text-slate-50 mb-2 font-bold">{profileUser.job_title || 'Game Enthusiast'}</p>
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                                                {userRoles.map((role) => <RoleBadge key={role} role={role} />)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 mt-2">
                                        <SocialLink url={profileUser.website_url} icon={<LinkIcon className="w-5 h-5" />} />
                                        <SocialLink url={profileUser.twitter_url} icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>} />
                                        <SocialLink url={profileUser.bgg_profile_url} icon={<Star className="w-5 h-5" />} />
                                        <SocialLink url={profileUser.discord_url} icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" /></svg>} />
                                        <SocialLink url={profileUser.linkedin_url} icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065c0-1.138.92-2.063 2.063-2.063c1.14 0 2.064.925 2.064 2.063c0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>} />
                                        <SocialLink url={profileUser.facebook_url} icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669c1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>} />
                                        <SocialLink url={profileUser.instagram_url} icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07c3.252.148 4.771 1.691 4.919 4.919c.058 1.265.069 1.645.069 4.849c0 3.205-.012 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919c-1.266.058-1.644.07-4.85.07c-3.204 0-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92c-.058-1.265-.07-1.644-.07-4.849c0-3.204.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919c1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072c-4.358.2-6.78 2.618-6.98 6.98c-.059 1.281-.073 1.689-.073 4.948c0 3.259.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98c1.281.058 1.689.072 4.948.072c3.259 0 3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98c.059-1.28.073-1.689.073-4.948c0-3.259-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98c-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163s6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>} />
                                        <SocialLink url={profileUser.youtube_url} icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>} />
                                    </div>
                                </div>
                            </div>
                            {isOwnProfile &&
            <Button onClick={() => setEditMode(true)} className="absolute bottom-4 right-4 bg-surface hover:bg-slate-700 border border-default text-main text-sm">
                                    <Edit className="w-4 h-4 mr-2" /> Edit Profile
                                </Button>
            }
                        </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="profile" className="space-y-6">
                                <TabsList className="border-b border-default rounded-none p-0 h-auto bg-transparent w-full justify-start">
                                    <TabsTrigger value="profile" className="text-sm sm:text-base">Profile</TabsTrigger>
                                    {canHavePortfolio && profileUser.portfolio?.length > 0 &&
                <TabsTrigger value="portfolio" className="text-sm sm:text-base">Portfolio</TabsTrigger>
                }
                                    {isOwnProfile && <TabsTrigger value="my-content" className="text-sm sm:text-base">My Content</TabsTrigger>}
                                </TabsList>

                                <TabsContent value="profile" className="space-y-8">
                                    <Card className="bg-surface border-border-default">
                                        <CardHeader><CardTitle className="font-serif text-main">About {displayName}</CardTitle></CardHeader>
                                        <CardContent><p className="text-slate-50 whitespace-pre-wrap">{profileUser.bio || 'No bio provided.'}</p></CardContent>
                                    </Card>
                                    
                                    {showProfessionalInfo && (profileUser.skills?.length > 0 || profileUser.languages?.length > 0) &&
                <Card className="bg-surface border-border-default">
                                            <CardHeader><CardTitle className="font-serif flex items-center text-main"><Star className="w-5 h-5 mr-3 text-primary" />Skills & Languages</CardTitle></CardHeader>
                                            <CardContent className="space-y-4">
                                                {profileUser.skills?.length > 0 &&
                    <div>
                                                        <h4 className="font-semibold text-main mb-2">Skills</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {profileUser.skills.map((skill) => <Badge key={skill} className="bg-secondary/10 text-secondary border-secondary/20">{skill}</Badge>)}
                                                        </div>
                                                    </div>
                    }
                                                {profileUser.languages?.length > 0 &&
                    <div>
                                                        <h4 className="font-semibold text-main mb-2 mt-4">Languages</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {profileUser.languages.map((lang) => <Badge key={lang} variant="outline" className="border-border-default text-white">{lang}</Badge>)}
                                                        </div>
                                                    </div>
                    }
                                            </CardContent>
                                        </Card>
                }

                                    {showProfessionalInfo && profileUser.work_experience?.length > 0 &&
                <Card className="bg-surface border-border-default">
                                            <CardHeader><CardTitle className="font-serif flex items-center text-main"><Briefcase className="w-5 h-5 mr-3 text-primary" />Work Experience</CardTitle></CardHeader>
                                            <CardContent className="space-y-6">
                                                {profileUser.work_experience.map((exp, index) => {
                      const isValidStartDate = exp.start_date && !isNaN(new Date(exp.start_date).getTime());
                      const isValidEndDate = exp.end_date && !isNaN(new Date(exp.end_date).getTime());

                      return (
                        <div key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-0.5 before:bg-border-default last:before:h-0">
                                                            <div className="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-primary border-2 border-surface"></div>
                                                            <p className="font-semibold text-white">{exp.position} at {exp.company}</p>
                                                            <p className="text-sm text-slate-300">
                                                                {isValidStartDate ? format(new Date(exp.start_date), 'MMM yyyy') : 'Start date'} - {isValidEndDate ? format(new Date(exp.end_date), 'MMM yyyy') : 'Present'}
                                                            </p>
                                                            {exp.description && <p className="mt-2 text-slate-300 text-sm">{exp.description}</p>}
                                                        </div>);

                    })}
                                            </CardContent>
                                        </Card>
                }

                                    {showProfessionalInfo && profileUser.education?.length > 0 &&
                <Card className="bg-surface border-border-default">
                                            <CardHeader><CardTitle className="font-serif flex items-center text-main"><Award className="w-5 h-5 mr-3 text-primary" />Education</CardTitle></CardHeader>
                                            <CardContent className="space-y-6">
                                                {profileUser.education.map((edu, index) =>
                    <div key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-0.5 before:bg-border-default last:before:h-0">
                                                        <div className="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-primary border-2 border-surface"></div>
                                                        <p className="font-semibold text-white">{edu.degree || 'Degree'} from {edu.institution || 'Institution'}</p>
                                                        <p className="text-sm text-slate-300">
                                                            {edu.field_of_study}{edu.graduation_year && ` - Graduated ${edu.graduation_year}`}
                                                        </p>
                                                    </div>
                    )}
                                            </CardContent>
                                        </Card>
                }

                                    {showServiceProviderInfo &&
                <Card className="bg-surface border-border-default">
                                            <CardHeader>
                                                <div className="flex items-center gap-4">
                                                    {profileUser.company_logo && <img src={profileUser.company_logo} alt="Company Logo" className="w-16 h-16 rounded-lg object-contain bg-white/10 p-1" />}
                                                    <div>
                                                        <CardTitle className="font-serif flex items-center text-main"><Building2 className="w-5 h-5 mr-3 text-primary" />{profileUser.company_name || 'Service Provider'}</CardTitle>
                                                        <p className="text-slate-300">{profileUser.tagline}</p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                {profileUser.company_description &&
                    <div>
                                                        <h4 className="font-semibold text-white mb-2">About Company</h4>
                                                        <p className="text-slate-300 text-sm">{profileUser.company_description}</p>
                                                    </div>
                    }

                                                {profileUser.services?.length > 0 &&
                    <div>
                                                        <h4 className="font-semibold text-white mb-2">Services Offered</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {profileUser.services.map((service) => <Badge key={service} className="bg-primary/10 text-primary border-primary/20">{service}</Badge>)}
                                                        </div>
                                                    </div>
                    }

                                                {(profileUser.contact_email || profileUser.contact_number || profileUser.company_website) &&
                    <div>
                                                        <h4 className="font-semibold text-white mb-2">Contact</h4>
                                                        <div className="space-y-2 text-sm">
                                                            {profileUser.contact_email && <div className="flex items-center gap-2 text-slate-300"><Mail className="w-4 h-4 text-primary" /> {profileUser.contact_email}</div>}
                                                            {profileUser.contact_number && <div className="flex items-center gap-2 text-slate-300"><Phone className="w-4 h-4 text-primary" /> {profileUser.contact_number}</div>}
                                                            {profileUser.company_website && <a href={profileUser.company_website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-primary"><Globe className="w-4 h-4 text-primary" /> {profileUser.company_website}</a>}
                                                        </div>
                                                    </div>
                    }
                                            </CardContent>
                                        </Card>
                }

                                </TabsContent>

                                {canHavePortfolio &&
              <TabsContent value="portfolio" className="space-y-8">
                                        <Card className="bg-surface border-border-default">
                                            <CardHeader>
                                                <CardTitle className="font-serif flex items-center text-main">
                                                    <Palette className="w-5 h-5 mr-3 text-primary" />
                                                    Portfolio
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {profileUser.portfolio?.length > 0 ?
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        {profileUser.portfolio.map((url, index) =>
                      <button
                        key={index}
                        onClick={() => openGallery(index)}
                        className="block overflow-hidden rounded-lg group cursor-pointer">

                                                                <img
                          src={url}
                          alt={`Portfolio item ${index + 1}`}
                          className="aspect-square w-full object-cover transition-transform group-hover:scale-105" />

                                                            </button>
                      )}
                                                    </div> :

                    <p className="text-text-muted text-center py-8">No portfolio items to display.</p>
                    }
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
              }
                                
                                {isOwnProfile &&
              <TabsContent value="my-content">
                                        <Tabs value={activeContentTab} onValueChange={setActiveContentTab} orientation="vertical">
                                            <div className="grid md:grid-cols-4 gap-6">
                                                <div className="md:col-span-1">
                                                     <TabsList className="w-full flex-col items-stretch h-auto bg-surface p-2">
                                                        <TabsTrigger value="projects" className="justify-start">Game Designs</TabsTrigger>
                                                        {canCreateJobs && <TabsTrigger value="jobs" className="justify-start">Jobs</TabsTrigger>}
                                                        {canCreateEvents && <TabsTrigger value="events" className="justify-start">Events</TabsTrigger>}
                                                        {canCreateGroups && <TabsTrigger value="groups" className="justify-start">Groups</TabsTrigger>}
                                                    </TabsList>
                                                </div>
                                                <div className="md:col-span-3">
                                                    <TabsContent value="projects"><ManageProjects user={profileUser} /></TabsContent>
                                                    <TabsContent value="jobs"><ManageJobs user={profileUser} /></TabsContent>
                                                    <TabsContent value="events"><ManageEvents user={profileUser} /></TabsContent>
                                                    <TabsContent value="groups"><ManageGroups /></TabsContent>
                                                </div>
                                            </div>
                                        </Tabs>
                                    </TabsContent>
              }

                            </Tabs>
                        </div>

                        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                           {/* Portfolio Sidebar */}
                           {canHavePortfolio && profileUser.portfolio?.length > 0 &&
            <Card className="bg-surface border-border-default">
                                    <CardHeader>
                                        <CardTitle className="font-serif text-lg flex items-center justify-between text-main">
                                            <span className="flex items-center">
                                                <Palette className="w-5 h-5 mr-2 text-primary" />
                                                Portfolio
                                            </span>
                                            {profileUser.portfolio.length > 6 &&
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className="text-primary hover:text-primary/80 text-sm font-normal">

                                                    View All
                                                </button>
                  }
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-3">
                                            {profileUser.portfolio.slice(0, 6).map((url, index) =>
                  <button
                    key={index}
                    onClick={() => openGallery(index)}
                    className="group cursor-pointer">

                                                    <div className="aspect-square rounded-lg overflow-hidden bg-background/50">
                                                        <img
                        src={url}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" />

                                                    </div>
                                                </button>
                  )}
                                        </div>
                                    </CardContent>
                                </Card>
            }

                           {canCreateProjects &&
            <Card className="bg-surface border-border-default">
                                    <CardHeader>
                                        <CardTitle className="font-serif text-lg flex items-center justify-between text-main">
                                            Game Designs
                                            <Link to={createPageUrl(`Projects?user=${profileUser.id}`)} className="text-primary hover:text-primary/80 text-sm font-normal">View All</Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {userContent.projects.length > 0 ?
                <div className="grid grid-cols-2 gap-3">
                                                {userContent.projects.slice(0, 6).map((project) =>
                  <Link key={project.id} to={createPageUrl(`ProjectDetails?id=${project.id}`)} className="group">
                                                        <div className="aspect-square rounded-lg overflow-hidden bg-background/50 mb-2">
                                                            {project.main_image_url ?
                      <img src={project.main_image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> :
                      <div className="w-full h-full flex items-center justify-center text-2xl">🎲</div>}
                                                        </div>
                                                        <p className="text-xs text-main font-medium line-clamp-2 group-hover:text-primary transition-colors">{project.title}</p>
                                                    </Link>
                  )}
                                            </div> :
                <div className="text-center py-8"><p className="text-text-muted text-sm">No game designs yet.</p></div>}
                                    </CardContent>
                                </Card>
            }
                        </div>
                    </div>

                    {/* Image Gallery Modal */}
                    <ImageGalleryModal
          images={profileUser.portfolio || []}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          initialIndex={galleryIndex} />

                </>
      }
        </div>);

}