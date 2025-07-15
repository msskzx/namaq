'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { useSearchParams, useRouter } from 'next/navigation';
import translations from '@/components/translations';

export default function PeoplePage() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial filter from URL
  const initialTitle = searchParams.get('title') || '';
  const [titleFilter, setTitleFilter] = React.useState(initialTitle);
  const [people, setPeople] = React.useState<any[]>([]);

  // Update filter when URL changes (for back/forward navigation)
  React.useEffect(() => {
    setTitleFilter(searchParams.get('title') || '');
  }, [searchParams]);

  React.useEffect(() => {
    let url = '/api/people';
    if (titleFilter) {
      const params = new URLSearchParams({ title: titleFilter });
      url += `?${params.toString()}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then(setPeople);
  }, [titleFilter]);

  const isArabic = language === 'ar';

  // Update URL when filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitleFilter(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('title', value);
    } else {
      params.delete('title');
    }
    router.replace(`/people?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8" dir={isArabic ? 'rtl' : 'ltr'} style={{ textAlign: isArabic ? 'right' : 'left' }}>
      <h1 className="text-3xl font-bold mb-6">{translations[language]?.people}</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder={translations[language]?.search}
          value={titleFilter}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 w-full max-w-xs"
        />
      </div>
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