import React from "react";
import {useState} from "react";
import { Tab } from "./types";
import "./css/TabBar.css";


interface TabBarProps {
    tabs: Tab[];
    onCloseTab: (id: string) => void;
    activeTabId: string;
    setActiveTabId: React.Dispatch<React.SetStateAction<string>>;
}

const TabBar: React.FC<TabBarProps> = ({
    tabs,
    onCloseTab,
    activeTabId,
    setActiveTabId
}) => {

    return (
        <div className="tab-bar">
            {tabs.map(tab => (
                    <div
                        key={tab.id}
                        className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
                        onClick={() => setActiveTabId(tab.id)}
                    >
                        {tab.title}
                        <button className="close-btn" onClick={() => onCloseTab(tab.id)}>x</button>
                    </div>
        ))}
        </div>
    );
};

export default TabBar;