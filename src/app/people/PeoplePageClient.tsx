'use client';

import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { useSearchParams, useRouter } from 'next/navigation';
import translations from '@/components/translations';
import PeopleFilter from '@/components/PeopleFilter';
import type { Title } from '@/generated/prisma';
import LoadingSpinner from '@/components/LoadingSpinner';
import PersonCard from '@/components/PersonCard';
import { PersonWithTitles } from '@/types/person';

export default function PeoplePageClient() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial filters from URL
  const initialTitle = searchParams.get('title') || '';
  const initialSearch = searchParams.get('search') || '';
  const [titleFilter, setTitleFilter] = React.useState(initialTitle);
  const [search, setSearch] = React.useState(initialSearch);
  const [people, setPeople] = React.useState<PersonWithTitles[]>([]);
  const [titles, setTitles] = React.useState<Title[]>([]);
  const [loadingPeople, setLoadingPeople] = React.useState(true);
  const [loadingTitles, setLoadingTitles] = React.useState(true);

  // Fetch titles on mount
  React.useEffect(() => {
    fetch('/api/titles')
      .then(res => res.json())
      .then((data) => {
        setTitles(data);
        setLoadingTitles(false);
      });
  }, []);

  // Update filters when URL changes (for back/forward navigation)
  React.useEffect(() => {
    setTitleFilter(searchParams.get('title') || '');
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch people when filters change
  React.useEffect(() => {
    let url = '/api/people';
    const params = new URLSearchParams();
    if (titleFilter) params.set('title', titleFilter);
    if (search) params.set('search', search);
    if ([...params].length > 0) url += `?${params.toString()}`;
    setLoadingPeople(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPeople(data);
        setLoadingPeople(false);
      });
  }, [titleFilter, search]);

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
  };

  return (
    <div className="container mx-auto px-4 py-8" dir={isArabic ? 'rtl' : 'ltr'} style={{ textAlign: isArabic ? 'right' : 'left' }}>
      <h1 className="text-3xl font-bold mb-6 text-center text-amber-400">{translations[language]?.people}</h1>
      <PeopleFilter
        titles={titles}
        selectedTitle={titleFilter}
        onTitleChange={handleTitleChange}
        search={search}
        onSearchChange={handleSearchChange}
        language={language as 'en' | 'ar'}
      />
      {(loadingPeople || loadingTitles) ? (
        <LoadingSpinner />
      ) : (
        <>
          <ul className="space-y-4">
            {people.map((person) => (
              <li key={person.slug}>
                <PersonCard person={person} language={language} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
} 