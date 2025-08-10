
import React, { useState, useEffect } from "react";
import { Event, User } from "@/api/entities";
import {
  Calendar,
  Plus,
  MapPin,
  Clock,
  Users,
  Search,
  Filter,
  Star,
  Video
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isAfter, isSameMonth, addDays } from "date-fns";
import EventFormModal from "../components/events/EventFormModal";
import EventCard from "../components/events/EventCard";

const eventTypeColors = {
  workshop: "bg-blue-100 text-blue-800 border-blue-200",
  playtesting: "bg-purple-100 text-purple-800 border-purple-200",
  networking: "bg-emerald-100 text-emerald-800 border-emerald-200",
  webinar: "bg-amber-100 text-amber-800 border-amber-200",
  conference: "bg-red-100 text-red-800 border-red-200"
};

// Helper function to validate date
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const eventList = await Event.list('-date');
      setEvents(eventList);
    } catch (error) {
      console.error("Error loading events:", error);
    }
    setLoading(false);
  };

  const handleCreateEvent = async () => {
    await loadEvents();
    setShowCreateModal(false);
  };

  const filteredEvents = events.filter((event) => {
    // Ensure event.date is a valid date string before creating a Date object
    const eventDate = isValidDate(event.date) ? new Date(event.date) : null;
    const now = new Date();

    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || event.type === typeFilter;

    let matchesTime = true;
    if (eventDate) { // Only apply time filters if the event date is valid
      if (timeFilter === "upcoming") {
        matchesTime = isAfter(eventDate, now);
      } else if (timeFilter === "this_month") {
        matchesTime = isSameMonth(eventDate, now);
      } else if (timeFilter === "next_week") {
        matchesTime = isAfter(eventDate, now) && isAfter(addDays(now, 7), eventDate);
      }
    } else {
      // If eventDate is invalid, it won't match any specific time filter except "all"
      matchesTime = timeFilter === "all";
    }

    return matchesSearch && matchesType && matchesTime;
  });

  const upcomingEvents = events.filter((event) => isValidDate(event.date) && isAfter(new Date(event.date), new Date())).slice(0, 3);

  return (
    <div className="bg-background p-2 sm:p-4 md:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Community Events</h1>
          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto px-4">
            Join workshops, playtesting sessions, and networking events with fellow board game creators
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            
            {/* Controls */}
            <Card className="bg-surface border-border-default">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <Input
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background border-border-default focus:border-primary text-white"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-32 sm:w-40 bg-background border-border-default text-white text-sm">
                        <SelectValue placeholder="Event Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-border-default text-white">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="workshop">Workshops</SelectItem>
                        <SelectItem value="playtesting">Playtesting</SelectItem>
                        <SelectItem value="networking">Networking</SelectItem>
                        <SelectItem value="webinar">Webinars</SelectItem>
                        <SelectItem value="conference">Conferences</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger className="w-28 sm:w-40 bg-background border-border-default text-white text-sm">
                        <SelectValue placeholder="When" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-border-default text-white">
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="next_week">Next Week</SelectItem>
                        <SelectItem value="this_month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>

            {/* Events Grid */}
            {loading ? (
              <div className="grid gap-4 sm:gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-surface rounded-xl h-48 sm:h-64"></div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}

            {!loading && filteredEvents.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-main mb-2">No events found</h3>
                <p className="text-text-muted mb-6 px-4">Try adjusting your filters or create a new event</p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:block hidden">
            
            {/* Upcoming Highlights */}
            <Card className="bg-surface border-border-default">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-main flex items-center">
                  <Star className="w-5 h-5 mr-2 text-primary" />
                  Coming Up
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length > 0 ?
                <div className="space-y-4">
                    {upcomingEvents.map((event) =>
                  <div key={event.id} className="p-3 bg-background rounded-lg border border-border-default">
                        <h4 className="font-medium text-main text-sm mb-1">{event.title}</h4>
                        <div className="flex items-center text-xs text-text-muted mb-2">
                          <Clock className="w-3 h-3 mr-1" />
                          {isValidDate(event.date) ? format(new Date(event.date), "MMM d, h:mm a") : 'TBD'}
                        </div>
                        <Badge className={`${eventTypeColors[event.type]} text-xs`}>
                          {event.type}
                        </Badge>
                      </div>
                  )}
                  </div> :

                <div className="text-center py-4">
                    <Calendar className="w-8 h-8 text-text-muted mx-auto mb-2" />
                    <p className="text-sm text-text-muted">No upcoming events</p>
                  </div>
                }
              </CardContent>
            </Card>

            {/* Event Types */}
            <Card className="bg-surface border-border-default">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-main">Event Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(eventTypeColors).map(([type, colorClass]) =>
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className="w-full text-left p-3 rounded-lg hover:bg-background transition-colors group">

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={`${colorClass} text-xs`}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Badge>
                        </div>
                        <span className="text-xs text-text-muted">
                          {events.filter((e) => e.type === type).length}
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-surface border-border-default">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-main">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-400/10 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-sm text-text-muted">Total Events</span>
                    </div>
                    <span className="font-semibold text-main">
                      {events.filter((e) => isValidDate(e.date) && isSameMonth(new Date(e.date), new Date())).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="text-sm text-text-muted">Attendees</span>
                    </div>
                    <span className="font-semibold text-main">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-400/10 rounded-full flex items-center justify-center">
                        <Video className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-sm text-text-muted">Online</span>
                    </div>
                    <span className="font-semibold text-main">
                      {events.filter((e) => e.location === 'online').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EventFormModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateEvent}
      />
    </div>
  );
}
