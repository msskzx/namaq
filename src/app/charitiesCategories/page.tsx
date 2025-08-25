"use client"

import React from 'react'
import { useLanguage } from '@/components/language/LanguageContext'
import translations from '@/components/language/translations'
import useSWR from 'swr'
import { CharityCategory } from '@/types/charity'
import { fetcher } from '@/lib/swr'
import CharityCategoryCard from '@/components/charities/CharityCategoryCard'
import CharityCategoryHero from '@/components/charities/CharityCategoryHero'
import ErrorMessage from '@/components/common/ErrorMessage'

export default function CharitiesPage() {
  const { language } = useLanguage()
  const { data: charitiesCategories, isLoading, error } = useSWR<CharityCategory[]>(`/api/charitiesCategories`, fetcher)

  return (
    <div className='min-h-screen bg-white dark:bg-gray-950'>
      <div className='container mx-auto px-4 py-8'>
        <CharityCategoryHero />

        <div className='mt-16'>
          {isLoading ? (
            <div className='flex justify-center items-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white'></div>
            </div>
          ) : error ? (
            <ErrorMessage title={translations[language].noCharitiesFound} description={translations[language].tryAdjustingSearch} />
          ) : !charitiesCategories || charitiesCategories.length === 0 ? (
            <p className='text-center text-black dark:text-white text-lg my-8'>
              {translations[language].noCharities}
            </p>
          ) : (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {charitiesCategories?.map((charityCategory) => (
                <CharityCategoryCard key={charityCategory.id} category={charityCategory} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}