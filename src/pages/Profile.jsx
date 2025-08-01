import React, { useState, useEffect } from 'react';
import { User, Project, Job, Event, ForumPost } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Mail, Phone, Link as LinkIcon, MapPin, Briefcase, Award, School, Star, Settings, ExternalLink, Building, Calendar, DollarSign, Languages, Users, Rss, Eye, GitFork, Heart } from 'lucide-react';
import EditProfileForm from '../components/profile/EditProfileForm';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from '../components/projects/ProjectCard';
import PostCard from '../components/community/PostCard';

const SocialLink = ({ url, icon, children }) => {
    if (!url) return null;
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center text-text-muted hover:text-primary transition-colors">
            {icon}
            <span className="truncate ml-2 text-sm">{children || url}</span>
        </a>
    );
};

const StatBubble = ({ value, label, color, icon }) => (
    <div className="flex flex-col items-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-${color}-500 mb-2`}>
            {icon}
        </div>
        <p className="text-2xl font-bold text-main">{value}</p>
        <p className="text-sm text-muted">{label}</p>
    </div>
);

export default function Profile() {
    const [user, setUser] = useState(null);
    const [userContent, setUserContent] = useState({ projects: [], posts: [] });
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);

    const loadUserProfile = async () => {
        setLoading(true);
        try {
            const currentUser = await User.me();
            setUser(currentUser);
            if (currentUser) {
                const [projects, posts] = await Promise.all([
                    Project.filter({ created_by: currentUser.email }, '-created_date', 3),
                    ForumPost.filter({ created_by: currentUser.email }, '-created_date', 3),
                ]);
                setUserContent({ projects, posts });
            }
        } catch (error) {
            console.error("Failed to load user profile", error);
        }
        setLoading(false);
    };
    
    useEffect(() => {
        loadUserProfile();
    }, []);

    const handleUpdateSuccess = async () => {
        await loadUserProfile();
        setEditMode(false);
    }

    if (loading) {
        return <div className="text-center p-10 text-main">Loading profile...</div>;
    }

    if (!user) {
        return <div className="text-center p-10 text-main">Could not load profile. Please try again.</div>;
    }
    
    const displayName = user.display_name || user.full_name || 'User';

    return (
        <div className="space-y-8">
            {editMode ? (
                <EditProfileForm user={user} onSave={handleUpdateSuccess} onCancel={() => setEditMode(false)} />
            ) : (
                <>
                    {/* Profile Header */}
                    <Card className="bg-surface border-border-default overflow-hidden">
                        <div className="h-48 bg-gradient-to-r from-gray-700 to-gray-800 relative" >
                           <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" />
                        </div>
                        <CardContent className="p-6">
                            <div className="flex items-end -mt-24 space-x-6">
                                <div className="relative w-36 h-36">
                                    <Avatar className="w-36 h-36 border-4 border-surface" style={{
                                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                    }}>
                                        <AvatarImage src={user.profile_picture} alt={displayName} className="w-full h-full object-cover"/>
                                        <AvatarFallback className="bg-primary/20 text-primary text-4xl font-bold">
                                            {displayName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h1 className="text-3xl font-bold font-serif text-main">{displayName}</h1>
                                            <p className="text-text-muted">{user.job_title || 'Board Game Enthusiast'}</p>
                                        </div>
                                         <Button onClick={() => setEditMode(true)} className="bg-surface hover:bg-slate-700 border border-default text-main">
                                            <Edit className="w-4 h-4 mr-2" /> Edit Profile
                                        </Button>
                                    </div>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <SocialLink url={user.website_url} icon={<LinkIcon className="w-4 h-4"/>}/>
                                        <SocialLink url={user.twitter_url} icon={<Rss className="w-4 h-4"/>}/>
                                        <SocialLink url={user.bgg_profile_url} icon={<Star className="w-4 h-4"/>}/>
                                    </div>
                                </div>
                            </div>
                            
                            <Tabs defaultValue="profile" className="mt-6">
                                <TabsList className="border-b border-default rounded-none p-0 h-auto bg-transparent">
                                    <TabsTrigger value="profile" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary text-text-muted rounded-none pb-2 mr-4">Profile</TabsTrigger>
                                    <TabsTrigger value="designs" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary text-text-muted rounded-none pb-2 mr-4">Designs</TabsTrigger>
                                    <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary text-text-muted rounded-none pb-2 mr-4">Activity</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column */}
                        <div className="lg:col-span-8 space-y-8">
                             <Card className="bg-surface border-border-default">
                                <CardHeader>
                                    <CardTitle className="font-serif">About Freelancer</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-text-muted whitespace-pre-wrap">{user.bio || 'No bio provided.'}</p>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {user.skills?.length > 0 ? user.skills.map(skill => (
                                            <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary border-primary/20">{skill}</Badge>
                                        )) : <p className="text-text-muted text-sm">No skills listed.</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            {user.work_experience?.length > 0 && (
                                <Card className="bg-surface border-border-default">
                                    <CardHeader><CardTitle className="font-serif">Work & Experience</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {user.work_experience.map((exp, index) => (
                                                <div key={index} className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-border-default">
                                                    <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary border-4 border-surface"></div>
                                                    <h3 className="font-semibold text-main">{exp.position} at {exp.company}</h3>
                                                    <p className="text-sm text-text-muted">
                                                        {exp.start_date && !isNaN(new Date(exp.start_date)) ? format(new Date(exp.start_date), 'MMM yyyy') : 'N/A'}
                                                        {' - '}
                                                        {exp.end_date && !isNaN(new Date(exp.end_date)) ? format(new Date(exp.end_date), 'MMM yyyy') : 'Present'}
                                                    </p>
                                                    <p className="text-sm text-text-muted mt-1">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            
                             {user.portfolio?.length > 0 && (
                                <Card className="bg-surface border-border-default">
                                    <CardHeader><CardTitle className="font-serif">Portfolio</CardTitle></CardHeader>
                                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {user.portfolio.map((url, index) => (
                                            <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                                                <img src={url} alt={`Portfolio item ${index + 1}`} className="rounded-lg object-cover aspect-square hover:opacity-80 transition-opacity" />
                                            </a>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-4 space-y-6 sticky top-28">
                             <Card className="bg-surface border-border-default">
                                <CardHeader><CardTitle className="font-serif text-lg">Stats</CardTitle></CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                     <div className="flex justify-between"><span>Profile Views</span> <span className="font-medium text-main">1.5k</span></div>
                                     <div className="flex justify-between"><span>Projects</span> <span className="font-medium text-main">{userContent.projects.length}</span></div>
                                     <div className="flex justify-between"><span>Followers</span> <span className="font-medium text-main">243</span></div>
                                </CardContent>
                            </Card>
                            
                            <Card className="bg-surface border-border-default">
                                <CardHeader><CardTitle className="font-serif text-lg">Designs</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {userContent.projects.length > 0 ? (
                                        userContent.projects.map(p => (
                                            <div key={p.id} className="flex items-center space-x-3">
                                                <img src={p.main_image_url || 'https://placehold.co/40x40/1E242E/FFD166?text=P'} className="w-10 h-10 rounded-md object-cover" />
                                                <p className="text-sm text-main font-medium">{p.title}</p>
                                            </div>
                                        ))
                                    ) : <p className="text-text-muted text-sm">No projects to show.</p>}
                                </CardContent>
                            </Card>
                             <Card className="bg-surface border-border-default">
                                <CardHeader><CardTitle className="font-serif text-lg">Recent Posts</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                     {userContent.posts.length > 0 ? (
                                        userContent.posts.map(p => (
                                            <div key={p.id}>
                                                <p className="text-sm text-main font-medium line-clamp-2">{p.title}</p>
                                                <p className="text-xs text-text-muted">{formatDistanceToNow(new Date(p.created_date))} ago</p>
                                            </div>
                                        ))
                                    ) : <p className="text-text-muted text-sm">No recent posts.</p>}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}