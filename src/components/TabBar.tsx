import React, { useEffect, useRef } from "react";
import { Tab } from "./types";
import { FiFileText, FiInfo, FiAward, FiLayers, FiBriefcase, FiTool, FiX } from "react-icons/fi";
import "./css/TabBar.css";

interface TabBarProps {
  tabs: Tab[];
  onCloseTab: (id: string) => void;
  activeTabId: string;
  setActiveTabId: React.Dispatch<React.SetStateAction<string>>;
}

const iconFor = (type: Tab["type"]) => {
  switch (type) {
    case "blog":
      return <FiFileText className="tab-icon" />; // blog icon
    case "about":
      return <FiInfo className="tab-icon" />;
    case "awards":
      return <FiAward className="tab-icon" />;
    case "projects":
      return <FiLayers className="tab-icon" />;
    case "experience":
      return <FiBriefcase className="tab-icon" />;
    case "skills":
      return <FiTool className="tab-icon" />;
    default:
      return null;
  }
};

const TabBar: React.FC<TabBarProps> = ({ tabs, onCloseTab, activeTabId, setActiveTabId }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Optional: wheel scroll horizontally when hovering the bar (nice on mouse wheels)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // If user is scrolling vertically, translate into horizontal scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as any);
  }, []);

  return (
    <div className="tab-bar">
      <div className="tab-scroll" ref={scrollerRef}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTabId ? "active" : ""}`}
            onClick={() => setActiveTabId(tab.id)}
            title={tab.title}
          >
            {iconFor(tab.type)}
            <span className="tab-title">{tab.title}</span>

            <button
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab.id);
              }}
              aria-label="Close tab"
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabBar;