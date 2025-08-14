import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

export default function NewsCard({ newsItem, author }) {
    if (!newsItem) return null;

    const authorName = author?.display_name || 'Anonymous';
    const authorInitials = authorName.charAt(0).toUpperCase();

    // Basic content stripping for excerpt
    const excerpt = newsItem.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...';
    
    return (
        <Link to={createPageUrl(`ResourceDetails?id=${newsItem.id}`)} className="group block">
            <Card className="bg-surface border-border-default hover:border-primary transition-all duration-300 group flex flex-col sm:flex-row h-full">
                {newsItem.featured_image && (
                    <div className="sm:w-1/3 flex-shrink-0">
                        <img src={newsItem.featured_image} alt={newsItem.title} className="w-full h-32 sm:h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-r-none" />
                    </div>
                )}
                <CardContent className="p-4 flex-grow flex flex-col">
                    <h3 className="text-md font-bold font-serif text-white line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {newsItem.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-3 flex-grow">{excerpt}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                        {newsItem.tags?.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="border-slate-600 text-slate-400 text-xs">{tag}</Badge>
                        ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                                <AvatarImage src={author?.profile_picture} />
                                <AvatarFallback className="bg-primary/20 text-primary text-xs">{authorInitials}</AvatarFallback>
                            </Avatar>
                            <span>{authorName}</span>
                        </div>
                        <span>{formatDistanceToNow(new Date(newsItem.created_date), { addSuffix: true })}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}