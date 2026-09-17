import React, { useState, useEffect } from 'react';
import '../css/Skills.css';
import { allPosts } from '../../blog/render/loadPosts';
import { FiArrowRight, FiSearch, FiX } from 'react-icons/fi';

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
    const [query, setQuery] = useState('');
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

    const skillEntries = Object.entries(skillMap);
    const visibleSkills = skillEntries.filter(([skill]) =>
        skill.toLowerCase().includes(query.trim().toLowerCase())
    );
    const totalCitations = skillEntries.reduce((total, [, citations]) => total + citations.length, 0);
    const popularSkills = [...skillEntries]
        .sort(([, a], [, b]) => b.length - a.length)
        .slice(0, 5);

    return (
        <div className={`skills-page-container ${isVisible ? 'visible' : ''}`}>
            <h1 className="page-title">Skills</h1>
            <p className="page-blurb">Select a skill to see where it appears across my work.</p>

            <div className="skills-toolbar">
                <div className="skills-summary" aria-label={`${skillEntries.length} skills across ${totalCitations} references`}>
                    <span>Skill index</span>
                    <strong>{skillEntries.length}</strong>
                    <span className="summary-divider" aria-hidden="true" />
                    <span>{totalCitations} references</span>
                </div>
                <label className="skills-search">
                    <FiSearch aria-hidden="true" />
                    <span className="sr-only">Filter skills</span>
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Filter skills..."
                    />
                </label>
            </div>

            <div className="skills-main-grid">
                <div className="skills-cloud">
                    <div className="skills-grid">
                        {visibleSkills.map(([skill, citations]) => (
                            <button
                                key={skill}
                                className={`skill-cloud-tag ${selectedSkill === skill ? 'active' : ''}`}
                                onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
                                aria-pressed={selectedSkill === skill}
                            >
                                <span className="skill-name">{skill}</span>
                                <span className="skill-count">{citations.length}</span>
                            </button>
                        ))}
                    </div>
                    {visibleSkills.length === 0 && (
                        <div className="skills-no-results">No skills match “{query}”.</div>
                    )}
                </div>

                <div className="citations-panel" aria-live="polite">
                    {selectedSkill ? (
                        <div className="citation-content">
                            <div className="citation-header">
                                <div>
                                    <span className="panel-eyebrow">Used in {skillMap[selectedSkill].length} places</span>
                                    <h2>{selectedSkill}</h2>
                                </div>
                                <button
                                    className="citation-close-btn"
                                    onClick={() => setSelectedSkill(null)}
                                    aria-label="Clear selected skill"
                                >
                                    <FiX aria-hidden="true" />
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
                            <div className="empty-state-mark" aria-hidden="true">↳</div>
                            <span className="panel-eyebrow">Skill explorer</span>
                            <h2>Trace a skill through the portfolio.</h2>
                            <p>Choose any skill to see the projects, research, courses, and roles where I used it.</p>
                            <div className="popular-skills">
                                <span>Most connected</span>
                                {popularSkills.map(([skill, citations]) => (
                                    <button key={skill} onClick={() => setSelectedSkill(skill)}>
                                        <span>{skill}</span>
                                        <span>{citations.length}</span>
                                        <FiArrowRight aria-hidden="true" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Skills;
