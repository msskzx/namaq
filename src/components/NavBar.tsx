"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from './LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import translations from './translations';

const NavBar: React.FC = () => {
  const { language, languageLoaded } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!languageLoaded) {
    // Render placeholder with real title (invisible) to prevent hydration mismatch
    return (
      <nav className="bg-indigo-950 w-full border-b-2 border-amber-400 shadow-lg min-h-[72px]">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 min-h-[72px]">
          <span className="text-amber-400 text-2xl font-bold opacity-0">{translations[language]?.title || 'Namaq'}</span>
          <div className="hidden lg:flex space-x-4 items-center opacity-0">
            <span>Placeholder</span>
          </div>
          <button className="lg:hidden text-amber-400 p-2 opacity-0" style={{ visibility: 'hidden' }} aria-hidden="true">&nbsp;</button>
        </div>
      </nav>
    );
  }

  // Define nav links
  const navLinks = [
    { href: '/', label: translations[language].home },
    { href: '/people/prophet-muhammad', label: translations[language].prophet },
    { href: '/people?title=companion', label: translations[language].companions },
    { href: '/battles', label: translations[language].battles.title },
    { href: '/articles', label: translations[language].articles },
    { href: '/categories', label: translations[language].categories }
  ];
  const sortedNavLinks = language === 'ar' ? [...navLinks].reverse() : navLinks;

  return (
    <nav className="bg-indigo-950 w-full border-b-2 border-amber-400 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link href="/" className="text-amber-400 text-2xl font-bold hover:text-amber-300 transition-colors">
          {translations[language].title}
        </Link>
        {/* Desktop Nav */}
        <div className="hidden lg:flex space-x-4 items-center">
          {sortedNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-amber-400 rounded-md transition-colors hover:text-amber-300 font-medium px-3 py-2">
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>
        {/* Hamburger Icon for Mobile */}
        <button
          className="lg:hidden text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 p-2"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="w-6 h-6" />
        </button>
      </div>
      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-indigo-950 border-t-2 border-amber-400 px-4 pb-4 animate-fade-in-down">
          <div className="flex flex-col gap-3 mt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-amber-400 rounded-md transition-colors hover:text-amber-300 font-medium px-3 py-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar; 