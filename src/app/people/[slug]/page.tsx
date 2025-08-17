'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHexagonNodes, faSeedling, faSignature, faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Badge from '@/components/common/Badge';
import BattleParticipationTimeline from '@/components/battles/BattleParticipationTimeline';
import Timeline from '@/components/people/Timeline';
import type { PersonFull } from '@/types/person';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { EventWithBattle } from '@/types/event';
import GraphCanvas from '@/components/graph/GraphCanvas';

import { fetcher } from '@/lib/swr';
import { AyatGroup } from '@/components/quran/AyahCard';

function PersonDetailPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const { slug } = useParams<{ slug: string }>();
  const { data: person, error, isLoading } = useSWR<PersonFull>(slug ? `/api/people/${slug}` : null, fetcher);

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-600 dark:text-red-400 text-lg my-8">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !person) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-4 gap-4">
          {person.picture && (
            <Image src={person.picture} alt={person.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover border" />
          )}
          <h1 className="text-5xl font-bold text-center text-gray-900 dark:text-gray-200 mb-4">{person.name}</h1>
          <div className="flex flex-wrap gap-2 justify-center">
            {person.titles && person.titles.length > 0 && person.titles.map((title) => (
              <Badge
                key={title.id}
                href={`/people?title=${title.slug}`}
                text={language === 'ar' && title.name ? title.name : title.nameTransliterated || title.name}
                color="indigo"
              />
            ))}
          </div>
        </div>

        <Timeline events={person.events as EventWithBattle[] || []} />

        <div className="flex flex-col gap-6 mt-10">
          {person.fullName && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
              <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
                <FontAwesomeIcon icon={faSignature} className="w-7 h-7 text-amber-500 ml-2" />
                {t.fullName}</h2>
              <p className="text-gray-800 dark:text-gray-200 text-lg">{person.fullName}</p>
            </div>
          )}
          {person.appearance && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
              <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
                <FontAwesomeIcon icon={faUser} className="w-7 h-7 text-amber-500 ml-2" />
                {t.appearance}</h2>
              <p className="text-gray-800 dark:text-gray-200 text-lg">{person.appearance}</p>
            </div>
          )}
          {person.bioTextSiyarArabic && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
              <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
                <FontAwesomeIcon icon={faSeedling} className="w-7 h-7 text-amber-500 ml-2" />
                {language === 'ar' ? 'السيرة' : 'Bio'}</h2>
              <p className="text-gray-800 dark:text-gray-200 text-lg">{person.bioTextSiyarArabic}</p>
            </div>
          )}
          {person.virtues && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
              <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
                <FontAwesomeIcon icon={faSeedling} className="w-7 h-7 text-amber-500 ml-2" />
                {t.virtues}</h2>
              <p className="text-gray-800 dark:text-gray-200 text-lg">{person.virtues}</p>
            </div>
          )}
          {(person.relationsFrom.length > 0 || person.relationsTo.length > 0) && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
              <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
                <FontAwesomeIcon icon={faHexagonNodes} className="w-7 h-7 text-amber-500 ml-2" />
                {t.relations}
              </h2>
              <GraphCanvas url={`/api/graph?person=${slug}&ancestorsOf=${slug}`} targetSlug={slug} showSearch={false} />
            </div>
          )}

          {/* Battle Participation Timeline */}
          <BattleParticipationTimeline participations={person.participations || []} />

          {/* Quranic References */}
          <AyatGroup ayat={person.ayat || []} />
        </div>
      </div>
    </div>
  );
};

export default PersonDetailPage;