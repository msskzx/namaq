"use client"

import { useSearchParams } from 'next/navigation'
import { useLanguage } from '@/components/language/LanguageContext'
import translations from '@/components/language/translations'
import useSWR from 'swr'
import { Charity } from '@/types/charity'
import { fetcher } from '@/lib/swr'
import CharityCard from '@/components/charities/CharityCard'
import CharitySlider from '@/components/charities/CharitySlider'
import RandomCharityPicker from '@/components/charities/RandomCharityPicker'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'

export default function CharitiesPage() {
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const category = searchParams?.get('category')

  const { data: charities, isLoading, error } = useSWR<Charity[]>(
    `/api/charities${category ? `?category=${category}` : ''}`,
    fetcher
  )

  return (
    <div className='min-h-screen bg-white dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8'>
      <div className="container mx-auto">

        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-3xl text-gray-900 dark:text-white mb-2'>
              {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Charities` : translations[language].allCharities}
            </h1>
          </div>
        </div>

        <div className='mb-12'>
          <CharitySlider />
        </div>

        <div className='mb-12'>
          <RandomCharityPicker />
        </div>

        {isLoading ? (
          <div className='flex justify-center items-center'>
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorMessage title={translations[language].noCharitiesFound} description={translations[language].tryAdjustingSearch} />
        ) : !charities || charities.length === 0 ? (
          <p className='text-center text-black dark:text-white text-lg my-8'>
            {translations[language].noCharities}
          </p>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
            {charities.map((charity) => (
              <CharityCard key={charity.id} charity={charity} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}