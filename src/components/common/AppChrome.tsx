"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { NavigationLoaderProvider } from './NavigationLoader';

type Setter = (hidden: boolean) => void;
const FooterContext = createContext<Setter>(() => {});
const NavbarContext = createContext<Setter>(() => {});

function useHide(context: React.Context<Setter>, hidden: boolean) {
  const setHidden = useContext(context);
  useEffect(() => {
    setHidden(hidden);
    return () => setHidden(false);
  }, [hidden, setHidden]);
}

/** Hides the site footer while `hidden` is true, e.g. while a quiz is running. */
export const useHideFooter = (hidden: boolean) => useHide(FooterContext, hidden);

/** Shrinks the site navbar to its menu button while `hidden` is true, e.g. in a party room. */
export const useHideNavbar = (hidden: boolean) => useHide(NavbarContext, hidden);

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const [footerHidden, setFooterHidden] = useState(false);
  const [navbarHidden, setNavbarHidden] = useState(false);
  return (
    <NavigationLoaderProvider>
      <FooterContext.Provider value={setFooterHidden}>
      <NavbarContext.Provider value={setNavbarHidden}>
        <div className="min-h-screen flex flex-col">
          <NavBar menuOnly={navbarHidden} />
          <main className="flex-1">
            {children}
          </main>
          {!footerHidden && <Footer />}
        </div>
      </NavbarContext.Provider>
      </FooterContext.Provider>
    </NavigationLoaderProvider>
  );
}
