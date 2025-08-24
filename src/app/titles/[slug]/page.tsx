"use client";

import { useLanguage } from "@/components/language/LanguageContext";
import translations from "@/components/language/translations";
import useSWR from "swr";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import PersonNameCard from '@/components/people/PersonNameCard';
import { PersonBase } from "@/types/person";

import { fetcher } from '@/lib/swr';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function TitleDetailPage() {
  const { language } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const { data: title, error, isLoading } = useSWR(slug ? `/api/titles/${slug}` : null, fetcher);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950">
                <FontAwesomeIcon icon={faCrown} className="text-amber-400 w-10 h-10" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {title ? (language === 'ar' ? title.name : title.nameTransliterated) : translations[language].motivation.titles.title}
              </h1>
            </div>
            {error && (
              <ErrorMessage title={language === 'ar' ? 'تعذر تحميل اللقب.' : 'Failed to load title.'} />
            )}
            {title && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-amber-400 p-6 mb-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200 mt-2">
                  {language === 'ar' ? 'الأشخاص' : 'People'}
                </h2>
                {title.people && title.people.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {title.people.map((person: PersonBase) => (
                      <PersonNameCard key={person.id} person={person} language={language} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    {language === 'ar' ? 'لا يوجد أشخاص بهذا اللقب.' : 'No people with this title.'}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 