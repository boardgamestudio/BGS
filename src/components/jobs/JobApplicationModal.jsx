import React, { useState } from "react";
import { Job } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createPageUrl } from "@/utils";
import { Upload, Paperclip, X } from "lucide-react";

export default function JobApplicationModal({ job, user, open, onClose, onSuccess }) {
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsSubmitting(true); // Use submitting state for upload indicator
        const uploadedFiles = [...attachments];

        for (const file of files) {
            try {
                const { file_url } = await UploadFile({ file });
                uploadedFiles.push({ name: file.name, url: file_url });
            } catch (err) {
                console.error("File upload failed", err);
                setError("An error occurred during file upload. Please try again.");
            }
        }
        setAttachments(uploadedFiles);
        setIsSubmitting(false);
    };
    
    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const userProfileUrl = createPageUrl(`Profile?id=${user.id}`);
            
            const newApplication = {
                applicant_id: user.id,
                message: message,
                profile_link: userProfileUrl,
                attached_files: attachments.map(f => f.url),
                applied_date: new Date().toISOString(),
                status: 'pending'
            };

            const updatedApplications = [...(job.applications || []), newApplication];
            
            await Job.update(job.id, {
                applications: updatedApplications,
                applications_count: updatedApplications.length
            });

            onSuccess();
            setMessage("");
            setAttachments([]);

        } catch (err) {
            console.error("Failed to submit application", err);
            setError("Failed to submit application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-surface border-border-default text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold font-serif text-main">Apply for {job.title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-text-muted">Your Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Write a message to the employer..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="bg-background border-border-default min-h-[120px]"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="attachments" className="text-text-muted">Attachments (CV, Portfolio, etc.)</Label>
                        <div className="relative flex items-center">
                            <Button type="button" asChild variant="outline" className="border-border-default bg-background hover:bg-slate-800">
                                <label htmlFor="attachments-input" className="cursor-pointer">
                                    <Upload className="w-4 h-4 mr-2"/>
                                    Upload Files
                                </label>
                            </Button>
                            <Input
                                id="attachments-input"
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="absolute opacity-0 w-full h-full cursor-pointer"
                            />
                        </div>
                    </div>
                    
                    {attachments.length > 0 && (
                        <div className="space-y-2">
                             {attachments.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-background p-2 rounded-md">
                                    <div className="flex items-center gap-2 text-sm text-text-muted">
                                        <Paperclip className="w-4 h-4"/>
                                        <span>{file.name}</span>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeAttachment(index)} className="h-6 w-6">
                                        <X className="w-4 h-4"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} className="bg-background text-white border-border-default hover:bg-slate-700">Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="btn-primary">
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}