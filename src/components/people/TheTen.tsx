"use client";

import { useLanguage } from '@/components/language/LanguageContext';
import translations from "@/components/language/translations";
import useSWR from 'swr';
import PersonCard from '../people/PersonCard';
import LoadingSpinner from '../common/LoadingSpinner';
import type { PersonWithTitles } from '@/types/person';
import type { Pagination } from '@/types/pagination';
import Link from 'next/link';
import { fetcher } from '@/lib/swr';
import Image from 'next/image';

export default function TheTen() {
  const { data: prophet, error: prophetError, isLoading: prophetLoading } = useSWR('/api/people/prophet-muhammad', fetcher);

  const { language } = useLanguage();
  const t = translations[language];

  const sortedSlugs = [
    'abu-bakr-as-siddiq',
    'umar-ibn-al-khattab',
    'uthman-ibn-affan',
    'ali-ibn-abi-talib',
    'talhah-ibn-ubaydullah',
    'az-zubayr-ibn-al-awwam',
    'saad-ibn-abi-waqqas',
    'abdur-rahman-ibn-awf',
    'saeed-ibn-zaid',
    'abu-ubaydah-ibn-al-jarrah',
  ];

  // Fetch people with the 'the-ten-promised-paradise' title
  const { data: response, error, isLoading } = useSWR<{
    data: PersonWithTitles[];
    pagination: Pagination;
  }>(
    `/api/people?title=the-ten-promised-paradise&limit=10`,
    fetcher
  );

  // Extract people from response and sort by slug
  const sortedPeople = response?.data?.sort((a, b) =>
    sortedSlugs.indexOf(a.slug) - sortedSlugs.indexOf(b.slug)
  );

  if (error) {
    return (
      <div className="mx-auto mt-8 text-center text-red-500">
        {t.peopleLoadError}
      </div>
    );
  }

  return (
    <div className="mx-auto">

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div >
          <h2 className="font-arabicDisplay text-gray-900 dark:text-gray-200 text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 text-center">
            {t.notablePeople}
          </h2>

          <p className="text-center text-gray-800 dark:text-gray-200 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-4xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'استكشف حياة العديد من الشخصيات التاريخية من خلال الجداول الزمنية والرسوم المتحركة والشخصيات التوضيحية، مما يجعل من التعلم تجربة فريدة.'
              : 'Explore the lives and events of many historical figures through clear timelines, animations, and interactive figures, making learning a unique experience.'}
          </p>

          <div className="text-center mt-8">
            <Link href="/people" className="inline-flex items-center px-6 py-3 bg-amber-400 text-gray-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base">
              {language === 'ar' ? 'عرض جميع الشخصيات' : 'View All People'}
            </Link>
          </div>
        </div>

        <div className="min-h-[500px] mb-8">
          <Image
            src="/gemini_halaqa.png"
            alt="The Ten Promised Paradise"
            width={500}
            height={500}
            className="mx-auto mb-8 w-full h-full rounded-2xl"
          />
        </div>
      </div>

      {prophetError && (
        <div className="text-red-600 dark:text-red-400 text-center mb-4 text-sm md:text-base">
          {language === 'ar' ? 'حدث خطأ في تحميل بيانات النبي' : 'Error loading Prophet data'}
        </div>
      )}

      {prophetLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="mx-auto">
          <PersonCard person={prophet} language={language} />
        </div>
      )}

      {/* The Ten Promised Paradise */}
      {isLoading ? (
        <div className="flex justify-center my-8">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 mt-8 gap-6">
          {Array.isArray(sortedPeople) && sortedPeople.length > 0 ? (
            sortedPeople.map((person) => (
              <div key={person.id} className="h-full">
                <PersonCard person={person} language={language} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 dark:text-gray-400 py-4">
              {t.peopleNotFound}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
