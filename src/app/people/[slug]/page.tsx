'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
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
          {person.picture ? (
            <Image src={person.picture} alt={person.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover border" />
          ) : (
            <span className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
              <FontAwesomeIcon icon={faUser} className="text-3xl text-gray-950 dark:text-gray-400" />
            </span>
          )}
          <h1 className="text-5xl font-bold text-center text-amber-400 mb-4">{person.name}</h1>
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


        {/* Horizontal Timeline */}
        <Timeline events={person.events as EventWithBattle[] || []} />

        <div className="flex flex-col gap-6 mt-10">
          {person.fullName && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
              <div className="font-bold text-2xl mb-2 text-amber-400">{t.fullName}</div>
              <div className="text-gray-800 dark:text-gray-200">{person.fullName}</div>
            </div>
          )}
          {person.appearance && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
              <div className="font-bold text-2xl mb-2 text-amber-400">{t.appearance}</div>
              <div className="text-gray-800 dark:text-gray-200">{person.appearance}</div>
            </div>
          )}
          {person.virtues && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
              <div className="font-bold text-2xl mb-2 text-amber-400">{t.virtues}</div>
              <div className="text-gray-800 dark:text-gray-200">{person.virtues}</div>
            </div>
          )}
          {(person.relationsFrom.length > 0 || person.relationsTo.length > 0) && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
              <div className="font-bold text-2xl mb-2 text-amber-400">{t.relations}</div>
              <GraphCanvas url={`/api/graph?person=${slug}`} targetSlug={slug} />
            </div>
          )}

          {/* Battle Participation Timeline */}
          <BattleParticipationTimeline participations={person.participations || []} />
        </div>
      </div>
    </div>
  );
};

export default PersonDetailPage;