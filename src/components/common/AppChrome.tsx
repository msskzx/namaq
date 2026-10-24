"use client";

import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

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
