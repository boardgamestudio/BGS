import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star,
  MoreHorizontal
} from "lucide-react";

const userTypeColors = {
  learner: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  creative: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  designer: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  service: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  illustrator: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  'web designer': "bg-pink-400/10 text-pink-400 border-pink-400/20",
  '3d artist': "bg-teal-400/10 text-teal-400 border-teal-400/20",
  'graphic designer': "bg-indigo-400/10 text-indigo-400 border-indigo-400/20",
  'ux/ui designer': "bg-sky-400/10 text-sky-400 border-sky-400/20"
};

export default function ProfileCard({ user }) {
  const displayName = user.display_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User';
  const username = user.email?.split('@')[0] || 'username';
  const userType = (user.job_title || user.user_type?.[0] || 'creative').toLowerCase();
  
  const badgeColorClass = userTypeColors[userType] || userTypeColors.creative;

  return (
    <Card className="bg-gray-800 border-gray-700 text-slate-200 rounded-xl overflow-hidden group flex flex-col h-full">
      <CardContent className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <Badge className={`border text-xs uppercase font-semibold tracking-wider ${badgeColorClass}`}>
            {userType}
          </Badge>
          <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:bg-gray-700 hover:text-white">
            <MoreHorizontal className="w-4 h-4"/>
          </Button>
        </div>

        <div className="text-center flex-grow">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-gray-700">
            {user.profile_picture ? (
              <AvatarImage src={user.profile_picture} alt={displayName} />
            ) : (
              <AvatarFallback className="bg-gray-700 text-gray-400 text-3xl font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <h3 className="text-xl font-bold text-white truncate">{displayName}</h3>
          <p className="text-sm text-slate-400 mb-4">@{username}</p>

          <div className="flex items-center justify-center space-x-4 mb-2">
              <div className="text-center">
                  <p className="font-bold text-white">${user.hourly_rate_min || 'N/A'}{user.hourly_rate_max ? `-$${user.hourly_rate_max}`: ''}</p>
                  <p className="text-xs text-slate-500">per hour</p>
              </div>
              <div className="border-l border-gray-700 h-8"></div>
              <div className="text-center">
                  <div className="flex items-center justify-center font-bold text-white">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span>{user.rating || '4.5'}</span>
                  </div>
                  <p className="text-xs text-slate-500">{user.review_count || '15'} reviews</p>
              </div>
          </div>
        </div>
        
        <Button className="w-full mt-auto bg-gray-700 hover:bg-gray-600 text-slate-200 font-semibold">
          Invite
        </Button>
      </CardContent>
    </Card>
  );
}