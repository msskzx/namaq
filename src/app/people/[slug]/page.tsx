'use client';

import React, { useState, useEffect } from 'react';
import type { Person, PersonRelation } from '@/generated/prisma';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import PersonRelationsGraph from '@/components/PersonRelationsGraph';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PersonDetailPage = ({ params }: PageProps) => {
  const [person, setPerson] = useState<
    (Person & {
      relationsFrom: (PersonRelation & { to: Person })[];
      relationsTo: (PersonRelation & { from: Person })[];
    }) | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const { slug } = await params;
        const response = await fetch(`/api/people/${slug}`);
        if (!response.ok) {
          setError('تعذر تحميل بيانات الشخصية');
          return;
        }
        const data = await response.json();
        setPerson(data);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerson();
  }, [params]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600 dark:text-red-400 text-lg my-8">{error}</p>
      </div>
    );
  }

  if (isLoading || !person) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-4 gap-4">
        {person.picture ? (
          <img src={person.picture} alt={person.name} className="w-16 h-16 rounded-full object-cover border" />
        ) : (
          <span className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
            <FontAwesomeIcon icon={faUser} className="text-3xl text-gray-500 dark:text-gray-300" />
          </span>
        )}
        <h1 className="text-3xl font-bold text-center">{person.name}</h1>
      </div>

      <div className="grid gap-6 max-w-xl mx-auto">
        {person.fullName && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4" dir="rtl">
            <div className="font-bold text-lg mb-2">الاسم الكامل</div>
            <div>{person.fullName}</div>
          </div>
        )}
        {person.appearance && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4" dir="rtl">
            <div className="font-bold text-lg mb-2">الهيئة</div>
            <div>{person.appearance}</div>
          </div>
        )}
        {person.virtues && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4" dir="rtl">
            <div className="font-bold text-lg mb-2">الفضائل</div>
            <div>{person.virtues}</div>
          </div>
        )}
        {(person.relationsFrom.length > 0 || person.relationsTo.length > 0) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4" dir="rtl">
            <div className="font-bold text-lg mb-2">العلاقات</div>
            <PersonRelationsGraph person={person} relationsFrom={person.relationsFrom} relationsTo={person.relationsTo} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonDetailPage; 