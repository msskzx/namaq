"use client";

import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { usePathname } from 'next/navigation';
import styles from '../homepage/Home.module.css';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const isHome = usePathname() === '/';
  return (
    <div className={`min-h-screen flex flex-col ${isHome ? styles.theme : ''}`}>
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
