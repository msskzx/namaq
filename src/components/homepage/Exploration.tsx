"use client";

import React from 'react';
import { useLanguage } from '../language/LanguageContext';
import translations from '../language/translations';
import ExplorationCard from './ExplorationCard';

interface ExploreCard {
  id: string;
  title: string;
  description: string;
  href: string;
}

export default function Explore() {
  const { language } = useLanguage();
  const t = translations[language];

  const exploreCards: ExploreCard[] = [
    {
      id: 'graph',
      title: t.allGraph,
      description: language === 'ar'
        ? 'استكشف جميع الشبكات المتاحة'
        : 'Explore all available network graphs',
      href: '/graphs?kind=person'
    },
    {
      id: 'people',
      title: t.people,
      description: language === 'ar'
        ? 'اكتشف قصص الشخصيات البارزة في التاريخ الإسلامي'
        : 'Discover the stories of remarkable individuals in Islamic history',
      href: '/people'
    },
    {
      id: 'historical-events',
      title: t.events,
      description: language === 'ar'
        ? 'تعرف على الأحداث التاريخية والمعارك المهمة'
        : 'Learn about historical events and important battles',
      href: '/events'
    },
    {
      id: 'sources',
      title: t.sources,
      description: language === 'ar'
        ? 'اقرأ النصوص الأصلية التي بُنيت عليها المعلومات'
        : 'Read the original texts the information is built on',
      href: '/sources'
    },
  ];

  return (
    <div className="container mt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exploreCards.map((card) => (
          <ExplorationCard
            key={card.id}
            title={card.title}
            desc={card.description}
            url={card.href}
          />
        ))}
      </div>
    </div>
  );
}