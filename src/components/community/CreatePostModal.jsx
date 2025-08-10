import React, { useState } from "react";
import { ForumPost, User } from "@/api/entities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const categoryOptions = {
  general: "General Discussion",
  design_theory: "Design Theory",
  mechanics: "Game Mechanics",
  artwork: "Artwork & Design", 
  publishing: "Publishing",
  playtesting: "Playtesting",
  rules: "Rules & Instructions",
  marketing: "Marketing"
};

const commonTags = [
  "beginner", "strategy", "mechanics", "artwork", "playtesting", 
  "rules", "prototype", "feedback", "collaboration", "publishing"
];

export default function CreatePostModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: []
  });
  const [creating, setCreating] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await ForumPost.create({
        ...formData,
        replies: [],
        upvotes: 0
      });

      onSuccess();
      setFormData({
        title: "",
        content: "",
        category: "",
        tags: []
      });
    } catch (error) {
      console.error("Error creating post:", error);
    }
    setCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-stone-900">Start New Discussion</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Discussion Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="What's your topic?"
              className="bg-white border-stone-300 focus:border-emerald-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger className="bg-white border-stone-300">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryOptions).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Share your thoughts, questions, or ideas..."
              className="bg-white border-stone-300 focus:border-emerald-500 min-h-[150px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  disabled={formData.tags.includes(tag)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200 cursor-not-allowed'
                      : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {formData.tags.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Selected tags:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-emerald-100 text-emerald-800 border-emerald-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:bg-emerald-200 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creating}
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              {creating ? "Publishing..." : "Publish Discussion"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}