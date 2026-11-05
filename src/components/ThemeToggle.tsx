'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="tooltip tooltip-bottom" data-tip={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
      <button
        onClick={toggleTheme}
        type="button"
        className="btn btn-ghost btn-circle btn-sm text-base-content hover:bg-base-200 transition-colors"
        aria-label="Toggle Theme"
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-gray-700" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-400" />
        )}
      </button>
    </div>
  );
}

