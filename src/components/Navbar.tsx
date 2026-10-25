import React from 'react';
import { RotateCcw, Database, Shield, Zap, Sparkles, Sun, Moon, Flame, Users, Calendar, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { CricketBrandLogo } from './CricketBrandLogo';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onResetDb: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onResetDb }) => {
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Home' },
    { id: 'matches', label: 'Fixtures' },
    { id: 'scores', label: 'Live Center', isLive: true },
    { id: 'teams', label: 'Squads' },
    { id: 'players', label: 'Athletes' },
    { id: 'performances', label: 'Game Logs' },
    { id: 'goats', label: 'Legends', icon: Flame },
  ];

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-2xl border-b border-white/10 bg-black/90 shadow-2xl transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Cricket Championship Brand Identity */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className="group text-left cursor-pointer shrink-0"
        >
          <CricketBrandLogo />
        </button>

        {/* Zone 2: Navigation Links with Animated Active Indicator */}
        <nav
          className="hidden xl:flex items-center gap-1 p-1.5 rounded-2xl border border-white/10 bg-black/80"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-slate-950 font-black'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbarActiveTab"
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-xl shadow-md shadow-amber-500/20"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.isLive && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                  {Icon && !item.isLive && <Icon className="w-3.5 h-3.5 text-amber-500" />}
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Quick Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* THEME TOGGLE (Accessible Light/Dark Mode) */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-sm flex items-center justify-center ${
              isDark
                ? 'bg-slate-900/90 hover:bg-slate-800 border-amber-500/30 text-amber-300 hover:border-amber-400 shadow-amber-500/10'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-amber-600 shadow-slate-200/50'
            }`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-amber-600" />
            )}
          </button>

          {/* Restrained Admin / Data Studio Access */}
          <button
            onClick={() => onSelectTab('datastudio')}
            title="Admin & Relational Data Studio"
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-medium rounded-xl border transition-all cursor-pointer shadow-sm ${
              currentTab === 'datastudio'
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                : isDark
                ? 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                : 'bg-white text-slate-700 border-slate-300 hover:text-slate-950'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Data Studio</span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Sub-Navigation Scrollable Strip */}
      <div
        className="xl:hidden flex items-center gap-1.5 overflow-x-auto px-4 py-2.5 border-t border-white/10 bg-black/95 no-scrollbar"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg whitespace-nowrap shrink-0 cursor-pointer transition-colors flex items-center gap-1.5 ${
              currentTab === item.id
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950'
                : isDark
                ? 'text-slate-300 hover:bg-white/10'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {item.isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
            {item.label}
          </button>
        ))}
        <button
          onClick={() => onSelectTab('datastudio')}
          className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg whitespace-nowrap shrink-0 cursor-pointer transition-colors flex items-center gap-1.5 ${
            currentTab === 'datastudio'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : isDark
              ? 'text-amber-400 hover:bg-white/10'
              : 'text-amber-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3 h-3" />
          <span>Data Studio</span>
        </button>
      </div>
    </header>
  );
};
