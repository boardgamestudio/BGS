import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  FolderKanban,
  Briefcase,
  Calendar,
  MapPin } from
"lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Project, Job, Event } from "@/api/entities";

const RoleBadge = ({ role }) => {
  const roleColors = {
    learner: "bg-blue-600/80 text-white",
    freelancer: "bg-purple-600/80 text-white",
    game_designer: "bg-emerald-600/80 text-white",
    service_provider: "bg-amber-600/80 text-white"
  };

  const roleLabels = {
    learner: "Learner",
    freelancer: "Freelancer",
    game_designer: "Game Designer",
    service_provider: "Service Provider"
  };

  const label = roleLabels[role] || role;
  const color = roleColors[role] || "bg-gray-500 text-white";

  return (
    <Badge className={`${color} text-xs px-2 py-0.5 font-medium`}>
      {label}
    </Badge>);

};

export default function ProfileCard({ user }) {
  const [counts, setCounts] = useState({ projects: 0, jobs: 0, events: 0 });
  const displayName = user.display_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User';

  useEffect(() => {
    const loadCounts = async () => {
      if (!user.email || !user.id) return;

      try {
        const [projectsResult, jobsResult, eventsResult] = await Promise.allSettled([
        Project.filter({ created_by: user.email }),
        Job.filter({ employer_id: user.id }),
        Event.filter({ organizer_id: user.id })]
        );

        setCounts({
          projects: projectsResult.status === 'fulfilled' ? projectsResult.value.length : 0,
          jobs: jobsResult.status === 'fulfilled' ? jobsResult.value.length : 0,
          events: eventsResult.status === 'fulfilled' ? eventsResult.value.length : 0
        });
      } catch (error) {
        console.error("Error loading user counts:", error);
      }
    };

    loadCounts();
  }, [user.email, user.id]);

  return (
    <Link to={createPageUrl(`Profile?id=${user.id}`)} className="block group">
      <Card className="bg-gray-800 border-gray-700 text-slate-200 rounded-xl overflow-hidden group-hover:border-primary transition-all duration-300 h-80 flex flex-col">
        
        {/* Background Image */}
        <div className="relative h-[120px] flex-shrink-0">
          <img
            src={user.profile_banner || "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop"}
            alt="Profile background"
            className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-gray-800/50 to-transparent"></div>
        </div>

        {/* Content Area */}
        <CardContent className="flex-grow flex flex-col items-center text-center p-3 -mt-[130px]">
          
          {/* Avatar (overlapping background) */}
          <div className="w-32 aspect-[20/23] mb-3 z-10">
            <div className="w-full h-full p-1 bg-gradient-to-br from-primary to-secondary"
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <div className="w-full h-full bg-gray-800 overflow-hidden"
              style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                {user.profile_picture ?
                <img
                  src={user.profile_picture}
                  alt={displayName}
                  className="w-full h-full object-cover" /> :

                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-300 text-2xl font-semibold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                }
              </div>
            </div>
          </div>

          {/* Text Info Area */}
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors mb-1">
              {displayName}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-2 text-sm text-slate-300">
              <p>{user.job_title || 'Designer'}</p>
              {(user.city || user.country) &&
              <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.city || user.country}</span>
                  </div>
                </>
              }
            </div>
            {user.user_roles && user.user_roles.length > 0 &&
            <div className="flex flex-wrap justify-center items-center gap-1.5 mb-3">
                {user.user_roles.map((role) =>
              <RoleBadge key={role} role={role} />
              )}
              </div>
            }
          </div>

          {/* Stats Bar (pushed to bottom) */}
          <div className="w-full flex justify-center items-center gap-6 pt-3 mt-auto border-t border-gray-600">
            <div className="relative w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-4 h-4 text-primary" />
              {counts.projects > 0 &&
              <span className="bg-pink-500 text-gray-900 text-xs font-bold absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center">
                  {counts.projects > 99 ? '99+' : counts.projects}
                </span>
              }
            </div>
            <div className="relative w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-cyan-500" />
              {counts.jobs > 0 &&
              <span className="bg-cyan-500 text-gray-900 text-xs font-bold absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center">
                  {counts.jobs > 99 ? '99+' : counts.jobs}
                </span>
              }
            </div>
            <div className="relative w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-amber-400" />
              {counts.events > 0 &&
              <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {counts.events > 99 ? '99+' : counts.events}
                </span>
              }
            </div>
          </div>

        </CardContent>
      </Card>
    </Link>);

}