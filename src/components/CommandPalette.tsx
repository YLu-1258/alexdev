import { useState, useEffect, useRef } from 'react';
import {
  FiSearch, FiFileText, FiInfo, FiAward,
  FiLayers, FiBriefcase, FiTool, FiBook, FiCheckSquare,
} from 'react-icons/fi';
import { Page } from './types';
import { allPosts } from '../blog/render/loadPosts';
import About from '../content/portfolio/about';
import Awards from '../content/portfolio/awards';
import Projects from '../content/portfolio/projects';
import Skills from '../content/portfolio/skills';
import Courses from '../content/portfolio/courses';
import Experiences from '../content/portfolio/experiences';
import Research from '../content/portfolio/research';
import './css/CommandPalette.css';

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
  onOpenBlog: (slug: string) => void;
}

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  action: () => void;
}

const SECTIONS: { label: string; type: Page['type']; icon: React.ReactNode; element: React.ReactNode }[] = [
  { label: 'About',      type: 'about',      icon: <FiInfo />,        element: <About /> },
  { label: 'Experience', type: 'experience', icon: <FiBriefcase />,   element: <Experiences /> },
  { label: 'Research',   type: 'research',   icon: <FiBook />,        element: <Research /> },
  { label: 'Projects',   type: 'projects',   icon: <FiLayers />,      element: <Projects /> },
  { label: 'Skills',     type: 'skills',     icon: <FiTool />,        element: <Skills /> },
  { label: 'Courses',    type: 'courses',    icon: <FiCheckSquare />, element: <Courses /> },
  { label: 'Awards',     type: 'awards',     icon: <FiAward />,       element: <Awards /> },
];

export default function CommandPalette({ open, onClose, onNavigate, onOpenBlog }: Props) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const commands: Command[] = [
    ...SECTIONS.map(s => ({
      id: s.label,
      label: s.label,
      hint: 'Section',
      icon: s.icon,
      action: () => { onNavigate({ title: s.label, type: s.type, content: s.element }); onClose(); },
    })),
    ...allPosts.map(p => ({
      id: p.slug,
      label: p.title,
      hint: p.date,
      icon: <FiFileText />,
      action: () => { onOpenBlog(p.slug); onClose(); },
    })),
  ];

  const lower = query.toLowerCase();
  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(lower) || c.hint.toLowerCase().includes(lower))
    : commands;

  useEffect(() => setActiveIdx(0), [query]);

  useEffect(() => {
    const el = listRef.current?.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filtered[activeIdx]) filtered[activeIdx].action();
  };

  if (!open) return null;

  return (
    <div className="palette-overlay" onMouseDown={onClose}>
      <div className="palette-modal" onMouseDown={e => e.stopPropagation()}>
        <div className="palette-search-row">
          <FiSearch className="palette-search-icon" />
          <input
            ref={inputRef}
            className="palette-input"
            placeholder="Go to section or blog post…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <kbd className="palette-esc-key">esc</kbd>
        </div>

        <div className="palette-results" ref={listRef}>
          {filtered.length === 0 && (
            <div className="palette-empty">No results for "{query}"</div>
          )}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              className={`palette-item ${i === activeIdx ? 'active' : ''}`}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={cmd.action}
            >
              <span className="palette-item-icon">{cmd.icon}</span>
              <span className="palette-item-label">{cmd.label}</span>
              <span className="palette-item-hint">{cmd.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
