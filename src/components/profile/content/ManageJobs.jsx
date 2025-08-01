
import React, { useState, useEffect } from 'react';
import { Job } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import CreateJobModal from '@/components/jobs/CreateJobModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ManageJobs({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadJobs = async () => {
    if (!user || !user.id) return;
    setLoading(true);
    try {
      const userJobs = await Job.filter({ employer_id: user.id }, '-created_date');
      setJobs(userJobs);
    } catch (error) {
      console.error("Failed to load jobs", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, [user]);

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadJobs();
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await Job.delete(jobId);
        loadJobs();
      } catch (error) {
        console.error("Failed to delete job", error);
        alert("Error deleting job.");
      }
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Manage Your Job Postings</CardTitle>
            <Button type="button" onClick={() => setShowCreateModal(true)} className="bg-emerald-700 hover:bg-emerald-800"><Plus className="w-4 h-4 mr-2" /> Post New Job</Button>
        </CardHeader>
        <CardContent>
            {loading ? (
                <p className="text-slate-400">Loading jobs...</p>
            ) : (
                <div className="space-y-4">
                {jobs.map(job => (
                    <div key={job.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50">
                    <div>
                        <p className="font-semibold text-white">{job.title}</p>
                        <Badge variant="outline" className="text-slate-400 border-slate-600 mt-1">{job.job_type}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(job.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                    </div>
                    </div>
                ))}
                {jobs.length === 0 && <p className="text-slate-400 text-center py-4">You haven't posted any jobs yet.</p>}
                </div>
            )}
            <CreateJobModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={handleCreateSuccess} />
        </CardContent>
    </Card>
  );
}
