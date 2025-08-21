"use client"

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faMapMarkerAlt, faCheckCircle, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook, faInstagram, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Charity } from '@/types/charity';
import useSWR from "swr";
import { fetcher } from '@/lib/swr';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useLanguage } from '@/components/language/LanguageContext';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function CharityPage() {
  const { language } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const { data: charity, error, isLoading } = useSWR<Charity>(`/api/charities/${slug}`, fetcher);

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage title={language === 'ar' ? 'حدث خطأ أثناء تحميل الجمعية' : 'Error loading charity'} description={String(error)} />
        </div>
      </div>
    );
  }

  if (isLoading || !charity) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const getSocialIcon = (name: string) => {
    const socialIcons: Record<string, IconDefinition> = {
      twitter: faTwitter,
      facebook: faFacebook,
      instagram: faInstagram,
      youtube: faYoutube,
      linkedin: faLinkedin,
      donate: faHandHoldingHeart,
    };

    return socialIcons[name.toLowerCase()] || faGlobe;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-64 w-full">
            {charity.img ? (
              <Image
                src={charity.img}
                alt={charity.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faHandHoldingHeart} className="text-3xl" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-20 w-20 rounded-full bg-white dark:bg-gray-900 border-4 border-white dark:border-gray-800 overflow-hidden">
                  {charity.img ? (
                    <Image
                      src={charity.img}
                      alt={charity.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {charity.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-white">{charity.name}</h1>
                  {charity.isVerified && (
                    <div className="flex items-center mt-1">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-blue-401 mr-1"
                      />
                      <span className="text-sm text-gray-200">Verified Organization</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {charity.categories.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {category.name}
                </span>
              ))}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">About</h2>
              <p className="text-gray-700 dark:text-gray-300">
                {charity.description || 'No description available.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Contact Information</h3>
                <ul className="space-y-2">
                  {(charity.city || charity.country) && (
                    <li className="flex items-start">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {[charity.city, charity.country].filter(Boolean).join(', ')}
                      </span>
                    </li>
                  )}

                  {charity.links?.map((link) => {
                    return (
                      <li key={link.name} className="flex items-start">
                        <FontAwesomeIcon
                          icon={getSocialIcon(link.name)}
                          className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
                        />
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {link.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
