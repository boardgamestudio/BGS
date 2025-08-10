import React, { useState, useEffect } from 'react';
import { Job } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Trash2, Plus } from 'lucide-react';
import JobFormModal from '@/components/jobs/JobFormModal';

export default function ManageJobs({ user }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingJob, setEditingJob] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const loadJobs = async () => {
        setLoading(true);
        if (user) {
            const userJobs = await Job.filter({ employer_id: user.id }, '-updated_date');
            setJobs(userJobs);
        }
        setLoading(false);
    };

    useEffect(() => {
        if(user) loadJobs();
    }, [user]);

    const handleEdit = (job) => {
        setEditingJob(job);
        setShowModal(true);
    };
    
    const handleDelete = async (jobId) => {
        if (window.confirm("Are you sure you want to delete this job posting?")) {
            await Job.delete(jobId);
            loadJobs();
        }
    };

    const handleSuccess = () => {
        setShowModal(false);
        setEditingJob(null);
        loadJobs();
    }
    
    const handleAddNew = () => {
        setEditingJob(null);
        setShowModal(true);
    }

    if (loading) return <div className="text-center p-4 text-text-muted">Loading jobs...</div>;

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-main">Your Job Postings</h3>
                <Button onClick={handleAddNew} className="btn-primary"><Plus className="w-4 h-4 mr-2" />Post New Job</Button>
            </div>
            {jobs.length > 0 ? (
                <div className="space-y-3">
                    {jobs.map(job => (
                        <Card key={job.id} className="bg-background border-border-default flex justify-between items-center p-4">
                            <div>
                                <p className="font-semibold text-main">{job.title}</p>
                                <p className="text-sm text-text-muted capitalize">{job.job_type?.replace(/_/g, ' ')}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => handleEdit(job)} className="text-main border-border-default hover:bg-slate-700">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(job.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 border border-dashed border-border-default rounded-lg">
                    <p className="text-text-muted">You haven't posted any jobs yet.</p>
                </div>
            )}

            <JobFormModal 
                job={editingJob}
                open={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}