import React, { useState, useEffect } from 'react';
import '../css/Skills.css';

interface Skills {
    Technicals: string[];
    Programming: string[];
    Frameworks: string[];
    Tools: string[];
}

interface Course {
    title: string;
    name: string;
    grade: string;
}
interface Semester {
    semester: string;
    courses: Course[];
}

interface Courses {
    courses: Semester[];
}

const Skills: React.FC = () => {
    const [skills, setSkills] = useState<Skills>({
        Technicals: [],
        Programming: [],
        Frameworks: [],
        Tools: []
    });
    const [courses, setCourses] = useState<Courses>({ courses: [] });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        import(`./skills.json`)
            .then((content) => setSkills(content.default))
            .catch((error) => console.error("Failed to load skills.json:", error));

        import(`./courses.json`)
            .then((content) => setCourses(content.default))
            .catch((error) => console.error("Failed to load courses.json:", error));
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

            <div className="courses-container">
                <h1 className="courses-title">Courses</h1>
                <div className="courses-grid">
                    {courses.courses.map((semester) => (
                        <div key={semester.semester} className="semester-card">
                            <h3 className="semester-title">{semester.semester}</h3>
                            <ul className="course-list">
                                {semester.courses.map((course, index) => (
                                    <li key={index} className="course-item">
                                        <p className="course"><span className="course-title">{course.title}</span>: {course.name}</p>
                                        <span className="course-grade">({course.grade})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Skills;