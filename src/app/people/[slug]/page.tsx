'use client';

import React, { useState, useEffect } from 'react';
import type { Person, PersonRelation, Title } from '@/generated/prisma';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShield, faCalendarAlt, faTimeline } from '@fortawesome/free-solid-svg-icons';
import PersonRelationsGraph from '@/components/PersonRelationsGraph';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageContext';
import translations from '@/components/translations';
import LoadingSpinner from '@/components/LoadingSpinner';
import Badge from '@/components/Badge';
import type { Ayah } from '@/types/person';
import Link from 'next/link';

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
      participations?: { 
        battle: { 
          id: string; 
          name: string; 
          nameEn: string | null; 
          slug: string;
          hijri_year: number | null;
          location: string | null;
          locationEn: string | null;
        };
        status: string[];
      }[];
      ayat?: Ayah[];
    }) | null
  >(null);
  const [ayatText, setAyatText] = useState<Ayah[]>([]);
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
        // Fetch ayah text for each ayat reference
        if (Array.isArray(data.ayat) && data.ayat.length > 0) {
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
              (data.ayat as Ayah[]).map((ref) =>
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
        setError(t.personGenericError);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerson();
  }, [params, language, t]);

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
                text={language === 'ar' && title.name ? title.name : title.nameEn || title.name}
                color="bg-indigo-100 dark:bg-indigo-900"
                className="text-s font-semibold border border-amber-400"
              />
            ))}
            {person.participations && person.participations.length > 0 && person.participations.map((p) => (
              <Badge
                key={p.battle.id}
                href={`/battles/${p.battle.slug}`}
                text={language === 'ar' ? p.battle.name : p.battle.nameEn || p.battle.name}
                color="bg-yellow-100 dark:bg-amber-900"
                className="text-s font-semibold border border-amber-400"
              />
            ))}
          </div>
        </div>

        
        {/* Horizontal Timeline */}
        {person.participations && person.participations.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
            <div className="font-bold text-xl mb-6 text-amber-400 flex items-center gap-2">
              <FontAwesomeIcon icon={faTimeline} className="w-5 h-5" />
              {language === 'ar' ? 'الخط الزمني' : 'Timeline'}
            </div>
            
            <div className="relative overflow-x-auto pb-4">
              <div className="flex items-center min-w-max px-4">
                {/* Timeline line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-400 transform -translate-y-1/2 z-0 min-w-[1700px]"></div>
                
                {person.participations
                  .sort((a, b) => (a.battle.hijri_year || 0) - (b.battle.hijri_year || 0))
                  .map((participation) => (
                    <div key={participation.battle.id} className="relative flex flex-col items-center mx-8 first:ml-0 last:mr-0">
                      {/* Battle Name above dot */}
                      <Link 
                        href={`/battles/${participation.battle.slug}`}
                        className="group mb-4 text-center"
                      >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 px-3 py-2 min-w-max transition-all duration-200 hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors whitespace-nowrap">
                            {language === 'ar' ? participation.battle.name : participation.battle.nameEn || participation.battle.name}
                          </h3>
                        </div>
                      </Link>
                      
                      {/* Timeline dot */}
                      <div className="w-4 h-4 top-1/2 left-0 right-0 bg-amber-400 rounded-full border-4 border-amber-400 dark:border-gray-900 z-10 shadow-sm"></div>
                      
                      {/* Year below dot */}
                      {participation.battle.hijri_year && (
                        <div className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                          {participation.battle.hijri_year} {language === 'ar' ? 'هـ' : 'AH'}
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}
      
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

          {/* Battle Timeline */}
          {person.participations && person.participations.length > 0 && (
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg shadow p-6">
              <div className="font-bold text-2xl mb-6 text-amber-400 flex items-center gap-2">
                <FontAwesomeIcon icon={faShield} className="w-6 h-6" />
                {language === 'ar' ? 'المعارك والغزوات' : 'Battles & Expeditions'}
              </div>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-amber-400"></div>
                
                {person.participations
                  .sort((a, b) => (a.battle.hijri_year || 0) - (b.battle.hijri_year || 0))
                  .map((participation) => (
                    <div key={participation.battle.id} className="relative flex items-start mb-8 last:mb-0">
                      {/* Timeline dot */}
                      <div className="absolute left-6 w-4 h-4 bg-amber-400 rounded-full border-4 border-white dark:border-gray-900 z-10"></div>
                      
                      {/* Content - Clickable Card */}
                      <Link 
                        href={`/battles/${participation.battle.slug}`}
                        className="ml-16 w-full block group"
                      >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 w-full transition-all duration-200 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-500 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                              {language === 'ar' ? participation.battle.name : participation.battle.nameEn || participation.battle.name}
                            </h3>
                            {participation.battle.hijri_year && (
                              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                                <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4" />
                                <span>{participation.battle.hijri_year} {language === 'ar' ? 'هـ' : 'AH'}</span>
                              </div>
                            )}
                          </div>
                          
                          {participation.battle.location && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <span className="font-medium">{language === 'ar' ? 'الموقع:' : 'Location:'}</span> 
                              {language === 'ar' ? participation.battle.location : participation.battle.locationEn || participation.battle.location}
                            </div>
                          )}
                          
                          {participation.status && participation.status.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {participation.status.map((status, statusIndex) => (
                                <span 
                                  key={statusIndex}
                                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                                    status === 'MARTYRED' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                    status === 'INJURED' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                    status === 'CAPTURED' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                    status === 'ABSENT_EXCUSED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                  }`}
                                >
                                  {language === 'ar' ? (
                                    status === 'MARTYRED' ? 'استشهد' :
                                    status === 'INJURED' ? 'جُرح' :
                                    status === 'CAPTURED' ? 'أُسر' :
                                    status === 'ABSENT_EXCUSED' ? 'غائب بعذر' :
                                    status
                                  ) : (
                                    status === 'MARTYRED' ? 'Martyred' :
                                    status === 'INJURED' ? 'Injured' :
                                    status === 'CAPTURED' ? 'Captured' :
                                    status === 'ABSENT_EXCUSED' ? 'Absent (Excused)' :
                                    status
                                  )}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonDetailPage; 