"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from './LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faChevronDown, faGear } from '@fortawesome/free-solid-svg-icons';
import translations from './translations';
import ThemeSwitcher from './ThemeSwitcher';

const NavBar: React.FC = () => {
  const { language, languageLoaded } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!languageLoaded) {
    // Render placeholder with real title (invisible) to prevent hydration mismatch
    return (
      <nav className="bg-gray-50 dark:bg-gray-950 w-full border-b-2 border-amber-400 shadow-lg min-h-[72px]">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 min-h-[72px]">
          <span className="text-black dark:text-amber-400 text-2xl font-bold opacity-0">{translations[language]?.title || 'Namaq'}</span>
          <div className="hidden lg:flex space-x-4 items-center opacity-0">
            <span>Placeholder</span>
          </div>
          <button className="lg:hidden text-black dark:text-amber-400 p-2 opacity-0" style={{ visibility: 'hidden' }} aria-hidden="true">&nbsp;</button>
        </div>
      </nav>
    );
  }

  // Define nav links
  const navLinks = [
    { href: '/specials', label: language === 'ar' ? 'مقالات مميزة' : 'Special Articles' },
    { href: '/people/prophet-muhammad', label: translations[language].prophet },
    { href: '/people?title=companion', label: translations[language].companions },
    { href: '/battles', label: translations[language].battles.title },
  ];

  // Define dropdown items
  const dropdownItems = [
    { href: '/articles', label: translations[language].articles },
    { href: '/categories', label: translations[language].categories },
    { href: '/poems', label: translations[language].poems },
    { href: '/titles', label: translations[language].titles },
    { href: '/quran', label: translations[language].quran },
    { href: '/hadith', label: translations[language].hadith },
  ];

  const sortedNavLinks = language === 'ar' ? [...navLinks].reverse() : navLinks;

  return (
    <nav className="bg-gray-50 dark:bg-gray-950 w-full border-b-2 border-amber-400 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link href="/" className="text-amber-600 dark:text-amber-400 text-2xl font-bold hover:text-amber-300 transition-colors">
          {translations[language].title}
        </Link>
        {/* Desktop Nav */}
        <div className="hidden lg:flex space-x-4 items-center">
          {language && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-black dark:text-amber-400 rounded-md transition-colors hover:bg-gray-200 dark:hover:bg-indigo-950 dark:hover:text-amber-300 font-medium px-3 py-2 flex items-center gap-1"
              >
                {language === 'ar' ? 'المزيد' : 'More'} 
                <FontAwesomeIcon icon={faChevronDown} className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-gray-50 dark:bg-gray-950 border border-amber-400 rounded-md shadow-lg z-50 min-w-[200px]">
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-black dark:text-amber-400 dark:hover:text-amber-300 hover:bg-gray-200 dark:hover:bg-indigo-950 px-4 py-2 text-sm transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {sortedNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-black dark:text-amber-400 rounded-md transition-colors hover:bg-gray-200 dark:hover:bg-indigo-950 dark:hover:text-amber-300 font-medium px-3 py-2">
              {link.label}
            </Link>
          ))}
          
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
          <div className="lg:hidden bg-gray-950 border-t-2 border-amber-400 px-4 pb-4 animate-fade-in-down">
            <div className="flex flex-col gap-3 mt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-black dark:text-amber-400 rounded-md transition-colors hover:text-gray-800 dark:hover:text-amber-300 font-medium px-3 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Dropdown Items */}
              {language && (
                <div className="border-t border-amber-400 pt-3">
                  <div className="text-black dark:text-amber-400 font-medium px-3 py-2 mb-2">
                    {language === 'ar' ? 'المزيد' : 'More'}
                  </div>
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-black dark:text-amber-400 rounded-md transition-colors hover:text-gray-800 dark:hover:text-amber-300 font-medium px-3 py-2 ml-4"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
    </nav>
  );
};

export default NavBar; 