import axios from 'axios';
import type { Project } from '../types/project';

const api = axios.create({
    // baseURL: 'http://127.0.0.1:8000/api',
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export type ProjectFormData = {
    clientName: string;
    projectName: string;
    description: string;
    status: Project['status'];
    priority: Project['priority'];
    startDate: string;
    dueDate: string;
};

type ApiProject = {
    id: number;
    clientName: string;
    projectName: string;
    description: string | null;
    status: Project['status'];
    priority: Project['priority'];
    startDate: string;
    dueDate: string;
    created_at?: string;
    updated_at?: string;
};

const toApiPayload = (data: ProjectFormData) => ({
    client_name: data.clientName,
    project_name: data.projectName,
    description: data.description,
    status: data.status,
    priority: data.priority,
    start_date: data.startDate,
    due_date: data.dueDate,
});

const fromApiProject = (
    project: ApiProject
): Project => ({
    id: project.id,
    clientName: project.clientName,
    projectName: project.projectName,
    description: project.description ?? '',
    status: project.status,
    priority: project.priority,
    startDate: project.startDate,
    dueDate: project.dueDate,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
});

export const getProjects = async (): Promise<Project[]> => {
    const response = await api.get('/projects');

    return response.data.data.map(
        (project: ApiProject) => fromApiProject(project)
    );
};

export const getProject = async (
    id: number
): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);

    return fromApiProject(
        response.data.data
    );
};

export const createProject = async (
    data: ProjectFormData
): Promise<Project> => {
    const response = await api.post(
        '/projects',
        toApiPayload(data)
    );

    return fromApiProject(
        response.data.data
    );
};

export const updateProject = async (
    id: number,
    data: ProjectFormData
): Promise<Project> => {
    const response = await api.put(
        `/projects/${id}`,
        toApiPayload(data)
    );

    return fromApiProject(
        response.data.data
    );
};

export const deleteProject = async (
    id: number
): Promise<void> => {
    await api.delete(`/projects/${id}`);
};