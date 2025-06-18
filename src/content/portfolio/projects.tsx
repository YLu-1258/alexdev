import React, { useState, useEffect } from 'react';
import '../css/Projects.css';

interface Project {
    name: string;
    description: string;
    language: string;
    url: string;
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

    console.log(projects);

    return (
        <div className={`projects-container ${isVisible ? "visible" : ""}`}>
            <h1 className="page-title">Projects</h1>
            <div className="projects-grid">
                {projects.projects.map((project, index) => (
                    // Make this div redict to project.url when clicked
                    <div key={index} className="project-card" onClick={() => window.location.href = project.url || '#'}>
                        <div className="card-left">
                            <img src={project.language || '/placeholder-image.png'} className="project-image" />
                        </div>
                        <div className="card-right">
                            <h2 className="project-title">{project.name}</h2>
                            <p className="project-details">{project.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;