import React, { useState, useEffect } from 'react';
import '../css/Experiences.css'; // Create this CSS file for styling

interface Experience {
    company: string;
    position: string;
    description: string[];
    years: string;
    picture?: string;
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

    console.log(Experiences);

    return (
        <div className={`experiences-container ${isVisible ? "visible" : ""}`}>
            <h1 className="page-title">Experiences</h1>
            <div className="Experiences-grid">
                {experiences.experiences.map((experience, index) => (
                    <div key={index} className="experience-card">
                        <div className="card-left">
                            <img src={experience.picture || '/placeholder-image.png'} alt={experience.company} className="experience-image" />
                        </div>
                        <div className="card-right">
                            <h2 className="experience-title">{experience.company}: {experience.years}</h2>
                            <h4 className="experience-position">{experience.position}</h4>
                            <ul className="experience-details">
                                {experience.description.map((description, index) => (
                                    <li className="experience-description" key={index}>{description}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Experiences;