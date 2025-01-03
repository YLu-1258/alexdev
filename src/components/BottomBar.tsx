import React from 'react';
import './css/BottomBar.css';
import { Page } from './types';
import About from '../content/portfolio/about.tsx';
import Awards from '../content/portfolio/awards.tsx';
import Projects from '../content/portfolio/projects.tsx';
import Skills from '../content/portfolio/skills.tsx';
import Contact from '../content/portfolio/contact.tsx';
import Experiences from '../content/portfolio/experiences.tsx';

interface BottomBarProps {
    handleCreateTab: (page: Page) => void;
}
const BottomBar: React.FC<BottomBarProps> = ({handleCreateTab}) => {
    const pages = [
        { label: 'About', color: '#e06c75', element: <About /> },
        { label: 'Awards', color: '#de9a4b', element: <Awards /> },
        { label: 'Experience', color: '#f0db54', element: <Experiences /> },
        { label: 'Projects', color: '#98c379', element: <Projects /> },
        { label: 'skills', color: '#61afef', element: <Skills /> }
    ];

    const createPage = (label: string) => {
        let page : Page = {
            title: label,
            type: label.toLowerCase() as 'about' | 'awards' | 'projects' | 'skills' | 'contact',
            content: pages.find(page => page.label === label)?.element
        }
        return page

    }

    return (
        <div className="bottom-bar">
            <div className="buttons-container">
                {pages.map((page, index) => (
                    <div
                        key={index}
                        className="button"
                        style={{ backgroundColor: page.color }}
                        onClick={() => handleCreateTab(createPage(page.label))}
                    >
                        <span className="label">{page.label}</span>
                        <div className="arrow"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BottomBar;