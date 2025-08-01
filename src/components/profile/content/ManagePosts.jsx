
import React, { useState, useEffect } from 'react';
import { ForumPost } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import CreatePostModal from '@/components/community/CreatePostModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ManagePosts({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadPosts = async () => {
    if (!user || !user.email) return;
    setLoading(true);
    try {
      const userPosts = await ForumPost.filter({ created_by: user.email }, '-created_date');
      setPosts(userPosts);
    } catch (error) {
      console.error("Failed to load posts", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, [user]);

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadPosts();
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await ForumPost.delete(postId);
        loadPosts();
      } catch (error) {
        console.error("Failed to delete post", error);
        alert("Error deleting post.");
      }
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Manage Your Forum Posts</CardTitle>
            <Button type="button" onClick={() => setShowCreateModal(true)} className="bg-emerald-700 hover:bg-emerald-800"><Plus className="w-4 h-4 mr-2" /> Start Discussion</Button>
        </CardHeader>
        <CardContent>
            {loading ? (
                <p className="text-slate-400">Loading posts...</p>
            ) : (
                <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50">
                    <div>
                        <p className="font-semibold text-white">{post.title}</p>
                         <Badge variant="outline" className="text-slate-400 border-slate-600 mt-1">{post.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(post.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                    </div>
                    </div>
                ))}
                {posts.length === 0 && <p className="text-slate-400 text-center py-4">You haven't created any posts yet.</p>}
                </div>
            )}
            <CreatePostModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={handleCreateSuccess} />
        </CardContent>
    </Card>
  );
}
