"use client";

import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faMosque, faPen, faLandmark, faDove, faFilm } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Namaq in English and Arabic */}
        <header className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-800 dark:text-white mb-4">
            {translations[language].title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
            {translations[language].intro}
          </p>
        </header>

        {/* Definition Cards */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Noun Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center" dir="rtl">
                {translations[language].nounTitle}
              </h4>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center" dir="rtl">
                {translations[language].nounDefinition}
              </p>
            </div>

            {/* Verb Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center" dir="rtl">
                {translations[language].verbTitle}
              </h4>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center mb-4" dir="rtl">
                {translations[language].verbDefinition}
              </p>
              <div className="space-y-2">
                {translations[language].verbForms.map((form, index) => (
                  <p key={index} className="text-sm text-gray-600 dark:text-gray-300 text-center" dir="rtl">
                    {form}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Educational Categories */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
            {translations[language].whyLearn}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 - Arabic Language */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faBook} className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-3" />
                <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                  {translations[language].arabicLanguage}
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {translations[language].arabicLanguageDesc}
              </p>
            </div>

            {/* Card 2 - Islamic History */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faMosque} className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                  {translations[language].islamicHistory}
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {translations[language].islamicHistoryDesc}
              </p>
            </div>

            {/* Card 3 - Grammar & Structure */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faPen} className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
                <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                  {translations[language].grammarMastery}
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {translations[language].grammarMasteryDesc}
              </p>
            </div>

            {/* Card 4 - Cultural Heritage */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faLandmark} className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
                <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                  {translations[language].culturalHeritage}
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {translations[language].culturalHeritageDesc}
              </p>
            </div>

            {/* Card 5 - Spiritual Growth */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faDove} className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                  {translations[language].spiritualGrowth}
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {translations[language].spiritualGrowthDesc}
              </p>
            </div>

            {/* Card 6 - Interactive Learning */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faFilm} className="w-6 h-6 text-red-600 dark:text-red-400 mr-3" />
                <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                  {translations[language].interactiveLearning}
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {translations[language].interactiveLearningDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
            {translations[language].startJourney}
          </button>
        </div>
      </div>
    </div>
  );
}
