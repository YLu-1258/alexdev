import React, { useState, useEffect } from 'react';
import '../css/Experiences.css';

interface Experience {
    company: string;
    position: string;
    description: string[];
    years: string;
    picture?: string;
    skills?: string[];
}

interface Experiences {
    experiences: Experience[];
}

const Experiences: React.FC = () => {
    const [experiences, setExperiences] = useState<Experiences>({ experiences: [] });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        import(`./experiences.json`)
            .then((content) => setExperiences(content.default))
            .catch((error) => console.error("Failed to load Experiences.json:", error));
    }, []);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 200);
    }, []);

    return (
        <div className={`experiences-container ${isVisible ? "visible" : ""}`}>
            <h1 className="page-title">Experience</h1>
            <p className="page-blurb">Where ideas met deadlines and somehow both survived.</p>
            <div className="experiences-grid">
                {experiences.experiences.map((experience, index) => (
                    <div
                        key={index}
                        className="timeline-item"
                        style={{ '--i': index } as React.CSSProperties}
                    >
                        <div className="timeline-dot" />
                        <div className="experience-card">
                            <div className="card-left">
                                <img src={experience.picture || '/placeholder-image.png'} alt={experience.company} className="experience-image" />
                            </div>
                            <div className="card-right">
                                <h2 className="experience-title">{experience.company}</h2>
                                <span className="experience-years">{experience.years}</span>
                                <h4 className="experience-position">{experience.position}</h4>
                                <ul className="experience-details">
                                    {experience.description.map((description, i) => (
                                        <li className="experience-description" key={i}>{description}</li>
                                    ))}
                                </ul>
                                {experience.skills && experience.skills.length > 0 && (
                                    <div className="experience-skills">
                                        {experience.skills.map((skill, i) => (
                                            <span key={i} className="experience-skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Experiences;
