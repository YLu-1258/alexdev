import React, { useState, useEffect } from 'react';
import '../css/Skills.css';
import { allPosts } from '../../blog/render/loadPosts';

interface Experience {
    company: string;
    skills?: string[];
}

interface Project {
    name: string;
    skills?: string[];
}

interface Publication {
    title: string;
    skills?: string[];
    tags?: string[];
}
interface Course {
    title: string;
    name: string;
    skills?: string[];
}

interface Semester {
    semester: string;
    courses: Course[];
}

interface CoursesData {
    courses: Semester[];
}

interface SkillCitation {
    type: 'experience' | 'project' | 'research' | 'course' | 'blog';
    name: string;
    displayName: string;
}

interface SkillMap {
    [skill: string]: SkillCitation[];
}

const Skills: React.FC = () => {
    const [skillMap, setSkillMap] = useState<SkillMap>({});
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        Promise.all([
            import('./experiences.json'),
            import('./projects.json'),
            import('./research.json'),
            import('./courses.json'),
        ]).then(([experiences, projects, research, coursesData]) => {
            const courses = coursesData.default as CoursesData;
            const map: SkillMap = {};

            // Collect skills from experiences
            experiences.default.experiences.forEach((exp: Experience) => {
                if (exp.skills) {
                    exp.skills.forEach((skill: string) => {
                        if (!map[skill]) map[skill] = [];
                        map[skill].push({
                            type: 'experience',
                            name: exp.company,
                            displayName: exp.company,
                        });
                    });
                }
            });

            // Collect skills from projects
            projects.default.projects.forEach((proj: Project) => {
                if (proj.skills) {
                    proj.skills.forEach((skill: string) => {
                        if (!map[skill]) map[skill] = [];
                        map[skill].push({
                            type: 'project',
                            name: proj.name,
                            displayName: proj.name,
                        });
                    });
                }
            });

            // Collect skills from research (using tags)
            research.default.publications.forEach((pub: Publication) => {
                const skills = pub.skills || pub.tags || [];
                skills.forEach((skill: string) => {
                    if (!map[skill]) map[skill] = [];
                    map[skill].push({
                        type: 'research',
                        name: pub.title,
                        displayName: pub.title,
                    });
                });
            });

            // Collect skills from courses
            courses.courses.forEach((semester: Semester) => {
                semester.courses.forEach((course: Course) => {
                    if (course.skills && course.skills.length > 0) {
                        course.skills.forEach((skill: string) => {
                            if (!map[skill]) map[skill] = [];
                            map[skill].push({
                                type: 'course',
                                name: `${course.title} (${course.name})`,
                                displayName: `${course.title}`,
                            });
                        });
                    }
                });
            });

            // Collect skills from blog post tags
            allPosts.forEach((post) => {
                const tags = post.skillTags || post.tags || [];
                tags.forEach((tag) => {
                    if (!map[tag]) map[tag] = [];
                    map[tag].push({
                        type: 'blog',
                        name: post.slug,
                        displayName: post.title,
                    });
                });
            });

            // Sort skills alphabetically
            const sortedMap: SkillMap = {};
            Object.keys(map)
                .sort()
                .forEach((skill) => {
                    sortedMap[skill] = map[skill];
                });

            setSkillMap(sortedMap);
        });
    }, []);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 200);
    }, []);

    const getCitationColor = (type: string) => {
        switch (type) {
            case 'experience':
                return '#4fc3f7';
            case 'project':
                return '#98c379';
            case 'research':
                return '#c678dd';
            case 'course':
                return '#e5c07b';
            case 'blog':
                return '#e06c75';
            default:
                return '#b0b0b0';
        }
    };

    const getCitationLabel = (type: string) => {
        switch (type) {
            case 'experience':
                return 'Experience';
            case 'project':
                return 'Project';
            case 'research':
                return 'Research';
            case 'course':
                return 'Course';
            case 'blog':
                return 'Blog';
            default:
                return 'Citation';
        }
    };

    return (
        <div className={`skills-page-container ${isVisible ? 'visible' : ''}`}>
            <h1 className="page-title">Skills</h1>
            <p className="page-blurb">Collected through equal parts curiosity, caffeine, and compiler errors.</p>

            <div className="skills-main-grid">
                {/* Skills cloud on the left */}
                <div className="skills-cloud">
                    <div className="skills-grid">
                        {Object.keys(skillMap).map((skill) => (
                            <button
                                key={skill}
                                className={`skill-cloud-tag ${selectedSkill === skill ? 'active' : ''}`}
                                onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
                            >
                                {skill}
                                <span className="skill-count">({skillMap[skill].length})</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Citations panel on the right */}
                <div className="citations-panel">
                    {selectedSkill ? (
                        <div className="citation-content">
                            <div className="citation-header">
                                <h2>{selectedSkill}</h2>
                                <button
                                    className="close-btn"
                                    onClick={() => setSelectedSkill(null)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="citations-list">
                                {skillMap[selectedSkill].map((citation, idx) => (
                                    <div
                                        key={idx}
                                        className="citation-item"
                                        style={{
                                            borderLeftColor: getCitationColor(citation.type),
                                        }}
                                    >
                                        <span
                                            className="citation-badge"
                                            style={{
                                                backgroundColor: getCitationColor(citation.type),
                                            }}
                                        >
                                            {getCitationLabel(citation.type)}
                                        </span>
                                        <p className="citation-name">{citation.displayName}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>Click on a skill to see where it's used</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Skills;