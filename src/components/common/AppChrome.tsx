"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { NavigationLoaderProvider } from './NavigationLoader';

const FooterContext = createContext<(hidden: boolean) => void>(() => {});

/** Hides the site footer while `hidden` is true, e.g. while a quiz is running. */
export function useHideFooter(hidden: boolean) {
  const setHidden = useContext(FooterContext);
  useEffect(() => {
    setHidden(hidden);
    return () => setHidden(false);
  }, [hidden, setHidden]);
}

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const [footerHidden, setFooterHidden] = useState(false);
  return (
    <NavigationLoaderProvider>
      <FooterContext.Provider value={setFooterHidden}>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-1">
            {children}
          </main>
          {!footerHidden && <Footer />}
        </div>
      </FooterContext.Provider>
    </NavigationLoaderProvider>
  );
}
