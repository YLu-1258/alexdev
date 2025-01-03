import React, { useState, useRef } from 'react';
import Header from './components/Header';
import FileTree from './components/FileTree';
import MainDisplay from './components/MainDisplay';
import BottomBar from './components/BottomBar';
import './App.css';
import { Tab, Page } from './components/types';

const App: React.FC = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(100);
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [activeTabId, setActiveTabId] = useState<string>("0");
    const appRef = useRef<HTMLDivElement>(null);

    const startResizing = React.useCallback(() => {
        setIsResizing(true);
      }, []);
    
      const stopResizing = React.useCallback(() => {
        setIsResizing(false);
      }, []);
    
      const resize = React.useCallback(
        (mouseMoveEvent : any) => {
          if (isResizing && sidebarRef.current) {
            setSidebarWidth(
              mouseMoveEvent.clientX -
                sidebarRef.current.getBoundingClientRect().left
            );
          }
        },
        [isResizing]
      );
    
      React.useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
          window.removeEventListener("mousemove", resize);
          window.removeEventListener("mouseup", stopResizing);
        };
      }, [resize, stopResizing]);

    const handleFileSelect = (file: { id: string; name: string; content: React.ReactNode }) => {
      return file;
    };

    const handleCreateTab = async (page: Page) => {
        // Check if the tab is already open
        let foundTab = tabs.find(tab => tab.title === page.title);
        if (foundTab) {
            setActiveTabId(foundTab.id);
            return;
        }
        const newTab: Tab = {
            id: Date.now().toString(),
            title: page.title,
            type: page.type,
            content: page.content,
        };
        setTabs(prevTabs => [...prevTabs, newTab]);
        setActiveTabId(newTab.id);
    };

    return (
        <div className="app" ref={appRef}>
            <Header />
            <div className="main-layout">

                <div
                    ref={sidebarRef}
                    className="app-sidebar"
                    style={{ width: sidebarWidth }}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <div className="app-sidebar-content">
                        <FileTree onFileSelect={handleFileSelect} />
                    </div>
                    <div className="app-sidebar-resizer" onMouseDown={startResizing} />
                </div>


                <MainDisplay
                    tabs={tabs}
                    setTabs={setTabs}
                    activeTabId={activeTabId}
                    setActiveTabId={setActiveTabId}
                />
            </div>
            <BottomBar handleCreateTab={handleCreateTab} />
        </div>
    );
};

export default App;
