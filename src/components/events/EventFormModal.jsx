
import React, { useState, useEffect } from "react";
import { Event, User } from "@/api/entities";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const emptyEvent = {
    title: "",
    description: "",
    type: "",
    date: "",
    location: "",
    max_attendees: "",
    is_free: true,
    price: ""
};

export default function EventFormModal({ event, open, onClose, onSuccess }) {
    const [formData, setFormData] = useState(event || emptyEvent);
    const [isEditing, setIsEditing] = useState(!!event);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setIsEditing(!!event);
        
        let initialDate = '';
        if (event?.date) {
            const d = new Date(event.date);
            if (!isNaN(d.getTime())) { // Check if the date is valid
                initialDate = d.toISOString().substring(0, 16);
            }
        }

        const eventData = event ? {
            ...event,
            date: initialDate
        } : emptyEvent;
        setFormData(eventData);
    }, [event, open]);


    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const { id, created_by, created_date, updated_date, organizer_id, attendees, ...updateData } = formData;
        
        updateData.max_attendees = updateData.max_attendees ? parseInt(updateData.max_attendees) : null;
        updateData.price = updateData.is_free ? null : parseFloat(updateData.price) || null;
        updateData.date = new Date(updateData.date).toISOString();

        try {
            if (isEditing) {
                await Event.update(id, updateData);
            } else {
                const user = await User.me();
                await Event.create({ ...updateData, organizer_id: user.id, attendees: [] });
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save event", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-surface border-border-default text-white overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">{isEditing ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6 p-1">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-white">Event Title</Label>
                        <Input id="title" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} placeholder="Enter event title" className="bg-background border-border-default text-white" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">Description</Label>
                        <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Describe your event..." className="bg-background border-border-default text-white min-h-[100px]" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-white">Event Type</Label>
                            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                                <SelectTrigger className="bg-background border-border-default text-white">
                                    <SelectValue placeholder="Select event type..." />
                                </SelectTrigger>
                                <SelectContent className="bg-surface border-border-default text-white">
                                    <SelectItem value="workshop">Workshop</SelectItem>
                                    <SelectItem value="playtesting">Playtesting</SelectItem>
                                    <SelectItem value="networking">Networking</SelectItem>
                                    <SelectItem value="webinar">Webinar</SelectItem>
                                    <SelectItem value="conference">Conference</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-white">Date & Time</Label>
                            <Input id="date" type="datetime-local" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} className="bg-background border-border-default text-white" required />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border-default">
                        <Button type="button" variant="outline" onClick={onClose} className="bg-background text-white border-border-default hover:bg-slate-700">Cancel</Button>
                        <Button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Event"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
