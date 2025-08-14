import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DesignDiary, User } from '@/api/entities';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function ResourceDetails() {
    const [entry, setEntry] = useState(null);
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchEntry = async () => {
            const params = new URLSearchParams(location.search);
            const entryId = params.get('id');

            if (!entryId) {
                setLoading(false);
                return;
            }

            try {
                const results = await DesignDiary.filter({ id: entryId });
                if (results.length > 0) {
                    const diaryEntry = results[0];
                    setEntry(diaryEntry);
                    
                    const authorResults = await User.filter({ id: diaryEntry.author_id });
                    if(authorResults.length > 0) {
                        setAuthor(authorResults[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to load resource:", error);
            }
            setLoading(false);
        };

        fetchEntry();
    }, [location.search]);

    if (loading) {
        return <div className="text-center p-10 text-main">Loading resource...</div>;
    }

    if (!entry) {
        return <div className="text-center p-10 text-main">Resource not found.</div>;
    }

    const authorName = author?.display_name || 'Anonymous';
    const authorInitials = authorName.charAt(0).toUpperCase();

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="bg-surface border-border-default">
                {entry.featured_image && (
                    <img src={entry.featured_image} alt={entry.title} className="w-full h-64 object-cover rounded-t-lg" />
                )}
                <CardContent className="p-6 md:p-10">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {entry.tags?.map(tag => (
                            <Badge key={tag} variant="outline" className="text-primary border-primary/40 bg-primary/10">{tag}</Badge>
                        ))}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold font-serif text-white mb-6">{entry.title}</h1>
                    
                    <div className="flex items-center gap-6 text-sm text-slate-400 mb-8 pb-8 border-b border-border-default">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={author?.profile_picture} />
                                <AvatarFallback className="bg-primary/20 text-primary">{authorInitials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-white">{authorName}</p>
                                <p>Author</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <div>
                                <p className="font-semibold text-white">{format(new Date(entry.created_date), 'MMMM d, yyyy')}</p>
                                <p>Published Date</p>
                            </div>
                        </div>
                    </div>

                    <div 
                        className="prose prose-invert prose-lg max-w-none text-slate-300 prose-headings:text-white prose-a:text-primary prose-strong:text-white"
                        dangerouslySetInnerHTML={{ __html: entry.content }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}