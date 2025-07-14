import Link from 'next/link';
import { getPeople } from '@/lib/db';
import type { Person } from '@/generated/prisma';

export default async function PeoplePage() {
  const people: Person[] = await getPeople();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">الشخصيات التاريخية</h1>
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