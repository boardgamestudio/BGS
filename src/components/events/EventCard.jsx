import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isAfter } from "date-fns";

const eventTypeColors = {
  workshop: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  playtesting: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  networking: "bg-secondary/10 text-secondary border-secondary/20",
  webinar: "bg-primary/10 text-primary border-primary/20",
  conference: "bg-destructive/10 text-destructive border-destructive/20"
};

export default function EventCard({ event }) {
  const eventDate = event.date ? new Date(event.date) : null;
  const isValidDate = eventDate && !isNaN(eventDate.getTime());
  
  return (
    <Card className="bg-surface border-border-default hover:border-primary transition-all duration-300 group flex flex-col">
       <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold font-serif text-main line-clamp-2 group-hover:text-primary transition-colors">
                {event.title}
            </h3>
            <Badge className={`${eventTypeColors[event.type] || 'bg-slate-700'} capitalize`}>
                {event.type}
            </Badge>
        </div>

        <p className="text-sm text-text-muted line-clamp-3 mb-4">{event.description}</p>
        
        {isValidDate && (
          <div className="flex items-center text-sm text-secondary mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(eventDate, "EEEE, MMM d, yyyy")}</span>
          </div>
        )}
        <div className="flex items-center text-sm text-text-muted">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
        </div>
       </div>

      <div className="px-6 pb-6 mt-auto">
        <Button className="w-full btn-primary">View Event</Button>
      </div>
    </Card>
  );
}