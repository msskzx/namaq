"use client";

import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import dynamic from 'next/dynamic';
import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import type { BattleWithParticipants } from "@/types/battle";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faLocationDot, faCalendarDays, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '@/components/LoadingSpinner';
import PersonNameCard from '@/components/PersonNameCard';

// Dynamically import the BattleMap component with SSR disabled
const BattleMap = dynamic(() => import('@/components/BattleMap'), {
  ssr: false, // Disable server-side rendering for the map component
  loading: () => <div className="h-[500px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
    <span className="text-gray-500">Loading map...</span>
  </div>
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BattleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const t = translations[language];
  const { data: battle, error, isLoading } = useSWR<BattleWithParticipants>(slug ? `/api/battles/${slug}` : null, fetcher);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-gray-900">
              <FontAwesomeIcon icon={faShieldHalved} className="text-amber-400 w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold text-amber-400">
              {battle ? (language === 'ar' ? battle.name : battle.nameEn || battle.name) : t.battles.title}
            </h1>
          </div>
          {error && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4">
              {t.battles.loadError}
            </div>
          )}
          {battle && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-amber-400 p-6 font-geistmono">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faLocationDot} className="text-amber-400 w-5 h-5" />
                  <span className="font-semibold text-gray-800 dark:text-gray-300">{language === 'ar' ? t.battles.location : t.battles.locationEn}:</span>
                  <span className="text-gray-800 dark:text-gray-300">{language === 'ar' ? battle.location : battle.locationEn || battle.location || '-'}</span>
                </div>
              </div>
              {battle.hijri_year && (
                <div className="mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-amber-400 w-5 h-5" />
                  <span className="font-semibold text-gray-800 dark:text-gray-300">{t.battles.hijriYear}:</span>
                  <span className="text-gray-800 dark:text-gray-300">{battle.hijri_year}</span>
                </div>
              )}
              {battle.latitude && battle.longitude && (
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="p-4 bg-amber-50 dark:bg-gray-800 flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapLocationDot} className="text-amber-500" />
                    <h3 className="font-semibold text-amber-800 dark:text-amber-400">
                      {language === 'ar' ? 'موقع المعركة على الخريطة' : 'Battle Location on Map'}
                    </h3>
                  </div>
                  <div className="h-[500px] w-full">
                    <BattleMap 
                      battles={[battle]} 
                      defaultCenter={{
                        lat: battle.latitude,
                        lng: battle.longitude
                      }}
                      defaultZoom={12}
                    />
                  </div>
                </div>
              )}
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200 mt-8">
                {language === 'ar' ? 'المشاركون' : 'Participants'}
              </h2>
              {battle.participations && battle.participations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {battle.participations.map((p: { person: { slug: string; name: string; nameAr?: string; nameEn?: string } }) => (
                    <PersonNameCard key={p.person.slug} person={{
                      slug: p.person.slug,
                      name: p.person.name,
                      nameEn: p.person.nameEn || p.person.name
                    }} language={language} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-4">
                  {language === 'ar' ? 'لا يوجد مشاركون في هذه المعركة.' : 'No participants in this battle.'}
                </div>
              )}
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default BattleDetailPage; 