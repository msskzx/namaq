'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { useSearchParams, useRouter } from 'next/navigation';
import translations from '@/components/translations';
import PeopleFilter from '@/components/PeopleFilter';

interface Title {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
}

export default function PeoplePage() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial filters from URL
  const initialTitle = searchParams.get('title') || '';
  const initialSearch = searchParams.get('search') || '';
  const [titleFilter, setTitleFilter] = React.useState(initialTitle);
  const [search, setSearch] = React.useState(initialSearch);
  const [people, setPeople] = React.useState<any[]>([]);
  const [titles, setTitles] = React.useState<Title[]>([]);

  // Fetch titles on mount
  React.useEffect(() => {
    fetch('/api/titles')
      .then(res => res.json())
      .then(setTitles);
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
    fetch(url)
      .then((res) => res.json())
      .then(setPeople);
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
      <h1 className="text-3xl font-bold mb-6">{translations[language]?.people}</h1>
      <PeopleFilter
        titles={titles}
        selectedTitle={titleFilter}
        onTitleChange={handleTitleChange}
        search={search}
        onSearchChange={handleSearchChange}
        language={language as 'en' | 'ar'}
      />
      <ul className="space-y-4">
        {people.map((person) => (
          <li key={person.slug} className="bg-white dark:bg-gray-800 rounded shadow p-4">
            <Link href={`/people/${person.slug}`}
              className="text-xl font-semibold text-blue-600 hover:underline">
              {person.name}
            </Link>
            {person.fullName && (
              <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">{person.fullName}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 