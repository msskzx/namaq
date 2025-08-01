'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import PersonRelationsGraph from '@/components/PersonRelationsGraph';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageContext';
import translations from '@/components/translations';
import LoadingSpinner from '@/components/LoadingSpinner';
import Badge from '@/components/Badge';
import type { Ayah } from '@/types/person';
import BattleParticipationTimeline from '@/components/BattleParticipationTimeline';
import Timeline from '@/components/Timeline';
import type { PersonFull } from '@/types/person';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { EventWithBattle } from '@/types/event';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PersonDetailPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { slug } = useParams<{ slug: string }>();
  const { data: person, error, isLoading } = useSWR<PersonFull>(slug ? `/api/people/${slug}` : null, fetcher);
  const [ayatText, setAyatText] = useState<Ayah[]>([]);

  useEffect(() => {
    const fetchAyatText = async () => {
      try {
        // Fetch ayah text for each ayat reference
        if (Array.isArray(person?.ayat) && person?.ayat.length > 0) {
          const fetchAyahText = async (surah: number, ayah: number): Promise<Ayah | null> => {
            const surahInfoRes = await fetch(`https://api.alquran.cloud/v1/surah/${surah}/ar.hafs`);
            const surahInfo = await surahInfoRes.json();
            if (!surahInfo.data || !Array.isArray(surahInfo.data.ayahs)) return null;
            const ayahObj = (surahInfo.data.ayahs as { numberInSurah: number; number: number }[]).find((a) => a.numberInSurah === ayah);
            if (!ayahObj) return null;
            const globalAyahNumber = ayahObj.number;
            const ayahRes = await fetch(`https://api.alquran.cloud/v1/ayah/${globalAyahNumber}/ar.hafs`);
            const ayahData = await ayahRes.json();
            if (ayahData.code === 200 && ayahData.data && ayahData.data.text) {
              return { surah, ayah, text: ayahData.data.text };
            }
            return null;
          };
          const fetchAllAyat = async () => {
            const results = await Promise.all(
              (person.ayat as Ayah[]).map((ref) =>
                ref && typeof ref.surah === 'number' && typeof ref.ayah === 'number'
                  ? fetchAyahText(ref.surah, ref.ayah)
                  : null
              )
            );
            setAyatText(results.filter((a): a is Ayah => !!a));
          };
          fetchAllAyat();
        } else {
          setAyatText([]);
        }
      } catch {
        setAyatText([]);

      }
    };
    fetchAyatText();
  }, [person?.ayat, language, t]);

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
        <Timeline events={person.events as EventWithBattle[] || [] } />
      
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
          {/* Quranic References (Ayat) */}
          {ayatText.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
              <div className="font-bold text-2xl mb-4 text-amber-400">{t.ayatReferences}</div>
              <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
                <div className="flex flex-col gap-4">
                  {ayatText.map((ref, idx) => (
                    <div
                      key={idx}
                      className="border border-amber-300 dark:border-amber-700 rounded-lg bg-amber-50 dark:bg-gray-800 p-4 shadow-sm"
                    >
                      <div className="text-lg font-semibold mb-2 text-amber-700 dark:text-amber-400">
                        {language === 'ar'
                          ? `سورة ${ref.surah}، آية ${ref.ayah}`
                          : `Surah ${ref.surah}:${ref.ayah}`}
                      </div>
                      <div className="text-2xl text-gray-800 dark:text-gray-200 font-arabic" style={{ fontFamily: 'Amiri, serif' }}>
                        {ref.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {(person.relationsFrom.length > 0 || person.relationsTo.length > 0) && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
              <div className="font-bold text-2xl mb-2 text-amber-400">{t.relations}</div>
              <PersonRelationsGraph person={person} relationsFrom={person.relationsFrom} relationsTo={person.relationsTo} />
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