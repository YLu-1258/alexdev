import React, { useState, useRef } from 'react';
import Header from './components/Header';
import FileTree from './components/FileTree';
import MainDisplay from './components/MainDisplay';
import BottomBar from './components/BottomBar';
import CommandPalette from './components/CommandPalette';
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

type ThemeMode = 'dark' | 'light' | 'ocean' | 'sunset' | 'forest' | 'nord' | 'midnight' | 'rose';
type FontMode = 'fira' | 'serif' | 'rounded' | 'system' | 'mono';
type EffectMode = 'none' | 'glow' | 'grain' | 'scanlines' | 'blur' | 'neon';

const THEME_OPTIONS: ThemeMode[] = ['dark', 'light', 'ocean', 'sunset', 'forest', 'nord', 'midnight', 'rose'];
const DARK_THEMES: ThemeMode[] = ['dark', 'ocean', 'sunset', 'forest', 'nord', 'midnight', 'rose'];
const FONT_OPTIONS: FontMode[] = ['fira', 'serif', 'rounded', 'system', 'mono'];
const EFFECT_OPTIONS: EffectMode[] = ['none', 'glow', 'grain', 'scanlines', 'blur', 'neon'];

const getStored = <T extends string>(key: string, fallback: T, valid: readonly T[]): T => {
  if (typeof window === 'undefined') return fallback;
  const stored = window.localStorage.getItem(key) as T | null;
  return stored && valid.includes(stored) ? stored : fallback;
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(THEME_KEY) as ThemeMode | null;
  if (stored && THEME_OPTIONS.includes(stored)) return stored;
  return DARK_THEMES[Math.floor(Math.random() * DARK_THEMES.length)];
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
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
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

  // ── Command palette ──────────────────────────────────────────────────────
  const [paletteOpen, setPaletteOpen] = useState(false);

  // ── Konami code + confetti ───────────────────────────────────────────────
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  const konamiIdx = useRef(0);
  const [toast, setToast] = useState<string | null>(null);

  const fireConfetti = React.useCallback(() => {
    const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff922b','#cc5de8'];
    Array.from({ length: 55 }).forEach((_, i) => {
      const el = document.createElement('div');
      const size = 7 + Math.random() * 8;
      el.style.cssText = [
        'position:fixed',
        `left:${5 + Math.random() * 90}vw`,
        'top:-20px',
        `width:${size}px`,
        `height:${size}px`,
        `background:${colors[i % colors.length]}`,
        `border-radius:${Math.random() > 0.4 ? '50%' : '3px'}`,
        'pointer-events:none',
        'z-index:10000',
        `animation:confetti-fall ${1.2 + Math.random() * 1.4}s ease-in ${Math.random() * 0.35}s forwards`,
        `--end-rot:${Math.random() * 720 - 360}deg`,
      ].join(';');
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    });
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(p => !p);
        return;
      }
      if (e.key === 'Escape') { setPaletteOpen(false); return; }

      // Konami
      if (e.key === KONAMI[konamiIdx.current]) {
        konamiIdx.current += 1;
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0;
          fireConfetti();
          setToast('🎮 Achievement Unlocked: Konami Code');
          setTimeout(() => setToast(null), 4000);
        }
      } else {
        konamiIdx.current = e.key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fireConfetti]);

  // ── Cursor sparkle (neon mode only) ──────────────────────────────────────
  React.useEffect(() => {
    if (effect !== 'neon') return;
    let last = 0;
    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - last < 40 || !appRef.current) return;
      last = now;
      const accent = getComputedStyle(appRef.current).getPropertyValue('--accent').trim() || '#007acc';
      const size = 3 + Math.random() * 5;
      const el = document.createElement('div');
      el.style.cssText = [
        'position:fixed',
        `left:${e.clientX}px`,
        `top:${e.clientY}px`,
        `width:${size}px`,
        `height:${size}px`,
        'border-radius:50%',
        `background:${accent}`,
        'pointer-events:none',
        'z-index:9999',
        'transform:translate(-50%,-50%)',
        'transition:opacity 0.5s,transform 0.5s',
        'opacity:0.85',
      ].join(';');
      document.body.appendChild(el);
      requestAnimationFrame(() => {
        el.style.opacity = '0';
        el.style.transform = `translate(-50%,${-18 - Math.random() * 18}px) scale(0.1)`;
      });
      setTimeout(() => el.remove(), 600);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [effect]);

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

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={handleCreateTab}
        onOpenBlog={handleCreateBlog}
      />

      {toast && <div className="achievement-toast">{toast}</div>}

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
