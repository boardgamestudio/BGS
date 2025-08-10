
import React, { useState, useEffect } from 'react';
import { Project, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Clock, Edit, User as UserIcon, Puzzle, Star, Link as LinkIcon, ExternalLink, ThumbsUp, MessageSquare, BookOpen, Layers, FileText, Printer, Globe } from 'lucide-react';
import ProjectFormModal from '../components/projects/ProjectFormModal';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ProjectDetailsPage() {
    const [project, setProject] = useState(null);
    const [creator, setCreator] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [error, setError] = useState(null);
    
    const getProjectId = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    };

    const loadProjectData = async () => {
        const projectId = getProjectId();
        if (!projectId) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const projectData = await Project.get(projectId);
            setProject(projectData);

            if (projectData.created_by) {
                const creatorData = await User.filter({ email: projectData.created_by });
                if(creatorData.length > 0) setCreator(creatorData[0]);
            }

        } catch (err) {
            console.error("Failed to load project", err);
            setError("Could not load game design details. The server might be temporarily unavailable. Please try again later.");
        }
        setLoading(false);
    };

    const loadUser = async () => {
        try {
            const user = await User.me();
            setCurrentUser(user);
        } catch (error) {
            console.log("User not logged in");
        }
    };
    
    useEffect(() => {
        loadProjectData();
        loadUser();
    }, []);

    const handleUpdateSuccess = async () => {
        setShowEditModal(false);
        await loadProjectData();
    }

    if (loading) {
        return <div className="text-center p-10 text-white">Loading project...</div>;
    }
    
    if (error) {
        return (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold text-destructive">An Error Occurred</h2>
              <p className="text-slate-400">{error}</p>
              <Link to={createPageUrl('Projects')}><Button className="mt-4">Back to Game Designs</Button></Link>
            </div>
        )
    }

    if (!project) {
        return <div className="text-center p-10 text-white">Project not found.</div>;
    }

    const isOwnerOrCollaborator = currentUser && (project.created_by === currentUser.email || project.collaborators?.includes(currentUser.id));
    
    const getPlayerCount = () => {
        if (!project.player_count_min && !project.player_count_max) return 'N/A';
        if (project.player_count_min === project.player_count_max) return project.player_count_min;
        return `${project.player_count_min || '?'} - ${project.player_count_max || '?'}`;
    };

    const getPlayingTime = () => {
        if (!project.playing_time_min && !project.playing_time_max) return 'N/A';
        if (project.playing_time_min === project.playing_time_max) return `${project.playing_time_min} min`;
        return `${project.playing_time_min || '?'} - ${project.playing_time_max || '?'} min`;
    };

    return (
        <div className="space-y-8 text-slate-300">
            {/* Header */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                <img src={project.main_image_url || 'https://images.unsplash.com/photo-1570303345338-e8f0eddf4946?q=80&w=2070&auto=format&fit=crop'} alt={project.title} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                    <Badge className="mb-2 bg-yellow-400/10 text-yellow-300 capitalize">{project.project_type?.replace(/_/g, ' ')}</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-white shadow-lg">{project.title}</h1>
                    <p className="mt-2 text-lg text-slate-200 max-w-3xl shadow-md">{project.short_description}</p>
                </div>
                {isOwnerOrCollaborator && (
                     <Button onClick={() => setShowEditModal(true)} className="absolute top-6 right-6 bg-gray-800/70 hover:bg-gray-700"><Edit className="w-4 h-4 mr-2" /> Edit Game Design</Button>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left/Main Column */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle>About this Game Design</CardTitle>
                        </CardHeader>
                        <CardContent className="prose prose-invert prose-slate max-w-none">
                            <ReactMarkdown>{project.full_description || "No full description provided."}</ReactMarkdown>
                        </CardContent>
                    </Card>

                    {/* Downloads Section */}
                    {(project.sell_sheet_url || project.rules_url || project.print_and_play_url) && (
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader><CardTitle>Downloads</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                {project.sell_sheet_url && (
                                    <a href={project.sell_sheet_url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                        <FileText className="w-5 h-5 mr-3 text-primary" />
                                        <div>
                                            <p className="font-medium text-white">Sell Sheet</p>
                                            <p className="text-sm text-gray-300">Marketing document for the game</p>
                                        </div>
                                    </a>
                                )}
                                {project.rules_url && (
                                    <a href={project.rules_url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                        <BookOpen className="w-5 h-5 mr-3 text-secondary" />
                                        <div>
                                            <p className="font-medium text-white">Rules</p>
                                            <p className="text-sm text-gray-300">Game rules document</p>
                                        </div>
                                    </a>
                                )}
                                {project.print_and_play_url && (
                                    <a href={project.print_and_play_url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                        <Printer className="w-5 h-5 mr-3 text-info" />
                                        <div>
                                            <p className="font-medium text-white">Print and Play</p>
                                            <p className="text-sm text-gray-300">Printable version of the game</p>
                                        </div>
                                    </a>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Play Online Section */}
                    {project.play_online_url && (
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader><CardTitle>Play Online</CardTitle></CardHeader>
                            <CardContent>
                                <a href={project.play_online_url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                    <Globe className="w-5 h-5 mr-3 text-emerald-400" />
                                    <div>
                                        <p className="font-medium text-white">Play on {project.play_online_platform || 'Online Platform'}</p>
                                        <p className="text-sm text-gray-300">Click to play online</p>
                                    </div>
                                </a>
                            </CardContent>
                        </Card>
                    )}

                    {project.gallery_image_urls?.length > 0 && (
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader><CardTitle>Gallery</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {project.gallery_image_urls.map((url, index) => (
                                    <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                                        <img src={url} alt={`Gallery image ${index + 1}`} className="rounded-lg object-cover aspect-square hover:opacity-80 transition-opacity" />
                                    </a>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                    
                    {project.gallery_youtube_url && (
                         <Card className="bg-gray-800 border-gray-700">
                            <CardHeader><CardTitle>Video Showcase</CardTitle></CardHeader>
                            <CardContent>
                               {/* Extract YouTube video ID from URL for embed */}
                               <iframe className="w-full aspect-video rounded-lg" src={`https://www.youtube.com/embed/${project.gallery_youtube_url.split('v=')[1]}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </CardContent>
                        </Card>
                    )}

                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader><CardTitle>Game Design Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between items-center"><span className="text-slate-400">Status:</span> <Badge className="capitalize bg-emerald-400/10 text-emerald-300">{project.status?.replace('_', ' ')}</Badge></div>
                            <div className="flex justify-between items-center"><span className="flex items-center text-slate-400"><UserIcon className="inline w-4 h-4 mr-2"/>Players:</span> <span className="font-medium text-white">{getPlayerCount()}</span></div>
                            <div className="flex justify-between items-center"><span className="flex items-center text-slate-400"><Clock className="inline w-4 h-4 mr-2"/>Time:</span> <span className="font-medium text-white">{getPlayingTime()}</span></div>
                            <div className="flex justify-between items-center"><span className="flex items-center text-slate-400"><Layers className="inline w-4 h-4 mr-2"/>Age:</span> <span className="font-medium text-white">{project.age_range || 'N/A'}</span></div>
                            <div className="flex justify-between items-center"><span className="flex items-center text-slate-400"><Puzzle className="inline w-4 h-4 mr-2"/>Complexity:</span> <span className="font-medium text-white capitalize">{project.complexity || 'N/A'}</span></div>
                            {project.estimated_release_date && <div className="flex justify-between items-center"><span className="text-slate-400">Est. Release:</span> <span className="font-medium text-white">{format(new Date(project.estimated_release_date), 'MMM yyyy')}</span></div>}
                            {project.looking_for_publisher && <div className="flex items-center gap-2"><span className="text-amber-400">📢</span> <span className="text-amber-400 font-medium">Looking for Publisher</span></div>}
                            {project.looking_for_manufacturer && <div className="flex items-center gap-2"><span className="text-blue-400">🏭</span> <span className="text-blue-400 font-medium">Looking for Manufacturer</span></div>}
                        </CardContent>
                    </Card>

                    {creator && (
                        <Card className="bg-gray-800 border-gray-700">
                             <CardHeader><CardTitle>Creator</CardTitle></CardHeader>
                             <CardContent>
                                <Link to={createPageUrl(`Profile?id=${creator.id}`)} className="flex items-center space-x-4 group">
                                    <Avatar>
                                        <AvatarImage src={creator.profile_picture} />
                                        <AvatarFallback>{creator.display_name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-white group-hover:text-primary transition-colors">{creator.display_name}</p>
                                        <p className="text-xs text-slate-400">{creator.job_title}</p>
                                    </div>
                                </Link>
                             </CardContent>
                        </Card>
                    )}
                    
                     {/* The collaborators card was removed as per the outline */}

                    {project.seeking_collaborators?.length > 0 && (
                         <Card className="bg-gray-800 border-gray-700">
                            <CardHeader><CardTitle>Seeking Collaborators</CardTitle></CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {project.seeking_collaborators.map(role => (
                                    <Badge key={role} variant="secondary" className="capitalize bg-purple-400/10 text-purple-300">{role.replace(/_/g, ' ')}</Badge>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                     {(project.bgg_link || project.crowdfunding_link) && (
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader><CardTitle>Links</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {project.bgg_link && <a href={project.bgg_link} target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-300 hover:text-yellow-400"><ExternalLink className="w-4 h-4 mr-2"/> BoardGameGeek</a>}
                                {project.crowdfunding_link && <a href={project.crowdfunding_link} target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-300 hover:text-yellow-400"><ExternalLink className="w-4 h-4 mr-2"/> Crowdfunding Page</a>}
                            </CardContent>
                        </Card>
                     )}
                </div>
            </div>
            
            <ProjectFormModal project={project} open={showEditModal} onClose={() => setShowEditModal(false)} onSuccess={handleUpdateSuccess} />
        </div>
    );
}
