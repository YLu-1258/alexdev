import React, { useRef, useEffect, useState, useCallback } from "react";
import "./css/BottomBar.css";
import { Page } from "./types";
import About from "../content/portfolio/about.tsx";
import Awards from "../content/portfolio/awards.tsx";
import Projects from "../content/portfolio/projects.tsx";
import Skills from "../content/portfolio/skills.tsx";
import Experiences from "../content/portfolio/experiences.tsx";

import { FiInfo, FiAward, FiBriefcase, FiLayers, FiTool } from "react-icons/fi";
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
  blog: FiLayers, // not used here; keep TS happy if blog exists in your union
};

const BottomBar: React.FC<BottomBarProps> = ({ handleCreateTab }) => {
  const pages: { title: string; type: PageType; color: string; element: React.ReactNode }[] = [
    { title: "About", type: "about", color: "#e06c75", element: <About /> },
    { title: "Awards", type: "awards", color: "#de9a4b", element: <Awards /> },
    { title: "Experience", type: "experience", color: "#f0db54", element: <Experiences /> },
    { title: "Projects", type: "projects", color: "#98c379", element: <Projects /> },
    { title: "Skills", type: "skills", color: "#61afef", element: <Skills /> },
  ];

  const createPage = (p: (typeof pages)[number]): Page => ({
    title: p.title,
    type: p.type,
    content: p.element,
  });

  return (
    <div className="bottom-bar">
      <div className="buttons-container">
        {pages.map((p, i) => (
          <ResponsiveButton
            key={i}
            label={p.title}
            color={p.color}
            Icon={iconFor[p.type]}
            onClick={() => handleCreateTab(createPage(p))}
          />
        ))}
      </div>
    </div>
  );
};

const ResponsiveButton: React.FC<{
  label: string;
  color: string;
  Icon: IconType;
  onClick: () => void;
}> = ({ label, color, Icon, onClick }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [showLabel, setShowLabel] = useState(true);

  const updateLabelVisibility = useCallback(() => {
    const buttonElement = buttonRef.current;
    const labelElement = labelRef.current;
    if (!buttonElement || !labelElement) return;

    setShowLabel(buttonElement.clientWidth > 2 * labelElement.scrollWidth);
  }, []);

  useEffect(() => {
    updateLabelVisibility();
    window.addEventListener("resize", updateLabelVisibility);
    return () => window.removeEventListener("resize", updateLabelVisibility);
  }, [updateLabelVisibility]);

  return (
    <div className="button" ref={buttonRef} style={{ backgroundColor: color }} onClick={onClick}>
        <Icon className="bottom-icon" />
        <span className="label" ref={labelRef} style={{ display: showLabel ? "inline" : "none" }}>
        {label}
        </span>
    </div>
    );
};

export default BottomBar;
