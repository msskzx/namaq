"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NavBar, { NavSlotContext, NavSlotElement, RailSlotContext, RailSlotElement } from './NavBar';
import TabBar, { TabSpacer } from './TabBar';
import { NavigationLoaderProvider } from './NavigationLoader';

const FooterContext = createContext<(hidden: boolean) => void>(() => {});

/** Hides the tab bar (bottom bar on phones, side rail on desktop) while `hidden` is true, e.g. while a quiz is running. */
export function useHideFooter(hidden: boolean) {
  const setHidden = useContext(FooterContext);
  useEffect(() => {
    setHidden(hidden);
    return () => setHidden(false);
  }, [hidden, setHidden]);
}

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const [footerHidden, setFooterHidden] = useState(false);
  const [slot, setSlot] = useState<HTMLDivElement | null>(null);
  const [railSlot, setRailSlot] = useState<HTMLDivElement | null>(null);
  const pathname = usePathname() ?? '/';
  const featureTheme = pathname === '/' || pathname === '/quran' || pathname === '/library' || /^\/quran\/(read|branches|compare|prophets|tajwid|oaths|iltifat|openings)(?:\/|$)/.test(pathname) || /^\/quizzes(?:\/|$)/.test(pathname);
  const partyRoom = /^\/quizzes\/party\/[^/]+/.test(pathname);
  const tabs = !footerHidden && !partyRoom;
  // The root layout renders <html data-tabbar> so the first paint already leaves room for the tabs.
  useEffect(() => { document.documentElement.toggleAttribute('data-tabbar', tabs); }, [tabs]);
  return (
    <NavigationLoaderProvider>
      <FooterContext.Provider value={setFooterHidden}>
        <NavSlotContext.Provider value={setSlot}>
          <NavSlotElement.Provider value={slot}>
          <RailSlotContext.Provider value={setRailSlot}>
          <RailSlotElement.Provider value={railSlot}>
            <div data-feature-theme={featureTheme || undefined} className="min-h-svh flex flex-col">
              <NavBar />
              {tabs && <TabBar />}
              <main className="flex-1">
                {children}
              </main>
              {tabs && <TabSpacer />}
            </div>
          </RailSlotElement.Provider>
          </RailSlotContext.Provider>
          </NavSlotElement.Provider>
        </NavSlotContext.Provider>
      </FooterContext.Provider>
    </NavigationLoaderProvider>
  );
}
