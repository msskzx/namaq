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

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 w-full border-b border-indigo-700 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link href="/" className="text-white text-2xl font-bold hover:text-indigo-200 transition-colors">
          {translations[language].title}
        </Link>
        {/* Desktop Nav */}
        <div className="hidden lg:flex space-x-4 items-center">
          <Link href="/" className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2">
            {translations[language].home}
          </Link>
          <Link href="/arabic" className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2">
            {translations[language].learn}
          </Link>
          <Link href="/grammar" className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2">
            {translations[language].grammar}
          </Link>
          <Link href="/history" className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2">
            {translations[language].history}
          </Link>
          <Link href="/prophet" className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2">
            {translations[language].prophet}
          </Link>
          <Link href="/companions" className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2">
            {translations[language].companions}
          </Link>
          <Link href="/practice" className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2">
            {translations[language].practice}
          </Link>
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
            <Link href="/" className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2" onClick={() => setMenuOpen(false)}>
              {translations[language].home}
            </Link>
            <Link href="/arabic" className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2" onClick={() => setMenuOpen(false)}>
              {translations[language].learn}
            </Link>
            <Link href="/grammar" className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2" onClick={() => setMenuOpen(false)}>
              {translations[language].grammar}
            </Link>
            <Link href="/history" className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2" onClick={() => setMenuOpen(false)}>
              {translations[language].history}
            </Link>
            <Link href="/prophet" className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2" onClick={() => setMenuOpen(false)}>
              {translations[language].prophet}
            </Link>
            <Link href="/companions" className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2" onClick={() => setMenuOpen(false)}>
              {translations[language].companions}
            </Link>
            <Link href="/practice" className="text-white rounded-md transition-colors hover:bg-indigo-700 font-medium px-3 py-2" onClick={() => setMenuOpen(false)}>
              {translations[language].practice}
            </Link>
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