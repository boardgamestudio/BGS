import React, { useState, useEffect } from "react";
import { Project, Job, Event, ForumPost } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Briefcase, Calendar, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "../components/projects/ProjectCard";
import JobCard from "../components/jobs/JobCard";
import EventCard from "../components/events/EventCard";
import PostCard from "../components/community/PostCard";
import { Badge } from "@/components/ui/badge";

const StatCard = ({ title, url, color }) => (
    <div className={`relative p-6 rounded-lg overflow-hidden h-48 flex flex-col justify-between items-start bg-${color}-500`}>
        <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-black/10`}></div>
        <h3 className="font-serif text-3xl text-black">{title}</h3>
        <Link to={url}>
            <Button variant="outline" className="bg-transparent border-black text-black hover:bg-black hover:text-white">View</Button>
        </Link>
    </div>
);


export default function Dashboard() {
    const [latestProjects, setLatestProjects] = useState([]);
    const [latestJobs, setLatestJobs] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [projects, jobs, events, posts] = await Promise.all([
                    Project.list('-created_date', 3),
                    Job.list('-created_date', 2),
                    Event.list('date', 2), // ascending to get upcoming
                    ForumPost.list('-created_date', 2)
                ]);
                setLatestProjects(projects);
                setLatestJobs(jobs);
                setUpcomingEvents(events.filter(e => new Date(e.date) > new Date()));
                setLatestPosts(posts);
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                    <h1 className="font-serif text-6xl md:text-7xl font-bold leading-tight">
                        Join the Ultimate <span className="text-secondary">Community</span> for Board Game <span className="text-primary">Designers</span> and <span className="text-destructive">Creatives</span>
                    </h1>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <StatCard title="Projects" url={createPageUrl('Projects')} color="primary" />
                    <StatCard title="Jobs" url={createPageUrl('Jobs')} color="destructive" />
                    <StatCard title="Events" url={createPageUrl('Events')} color="secondary" />
                    <StatCard title="Community" url={createPageUrl('Community')} color="info" />
                </div>
            </section>

            {/* Latest Board Game Jobs */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif text-4xl">Latest Board Game Jobs</h2>
                    <Link to={createPageUrl('Jobs')}>
                        <Button variant="ghost" className="text-primary hover:text-primary">View all <ArrowRight className="w-4 h-4 ml-2"/></Button>
                    </Link>
                </div>
                {loading ? <p>Loading...</p> : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {latestJobs.map(job => <JobCard key={job.id} job={job} />)}
                    </div>
                )}
            </section>
            
            {/* Elevate Your Game */}
            <section className="bg-surface rounded-lg p-10 grid md:grid-cols-2 gap-8 items-center">
                 <div>
                    <h2 className="font-serif text-4xl leading-snug">Elevate Your Game and Connect with Like-Minded Designers</h2>
                     <Link to={createPageUrl('Profiles')}>
                        <Button className="mt-6 btn-primary">Find a Collaborator</Button>
                    </Link>
                </div>
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-48 h-48 bg-primary rounded-full -translate-x-10"></div>
                    <div className="absolute w-24 h-24 bg-secondary rounded-full translate-x-16 translate-y-12"></div>
                    <div className="absolute w-16 h-16 bg-destructive rounded-full translate-x-2 -translate-y-16"></div>
                    <p className="font-serif text-lg z-10 bg-surface p-4 rounded-full border border-default">Board Game Creatives</p>
                </div>
            </section>

            {/* Upcoming Events */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif text-4xl">Upcoming Events</h2>
                    <Link to={createPageUrl('Events')}>
                        <Button variant="ghost" className="text-primary hover:text-primary">View all <ArrowRight className="w-4 h-4 ml-2"/></Button>
                    </Link>
                </div>
                {loading ? <p>Loading...</p> : (
                     <div className="grid md:grid-cols-2 gap-6">
                        {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
                    </div>
                )}
            </section>

            {/* Member Projects */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif text-4xl">Member Projects</h2>
                    <Link to={createPageUrl('Projects')}>
                        <Button variant="ghost" className="text-primary hover:text-primary">View all <ArrowRight className="w-4 h-4 ml-2"/></Button>
                    </Link>
                </div>
                {loading ? <p>Loading...</p> : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {latestProjects.map(project => <ProjectCard key={project.id} project={project} />)}
                    </div>
                )}
            </section>
            
            {/* Latest News */}
             <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif text-4xl">Latest News</h2>
                    <Link to={createPageUrl('Community')}>
                        <Button variant="ghost" className="text-primary hover:text-primary">View all <ArrowRight className="w-4 h-4 ml-2"/></Button>
                    </Link>
                </div>
                {loading ? <p>Loading...</p> : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {latestPosts.map(post => <PostCard key={post.id} post={post} />)}
                    </div>
                )}
            </section>
        </div>
    );
}