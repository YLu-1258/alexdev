import React, { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import '../css/About.css';

const ROLES = [
    "ML Researcher",
    "Software Engineer",
    "Berkeley EECS Student",
    "Open-Source Contributor",
    "Systems Programmer",
];

const About: React.FC = () => {
    const [aboutContent, setAboutContent] = useState<{
        picture: string;
        title: string;
        description: string;
        extras: string;
    }>({ picture: "", title: "", description: "", extras: "" });

    useEffect(() => {
        import(`./about.json`).then((content) => {
            setAboutContent(content.default);
        });
    }, []);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 200);
    }, []);

    const [roleIdx, setRoleIdx] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const role = ROLES[roleIdx];
        let id: ReturnType<typeof setTimeout>;
        if (!isDeleting && displayed === role) {
            id = setTimeout(() => setIsDeleting(true), 1800);
        } else if (isDeleting && displayed === '') {
            setIsDeleting(false);
            setRoleIdx(i => (i + 1) % ROLES.length);
        } else if (isDeleting) {
            id = setTimeout(() => setDisplayed(d => d.slice(0, -1)), 40);
        } else {
            id = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 90);
        }
        return () => clearTimeout(id);
    }, [displayed, isDeleting, roleIdx]);

    return (
        <div className={`about-container ${isVisible ? "visible" : ""}`}>
            <div className="about-hero">
                <div className="about-hero-text">
                    <div className="about-kicker">
                        <span>00</span>
                        <span>ML research / software engineering</span>
                        <span>Berkeley, California</span>
                    </div>
                    <h1 className="about-title">{aboutContent.title}</h1>
                    <div className="about-role">
                        <span className="role-text">{displayed}</span>
                        <span className="role-cursor" aria-hidden="true">|</span>
                    </div>
                    <p className="about-description">{aboutContent.description}</p>
                    <p className="about-extras">{aboutContent.extras}</p>
                    <div className="about-actions">
                        <a className="about-primary-action" href="/downloads/Alex_Lu_Resume.pdf" target="_blank" rel="noopener noreferrer">
                            View résumé <span aria-hidden="true">↗</span>
                        </a>
                        <a className="about-secondary-action" href="mailto:alexander.lu@berkeley.edu">
                            Get in touch
                        </a>
                    </div>
                    <div className="contact-icons">
                        <a
                            href="https://github.com/YLu-1258"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-icon github"
                            aria-label="GitHub"
                        >
                            <FaGithub />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/alexanderlu1258/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-icon linkedin"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedin />
                        </a>
                        <a
                            href="mailto:alexander.lu@berkeley.edu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-icon email"
                            aria-label="Email"
                        >
                            <FaEnvelope />
                        </a>
                    </div>
                </div>
                <div className="about-hero-photo">
                    <img
                        src={aboutContent.picture}
                        alt="Headshot"
                        className="about-headshot"
                    />
                </div>
            </div>
        </div>
    );
};

export default About;
