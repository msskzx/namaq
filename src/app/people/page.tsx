'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import translations from '@/components/translations';
import PeopleFilter from '@/components/people/PeopleFilter';
import type { Title } from '@/generated/prisma';
import LoadingSpinner from '@/components/LoadingSpinner';
import PersonCard from '@/components/people/PersonCard';
import { PersonWithTitles } from '@/types/person';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import type { Pagination } from '@/types/pagination';

const PAGE_SIZE = 12;

const getKey = (
  pageIndex: number,
  previousPageData: { pagination: Pagination } | null,
  title: string,
  search: string
) => {
  // Reached the end if no more pages
  if (previousPageData && !previousPageData.pagination.hasNextPage) return null;
  
  const params = new URLSearchParams({
    page: (pageIndex + 1).toString(),
    limit: PAGE_SIZE.toString(),
    ...(title ? { title } : {}),
    ...(search ? { search } : {}),
  });
  
  return `/api/people?${params.toString()}`;
};

const fetcher = <T,>(url: string): Promise<T> =>
  fetch(url).then((res) => res.json() as Promise<T>);

const PeoplePage = () => {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  // Debounce timer ref for infinite scroll
  const loadMoreTimeoutRef = useRef<number | null>(null);
  // Track previous inView to only trigger on rising-edge
  const prevInViewRef = useRef<boolean>(false);

  // Read initial filters from URL
  const initialTitle = searchParams.get('title') || '';
  const initialSearch = searchParams.get('search') || '';
  const [titleFilter, setTitleFilter] = useState(initialTitle);
  const [search, setSearch] = useState(initialSearch);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // SWR Infinite hook for pagination
  const {
    data: peoplePages,
    error: peopleError,
    setSize,
    isValidating,
  } = useSWRInfinite<{ data: PersonWithTitles[]; pagination: Pagination }>(
    (pageIndex, previousPageData) => getKey(pageIndex, previousPageData, titleFilter, search),
    fetcher,
    {
      revalidateFirstPage: false,
    }
  );
  
  // Flatten the paginated data into a single array of people
  const allPeople = React.useMemo(() => {
    return peoplePages?.flatMap(page => page.data) || [];
  }, [peoplePages]);

  // Determine if there are more pages to load
  const hasNextPage = React.useMemo(() => {
    if (!peoplePages || peoplePages.length === 0) return true;
    const last = peoplePages[peoplePages.length - 1];
    return !!last?.pagination?.hasNextPage;
  }, [peoplePages]);

  const { data: titles, error: titlesError, isLoading: isLoadingTitles } = useSWR<Title[]>("/api/titles", fetcher);
  
  // Load more when scroll to bottom
  useEffect(() => {
    const isRisingEdge = inView && !prevInViewRef.current;
    if (isRisingEdge && !isValidating && !isInitialLoad && hasNextPage) {
      // Clear any pending debounce
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }
      // Debounce the load-more to avoid rapid successive triggers
      loadMoreTimeoutRef.current = window.setTimeout(() => {
        setSize((prev) => prev + 1);
      }, 250);
    }
    // Cleanup on dependency change/unmount
    return () => {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
        loadMoreTimeoutRef.current = null;
      }
    };
  }, [inView, isValidating, isInitialLoad, hasNextPage, setSize]);

  // Update previous inView after effect runs
  useEffect(() => {
    prevInViewRef.current = inView;
  }, [inView]);
  
  // Mark initial load completed once mounted
  useEffect(() => {
    if (isInitialLoad) setIsInitialLoad(false);
  }, [isInitialLoad]);

  // Update filters when URL changes (for back/forward navigation)
  // Depend on the serialized search params rather than the unstable object reference
  useEffect(() => {
    const newTitle = searchParams.get('title') || '';
    const newSearch = searchParams.get('search') || '';

    if (newTitle !== titleFilter) setTitleFilter(newTitle);
    if (newSearch !== search) setSearch(newSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

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

      {(isInitialLoad && (!peoplePages || peoplePages.length === 0)) || isLoadingTitles ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {allPeople.map((person) => (
              <div key={person.slug}>
                <PersonCard person={person} language={language} />
              </div>
            ))}
          </div>
          
          {/* Loading spinner at the bottom when loading more */}
          <div ref={loadMoreRef} className="mt-8 flex justify-center">
            {isValidating && !isInitialLoad && <LoadingSpinner />}
          </div>
          
          {/* Show end of results message */}
          {!isValidating && peoplePages && peoplePages.length > 0 && !peoplePages[peoplePages.length - 1]?.pagination.hasNextPage && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
              {translations[language]?.noMoreResults || 'No more results'}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default PeoplePage;
