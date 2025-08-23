"use client"

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/language/LanguageContext'
import translations from '@/components/language/translations'
import { Charity } from '@/types/charity'
import CharityCard from './CharityCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function CharityPicker() {
    const { language } = useLanguage()
    const [randomCharity, setRandomCharity] = useState<Charity | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const pickRandomCharity = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/charities/random')
            if (response.ok) {
                const charity = await response.json()
                setRandomCharity(charity)
            } else {
                console.error('Failed to fetch random charity')
            }
        } catch (error) {
            console.error('Error fetching random charity:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        // Pick a random charity on component mount
        pickRandomCharity()
    }, [])

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 mb-8 border border-blue-200 dark:border-blue-800" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Right column - Text content */}
                <div className="flex flex-col justify-center text-center">
                    <div className="mb-6">
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-3">
                            {translations[language].randomCharityTitle}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            {translations[language].randomCharityMotivation}
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={pickRandomCharity}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    {translations[language].pickingCharity}
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    {translations[language].pickRandomCharity}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Left column - Charity Card or Loading State */}
                <div className="flex flex-col">
                    {randomCharity ? (
                        <>
                            <div className="text-center mb-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                    {translations[language].suggestedCharity}
                                </p>
                            </div>
                            <CharityCard charity={randomCharity} />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64">
                            <LoadingSpinner size="lg" />
                            <p className="text-gray-500 dark:text-gray-400 mt-4">
                                {translations[language].loading}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
