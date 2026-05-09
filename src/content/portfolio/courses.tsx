import React, { useEffect, useState } from 'react';
import '../css/Courses.css';

interface Course {
    title: string;
    name: string;
    grade: string;
    skills?: string[];
}

interface Semester {
    semester: string;
    courses: Course[];
}

interface CoursesData {
    courses: Semester[];
}

const Courses: React.FC = () => {
    const [data, setData] = useState<CoursesData>({ courses: [] });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        import('./courses.json')
            .then((content) => setData(content.default))
            .catch((error) => console.error('Failed to load courses.json:', error));
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => setIsVisible(true), 200);
        return () => window.clearTimeout(timeout);
    }, []);

    return (
        <div className={`courses-page-container ${isVisible ? 'visible' : ''}`}>
            <h1 className="page-title">Courses</h1>
            <p className="page-blurb">Turns out office hours and group chats are both educational technologies.</p>
            <p className="courses-intro">Grades and the skills each class helped build.</p>

            <div className="courses-semesters">
                {data.courses.map((semester) => (
                    <section key={semester.semester} className="semester-card">
                        <div className="semester-header">
                            <h2>{semester.semester}</h2>
                            <span className="semester-count">{semester.courses.length} courses</span>
                        </div>

                        <div className="semester-courses">
                            {semester.courses.map((course) => (
                                <article key={course.title} className="course-card">
                                    <div className="course-topline">
                                        <div>
                                            <h3 className="course-title">{course.title}</h3>
                                            <p className="course-name">{course.name}</p>
                                        </div>
                                        <span className="course-grade">{course.grade}</span>
                                    </div>

                                    {course.skills && course.skills.length > 0 && (
                                        <div className="course-skills">
                                            {course.skills.map((skill) => (
                                                <span key={skill} className="course-skill-tag">{skill}</span>
                                            ))}
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default Courses;