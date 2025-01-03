import React, { useState, useEffect } from 'react';
import '../css/Awards.css';
interface Award {
    title: string;
    award: string;
    years: string;
    picture?: string;
}

interface Awards {
    awards: Award[];
}

const Awards: React.FC = () => {
    const [awards, setAwards] = useState<Awards>({ awards: [] });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        import(`./awards.json`)
            .then((content) => setAwards(content.default))
            .catch((error) => console.error("Failed to load awards.json:", error));
    }, []);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 200);
    }, []);

    console.log(awards);

    return (
        <div className={`awards-container ${isVisible ? "visible" : ""}`}>
            <h1 className="page-title">Awards</h1>
            <div className="awards-grid">
                {awards.awards.map((award, index) => (
                    <div key={index} className="award-card">
                        <div className="card-left">
                            <img src={award.picture || '/placeholder-image.png'} alt={award.title} className="award-image" />
                        </div>
                        <div className="card-right">
                            <h2 className="award-title">{award.title}</h2>
                            <p className="award-details">{award.award}</p>
                            <p className="award-years">{award.years}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Awards;