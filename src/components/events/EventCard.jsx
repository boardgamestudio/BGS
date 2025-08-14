import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isAfter } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const eventTypeColors = {
  workshop: "bg-blue-400/20 text-blue-400 border-blue-400/30",
  playtesting: "bg-purple-400/20 text-purple-400 border-purple-400/30",
  networking: "bg-secondary/20 text-secondary border-secondary/30",
  webinar: "bg-primary/20 text-primary border-primary/30",
  conference: "bg-destructive/20 text-destructive border-destructive/30"
};

const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export default function EventCard({ event }) {
  const eventDate = isValidDate(event.date) ? new Date(event.date) : null;
  
  return (
    <Link to={createPageUrl(`Events?id=${event.id}`)} className="group">
      <Card className="bg-surface border-border-default hover:border-primary transition-all duration-300 group flex flex-col h-full">
        <CardContent className="p-6 flex-grow flex flex-col">
          <h3 className="text-lg font-bold font-serif text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {eventDate && (
            <div className="flex items-center text-sm text-white mb-4">
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              <span>{format(eventDate, "MMM d, yyyy")}</span>
            </div>
          )}
          
          <div className="mt-auto">
            <Badge className={`${eventTypeColors[event.type] || 'bg-slate-600/30 text-slate-300'} capitalize`}>
              {event.type}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}