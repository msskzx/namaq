"use client";

import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

// Every route keeps the same shell. /graphs used to opt out, being a
// viewport-filling workspace with a Menu of its own, but a graph fills the
// screen through a portal now (see GraphCanvas), so it covers this chrome
// while it is open and leaves a normal page underneath when it is not.
export default function AppChrome({ children }: { children: React.ReactNode }) {
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
