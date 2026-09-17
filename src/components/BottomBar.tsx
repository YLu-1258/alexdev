import React, { useEffect, useState } from "react";
import "./css/BottomBar.css";
import { Page } from "./types";
import About from "../content/portfolio/about.tsx";
import Awards from "../content/portfolio/awards.tsx";
import Projects from "../content/portfolio/projects.tsx";
import Skills from "../content/portfolio/skills.tsx";
import Courses from "../content/portfolio/courses.tsx";
import Experiences from "../content/portfolio/experiences.tsx";
import Research from "../content/portfolio/research.tsx";

import { FiInfo, FiAward, FiBriefcase, FiLayers, FiTool, FiBook, FiCheckSquare } from "react-icons/fi";
import type { IconType } from "react-icons";

interface BottomBarProps {
  handleCreateTab: (page: Page) => void;
}

type PageType = Page["type"];

const iconFor: Record<PageType, IconType> = {
  about: FiInfo,
  awards: FiAward,
  experience: FiBriefcase,
  projects: FiLayers,
  skills: FiTool,
  research: FiBook,
  courses: FiCheckSquare,
  blog: FiLayers,
};

const BottomBar: React.FC<BottomBarProps> = ({ handleCreateTab }) => {
  const pages: { title: string; type: PageType; element: React.ReactNode }[] = [
    { title: "About", type: "about", element: <About /> },
    { title: "Experience", type: "experience", element: <Experiences /> },
    { title: "Research", type: "research", element: <Research /> },
    { title: "Projects", type: "projects", element: <Projects /> },
    { title: "Skills", type: "skills", element: <Skills /> },
    { title: "Courses", type: "courses", element: <Courses /> },
    { title: "Awards", type: "awards", element: <Awards /> },
  ];

  const createPage = (p: (typeof pages)[number]): Page => ({
    title: p.title,
    type: p.type,
    path: `~/portfolio/${p.type}.tsx`,
    content: p.element,
  });

  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bottom-bar">
      <div className="buttons-container">
        {pages.map((p, i) => (
          <ResponsiveButton
            key={i}
            label={p.title}
            Icon={iconFor[p.type]}
            onClick={() => handleCreateTab(createPage(p))}
          />
        ))}
      </div>
      <div className="bottom-meta">
        <span className="bottom-shortcut">⌘K</span>
        <span className="bottom-clock">{time}</span>
      </div>
    </div>
  );
};

const ResponsiveButton: React.FC<{
  label: string;
  Icon: IconType;
  onClick: () => void;
}> = ({ label, Icon, onClick }) => {
  return (
    <div className="button" data-section={label.toLowerCase()} onClick={onClick}>
        <Icon className="bottom-icon" />
        <span className="label">{label}</span>
    </div>
    );
};

export default BottomBar;
