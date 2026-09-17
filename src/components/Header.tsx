import React, { useEffect, useRef, useState } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
import './css/Header.css';

type ThemeMode = 'dark' | 'light' | 'ocean' | 'sunset' | 'forest' | 'nord' | 'midnight' | 'rose';
type FontMode = 'fira' | 'serif' | 'rounded' | 'system' | 'mono';
type EffectMode = 'none' | 'glow' | 'grain' | 'scanlines' | 'blur' | 'neon';
type ControlKey = 'theme' | 'font' | 'effect';

interface Choice {
    value: string;
    label: string;
    detail?: string;
}

const THEME_CHOICES: Choice[] = [
    { value: 'dark', label: 'Hacker', detail: 'Blue-black' },
    { value: 'light', label: 'Light', detail: 'Paper' },
    { value: 'ocean', label: 'Ocean', detail: 'Teal' },
    { value: 'sunset', label: 'Sunset', detail: 'Warm' },
    { value: 'forest', label: 'Forest', detail: 'Green' },
    { value: 'nord', label: 'Nord', detail: 'Cool' },
    { value: 'midnight', label: 'Midnight', detail: 'Violet' },
    { value: 'rose', label: 'Rose', detail: 'Pink' },
];

const FONT_CHOICES: Choice[] = [
    { value: 'fira', label: 'Fira Code', detail: 'Editor' },
    { value: 'mono', label: 'Monospace', detail: 'Terminal' },
    { value: 'serif', label: 'Serif', detail: 'Editorial' },
    { value: 'rounded', label: 'Rounded', detail: 'Soft' },
    { value: 'system', label: 'System', detail: 'Native' },
];

const EFFECT_CHOICES: Choice[] = [
    { value: 'none', label: 'None' },
    { value: 'glow', label: 'Glow' },
    { value: 'grain', label: 'Grain' },
    { value: 'scanlines', label: 'Scanlines' },
    { value: 'blur', label: 'Glass' },
    { value: 'neon', label: 'Neon' },
];

interface HeaderProps {
    theme: ThemeMode;
    font: FontMode;
    effect: EffectMode;
    currentPath: string;
    onThemeChange: (value: ThemeMode) => void;
    onFontChange: (value: FontMode) => void;
    onEffectChange: (value: EffectMode) => void;
}

const Header: React.FC<HeaderProps> = ({
    theme,
    font,
    effect,
    currentPath,
    onThemeChange,
    onFontChange,
    onEffectChange,
}) => {
    const [openControl, setOpenControl] = useState<ControlKey | null>(null);
    const controlsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onPointerDown = (event: PointerEvent) => {
            if (!controlsRef.current?.contains(event.target as Node)) setOpenControl(null);
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpenControl(null);
        };
        document.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    const renderControl = (
        key: ControlKey,
        label: string,
        value: string,
        choices: Choice[],
        onChange: (next: string) => void,
    ) => {
        const isOpen = openControl === key;
        const selected = choices.find(choice => choice.value === value) ?? choices[0];

        return (
            <div className={`control-menu ${isOpen ? 'open' : ''}`}>
                <button
                    className="control-trigger"
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    onClick={() => setOpenControl(isOpen ? null : key)}
                >
                    <span className="control-label">{label}</span>
                    <span className="control-value">{selected.label}</span>
                    <FiChevronDown className="control-chevron" aria-hidden="true" />
                </button>
                <div
                    className="control-dropdown"
                    role="listbox"
                    aria-label={`${label} options`}
                    aria-hidden={!isOpen}
                >
                    {choices.map(choice => (
                        <button
                            key={choice.value}
                            className={`control-option ${choice.value === value ? 'selected' : ''}`}
                            type="button"
                            role="option"
                            aria-selected={choice.value === value}
                            tabIndex={isOpen ? 0 : -1}
                            onClick={() => {
                                onChange(choice.value);
                                setOpenControl(null);
                            }}
                        >
                            <span className={`control-swatch control-swatch--${key}`} aria-hidden="true" />
                            <span className="control-option-label">{choice.label}</span>
                            {choice.detail && <span className="control-option-detail">{choice.detail}</span>}
                            <FiCheck className="control-check" aria-hidden="true" />
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <header className="header">
            <div className="header-brand">
                <span className="header-signal" aria-hidden="true" />
                <span className="header-title">Alexander Lu</span>
                <span className="header-path" title={currentPath}>{currentPath}</span>
            </div>
            <div className="theme-controls" aria-label="Appearance controls" ref={controlsRef}>
                {renderControl('theme', 'Theme', theme, THEME_CHOICES, value => onThemeChange(value as ThemeMode))}
                {renderControl('font', 'Font', font, FONT_CHOICES, value => onFontChange(value as FontMode))}
                {renderControl('effect', 'FX', effect, EFFECT_CHOICES, value => onEffectChange(value as EffectMode))}
            </div>
        </header>
    );
};

export default Header;
