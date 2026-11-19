import type { Metadata } from 'next';
import Link from 'next/link';
import Chip from '@/components/common/Chip';
import Empty from '@/components/common/Empty';
import PeopleSearchBox from '@/components/tarajim/PeopleSearchBox';
import PersonRowList from '@/components/tarajim/PersonRowList';
import { peopleList } from '@/lib/tarajim';

export const metadata: Metadata = { title: 'كل التراجم' };

/**
 * «كل التراجم» (owner, 2026-11-19; the app's screens/people.tsx): every converted person, under the part of the book their
 * entry is in, as rows in one card per part; a group chip narrows it to one group the scholars name (`title`), the field
 * to a name (`search`). Replaces the old list of every catalog name loaded as you scroll.
 */
export default async function PeoplePage({ searchParams }: { searchParams: Promise<{ title?: string; search?: string }> }) {
  const { title, search = '' } = await searchParams;
  const list = peopleList(search, title);
  const href = (key?: string) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (key) params.set('title', key);
    const query = params.toString();
    return query ? `/people?${query}` : '/people';
  };
  return (
    <div dir="rtl" className="mx-auto flex w-full max-w-2xl flex-col gap-2.5 p-4 text-[var(--home-ink)]">
      <h1 className="text-3xl">{list.heading}</h1>
      <PeopleSearchBox live initial={search} title={list.title} placeholder={list.title ? 'ابحث في هذه المجموعة' : 'ابحث في التراجم'} />
      <nav aria-label="المجموعات" className="flex flex-wrap gap-1.5">
        <Link href={href()}><Chip label="الكل" on={!list.title} /></Link>
        {list.groups.map(group => (
          <Link key={group.key} href={href(list.title === group.key ? undefined : group.key)}><Chip label={group.name} on={list.title === group.key} /></Link>
        ))}
      </nav>
      {list.count === 0 && <Empty text="لا أحد بهذا الاسم في التراجم المضافة بعد" />}
      {list.parts.map(part => (
        <section key={part.heading} className="flex flex-col gap-1.5">
          <h2 className="mt-1.5 text-base text-[var(--home-accent)]">{part.heading}</h2>
          <PersonRowList rows={part.rows} />
        </section>
      ))}
    </div>
  );
}
