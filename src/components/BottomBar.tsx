import React, { useRef, useEffect, useState, useCallback } from 'react';
import './css/BottomBar.css';
import { Page } from './types';
import About from '../content/portfolio/about.tsx';
import Awards from '../content/portfolio/awards.tsx';
import Projects from '../content/portfolio/projects.tsx';
import Skills from '../content/portfolio/skills.tsx';
import Experiences from '../content/portfolio/experiences.tsx';

interface BottomBarProps {
    handleCreateTab: (page: Page) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ handleCreateTab }) => {
    const pages = [
        { label: 'ℹ️About', color: '#e06c75', element: <About />, icon: 'ℹ️' },
        { label: '🏆Awards', color: '#de9a4b', element: <Awards />, icon: '🏆' },
        { label: '💼Experience', color: '#f0db54', element: <Experiences />, icon: '💼' },
        { label: '📁Projects', color: '#98c379', element: <Projects />, icon: '📁' },
        { label: '🛠️Skills', color: '#61afef', element: <Skills />, icon: '🛠️' },
    ];

    const createPage = (label: string) => {
        const page: Page = {
            title: label,
            type: label.toLowerCase() as 'about' | 'awards' | 'projects' | 'skills',
            content: pages.find(page => page.label === label)?.element,
        };
        return page;
    };

    return (
        <div className="bottom-bar">
            <div className="buttons-container">
                {pages.map((page, index) => (
                    <ResponsiveButton
                        key={index}
                        label={page.label}
                        color={page.color}
                        icon={page.icon}
                        onClick={() => handleCreateTab(createPage(page.label))}
                    />
                ))}
            </div>
        </div>
    );
};

const ResponsiveButton: React.FC<{
    label: string;
    color: string;
    icon: string;
    onClick: () => void;
}> = ({ label, color, icon, onClick }) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const [showLabel, setShowLabel] = useState(true);

    const updateLabelVisibility = useCallback(() => {
        const buttonElement = buttonRef.current;
        const labelElement = labelRef.current;

        if (buttonElement && labelElement) {
            // Check if the label's scroll width is greater than the button's client width
            setShowLabel(buttonElement.clientWidth > 2*labelElement.scrollWidth);
        }
    }, []);

    useEffect(() => {
        updateLabelVisibility(); // Initial check
        window.addEventListener('resize', updateLabelVisibility);
        return () => {
            window.removeEventListener('resize', updateLabelVisibility);
        };
    }, [updateLabelVisibility]);

    return (
        <div
            className="button"
            ref={buttonRef}
            style={{ backgroundColor: color }}
            onClick={onClick}
        >
            <span className="label" ref={labelRef}>
                {showLabel ? label : icon}
            </span>
        </div>
    );
};

export default BottomBar;
