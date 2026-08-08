import type { Project } from '../types/project';

interface ProjectDetailsModalProps {
    project: Project;
    onClose: () => void;
}

function ProjectDetailsModal({
    project,
    onClose,
}: ProjectDetailsModalProps) {
    const getStatusClass = () => {
        switch (project.status) {
            case 'Planning':
                return 'status-planning';

            case 'In Progress':
                return 'status-progress';

            case 'On Hold':
                return 'status-hold';

            case 'Completed':
                return 'status-completed';

            default:
                return '';
        }
    };

    const getPriorityClass = () => {
        switch (project.priority) {
            case 'High':
                return 'priority-high';

            case 'Medium':
                return 'priority-medium';

            case 'Low':
                return 'priority-low';

            default:
                return '';
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="project-details-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                {/* Header */}

                <div className="modal-header">
                    <div className="modal-header-content">
                        <span className="modal-eyebrow">
                            Project Details
                        </span>

                        <h2 className="modal-title">
                            {project.projectName}
                        </h2>

                        <p className="modal-client">
                            {project.clientName}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}

                <div className="modal-body">
                    {/* Description */}

                    <div className="modal-description-section">
                        <span className="modal-section-label">
                            Description
                        </span>

                        <p className="modal-description">
                            {project.description ||
                                'No description provided.'}
                        </p>
                    </div>

                    {/* Details */}

                    <div className="modal-details-grid">
                        {/* Client */}

                        <div className="modal-detail">
                            <span className="modal-detail-label">
                                Client
                            </span>

                            <span className="modal-detail-value">
                                {project.clientName}
                            </span>
                        </div>

                        {/* Project */}

                        <div className="modal-detail">
                            <span className="modal-detail-label">
                                Project
                            </span>

                            <span className="modal-detail-value">
                                {project.projectName}
                            </span>
                        </div>

                        {/* Status */}

                        <div className="modal-detail">
                            <span className="modal-detail-label">
                                Status
                            </span>

                            <span
                                className={`badge ${getStatusClass()}`}
                            >
                                {project.status}
                            </span>
                        </div>

                        {/* Priority */}

                        <div className="modal-detail">
                            <span className="modal-detail-label">
                                Priority
                            </span>

                            <span
                                className={`badge ${getPriorityClass()}`}
                            >
                                {project.priority}
                            </span>
                        </div>

                        {/* Start Date */}

                        <div className="modal-detail">
                            <span className="modal-detail-label">
                                Start Date
                            </span>

                            <span className="modal-detail-value">
                                {project.startDate}
                            </span>
                        </div>

                        {/* Due Date */}

                        <div className="modal-detail">
                            <span className="modal-detail-label">
                                Due Date
                            </span>

                            <span className="modal-detail-value">
                                {project.dueDate}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}

                <div className="modal-footer">
                    <button
                        type="button"
                        className="modal-footer-button"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetailsModal;