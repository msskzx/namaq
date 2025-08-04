'use client';

import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { useSearchParams, useRouter } from 'next/navigation';
import translations from '@/components/translations';
import PeopleFilter from '@/components/people/PeopleFilter';
import type { Title } from '@/generated/prisma';
import LoadingSpinner from '@/components/LoadingSpinner';
import PersonCard from '@/components/people/PersonCard';
import { PersonWithTitles } from '@/types/person';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PeoplePage = () => {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial filters from URL
  const initialTitle = searchParams.get('title') || '';
  const initialSearch = searchParams.get('search') || '';
  const [titleFilter, setTitleFilter] = React.useState(initialTitle);
  const [search, setSearch] = React.useState(initialSearch);

  // Build dynamic URL based on filters
  const filteredUrl = `/api/people?${new URLSearchParams({
    ...(titleFilter ? { title: titleFilter } : {}),
    ...(search ? { search } : {}),
  }).toString()}`;

  const { data: people, error: peopleError, isLoading: isLoadingPeople } = useSWR<PersonWithTitles[]>(filteredUrl, fetcher);
  const { data: titles, error: titlesError, isLoading: isLoadingTitles } = useSWR<Title[]>("/api/titles", fetcher);

  // Update filters when URL changes (for back/forward navigation)
  React.useEffect(() => {
    setTitleFilter(searchParams.get('title') || '');
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const isArabic = language === 'ar';

  // Update URL when filters change
  const handleTitleChange = (value: string) => {
    setTitleFilter(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('title', value);
    } else {
      params.delete('title');
    }
    router.replace(`/people?${params.toString()}`);
    router.refresh();
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.replace(`/people?${params.toString()}`);
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-8" dir={isArabic ? 'rtl' : 'ltr'} style={{ textAlign: isArabic ? 'right' : 'left' }}>
      <h1 className="text-3xl font-bold mb-6 text-center text-amber-400">{translations[language]?.people}</h1>
      <PeopleFilter
        titles={titles || []}
        selectedTitle={titleFilter}
        onTitleChange={handleTitleChange}
        search={search}
        onSearchChange={handleSearchChange}
        language={language as 'en' | 'ar'}
      />
      {peopleError || titlesError ? (
        <p className="text-center text-red-600">
          {translations[language]?.personLoadError}
        </p>
      ) : null}

      {(isLoadingPeople || isLoadingTitles) ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
          {people?.map((person) => (
            <div key={person.slug}>
              <PersonCard person={person} language={language} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PeoplePage;
