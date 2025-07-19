'use client';

import React, { useState, useEffect } from 'react';
import type { Person, PersonRelation, Title } from '@/generated/prisma';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import PersonRelationsGraph from '@/components/PersonRelationsGraph';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageContext';
import translations from '@/components/translations';
import LoadingSpinner from '@/components/LoadingSpinner';
import Badge from '@/components/Badge';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PersonDetailPage = ({ params }: PageProps) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [person, setPerson] = useState<
    (Person & {
      titles: Title[];
      relationsFrom: (PersonRelation & { to: Person })[];
      relationsTo: (PersonRelation & { from: Person })[];
      participations?: { battle: { id: string; name: string; nameEn: string | null; slug: string } }[];
    }) | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const { slug } = await params;
        const response = await fetch(`/api/people/${slug}`);
        if (!response.ok) {
          setError(t.personLoadError);
          return;
        }
        const data = await response.json();
        setPerson(data);
      } catch {
        setError(t.personGenericError);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerson();
  }, [params, language, t]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-600 dark:text-red-400 text-lg my-8">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !person) {
    return (
      <div className="min-h-screen bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-4 gap-4">
          {person.picture ? (
            <Image src={person.picture} alt={person.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover border" />
          ) : (
            <span className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
              <FontAwesomeIcon icon={faUser} className="text-3xl text-gray-950 dark:text-gray-400" />
            </span>
          )}
          <h1 className="text-3xl font-bold text-center text-amber-400">{person.name}</h1>
          <div className="flex flex-wrap gap-2 justify-center">
            {person.titles && person.titles.length > 0 && person.titles.map((title) => (
              <Badge
                key={title.id}
                href={`/people?title=${title.slug}`}
                text={language === 'ar' && title.name ? title.name : title.nameEn || title.name}
                color="bg-indigo-100 dark:bg-indigo-950"
                className="text-xs font-semibold border border-amber-400"
              />
            ))}
            {person.participations && person.participations.length > 0 && person.participations.map((p) => (
              <Badge
                key={p.battle.id}
                href={`/battles/${p.battle.slug}`}
                text={language === 'ar' ? p.battle.name : p.battle.nameEn || p.battle.name}
                color="bg-yellow-100 dark:bg-yellow-800"
                className="text-xs font-semibold border border-amber-400"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {person.fullName && (
            <div className="bg-white dark:bg-indigo-950 rounded-lg shadow p-4">
              <div className="font-bold text-lg mb-2 text-amber-400">{t.fullName}</div>
              <div>{person.fullName}</div>
            </div>
          )}
          {person.appearance && (
            <div className="bg-white dark:bg-indigo-950 rounded-lg shadow p-4">
              <div className="font-bold text-lg mb-2 text-amber-400">{t.appearance}</div>
              <div>{person.appearance}</div>
            </div>
          )}
          {person.virtues && (
            <div className="bg-white dark:bg-indigo-950 rounded-lg shadow p-4">
              <div className="font-bold text-lg mb-2 text-amber-400">{t.virtues}</div>
              <div>{person.virtues}</div>
            </div>
          )}
          {(person.relationsFrom.length > 0 || person.relationsTo.length > 0) && (
            <div className="bg-white dark:bg-indigo-950 rounded-lg shadow p-4">
              <div className="font-bold text-lg mb-2 text-amber-400">{t.relations}</div>
              <PersonRelationsGraph person={person} relationsFrom={person.relationsFrom} relationsTo={person.relationsTo} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonDetailPage; 