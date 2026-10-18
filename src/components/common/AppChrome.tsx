"use client";

import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import styles from '../homepage/Home.module.css';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-screen flex flex-col ${styles.theme}`}>
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
