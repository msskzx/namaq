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
      id: 'special-articles',
      title: t.specialArticles,
      description: language === 'ar'
        ? 'مقالات تفاعلية مصممة خصيصاً لتجربة تعلم فريدة'
        : 'Interactive articles designed for a unique learning experience',
      href: '/specials',
      image: '/gemini_scholar_colored.png'
    },
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
      image: '/mariam_kaaba.png'
    },
    {
      id: 'arabic-language',
      title: t.arabic,
      description: language === 'ar'
        ? 'تعلم اللغة العربية والكتب والقرآن والحديث'
        : 'Learn Arabic language, books, Quran, and Hadith',
      href: '/arabic',
      image: '/mariam_arabic_language.png'
    },
    {
      id: 'charities',
      title: t.allCharities,
      description: language === 'ar'
        ? 'اكتشف المنظمات الخيرية والجمعيات الإنسانية'
        : 'Discover charitable organizations and humanitarian societies',
      href: '/charities',
      image: '/gemini_children.png'
    }
  ];

  return (
    <div className="container mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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