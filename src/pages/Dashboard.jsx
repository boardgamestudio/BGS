
import React, { useState, useEffect } from "react";
import { Project, Job, Event, User, DesignDiary } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderKanban, 
  Briefcase, 
  Calendar, 
  Users as UsersIcon,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ProjectCard from "../components/projects/ProjectCard";
import JobCard from "../components/jobs/JobCard";
import EventCard from "../components/events/EventCard";
import NewsCard from "../components/news/NewsCard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    jobs: 0,
    events: 0,
    members: 0,
    resources: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [projectAuthors, setProjectAuthors] = useState({});
  const [recentJobs, setRecentJobs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [newsAuthors, setNewsAuthors] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // Added currentUser state

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Check if user is logged in but don't fail if not
      let user = null;
      try {
        user = await User.me();
        setCurrentUser(user);
      } catch (e) {
        // User not logged in, continue with public data
        console.warn("User not logged in or failed to fetch user data:", e);
        setCurrentUser(null);
      }

      // Always load public data regardless of login status
      const [projectsData, jobsData, eventsData, usersData, newsData] = await Promise.allSettled([
        Project.list('-created_date', 50),
        Job.list('-created_date', 50),
        Event.list('-created_date', 50),
        User.list('-created_date', 100),
        DesignDiary.filter({ is_published: true })
      ]);

      // Extract actual data or use empty arrays on failure
      const projects = projectsData.status === 'fulfilled' ? projectsData.value : [];
      const jobs = jobsData.status === 'fulfilled' ? jobsData.value : [];
      const events = eventsData.status === 'fulfilled' ? eventsData.value : [];
      const users = usersData.status === 'fulfilled' ? usersData.value : [];
      const news = newsData.status === 'fulfilled' ? newsData.value : [];

      setStats({
        projects: projects.length,
        jobs: jobs.length,
        events: events.length,
        members: users.length,
        resources: news.length
      });

      const recents = projects.slice(0, 6);
      setRecentProjects(recents);

      // Fetch authors for the project cards
      if (recents.length > 0) {
        const authorEmails = [...new Set(recents.map(p => p.created_by).filter(e => e && typeof e === 'string' && e.includes('@')))];
        const authorIds = [...new Set(recents.map(p => p.created_by_id || p.author_id).filter(id => id && (typeof id === 'string' || typeof id === 'number')))];
        
        const authorsMap = {};
        
        // Also create a mapping from the users we already fetched
        users.forEach(user => {
          if (user.email) authorsMap[user.email] = user;
          if (user.id) authorsMap[user.id] = user;
        });

        // Try fetching by email first, if not already in authorsMap from usersData
        const emailsToFetch = authorEmails.filter(email => !authorsMap[email]);
        if (emailsToFetch.length > 0) {
          try {
            const authorDataByEmail = await User.filter({ email: { in: emailsToFetch } });
            authorDataByEmail.forEach(author => {
              if(author.email) authorsMap[author.email] = author;
              if(author.id) authorsMap[author.id] = author;
            });
          } catch (error) {
            console.log("Could not fetch authors by email:", error);
          }
        }
        
        // Try fetching by ID if we have IDs and not already in authorsMap
        const idsToFetch = authorIds.filter(id => !authorsMap[id]);
        if (idsToFetch.length > 0) {
          try {
            const authorDataById = await User.filter({ id: { in: idsToFetch } });
            authorDataById.forEach(author => {
              authorsMap[author.id] = author;
              if(author.email) authorsMap[author.email] = author;
            });
          } catch (error) {
            console.log("Could not fetch authors by ID:", error);
          }
        }
        
        setProjectAuthors(authorsMap);
      }

      setRecentJobs(jobs.slice(0, 3));
      setLatestNews(news.slice(0, 6));
      
      if (news.length > 0) {
          const newsAuthorIds = [...new Set(news.map(n => n.author_id).filter(id => id))];
          if(newsAuthorIds.length > 0) {
            try {
              const authorData = await User.filter({ id: { in: newsAuthorIds } });
              const authorsMapNews = authorData.reduce((acc, author) => {
                  acc[author.id] = author;
                  return acc;
              }, {});
              setNewsAuthors(authorsMapNews);
            } catch (error) {
              console.log("Could not fetch news authors:", error);
            }
          }
      }
      
      const now = new Date();
      const upcoming = events.filter(event => {
        if (!event.date) return false;
        try {
          const eventDate = new Date(event.date);
          return eventDate > now;
        } catch (error) {
          return false;
        }
      }).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4);
      
      // Fallback if no upcoming events, show recent ones
      if (upcoming.length === 0) {
        setUpcomingEvents(events.slice(0, 4));
      } else {
        setUpcomingEvents(upcoming);
      }

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setLoading(false);
  };

  const HeroStatCard = ({ title, count, icon: Icon, link, color, textColor = 'text-black' }) => (
    <Link to={link} className="group">
        <div className={`relative ${color} rounded-3xl p-6 aspect-square flex flex-col justify-end overflow-hidden transition-transform duration-300 group-hover:scale-105`}>
            <div className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 bg-black/70 text-white rounded-lg border-2 border-white/50">
                <span className="text-lg font-bold">{count}</span>
            </div>
            <Icon className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5 h-3/5 ${textColor} opacity-10 transition-transform duration-300 group-hover:rotate-[-6deg]`} />
            <h3 className={`text-2xl font-bold font-serif relative z-10 text-center ${textColor}`}>{title}</h3>
        </div>
    </Link>
  );

  return (
    <div className="space-y-12">
      {/* New Hero Section */}
      <div className="text-center py-6">
        <h1 className="text-5xl md:text-7xl font-extrabold font-serif leading-tight">
          <span className="text-primary">The Ultimate Hub for</span><br />
          <span className="text-orange-400">Board Game Designers</span><br />
          <span className="text-teal-400">and Creatives</span>
        </h1>
      </div>

      {/* New Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <HeroStatCard 
            title="Members" 
            count={stats.members} 
            icon={UsersIcon}
            link={createPageUrl("Profiles")}
            color="bg-yellow-400"
            textColor="text-gray-900"
        />
        <HeroStatCard 
            title="Game Designs" 
            count={stats.projects} 
            icon={FolderKanban}
            link={createPageUrl("Projects")}
            color="bg-orange-400"
            textColor="text-gray-900"
        />
        <HeroStatCard 
            title="Job Listings" 
            count={stats.jobs} 
            icon={Briefcase}
            link={createPageUrl("Jobs")}
            color="bg-teal-400"
            textColor="text-gray-900"
        />
        <HeroStatCard 
            title="Resources" 
            count={stats.resources} 
            icon={BookOpen}
            link={createPageUrl("Resources")}
            color="bg-pink-400"
            textColor="text-gray-900"
        />
      </div>

      {/* Member Game Designs */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-serif text-white">Member Game Designs</h2>
          <Link to={createPageUrl("Projects")} className="text-primary hover:text-primary/80 flex items-center gap-2">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              author={projectAuthors[project.created_by] || projectAuthors[project.created_by_id] || projectAuthors[project.author_id]} 
            />
          ))}
        </div>
      </div>

      {/* Removed Community CTA Section */}

      {/* Recent Jobs */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-serif text-white">Latest Job Opportunities</h2>
          <Link to={createPageUrl("Jobs")} className="text-primary hover:text-primary/80 flex items-center gap-2">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentJobs.slice(0, 3).map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* Popular Resources */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-serif text-white">Popular Resources</h2>
          <Link to={createPageUrl("Resources")} className="text-primary hover:text-primary/80 flex items-center gap-2">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.map(newsItem => (
            <NewsCard key={newsItem.id} newsItem={newsItem} author={newsAuthors[newsItem.author_id]} />
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-serif text-white">Upcoming Events</h2>
          <Link to={createPageUrl("Events")} className="text-primary hover:text-primary/80 flex items-center gap-2">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-surface rounded-xl h-64"></div>
            ))}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card className="bg-surface border-border-default">
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-text-muted" />
              <p className="text-text-muted">No upcoming events scheduled</p>
              <Link to={createPageUrl("Events")}>
                <Button className="mt-4 btn-primary">Browse All Events</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
