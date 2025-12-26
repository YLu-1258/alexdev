import React, { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import '../css/About.css';

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

    return (
        <div className={`about-container ${isVisible ? "visible" : ""}`}>
            <div className="about-header">
                <h1 className="about-title">{aboutContent.title}</h1>
                <img
                    src={aboutContent.picture}
                    alt="Headshot"
                    className="about-headshot"
                />
                
            </div>
            <p className="about-description">{aboutContent.description}</p>
            <p className="about-extras">{aboutContent.extras}</p>
            <div className="contact-icons">
                <a
                    href="https://github.com/YLu-1258"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-icon github"
                >
                    <FaGithub />
                </a>
                <a
                    href="https://www.linkedin.com/in/alexanderlu1258/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-icon linkedin"
                >
                    <FaLinkedin />
                </a>
                <a
                    href="https://twitter.com/your-profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-icon twitter"
                >
                    <FaTwitter />
                </a>
                <a
                    href="mailto:alexander.lu@berkeley.edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-icon email"
                >
                    <FaEnvelope />
                </a>
            </div>
        </div>
    );
};

export default About;
