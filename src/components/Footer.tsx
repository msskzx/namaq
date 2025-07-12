"use client";

import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 mt-12 border-t border-indigo-700">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <div className="text-center md:text-left">
                            <div className="text-lg font-bold mb-2">نَمَق</div>
                            <div className="text-sm opacity-90">&copy; {new Date().getFullYear()} Namaq. All rights reserved.</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <LanguageSwitcher />
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-indigo-500 text-center text-sm opacity-80">
                    <p>Learn Arabic language, Islamic history, and the teachings of Prophet Muhammad ﷺ</p>
                    <p className="mt-1" dir="rtl">تعلم اللغة العربية والتاريخ الإسلامي وتعاليم النبي محمد ﷺ</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 