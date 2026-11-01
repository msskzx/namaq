"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NavBar, { NavSlotContext, NavSlotElement } from './NavBar';
import TabBar from './TabBar';
import Footer from './Footer';
import { NavigationLoaderProvider } from './NavigationLoader';

const FooterContext = createContext<(hidden: boolean) => void>(() => {});

/** Hides the site footer and the phone tab bar while `hidden` is true, e.g. while a quiz is running. */
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
  const partyRoom = /^\/quizzes\/party\/[^/]+/.test(usePathname() ?? '/');
  const tabs = !footerHidden && !partyRoom;
  useEffect(() => {
    document.documentElement.toggleAttribute('data-tabbar', tabs);
    return () => document.documentElement.removeAttribute('data-tabbar');
  }, [tabs]);
  return (
    <NavigationLoaderProvider>
      <FooterContext.Provider value={setFooterHidden}>
        <NavSlotContext.Provider value={setSlot}>
          <NavSlotElement.Provider value={slot}>
            <div className="min-h-screen flex flex-col">
              <NavBar />
              <main className="flex-1">
                {children}
              </main>
              {!footerHidden && <Footer />}
              {tabs && <TabBar />}
            </div>
          </NavSlotElement.Provider>
        </NavSlotContext.Provider>
      </FooterContext.Provider>
    </NavigationLoaderProvider>
  );
}
