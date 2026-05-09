import React, { useState, useEffect } from 'react';
import '../css/Projects.css';

interface Project {
    name: string;
    description: string;
    language: string;
    url: string;
    skills?: string[];
}

interface Projects {
    projects: Project[];
}

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Projects>({ projects: [] });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        import(`./projects.json`)
            .then((content) => setProjects(content.default))
            .catch((error) => console.error("Failed to load projects.json:", error));
    }, []);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 200);
    }, []);

    return (
        <div className={`projects-container ${isVisible ? "visible" : ""}`}>
            <h1 className="page-title">Projects</h1>
            <p className="page-blurb">Built for fun, utility, and occasional controlled chaos.</p>
            <div className="projects-grid">
                {projects.projects.map((project, index) => (
                    <div
                        key={index}
                        className="project-card"
                        style={{ '--i': index } as React.CSSProperties}
                        onClick={() => window.open(project.url || '#', '_blank')}
                    >
                        <div className="card-left">
                            <img src={project.language || '/placeholder-image.png'} className="project-image" />
                        </div>
                        <div className="card-right">
                            <h2 className="project-title">{project.name}</h2>
                            <p className="project-details">{project.description}</p>
                            {project.skills && project.skills.length > 0 && (
                                <div className="project-skills">
                                    {project.skills.map((skill, i) => (
                                        <span key={i} className="project-skill-tag">{skill}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
