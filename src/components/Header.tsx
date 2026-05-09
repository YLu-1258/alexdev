import React from 'react';
import './css/Header.css';

type ThemeMode = 'dark' | 'light' | 'ocean' | 'sunset' | 'forest' | 'nord' | 'midnight' | 'rose';
type FontMode = 'fira' | 'serif' | 'rounded' | 'system' | 'mono';
type EffectMode = 'none' | 'glow' | 'grain' | 'scanlines' | 'blur' | 'neon';

interface HeaderProps {
    theme: ThemeMode;
    font: FontMode;
    effect: EffectMode;
    onThemeChange: (value: ThemeMode) => void;
    onFontChange: (value: FontMode) => void;
    onEffectChange: (value: EffectMode) => void;
}

const Header: React.FC<HeaderProps> = ({
    theme,
    font,
    effect,
    onThemeChange,
    onFontChange,
    onEffectChange,
}) => {
    return (
        <div className="header">
            <div className="header-title">Alexander Lu</div>
            <div className="theme-controls" aria-label="Theme controls">
                <label className="theme-control-item">
                    <span>Theme</span>
                    <select value={theme} onChange={(e) => onThemeChange(e.target.value as ThemeMode)}>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="ocean">Ocean</option>
                        <option value="sunset">Sunset</option>
                        <option value="forest">Forest</option>
                        <option value="nord">Nord</option>
                        <option value="midnight">Midnight</option>
                        <option value="rose">Rose</option>
                    </select>
                </label>
                <label className="theme-control-item">
                    <span>Font</span>
                    <select value={font} onChange={(e) => onFontChange(e.target.value as FontMode)}>
                        <option value="fira">Fira Code</option>
                        <option value="mono">Monospace</option>
                        <option value="serif">Serif</option>
                        <option value="rounded">Rounded</option>
                        <option value="system">System</option>
                    </select>
                </label>
                <label className="theme-control-item">
                    <span>FX</span>
                    <select value={effect} onChange={(e) => onEffectChange(e.target.value as EffectMode)}>
                        <option value="none">None</option>
                        <option value="glow">Glow</option>
                        <option value="grain">Grain</option>
                        <option value="scanlines">Scanlines</option>
                        <option value="blur">Blur</option>
                        <option value="neon">Neon</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default Header;
