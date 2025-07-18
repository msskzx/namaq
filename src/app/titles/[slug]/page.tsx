"use client";

import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import useSWR from "swr";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import PersonNameCard from '@/components/PersonNameCard';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TitleDetailPage() {
  const { language } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const { data: title, error, isLoading } = useSWR(slug ? `/api/titles/${slug}` : null, fetcher);
  const { data: people, isLoading: isLoadingPeople } = useSWR(slug ? `/api/people?title=${slug}` : null, fetcher);
  return (
    <div className="min-h-screen bg-indigo-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <FontAwesomeIcon icon={faCrown} className="text-amber-400 w-10 h-10" />
              </div>
              <h1 className="text-4xl font-bold text-amber-400">
                {title ? (language === 'ar' ? title.name : title.nameEn) : translations[language].motivation.titles.title}
              </h1>
            </div>
            {error && (
              <div className="text-red-600 dark:text-red-400 text-center mb-4">
                {language === 'ar' ? 'تعذر تحميل اللقب.' : 'Failed to load title.'}
              </div>
            )}
            {title && (
              <div className="bg-white dark:bg-indigo-900 rounded-xl shadow-lg border border-amber-400 p-6 mb-8">
                {isLoadingPeople ? (
                  <LoadingSpinner />
                ) : people && people.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {people.map((person: import("@/generated/prisma").Person) => (
                      <PersonNameCard key={person.slug} person={person} language={language} />
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