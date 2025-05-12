import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') === 'dark';
    setIsDark(storedTheme);

    const theme = storedTheme ? 'dark' : 'light';
    document.body.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark', storedTheme); // Enable Tailwind dark mode
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);

    const theme = next ? 'dark' : 'light';
    document.body.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark', next); // Enable Tailwind dark mode
    localStorage.setItem('theme', theme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center px-4 py-2 rounded-full text-white bg-gray-800 dark:bg-gray-300 dark:text-gray-900 transition-all duration-300 hover:bg-gray-600 dark:hover:bg-gray-400"
    >
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
