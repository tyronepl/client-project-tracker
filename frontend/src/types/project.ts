export type ProjectStatus =
  | 'Planning'
  | 'In Progress'
  | 'On Hold'
  | 'Completed';

export type ProjectPriority = 'Low' | 'Medium' | 'High';

export interface Project {
  id: number;
  clientName: string;
  projectName: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  dueDate: string;
  createdAt?: string;
  updatedAt?: string;
}