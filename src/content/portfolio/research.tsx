import React, { useState, useEffect } from 'react';
import '../css/Research.css';

interface Publication {
    title: string;
    venue: string;
    status: string;
    date: string;
    authors: string;
    description: string;
    arxiv: string;
    tags: string[];
}

interface ResearchData {
    publications: Publication[];
}

const Research: React.FC = () => {
    const [data, setData] = useState<ResearchData>({ publications: [] });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        import('./research.json')
            .then((content) => setData(content.default))
            .catch((error) => console.error('Failed to load research.json:', error));
    }, []);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 200);
    }, []);

    return (
        <div className={`research-container ${isVisible ? 'visible' : ''}`}>
            <h1 className="page-title">Research</h1>
            <p className="page-blurb">Asking tiny questions until they become large experiments.</p>
            <div className="research-grid">
                {data.publications.map((pub, index) => (
                    <div key={index} className="pub-card">
                        <div className="pub-badges">
                            <span className="pub-venue">{pub.venue}</span>
                            <span className={`pub-status pub-status--${pub.status.toLowerCase().replace(' ', '-')}`}>
                                {pub.status}
                            </span>
                        </div>

                        <h2 className="pub-title">
                            {pub.arxiv ? (
                                <a href={pub.arxiv} target="_blank" rel="noopener noreferrer" className="pub-title-link">
                                    {pub.title}
                                </a>
                            ) : pub.title}
                        </h2>

                        <p className="pub-meta">{pub.authors} &middot; {pub.date}</p>

                        <p className="pub-description">{pub.description}</p>

                        {pub.tags.length > 0 && (
                            <div className="pub-tags">
                                {pub.tags.map((tag, i) => (
                                    <span key={i} className="pub-tag">{tag}</span>
                                ))}
                            </div>
                        )}

                        {pub.arxiv && (
                            <a href={pub.arxiv} target="_blank" rel="noopener noreferrer" className="pub-arxiv-link">
                                ↗ arXiv
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Research;
