'use client';

// docs/plans/quran-repetition-merge.md
import React, { useEffect, useState } from 'react';
import type { Repetition } from '@/lib/quran/repetition';
import RepetitionView from './RepetitionView';

export default function RepetitionLoader() {
  const [data, setData] = useState<Repetition | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    fetch('/api/quran/repetition')
      .then(res => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<Repetition>;
      })
      .then(body => { if (live) setData(body); })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, []);

  if (data) return <RepetitionView data={data} />;
  return (
    <p dir="rtl" role={failed ? 'alert' : 'status'} className="max-w-5xl mx-auto p-4 text-gray-600 dark:text-gray-400">
      {failed ? 'تعذر تحميل البيانات.' : 'جارٍ التحميل…'}
    </p>
  );
}
