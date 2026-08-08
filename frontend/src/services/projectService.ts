import axios from 'axios';
import type { Project } from '../types/project';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

interface ProjectResponse {
  data: Project;
}

interface ProjectsResponse {
  data: Project[];
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<ProjectsResponse>('/projects');

  return response.data.data;
};

export const createProject = async (
  project: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Promise<Project> => {
  const response = await api.post<ProjectResponse>('/projects', project);

  return response.data.data;
};

export const updateProject = async (
  id: number,
  project: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Promise<Project> => {
  const response = await api.put<ProjectResponse>(
    `/projects/${id}`,
    project
  );

  return response.data.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
};