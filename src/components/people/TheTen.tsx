import { useLanguage } from '@/components/language/LanguageContext';
import translations from "@/components/language/translations";
import useSWR from 'swr';
import PersonCard from '../people/PersonCard';
import LoadingSpinner from '../common/LoadingSpinner';
import type { PersonWithTitles } from '@/types/person';
import type { Pagination } from '@/types/pagination';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function TheTen() {
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

export default TheTen;
