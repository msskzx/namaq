"use client"

import React from 'react'
import { useLanguage } from '@/components/language/LanguageContext'
import translations from '@/components/language/translations'
import useSWR from 'swr'
import { Charity } from '@/types/charity'
import { fetcher } from '@/lib/swr'
import CharityCard from '@/components/charities/CharityCard'

export default function CharitiesPage() {
  const { language } = useLanguage()
  const { data: charities, isLoading, error } = useSWR<Charity[]>(`/api/charities`, fetcher)

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-3xl text-gray-900 dark:text-white'>
            {translations[language].allCharities}
          </h1>
          <p className='mt-3 max-w-2xl mx-auto text-sm text-gray-500 dark:text-gray-300 sm:mt-4'>
            {translations[language].charitiesFound?.(charities?.length || 0) ||
              `Found ${charities?.length || 0} organizations`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white'></div>
        </div>
      ) : error ? (
        <div className='text-center py-12'>
          <svg
            className='mx-auto h-12 w-12 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1}
              d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <h3 className='mt-2 text-lg font-medium text-gray-900 dark:text-white'>
            {translations[language].noCharitiesFound}
          </h3>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            {translations[language].tryAdjustingSearch}
          </p>
        </div>
      ) : !charities || charities.length === 0 ? (
        <p className='text-center text-black dark:text-white text-lg my-8'>
          {translations[language].noCharities}
        </p>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {charities.map((charity) => (
            <CharityCard key={charity.id} charity={charity} />
          ))}
        </div>
      )}
    </div>
  )
}