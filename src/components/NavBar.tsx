"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from './LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import translations from './translations';

const NavBar: React.FC = () => {
  const { language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  // Define nav links
  const navLinks = [
    { href: '/', label: translations[language].home },
    { href: '/people/prophet-muhammad', label: translations[language].prophet },
    { href: '/people?title=companion', label: translations[language].companions },
    { href: '/battles', label: translations[language].battles.title },
    { href: '/arabic', label: translations[language].learn },
    { href: '/articles', label: translations[language].articles },
    { href: '/categories', label: translations[language].categories }
  ];
  const sortedNavLinks = language === 'ar' ? [...navLinks].reverse() : navLinks;

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 w-full border-b border-indigo-700 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link href="/" className="text-white text-2xl font-bold hover:text-indigo-200 transition-colors">
          {translations[language].title}
        </Link>
        {/* Desktop Nav */}
        <div className="hidden lg:flex space-x-4 items-center">
          {sortedNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2">
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>
        {/* Hamburger Icon for Mobile */}
        <button
          className="lg:hidden text-white focus:outline-none focus:ring-2 focus:ring-indigo-300 p-2"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="w-6 h-6" />
        </button>
      </div>
      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-gradient-to-r from-indigo-600 to-purple-600 border-t border-indigo-700 px-4 pb-4 animate-fade-in-down">
          <div className="flex flex-col gap-3 mt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2"
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