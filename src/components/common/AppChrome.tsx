"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';
import Footer from './Footer';

// The graph workspace (/graphs) is a viewport-filling map-style page: it
// carries its own Menu control for site navigation/settings, so it opts out
// of the standard NavBar+Footer chrome entirely rather than squeezing a full
// page layout under a fixed 72px navbar. Every other route keeps the normal
// shell. Person-profile pages and battle pages embed their own graph views
// separately and are unaffected -- this only matches the top-level page.
export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/graphs') return <>{children}</>;
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
