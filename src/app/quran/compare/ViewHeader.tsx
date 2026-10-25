import React from 'react';
import { NOTE } from '../panel';

export default function ViewHeader({ title, sub, method, children }: { title: string; sub?: string; method?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-3xl text-[var(--home-accent)]">{title}</h2>
        {sub && <span className={NOTE}>{sub}</span>}
      </div>
      {method && (
        <details className="text-sm">
          <summary className="w-fit cursor-pointer list-none text-[var(--home-accent)] underline underline-offset-4 [&::-webkit-details-marker]:hidden">كيف نقارن؟</summary>
          <div className={`${NOTE} mt-2 max-w-prose leading-relaxed`}>{method}</div>
        </details>
      )}
      {children}
    </header>
  );
}
