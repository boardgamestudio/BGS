import React, { useState, useEffect } from 'react';
import { Project } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ProjectFormModal from '@/components/projects/ProjectFormModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ManageProjects({ user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const loadProjects = async () => {
    if (!user || !user.email) return;
    setLoading(true);
    try {
      const userProjects = await Project.filter({ created_by: user.email }, '-created_date');
      setProjects(userProjects);
    } catch (error) {
      console.error("Failed to load projects", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  const handleCreate = () => {
    setSelectedProject(null);
    setShowFormModal(true);
  };
  
  const handleEdit = (project) => {
    setSelectedProject(project);
    setShowFormModal(true);
  };

  const handleSuccess = () => {
    setShowFormModal(false);
    setSelectedProject(null);
    loadProjects();
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await Project.delete(projectId);
        loadProjects();
      } catch (error) {
        console.error("Failed to delete project", error);
        alert("Error deleting project.");
      }
    }
  };
  
  const handleCloseModal = () => {
    setShowFormModal(false);
    setSelectedProject(null);
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Manage Your Projects</CardTitle>
            <Button type="button" onClick={handleCreate} className="bg-emerald-700 hover:bg-emerald-800"><Plus className="w-4 h-4 mr-2" /> Create Project</Button>
        </CardHeader>
        <CardContent>
            {loading ? (
                <p className="text-slate-400">Loading projects...</p>
            ) : (
                <div className="space-y-4">
                {projects.map(project => (
                    <div key={project.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50">
                    <div>
                        <p className="font-semibold text-white">{project.title}</p>
                        <Badge variant="outline" className="text-slate-400 border-slate-600 mt-1 capitalize">{project.status?.replace(/_/g, ' ')}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => handleEdit(project)} className="bg-gray-700 hover:bg-gray-600"><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                        <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(project.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                    </div>
                    </div>
                ))}
                {projects.length === 0 && <p className="text-slate-400 text-center py-4">You haven't created any projects yet.</p>}
                </div>
            )}
            {showFormModal && (
                <ProjectFormModal 
                    project={selectedProject} 
                    open={showFormModal} 
                    onClose={handleCloseModal} 
                    onSuccess={handleSuccess} 
                />
            )}
        </CardContent>
    </Card>
  );
}