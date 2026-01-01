"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '../language/LanguageSwitcher';
import { useLanguage } from '../language/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faGear } from '@fortawesome/free-solid-svg-icons';
import translations from '../language/translations';
import ThemeSwitcher from '../theme/ThemeSwitcher';

interface NavLink {
  href: string;
  label: string;
}

const getLinkItems = (href: string, language: 'en' | 'ar'): NavLink[] => {
  switch (href) {
    case '/graphs':
      return [
        { href: '/graphs', label: translations[language].familyRelations },
        { href: '/graphs/ancestry', label: 'الانساب' },
      ];
    case '/people':
      return [
        { href: '/people', label: translations[language].people },
        { href: '/people/prophet-muhammad', label: translations[language].prophet },
        { href: '/people?title=companion', label: translations[language].companions },
        { href: '/titles', label: translations[language].titles },
      ];
    case '/events':
      return [
        { href: '/events', label: translations[language].events },
        { href: '/battles', label: translations[language].battles.title },
      ];
    default:
      return [];
  }
};

export default function NavBar() {
  const { language, languageLoaded } = useLanguage() as { language: 'en' | 'ar'; languageLoaded: boolean };
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  if (!languageLoaded) {
    // Render placeholder with real title (invisible) to prevent hydration mismatch
    return (
      <>
        <nav className="bg-gray-50 dark:bg-gray-950 w-full border-b-2 border-amber-400 shadow-lg min-h-[72px] fixed top-0 left-0 right-0 z-50">
          <div className="container mx-auto flex justify-between items-center py-4 px-4 min-h-[72px]">
            <span className="text-black dark:text-amber-400 text-2xl font-bold opacity-0">{translations[language]?.title || 'Namaq'}</span>
            <div className="hidden lg:flex space-x-4 items-center opacity-0">
              <span>Placeholder</span>
            </div>
            <button className="lg:hidden text-black dark:text-amber-400 p-2 opacity-0" style={{ visibility: 'hidden' }} aria-hidden="true">&nbsp;</button>
          </div>
        </nav>
        <div className="h-[72px]" />
      </>
    );
  }

  const mainLinks = [
    { href: '/graphs', label: translations[language].familyRelations },
    { href: '/people', label: translations[language].people },
    { href: '/events', label: translations[language].events },
  ];

  const allLinks = [
    { href: '/events', label: translations[language].events },
    { href: '/graphs', label: translations[language].familyRelations },
    { href: '/graphs/ancestry', label: 'الانساب' },
    { href: '/people/prophet-muhammad', label: translations[language].prophet },
    { href: '/people?title=companion', label: translations[language].companions },
    { href: '/people', label: translations[language].people },
    { href: '/events', label: translations[language].events },
    { href: '/battles', label: translations[language].battles.title },
  ];

  const sortedMainLinks = language === 'ar' ? [...mainLinks].reverse() : mainLinks;

  return (
    <>
      <nav className="bg-gray-50 dark:bg-gray-950 w-full border-b-2 border-amber-400 shadow-lg fixed top-0 left-0 right-0 z-50 min-h-[72px]">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 min-h-[72px]">
          <Link
            href="/"
            className="text-amber-600 dark:text-amber-400 text-2xl font-bold hover:text-amber-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {translations[language].appName}
          </Link>
          {/* Desktop Nav */}
          <div className="hidden lg:flex space-x-4 items-center">
            {sortedMainLinks.map((link) => {
              const linkItems = getLinkItems(link.href, language);
              const isHovered = hoveredLink === link.href;

              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => {
                    if (hoverTimeoutRef.current) {
                      clearTimeout(hoverTimeoutRef.current);
                    }
                    setHoveredLink(link.href);
                  }}
                  onMouseLeave={() => {
                    hoverTimeoutRef.current = setTimeout(() => {
                      setHoveredLink(null);
                    }, 200);
                  }}
                >
                  <Link
                    href={link.href}
                    className="text-black dark:text-gray-100 rounded-md transition-colors hover:text-gray-800 dark:hover:text-amber-300 font-medium px-3 py-2 flex items-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>

                  {linkItems.length > 0 && isHovered && (
                    <div
                      className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 shadow-lg z-50 min-w-[200px] py-1"
                      onMouseEnter={() => {
                        if (hoverTimeoutRef.current) {
                          clearTimeout(hoverTimeoutRef.current);
                        }
                        setHoveredLink(link.href);
                      }}
                      onMouseLeave={() => {
                        hoverTimeoutRef.current = setTimeout(() => {
                          setHoveredLink(null);
                        }, 200);
                      }}
                    >
                      {linkItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => setHoveredLink(null)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div>
            {/* Gear Icon for Settings */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setSettingsOpen((open) => !open)}
                className="text-black dark:text-amber-400 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-indigo-950 dark:hover:text-amber-300 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300 ml-2"
                aria-label="Settings"
              >
                <FontAwesomeIcon icon={faGear} className="w-6 h-6" />
              </button>
              {settingsOpen && (
                <div className="absolute top-full right-0 mt-2 bg-gray-50 dark:bg-gray-950 border border-amber-400 rounded-md shadow-lg z-50 p-4 flex flex-col gap-4">
                  <div>
                    <LanguageSwitcher />
                  </div>
                  <div>
                    <ThemeSwitcher />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Hamburger Icon for Mobile */}
          <button
            className="lg:hidden text-black dark:text-amber-400 hover:text-gray-800 dark:hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 p-2"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="w-6 h-6" />
          </button>
        </div>
        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="lg:hidden fixed top-[72px] left-0 right-0 bg-gray-950 border-t-2 border-amber-400 px-4 pb-4 animate-fade-in-down z-40">
            <div className="flex flex-col gap-3 mt-2">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-black dark:text-amber-400 rounded-md transition-colors hover:text-gray-800 dark:hover:text-amber-300 font-medium px-3 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      <div className="h-[72px]" />
    </>
  );
}