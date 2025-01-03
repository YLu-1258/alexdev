import React, { useState, useEffect } from 'react';
import '../css/Skills.css';

interface Skills {
    technicals: string[];
    programming: string[];
    frameworks: string[];
    tools: string[];
}

interface Semester {
    semester: string;
    courses: string[];
}

interface Courses {
    courses: Semester[];
}
const Skills: React.FC = () => {
    const [skills, setSkills] = useState<Skills>({technicals: [], programming: [], frameworks: [], tools: []});
    const [courses, setCourses] = useState<Courses>({ courses: [] });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        import(`./skills.json`)
            .then((content) => setSkills(content.default))
            .catch((error) => console.error("Failed to load awards.json:", error));
        import(`./courses.json`)
            .then((content) => setCourses(content.default))
            .catch((error) => console.error("Failed to load awards.json:", error));
            
    }, []);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 200);
    }, []);

    return (
        <div className={`container ${isVisible ? "visible" : ""}`}>
            <div className="skills-container">
                <h1 className="skills-title">Skills</h1>
                {Object.entries(skills).map(([category, skillTags]) => (
                    <div key={category} className="skills-category">
                        <h3>{category}</h3>
                        <div className="skills-tags">
                            {skillTags.map((skill: string) => (
                                <span key={skill} className="skill-tag">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Skills;
