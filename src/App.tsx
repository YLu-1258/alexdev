import React, { useState, useRef } from 'react';
import Header from './components/Header';
import FileTree from './components/FileTree';
import MainDisplay from './components/MainDisplay';
import BottomBar from './components/BottomBar';
import './App.css';
import { Tab, Page } from './components/types';
import About from './content/portfolio/about';
import Awards from './content/portfolio/awards';
import Projects from './content/portfolio/projects';
import Skills from './content/portfolio/skills';
import Courses from './content/portfolio/courses';
import Experiences from './content/portfolio/experiences';

import Research from './content/portfolio/research';
import BlogPostView from "./blog/render/BlogPostView";
import { getPost } from "./blog/render/loadPosts";

const MOBILE_BP = 768;
const THEME_KEY = 'alexdev-theme';
const FONT_KEY = 'alexdev-font';
const EFFECT_KEY = 'alexdev-effect';

type ThemeMode = 'dark' | 'light' | 'ocean' | 'sunset';
type FontMode = 'fira' | 'serif' | 'rounded';
type EffectMode = 'none' | 'glow' | 'grain';

const THEME_OPTIONS: ThemeMode[] = ['dark', 'light', 'ocean', 'sunset'];
const FONT_OPTIONS: FontMode[] = ['fira', 'serif', 'rounded'];
const EFFECT_OPTIONS: EffectMode[] = ['none', 'glow', 'grain'];

const getStored = <T extends string>(key: string, fallback: T, valid: readonly T[]): T => {
  if (typeof window === 'undefined') return fallback;
  const stored = window.localStorage.getItem(key) as T | null;
  return stored && valid.includes(stored) ? stored : fallback;
};

const App: React.FC = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);

  const [tabs, setTabs] = useState<Tab[]>([
    { id: "0", title: 'About', type: 'about', content: <About /> },
    { id: "1", title: 'Experience', type: 'experience', content: <Experiences /> },
    { id: "2", title: 'Research', type: 'research', content: <Research /> },
    { id: "3", title: 'Projects', type: 'projects', content: <Projects /> },
    { id: "4", title: 'Skills', type: 'skills', content: <Skills /> },
    { id: "5", title: 'Courses', type: 'courses', content: <Courses /> },
    { id: "6", title: 'Awards', type: 'awards', content: <Awards /> },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("0");
  const [theme, setTheme] = useState<ThemeMode>(() => getStored(THEME_KEY, 'dark', THEME_OPTIONS));
  const [font, setFont] = useState<FontMode>(() => getStored(FONT_KEY, 'fira', FONT_OPTIONS));
  const [effect, setEffect] = useState<EffectMode>(() => getStored(EFFECT_KEY, 'none', EFFECT_OPTIONS));

  // ✅ mobile detection (no window.innerWidth in render)
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= MOBILE_BP : false
  );

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_BP);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  React.useEffect(() => {
    window.localStorage.setItem(FONT_KEY, font);
  }, [font]);

  React.useEffect(() => {
    window.localStorage.setItem(EFFECT_KEY, effect);
  }, [effect]);

  const startResizing = React.useCallback(() => setIsResizing(true), []);
  const stopResizing = React.useCallback(() => setIsResizing(false), []);

  const resize = React.useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing && sidebarRef.current) {
        const left = sidebarRef.current.getBoundingClientRect().left;
        const next = mouseMoveEvent.clientX - left;
        // clamp
        setSidebarWidth(Math.max(180, Math.min(next, 480)));
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

  // Close drawer on Escape
  React.useEffect(() => {
    return undefined;
  }, []);

  const handleCreateTab = async (page: Page) => {
    const foundTab = tabs.find(tab => tab.title === page.title);
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
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleCreateBlog = (slug: string) => {
    const post = getPost(slug);
    if (!post) {
      const missing: Page = {
        title: `Missing post: ${slug}`,
        type: "blog",
        content: <div style={{ padding: 18 }}>Couldn’t find blog post: {slug}</div>,
      };
      handleCreateTab(missing);
      return;
    }

    const page: Page = {
      title: post.title,
      type: "blog",
      content: <BlogPostView post={post} onOpenBlog={handleCreateBlog} />,
    };

    handleCreateTab(page);
  };

  return (
    <div className="app" data-theme={theme} data-font={font} data-effects={effect} ref={appRef}>
      {/* ✅ Header gets a "Files" button on mobile */}
      <Header
        theme={theme}
        font={font}
        effect={effect}
        onThemeChange={setTheme}
        onFontChange={setFont}
        onEffectChange={setEffect}
      />

      <div className="main-layout">
        {/* Desktop sidebar */}
        {!isMobile && (
          <div
            ref={sidebarRef}
            className="app-sidebar"
            style={{ width: sidebarWidth }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="app-sidebar-content">
              <FileTree handleCreateBlog={handleCreateBlog} />
            </div>
            <div className="app-sidebar-resizer" onMouseDown={startResizing} />
          </div>
        )}

        <MainDisplay
          tabs={tabs}
          setTabs={setTabs}
          activeTabId={activeTabId}
          setActiveTabId={setActiveTabId}
        />

      </div>

      <BottomBar handleCreateTab={handleCreateTab} />

      {/* ✅ Mobile Drawer */}
      {/* {isMobile && (
        <div className={`filetree-drawer ${isDrawerOpen ? "open" : ""}`}>
          <div className="filetree-drawer-backdrop" onClick={() => setIsDrawerOpen(false)} />
          <aside className="filetree-drawer-panel" role="dialog" aria-modal="true">
            <div className="filetree-drawer-header">
              <div className="filetree-drawer-title">Files</div>
              <button className="filetree-drawer-close" onClick={() => setIsDrawerOpen(false)}>
                ✕
              </button>
            </div>
            <div className="filetree-drawer-body">
              <FileTree handleCreateBlog={handleCreateBlog} />
            </div>
          </aside>
        </div>
      )} */}
    </div>
  );
};

export default App;
