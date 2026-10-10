"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '../language/LanguageSwitcher';
import { useLanguage } from '../language/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faGear } from '@fortawesome/free-solid-svg-icons';
import translations from '../language/translations';
import ThemeSwitcher from '../theme/ThemeSwitcher';
import Button from './Button';
import { getAllNavLinks, type SiteLink } from '@/lib/siteLinks';

// A subset of getAllNavLinks, by href, so a dropdown never lists a link under
// a different label than the mobile menu and the graph workspace menu give it.
const HADITH_SUBMENU_HREFS = ['/hadith/bukhari-jibril', '/hadith/muslim-jibril', '/hadith/fath-iman-50'];
const QURAN_SUBMENU_HREFS = ['/quran', '/quran/compare'];
const PEOPLE_SUBMENU_HREFS = ['/people', '/people/prophet-muhammad', '/titles', '/events'];

function submenuFrom(hrefs: string[], language: 'en' | 'ar'): SiteLink[] {
  const all = getAllNavLinks(language);
  return hrefs.map((wanted) => all.find((link) => link.href === wanted)).filter((link): link is SiteLink => link !== undefined);
}

const getLinkItems = (href: string, language: 'en' | 'ar'): SiteLink[] => {
  switch (href) {
    case '/people':
      return submenuFrom(PEOPLE_SUBMENU_HREFS, language);
    case '/hadith':
      return submenuFrom(HADITH_SUBMENU_HREFS, language);
    case '/quran':
      return submenuFrom(QURAN_SUBMENU_HREFS, language);
    case '/quizzes':
      // Solo today; party mode (docs/plans/quizzes.md) adds its own entry
      // here once built, rather than a second top-level dropdown.
      return [{ href: '/quizzes', label: translations[language].soloQuiz }];
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
        <nav className="bg-gray-50 dark:bg-black w-full border-b-2 border-amber-400 shadow-lg min-h-[72px] fixed top-0 left-0 right-0 z-50">
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

  const mainLinkHrefs = ['/graphs', '/people', '/quizzes', '/sources'];
  const mainLinks = mainLinkHrefs
    .map((wanted) => getAllNavLinks(language).find((link) => link.href === wanted))
    .filter((link): link is SiteLink => link !== undefined);
  mainLinks.splice(3, 0, { href: '/hadith', label: language === 'ar' ? 'الأحاديث' : 'Hadith' });
  mainLinks.splice(4, 0, { href: '/quran', label: language === 'ar' ? 'القرآن' : 'Quran' });

  const allLinks = getAllNavLinks(language);

  return (
    <>
      <nav className="bg-gray-50 dark:bg-black w-full border-b-2 border-amber-400 shadow-lg fixed top-0 left-0 right-0 z-50 min-h-[72px]">
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
            {mainLinks.map((link) => {
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
                      className="absolute top-full start-0 mt-1 bg-white dark:bg-gray-900 shadow-lg z-50 min-w-[200px] py-1"
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
              <Button size="icon" onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen} aria-label="Settings" className="ms-2">
                <FontAwesomeIcon icon={faGear} className="w-5 h-5" />
              </Button>
              {settingsOpen && (
                <div className="absolute top-full end-0 mt-2 bg-gray-50 dark:bg-black border border-amber-400 rounded-md shadow-lg z-50 p-4 flex flex-col gap-4">
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
          <Button
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="w-5 h-5" />
          </Button>
        </div>
        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="lg:hidden fixed top-[72px] left-0 right-0 bg-gray-50 dark:bg-black border-t-2 border-amber-400 px-4 pb-4 animate-fade-in-down z-40">
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