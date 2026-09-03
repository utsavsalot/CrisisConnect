import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`p-2 rounded-xl border border-slate-700/50 dark:border-white/10 bg-white/10 dark:bg-slate-800/60 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-tech-blue dark:hover:text-tech-blue transition-all duration-200 ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-400 hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
};
