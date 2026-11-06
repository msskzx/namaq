'use client';

import { Tags } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { TAGS, type Group } from '@/lib/quran/mutashabih/types';
import { evidenceGroup } from '@/lib/quran/mutashabih/evidence';
import { connectionColor, useGroupConnections } from './GroupConnections';

export function GroupDetails({ group, shownKeys }: { group: Group; shownKeys?: string[] }) {
  group = evidenceGroup(group, shownKeys);
  const ar = useLanguage().language === 'ar';
  const connections = useGroupConnections();
  return <div className="flex flex-col gap-2 text-sm">
    {(group.tags.length > 0 || group.detail) && <div data-connection-legend={group.id} className="flex flex-wrap items-center gap-1.5">
      {group.tags.map(tag => {
        const label = TAGS[tag];
        const active = connections?.selected.includes(tag) ?? false;
        const example = group.examples?.[tag] ?? (group.tags.length === 1 ? group.detail : undefined);
        return <span key={tag} className="inline-flex flex-wrap items-center gap-1.5"><Button data-connection-chip={tag} size="sm" tone={connectionColor(tag)} active={active} aria-pressed={active} onClick={() => connections?.select(tag)}>
          <Tags size={12} aria-hidden />{ar ? label.ar : label.en}
        </Button>{example && <span data-connection-words lang="ar" dir="rtl">{example}</span>}</span>;
      })}
    </div>}
    {group.citations.map(citation => <p key={citation.id} lang="ar" dir="rtl" className="m-0 text-xs leading-relaxed text-[var(--home-muted)]">
      {citation.book}، {citation.edition}{' · '}
      <span dir="ltr">{ar ? citation.places.join(' ↔ ').replace(/\d/g, digit => Number(digit).toLocaleString('ar-EG')) : citation.places.join(' ↔ ')}</span>{' · '}
      <a className="underline" href={citation.url}>{ar ? citation.locator.replace(/\d/g, digit => Number(digit).toLocaleString('ar-EG')) : citation.locator}</a>
      <br /><q>{citation.quote}</q>
    </p>)}
  </div>;
}
