"use client";

import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from './LanguageContext';

const Footer: React.FC = () => {
    const { language } = useLanguage();
    
    // Default to English if language is not available during SSR
    const currentLanguage = language || 'ar';
    
    return (
        <footer className="w-full bg-gray-950 text-amber-400 py-8 border-t-2 border-amber-400">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <div className="text-center md:text-left">
                            <div className="text-lg font-bold mb-2 text-amber-400">نَمَق</div>
                            <div className="text-sm opacity-90 text-amber-400">&copy; {new Date().getFullYear()} Namaq. All rights reserved.</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <LanguageSwitcher />
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-amber-400 text-center text-sm opacity-80">
                    {currentLanguage === 'ar' ? (
                        <>
                            <p dir="rtl" className="text-amber-400">تعلم اللغة العربية والتاريخ الإسلامي وتعاليم النبي محمد ﷺ</p>
                            <div className="mt-4">
                                <a href="/privacy" className="text-amber-400 hover:text-amber-300 transition-colors" dir="rtl">
                                    سياسة الخصوصية
                                </a>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-amber-400">Learn Arabic language, Islamic history, and the teachings of Prophet Muhammad ﷺ</p>
                            <div className="mt-4">
                                <a href="/privacy" className="text-amber-400 hover:text-amber-300 transition-colors">
                                    Privacy Policy
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer; 