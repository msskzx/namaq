'use client';

import { Tags } from 'lucide-react';
import Button from '@/components/common/Button';
import ExternalLink from '@/components/common/ExternalLink';
import { useLanguage } from '@/components/language/LanguageContext';
import { TAGS, type Group } from '@shared/quran/mutashabih/types';
import { evidenceGroup } from '@shared/quran/mutashabih/evidence';
import { connectionColor, useGroupConnections } from './GroupConnections';
import DifferenceWords from '@/components/quran/text/DifferenceWords';
import OpenInBook from '@/components/quran/OpenInBook';
import { citationInBook } from '@shared/readerBooks';

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
        </Button>{example ? <span data-connection-words lang="ar" dir="rtl">{example}</span> : group.words?.[tag] && <DifferenceWords words={group.words[tag]!} />}</span>;
      })}
    </div>}
    {group.citations.map(citation => ({ citation, inBook: citationInBook(citation) })).map(({ citation, inBook }) => <p key={citation.id} lang="ar" dir="rtl" className="m-0 text-xs leading-relaxed text-[var(--home-muted)]">
      {citation.book}، {citation.edition}{' · '}
      <span dir="ltr">{ar ? citation.places.join(' ↔ ').replace(/\d/g, digit => Number(digit).toLocaleString('ar-EG')) : citation.places.join(' ↔ ')}</span>{' · '}
      <ExternalLink className="underline" href={citation.url}>{ar ? citation.locator.replace(/\d/g, digit => Number(digit).toLocaleString('ar-EG')) : citation.locator}</ExternalLink>
      {inBook && <>{' · '}<OpenInBook book={inBook.book} printed={inBook.printed} /></>}
      <br /><q>{citation.quote}</q>
    </p>)}
  </div>;
}
