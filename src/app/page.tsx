"use client";

import { useLanguage } from "@/components/language/LanguageContext";
import Exploration from "@/components/homepage/Exploration";
import Hero from "@/components/homepage/Hero";

export default function Home() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 relative overflow-x-hidden">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 z-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>

        <Hero />

        <Exploration />

      </div>
    </div>
  );
}