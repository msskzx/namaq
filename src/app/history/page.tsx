"use client";

import { useLanguage } from '@/components/language/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faNetworkWired, faTags, faCalendarDay, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function HistoryPage() {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const historySections = [
    {
      title: isArabic ? 'الشخصيات' : 'People',
      description: isArabic
        ? 'استكشف سير الصحابة والتابعين والشخصيات البارزة في التاريخ الإسلامي'
        : 'Discover the biographies of companions, followers, and notable figures in Islamic history',
      icon: faUsers,
      href: '/people',
      color: 'from-amber-500 to-amber-600',
      hover: 'hover:from-amber-600 hover:to-amber-700',
    },
    {
      title: isArabic ? 'شبكة العلاقات' : 'Relationship Graph',
      description: isArabic
        ? 'افهم الروابط العائلية والاجتماعية بين الشخصيات التاريخية'
        : 'Understand family and social connections between historical figures',
      icon: faNetworkWired,
      href: '/graphs',
      color: 'from-blue-500 to-blue-600',
      hover: 'hover:from-blue-600 hover:to-blue-700',
    },
    {
      title: isArabic ? 'الألقاب' : 'Titles',
      description: isArabic
        ? 'استكشف الشخصيات حسب ألقابها'
        : 'Explore people by their titles',
      icon: faTags,
      href: '/titles',
      color: 'from-emerald-500 to-emerald-600',
      hover: 'hover:from-emerald-600 hover:to-emerald-700',
    },
    {
      title: isArabic ? 'الأحداث التاريخية' : 'Historical Events',
      description: isArabic
        ? 'تعرف على الأحداث الهامة في التاريخ الإسلامي'
        : 'Learn about important events in Islamic history',
      icon: faCalendarDay,
      href: '/events',
      color: 'from-purple-500 to-purple-600',
      hover: 'hover:from-purple-600 hover:to-purple-700',
    },
    {
      title: isArabic ? 'المعارك' : 'Battles',
      description: isArabic
        ? 'استكشف المعارك الفاصلة في التاريخ الإسلامي'
        : 'Explore decisive battles in Islamic history',
      icon: faShieldAlt,
      href: '/battles',
      color: 'from-rose-500 to-rose-600',
      hover: 'hover:from-rose-600 hover:to-rose-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isArabic ? 'التاريخ الإسلامي' : 'Islamic History'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {isArabic
              ? 'اكتشف ثراء التاريخ الإسلامي من خلال مواردنا الشاملة'
              : 'Discover the richness of Islamic history through our comprehensive resources'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historySections.map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="p-6">
                <div className={`w-14 h-14 mb-4 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center text-white`}>
                  <FontAwesomeIcon icon={section.icon} className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {section.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
