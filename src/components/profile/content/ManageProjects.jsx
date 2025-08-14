import React, { useState, useEffect } from 'react';
import { Project } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Trash2, Plus } from 'lucide-react';
import ProjectFormModal from '@/components/projects/ProjectFormModal';

export default function ManageProjects({ user }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const loadProjects = async () => {
        setLoading(true);
        if (user) {
            const userProjects = await Project.filter({ created_by: user.email }, '-updated_date');
            setProjects(userProjects);
        }
        setLoading(false);
    };

    useEffect(() => {
        if(user) loadProjects();
    }, [user]);

    const handleEdit = (project) => {
        setEditingProject(project);
        setShowModal(true);
    };
    
    const handleDelete = async (projectId) => {
        if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            await Project.delete(projectId);
            loadProjects();
        }
    };

    const handleSuccess = () => {
        setShowModal(false);
        setEditingProject(null);
        loadProjects();
    }
    
    const handleAddNew = () => {
        setEditingProject(null);
        setShowModal(true);
    }

    if (loading) return <div className="text-center p-4 text-text-muted">Loading projects...</div>;

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-main">Your Game Designs</h3>
                <Button onClick={handleAddNew} className="btn-primary"><Plus className="w-4 h-4 mr-2" />Add New Design</Button>
            </div>
            {projects.length > 0 ? (
                <div className="space-y-3">
                    {projects.map(project => (
                        <Card key={project.id} className="bg-background border-border-default flex justify-between items-center p-4">
                            <div>
                                <p className="font-semibold text-main">{project.title}</p>
                                <p className="text-sm text-text-muted capitalize">{project.status?.replace(/_/g, ' ')}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => handleEdit(project)} className="text-main border-border-default hover:bg-slate-700">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(project.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 border border-dashed border-border-default rounded-lg">
                    <p className="text-text-muted">You haven't created any projects yet.</p>
                </div>
            )}

            <ProjectFormModal 
                project={editingProject}
                open={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}