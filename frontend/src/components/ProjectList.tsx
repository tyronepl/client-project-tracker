import { useEffect, useMemo, useState } from 'react';
import type { Project } from '../types/project';
import {
    deleteProject,
    getProjects,
} from '../services/projectService';

interface ProjectListProps {
    onEdit: (project: Project) => void;
    onView: (project: Project) => void;
    onCreate: () => void;
    refreshTrigger: number;
}

type SortField =
    | 'id'
    | 'clientName'
    | 'projectName'
    | 'status'
    | 'priority'
    | 'startDate'
    | 'dueDate';

type SortDirection = 'asc' | 'desc';

function ProjectList({
    onEdit,
    onView,
    onCreate,
    refreshTrigger,
}: ProjectListProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');

    // Sorting
    const [sortField, setSortField] =
        useState<SortField>('id');

    const [sortDirection, setSortDirection] =
        useState<SortDirection>('desc');

    const loadProjects = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await getProjects();

            setProjects(data);
        } catch (error) {
            console.error(error);
            setError('Failed to load projects.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, [refreshTrigger]);

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this project?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteProject(id);

            setProjects((currentProjects) =>
                currentProjects.filter(
                    (project) => project.id !== id
                )
            );
        } catch (error) {
            console.error(error);
            setError('Failed to delete project.');
        }
    };

    /*
     * Filter and sort projects
     */
    const filteredProjects = useMemo(() => {
        const searchTerm = search
            .trim()
            .toLowerCase();

        const result = projects.filter((project) => {
            const matchesSearch =
                searchTerm === '' ||
                project.clientName
                    .toLowerCase()
                    .includes(searchTerm) ||
                project.projectName
                    .toLowerCase()
                    .includes(searchTerm) ||
                (project.description ?? '')
                    .toLowerCase()
                    .includes(searchTerm);

            const matchesStatus =
                statusFilter === 'All' ||
                project.status === statusFilter;

            const matchesPriority =
                priorityFilter === 'All' ||
                project.priority === priorityFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        });

        result.sort((a, b) => {
            let valueA = '';
            let valueB = '';

            switch (sortField) {
                case 'id':
                    valueA = String(a.id);
                    valueB = String(b.id);
                    break;

                case 'clientName':
                    valueA = a.clientName;
                    valueB = b.clientName;
                    break;

                case 'projectName':
                    valueA = a.projectName;
                    valueB = b.projectName;
                    break;

                case 'status':
                    valueA = a.status;
                    valueB = b.status;
                    break;

                case 'priority':
                    valueA = a.priority;
                    valueB = b.priority;
                    break;

                case 'startDate':
                    valueA = a.startDate;
                    valueB = b.startDate;
                    break;

                case 'dueDate':
                    valueA = a.dueDate;
                    valueB = b.dueDate;
                    break;
            }

            const comparison = valueA.localeCompare(
                valueB,
                undefined,
                {
                    numeric: true,
                    sensitivity: 'base',
                }
            );

            return sortDirection === 'asc'
                ? comparison
                : -comparison;
        });

        return result;
    }, [
        projects,
        search,
        statusFilter,
        priorityFilter,
        sortField,
        sortDirection,
    ]);

    /*
     * Handle column sorting
     */
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection((current) =>
                current === 'asc'
                    ? 'desc'
                    : 'asc'
            );

            return;
        }

        setSortField(field);
        setSortDirection('asc');
    };

    /*
     * Sorting indicator
     */
    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return '↕';
        }

        return sortDirection === 'asc'
            ? '↑'
            : '↓';
    };

    /*
     * Clear all filters
     */
    const clearFilters = () => {
        setSearch('');
        setStatusFilter('All');
        setPriorityFilter('All');
    };

    const hasActiveFilters =
        search !== '' ||
        statusFilter !== 'All' ||
        priorityFilter !== 'All';

    if (loading) {
        return (
            <div className="loading-state">
                Loading projects...
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-state">
                <p>{error}</p>

                <button onClick={loadProjects}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="project-list">

            {/* Header */}

            <div className="project-list-header">
                <div>
                    <h2>Projects</h2>

                    <p>
                        {filteredProjects.length}{' '}
                        {filteredProjects.length === 1
                            ? 'project'
                            : 'projects'}{' '}
                        shown
                    </p>
                </div>

                <button
                    className="new-project-button"
                    onClick={onCreate}
                >
                    + New Project
                </button>
            </div>

            {/* Search and Filters */}

            <div className="project-filters">

                <div className="search-wrapper">
                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(
                            event.target.value
                        )
                    }
                >
                    <option value="All">
                        All Statuses
                    </option>

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

                <select
                    value={priorityFilter}
                    onChange={(event) =>
                        setPriorityFilter(
                            event.target.value
                        )
                    }
                >
                    <option value="All">
                        All Priorities
                    </option>

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

                {hasActiveFilters && (
                    <button
                        className="clear-filters-button"
                        onClick={clearFilters}
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* No Results */}

            {filteredProjects.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        🔎
                    </div>

                    <h3>
                        No matching projects
                    </h3>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>

                                <th
                                    className="sortable"
                                    onClick={() =>
                                        handleSort(
                                            'clientName'
                                        )
                                    }
                                >
                                    Client{' '}
                                    {getSortIcon(
                                        'clientName'
                                    )}
                                </th>

                                <th
                                    className="sortable"
                                    onClick={() =>
                                        handleSort(
                                            'projectName'
                                        )
                                    }
                                >
                                    Project{' '}
                                    {getSortIcon(
                                        'projectName'
                                    )}
                                </th>

                                <th
                                    className="sortable"
                                    onClick={() =>
                                        handleSort(
                                            'status'
                                        )
                                    }
                                >
                                    Status{' '}
                                    {getSortIcon(
                                        'status'
                                    )}
                                </th>

                                <th
                                    className="sortable"
                                    onClick={() =>
                                        handleSort(
                                            'priority'
                                        )
                                    }
                                >
                                    Priority{' '}
                                    {getSortIcon(
                                        'priority'
                                    )}
                                </th>

                                <th
                                    className="sortable"
                                    onClick={() =>
                                        handleSort(
                                            'startDate'
                                        )
                                    }
                                >
                                    Start Date{' '}
                                    {getSortIcon(
                                        'startDate'
                                    )}
                                </th>

                                <th
                                    className="sortable"
                                    onClick={() =>
                                        handleSort(
                                            'dueDate'
                                        )
                                    }
                                >
                                    Due Date{' '}
                                    {getSortIcon(
                                        'dueDate'
                                    )}
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>
                        </thead>

                        <tbody>
                            {filteredProjects.map(
                                (project) => (
                                    <tr
                                        key={
                                            project.id
                                        }
                                    >

                                        <td>
                                            <span className="client-name">
                                                {
                                                    project.clientName
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            <div className="project-cell">

                                                <div className="project-name">
                                                    {
                                                        project.projectName
                                                    }
                                                </div>

                                                {project.description && (
                                                    <div className="project-description">
                                                        {
                                                            project.description
                                                        }
                                                    </div>
                                                )}

                                            </div>
                                        </td>

                                        <td>
                                            <span
                                                className={`badge ${
                                                    project.status ===
                                                    'Planning'
                                                        ? 'status-planning'
                                                        : project.status ===
                                                            'In Progress'
                                                          ? 'status-progress'
                                                          : project.status ===
                                                              'On Hold'
                                                            ? 'status-hold'
                                                            : 'status-completed'
                                                }`}
                                            >
                                                {
                                                    project.status
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`badge ${
                                                    project.priority ===
                                                    'High'
                                                        ? 'priority-high'
                                                        : project.priority ===
                                                            'Medium'
                                                          ? 'priority-medium'
                                                          : 'priority-low'
                                                }`}
                                            >
                                                {
                                                    project.priority
                                                }
                                            </span>
                                        </td>

                                        <td className="date-cell">
                                            {
                                                project.startDate
                                            }
                                        </td>

                                        <td className="date-cell">
                                            {
                                                project.dueDate
                                            }
                                        </td>

                                        <td>
                                            <div className="actions">

                                                <button
                                                    type="button"
                                                    className="action-button view-button"
                                                    onClick={() =>
                                                        onView(
                                                            project
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    type="button"
                                                    className="action-button edit-button"
                                                    onClick={() =>
                                                        onEdit(
                                                            project
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="action-button delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            project.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ProjectList;