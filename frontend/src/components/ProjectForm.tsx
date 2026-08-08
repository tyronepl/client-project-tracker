import { useEffect, useState } from 'react';
import type { Project } from '../types/project';

import {
    createProject,
    updateProject,
    type ProjectFormData,
} from '../services/projectService';

interface ProjectFormProps {
    project: Project | null;
    onSaved: () => void;
    onCancel: () => void;
}

type FormData = {
    client_name: string;
    project_name: string;
    description: string;
    status: Project['status'];
    priority: Project['priority'];
    start_date: string;
    due_date: string;
};

const initialForm: FormData = {
    client_name: '',
    project_name: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    start_date: '',
    due_date: '',
};

function ProjectForm({
    project,
    onSaved,
    onCancel,
}: ProjectFormProps) {
    const [formData, setFormData] =
        useState<FormData>(initialForm);

    const [errors, setErrors] =
        useState<Record<string, string[]>>({});

    const [saving, setSaving] = useState(false);

    const isEditing = project !== null;

    /*
     * Populate form when editing
     */
    useEffect(() => {
        if (project) {
            setFormData({
                client_name: project.clientName,
                project_name: project.projectName,
                description: project.description ?? '',
                status: project.status,
                priority: project.priority,
                start_date: project.startDate,
                due_date: project.dueDate,
            });
        } else {
            setFormData(initialForm);
        }

        setErrors({});
    }, [project]);

    /*
     * Handle input changes
     */
    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((current) => ({
                ...current,
                [name]: [],
            }));
        }
    };

    /*
     * Submit
     */
    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        try {
            setSaving(true);
            setErrors({});

            /*
             * Convert the form's snake_case fields
             * into the frontend ProjectFormData format.
             */
            const payload: ProjectFormData = {
                clientName: formData.client_name,
                projectName: formData.project_name,
                description: formData.description,
                status: formData.status,
                priority: formData.priority,
                startDate: formData.start_date,
                dueDate: formData.due_date,
            };

            if (isEditing) {
                await updateProject(
                    project.id,
                    payload
                );
            } else {
                await createProject(payload);
            }

            onSaved();
        } catch (error: any) {
            console.error(error);

            if (error.response?.status === 422) {
                setErrors(
                    error.response.data.errors ?? {}
                );
            } else {
                setErrors({
                    general: [
                        'Something went wrong. Please try again.',
                    ],
                });
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="project-form-wrapper">
            <form
                className="project-form"
                onSubmit={handleSubmit}
            >
                {/* Header */}

                <div className="form-header">
                    <div>
                        <span className="form-eyebrow">
                            {isEditing
                                ? 'PROJECT SETTINGS'
                                : 'NEW PROJECT'}
                        </span>

                        <h2>
                            {isEditing
                                ? 'Edit Project'
                                : 'Create Project'}
                        </h2>

                        <p>
                            {isEditing
                                ? 'Update the project information below.'
                                : 'Add a new project to your tracker.'}
                        </p>
                    </div>
                </div>

                {/* General Error */}

                {errors.general && (
                    <div className="form-error">
                        {errors.general[0]}
                    </div>
                )}

                {/* Project Information */}

                <div className="form-section">
                    <div className="form-section-title">
                        Project Information
                    </div>

                    <div className="form-grid">
                        {/* Client */}

                        <div className="form-field">
                            <label htmlFor="client_name">
                                Client Name
                            </label>

                            <input
                                id="client_name"
                                name="client_name"
                                type="text"
                                placeholder="e.g. Acme Corporation"
                                value={
                                    formData.client_name
                                }
                                onChange={handleChange}
                            />

                            {errors.client_name && (
                                <span className="field-error">
                                    {
                                        errors.client_name[0]
                                    }
                                </span>
                            )}
                        </div>

                        {/* Project */}

                        <div className="form-field">
                            <label htmlFor="project_name">
                                Project Name
                            </label>

                            <input
                                id="project_name"
                                name="project_name"
                                type="text"
                                placeholder="e.g. Website Redesign"
                                value={
                                    formData.project_name
                                }
                                onChange={handleChange}
                            />

                            {errors.project_name && (
                                <span className="field-error">
                                    {
                                        errors.project_name[0]
                                    }
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Description */}

                    <div className="form-field">
                        <label htmlFor="description">
                            Description

                            <span className="optional">
                                Optional
                            </span>
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            placeholder="Briefly describe the project..."
                            value={
                                formData.description
                            }
                            onChange={handleChange}
                            rows={4}
                        />

                        {errors.description && (
                            <span className="field-error">
                                {
                                    errors.description[0]
                                }
                            </span>
                        )}
                    </div>
                </div>

                {/* Project Details */}

                <div className="form-section">
                    <div className="form-section-title">
                        Project Details
                    </div>

                    <div className="form-grid">
                        {/* Status */}

                        <div className="form-field">
                            <label htmlFor="status">
                                Status
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={handleChange}
                            >
                                <option value="Planning">
                                    Planning
                                </option>

                                <option value="In Progress">
                                    In Progress
                                </option>

                                <option value="On Hold">
                                    On Hold
                                </option>

                                <option value="Completed">
                                    Completed
                                </option>
                            </select>

                            {errors.status && (
                                <span className="field-error">
                                    {errors.status[0]}
                                </span>
                            )}
                        </div>

                        {/* Priority */}

                        <div className="form-field">
                            <label htmlFor="priority">
                                Priority
                            </label>

                            <select
                                id="priority"
                                name="priority"
                                value={
                                    formData.priority
                                }
                                onChange={handleChange}
                            >
                                <option value="Low">
                                    Low
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="High">
                                    High
                                </option>
                            </select>

                            {errors.priority && (
                                <span className="field-error">
                                    {
                                        errors.priority[0]
                                    }
                                </span>
                            )}
                        </div>

                        {/* Start Date */}

                        <div className="form-field">
                            <label htmlFor="start_date">
                                Start Date
                            </label>

                            <input
                                id="start_date"
                                name="start_date"
                                type="date"
                                value={
                                    formData.start_date
                                }
                                onChange={handleChange}
                            />

                            {errors.start_date && (
                                <span className="field-error">
                                    {
                                        errors.start_date[0]
                                    }
                                </span>
                            )}
                        </div>

                        {/* Due Date */}

                        <div className="form-field">
                            <label htmlFor="due_date">
                                Due Date
                            </label>

                            <input
                                id="due_date"
                                name="due_date"
                                type="date"
                                value={
                                    formData.due_date
                                }
                                onChange={handleChange}
                            />

                            {errors.due_date && (
                                <span className="field-error">
                                    {
                                        errors.due_date[0]
                                    }
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}

                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="save-button"
                        disabled={saving}
                    >
                        {saving
                            ? 'Saving...'
                            : isEditing
                              ? 'Update Project'
                              : 'Create Project'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProjectForm;
