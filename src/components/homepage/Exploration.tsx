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
  image: string;
}

export default function Explore() {
  const { language } = useLanguage();
  const t = translations[language];

  const exploreCards: ExploreCard[] = [
    {
      id: 'people',
      title: t.people,
      description: language === 'ar'
        ? 'اكتشف قصص الشخصيات البارزة في التاريخ الإسلامي'
        : 'Discover the stories of remarkable individuals in Islamic history',
      href: '/people',
      image: '/gemini_marketplace.png'
    },
    {
      id: 'graph',
      title: t.familyRelations,
      description: language === 'ar'
        ? 'استكشف شبكات العلاقات العائلية والتاريخية'
        : 'Explore family and historical relationship networks',
      href: '/graphs',
      image: '/gemini_halaqa.png'
    },
    {
      id: 'historical-events',
      title: t.events,
      description: language === 'ar'
        ? 'تعرف على الأحداث التاريخية والمعارك المهمة'
        : 'Learn about historical events and important battles',
      href: '/events',
      image: '/gemini_books.png'
    },
  ];

  return (
    <div className="container mt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {exploreCards.map((card) => (
          <ExplorationCard
            key={card.id}
            title={card.title}
            desc={card.description}
            url={card.href}
            img={card.image}
          />
        ))}
      </div>
    </div>
  );
}