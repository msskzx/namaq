import { Suspense } from 'react';
import PersonPage from './PersonPage';

export default function PeoplePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Suspense fallback={<div>Loading...</div>}>
        <PersonPage />
      </Suspense>
    </div>
  );
} 