
import React, { useState, useEffect } from 'react';
import { Event } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import CreateEventModal from '@/components/events/CreateEventModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function ManageEvents({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadEvents = async () => {
    if (!user || !user.id) return;
    setLoading(true);
    try {
      const userEvents = await Event.filter({ organizer_id: user.id }, '-created_date');
      setEvents(userEvents);
    } catch (error) {
      console.error("Failed to load events", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, [user]);

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadEvents();
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await Event.delete(eventId);
        loadEvents();
      } catch (error) {
        console.error("Failed to delete event", error);
        alert("Error deleting event.");
      }
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Manage Your Events</CardTitle>
            <Button type="button" onClick={() => setShowCreateModal(true)} className="bg-emerald-700 hover:bg-emerald-800"><Plus className="w-4 h-4 mr-2" /> Create Event</Button>
        </CardHeader>
        <CardContent>
            {loading ? (
                <p className="text-slate-400">Loading events...</p>
            ) : (
                <div className="space-y-4">
                {events.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50">
                    <div>
                        <p className="font-semibold text-white">{event.title}</p>
                         <p className="text-sm text-slate-400 mt-1">
                           {event.date && !isNaN(new Date(event.date)) ? format(new Date(event.date), 'MMM d, yyyy') : 'No date'}
                         </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(event.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                    </div>
                    </div>
                ))}
                {events.length === 0 && <p className="text-slate-400 text-center py-4">You haven't created any events yet.</p>}
                </div>
            )}
            <CreateEventModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={handleCreateSuccess} />
        </CardContent>
    </Card>
  );
}
