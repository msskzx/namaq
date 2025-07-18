import { Suspense } from 'react';
import PeoplePageClient from './PeoplePageClient';

export default function PeoplePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Suspense fallback={<div>Loading...</div>}>
        <PeoplePageClient />
      </Suspense>
    </div>
  );
} 