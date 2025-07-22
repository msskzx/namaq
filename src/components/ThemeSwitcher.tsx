"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'next-themes';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ minWidth: 80 }}
    >
      <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} className="w-5 h-5 text-gray-500" />
      <div className="flex items-center w-16 h-7 rounded-full bg-gray-300 dark:bg-gray-600 relative">
        <span
          className={`flex-1 flex items-center justify-center z-10 transition-colors ${theme === 'dark' ? 'text-black dark:text-white' : 'text-gray-500'}`}
        >
          <FontAwesomeIcon icon={faMoon} className="w-4 h-4" />
        </span>
        <span
          className={`flex-1 flex items-center justify-center z-10 transition-colors ${theme === 'light' ? 'text-black dark:text-white' : 'text-gray-500'}`}
        >
          <FontAwesomeIcon icon={faSun} className="w-4 h-4" />
        </span>
        <span
          className={`absolute top-1/2 -translate-y-1/2 left-0 transition-all duration-200 w-1/2 h-5 rounded-full bg-indigo-400 ${theme === 'dark' ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ zIndex: 1 }}
        />
      </div>
    </button>
  );
};

export default ThemeSwitcher; 