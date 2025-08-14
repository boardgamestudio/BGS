import React, { useState, useEffect } from 'react';
import { Event } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Trash2, Plus } from 'lucide-react';
import EventFormModal from '@/components/events/EventFormModal';
import { format } from "date-fns";

export default function ManageEvents({ user }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const loadEvents = async () => {
        setLoading(true);
        if (user) {
            const userEvents = await Event.filter({ organizer_id: user.id }, '-updated_date');
            setEvents(userEvents);
        }
        setLoading(false);
    };

    useEffect(() => {
        if(user) loadEvents();
    }, [user]);

    const handleEdit = (event) => {
        setEditingEvent(event);
        setShowModal(true);
    };
    
    const handleDelete = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            await Event.delete(eventId);
            loadEvents();
        }
    };

    const handleSuccess = () => {
        setShowModal(false);
        setEditingEvent(null);
        loadEvents();
    }
    
    const handleAddNew = () => {
        setEditingEvent(null);
        setShowModal(true);
    }

    if (loading) return <div className="text-center p-4 text-text-muted">Loading events...</div>;

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-main">Your Events</h3>
                <Button onClick={handleAddNew} className="btn-primary"><Plus className="w-4 h-4 mr-2" />Create New Event</Button>
            </div>
            {events.length > 0 ? (
                <div className="space-y-3">
                    {events.map(event => (
                        <Card key={event.id} className="bg-background border-border-default flex justify-between items-center p-4">
                            <div>
                                <p className="font-semibold text-main">{event.title}</p>
                                <p className="text-sm text-text-muted capitalize">{event.type} on {format(new Date(event.date), "MMM d, yyyy")}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => handleEdit(event)} className="text-main border-border-default hover:bg-slate-700">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(event.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-8 border border-dashed border-border-default rounded-lg">
                    <p className="text-text-muted">You haven't created any events yet.</p>
                </div>
            )}

            <EventFormModal 
                event={editingEvent}
                open={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}