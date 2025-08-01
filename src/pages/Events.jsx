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
import CreateEventModal from "../components/events/CreateEventModal";
import EventCard from "../components/events/EventCard";

const eventTypeColors = {
  workshop: "bg-blue-100 text-blue-800 border-blue-200",
  playtesting: "bg-purple-100 text-purple-800 border-purple-200",
  networking: "bg-emerald-100 text-emerald-800 border-emerald-200",
  webinar: "bg-amber-100 text-amber-800 border-amber-200",
  conference: "bg-red-100 text-red-800 border-red-200"
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

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    
    let matchesTime = true;
    if (timeFilter === "upcoming") {
      matchesTime = isAfter(eventDate, now);
    } else if (timeFilter === "this_month") {
      matchesTime = isSameMonth(eventDate, now);
    } else if (timeFilter === "next_week") {
      matchesTime = isAfter(eventDate, now) && isAfter(addDays(now, 7), eventDate);
    }
    
    return matchesSearch && matchesType && matchesTime;
  });

  const upcomingEvents = events.filter(event => isAfter(new Date(event.date), new Date())).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-stone-900">Community Events</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Join workshops, playtesting sessions, and networking events with fellow board game creators
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Controls */}
            <Card className="bg-white/70 backdrop-blur-sm border-stone-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <Input
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white border-stone-300 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-40 bg-white border-stone-300">
                        <SelectValue placeholder="Event Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="workshop">Workshops</SelectItem>
                        <SelectItem value="playtesting">Playtesting</SelectItem>
                        <SelectItem value="networking">Networking</SelectItem>
                        <SelectItem value="webinar">Webinars</SelectItem>
                        <SelectItem value="conference">Conferences</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger className="w-40 bg-white border-stone-300">
                        <SelectValue placeholder="When" />
                      </SelectTrigger>
                      <SelectContent>
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
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>

            {/* Events Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-stone-200 rounded-xl h-64"></div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}

            {!loading && filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-stone-900 mb-2">No events found</h3>
                <p className="text-stone-600 mb-6">Try adjusting your filters or create a new event</p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Upcoming Highlights */}
            <Card className="bg-gradient-to-br from-emerald-50 to-amber-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-stone-900 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-amber-500" />
                  Coming Up
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="p-3 bg-white/70 rounded-lg border border-emerald-200">
                        <h4 className="font-medium text-stone-900 text-sm mb-1">{event.title}</h4>
                        <div className="flex items-center text-xs text-stone-600 mb-2">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(event.date), "MMM d, h:mm a")}
                        </div>
                        <Badge className={`${eventTypeColors[event.type]} text-xs`}>
                          {event.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Calendar className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm text-stone-500">No upcoming events</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Types */}
            <Card className="bg-white/70 backdrop-blur-sm border-stone-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-stone-900">Event Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(eventTypeColors).map(([type, colorClass]) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className="w-full text-left p-3 rounded-lg hover:bg-stone-50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={`${colorClass} text-xs`}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Badge>
                        </div>
                        <span className="text-xs text-stone-500">
                          {events.filter(e => e.type === type).length}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/70 backdrop-blur-sm border-stone-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-stone-900">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-stone-700">Total Events</span>
                    </div>
                    <span className="font-semibold text-stone-900">
                      {events.filter(e => isSameMonth(new Date(e.date), new Date())).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm text-stone-700">Attendees</span>
                    </div>
                    <span className="font-semibold text-stone-900">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Video className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm text-stone-700">Online</span>
                    </div>
                    <span className="font-semibold text-stone-900">
                      {events.filter(e => e.location === 'online').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateEventModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateEvent}
      />
    </div>
  );
}