'use client';

// docs/plans/quran-repetition-merge.md
import React, { createContext, useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeCompare } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import { num } from '@/lib/quran/arabicNumber';
import type { Repetition } from '@/lib/quran/repetition';
import { NOTE, PANEL } from '../panel';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className={PANEL}>
      <div className="text-3xl text-[var(--home-accent)]">{num(value)}</div>
      <div className={NOTE}>{label}</div>
    </div>
  );
}

const RepetitionContext = createContext<{ data: Repetition | null; failed: boolean }>({ data: null, failed: false });

export function RepetitionProvider({ children }: { children: React.ReactNode }) {
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

  return <RepetitionContext.Provider value={{ data, failed }}>{children}</RepetitionContext.Provider>;
}

export function useRepetition() {
  return useContext(RepetitionContext).data;
}

function Status() {
  const { failed } = useContext(RepetitionContext);
  return failed ? <p role="alert" className={NOTE}>تعذر تحميل البيانات.</p> : <LoadingSpinner />;
}

export function RepetitionStats() {
  const { data } = useContext(RepetitionContext);
  return (
    <section className={`${PANEL} flex flex-col gap-3`}>
      <h2 className="text-2xl">تكرار العبارات</h2>
      <p className={NOTE}>عبارات تتكرر بلفظها داخل السورة الواحدة وبين السور.</p>
      {!data ? <Status /> : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Tile value={data.surahs.length} label="سورة" />
          <Tile value={data.within.length} label="عبارة تتكرر داخل سورة" />
          <Tile value={data.across.length} label="نص مشترك بين سور" />
          <Tile value={new Set(data.cells.filter(c => c.a !== c.b).flatMap(c => [c.a, c.b])).size} label="سورة فيها نص مشترك" />
        </div>
      )}
      <Button size="sm" href="/quran/compare" className="w-fit">
        <FontAwesomeIcon icon={faCodeCompare} />
        قارن السور
      </Button>
    </section>
  );
}
