import { useState } from 'react';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import type { Project } from './types/project';
import './App.css';

function App() {
    const [editingProject, setEditingProject] =
        useState<Project | null>(null);

    const [showForm, setShowForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleCreate = () => {
        setEditingProject(null);
        setShowForm(true);
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleSaved = () => {
        setShowForm(false);
        setEditingProject(null);
        setRefreshTrigger((current) => current + 1);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingProject(null);
    };

    return (
        <div className="app">
            <div className="app-container">
                <header className="app-header">
                    <div>
                        <h1 className="app-title">
                            Client Project Tracker
                        </h1>

                        <p className="app-subtitle">
                            Manage your projects and track their progress.
                        </p>
                    </div>
                </header>

                {showForm ? (
                    <ProjectForm
                        project={editingProject}
                        onSaved={handleSaved}
                        onCancel={handleCancel}
                    />
                ) : (
                    <ProjectList
                        onEdit={handleEdit}
                        onCreate={handleCreate}
                        refreshTrigger={refreshTrigger}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
