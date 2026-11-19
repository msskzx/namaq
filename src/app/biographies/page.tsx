import type { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import Card from '@/components/common/Card';
import PeopleSearchBox from '@/components/tarajim/PeopleSearchBox';
import { hubGroups } from '@/lib/tarajim';
import battles from '@shared/data/battles/battles.json';

export const metadata: Metadata = { title: 'التراجم' };

const Heading = ({ text }: { text: string }) => <h2 className="mt-2 text-base text-[var(--home-muted)]">{text}</h2>;

/** A way in from the hub: its name, one muted line, and a chevron to say it opens (the app's components/tarajim/WayCard). */
function Way({ href, title, line }: { href: string; title: string; line: string }) {
  return (
    <Card href={href} className="flex min-h-14 items-center gap-2.5 px-3.5 py-2.5">
      <span className="flex flex-1 flex-col gap-0.5"><span className="text-xl">{title}</span><span className="text-[15px] text-[var(--home-muted)]">{line}</span></span>
      <ChevronLeft size={20} aria-hidden className="shrink-0 text-[var(--home-muted)]" />
    </Card>
  );
}

/**
 * The tarajim tab (owner, 2026-11-19; sketch tarajim-hub/sketch-dark.png, the app's screens/tarajim.tsx): a hub, not a list.
 * Search first, then the groups the scholars name, the sira and its events, the ties between people, and the whole list
 * and the titles on their own pages. The site's own chrome (side rail, bottom bar) stays as it is.
 */
export default function BiographiesPage() {
  const groups = hubGroups();
  return (
    <div dir="rtl" className="mx-auto flex w-full max-w-2xl flex-col gap-2.5 p-4 text-[var(--home-ink)]">
      <h1 className="text-3xl">التراجم</h1>
      <PeopleSearchBox placeholder="ابحث باسم أو كنية أو لقب" />
      <Heading text="كما جمعهم العلماء" />
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {groups.map(group => (
          <li key={group.key}>
            <Card href={`/people?title=${group.key}`} className="flex h-full min-h-[52px] items-center px-3.5 py-2.5 text-lg">{group.name}</Card>
          </li>
        ))}
      </ul>
      <Heading text="السيرة والأحداث" />
      <Way href="/stories" title="قصص السيرة" line="كل قصة كما يرويها الكتاب بإسنادها" />
      <Way href="/battles" title="الغزوات والمعارك" line={`من ${battles[0].name} إلى ${battles[battles.length - 1].name}، ومن شهد كل واحدة`} />
      <Way href="/events" title="الأحداث" line="الأحداث ومن شهدها" />
      <Heading text="الصلات" />
      <Way href="/graphs" title="استكشاف الشبكة" line="استكشف الصلات بين الأشخاص وصفّها بحسب نوع العلاقة" />
      <Way href="/nasab" title="النسب" line="تتبّع سلاسل الآباء وقارن أنساب عدة أشخاص" />
      <Heading text="كل التراجم" />
      <Way href="/people" title="كل التراجم بترتيب الكتاب" line="السيرة النبوية، ثم الخلفاء الراشدون، ثم أجزاء السير" />
      <Way href="/titles" title="الألقاب" line="الألقاب ومن عُرف بها" />
    </div>
  );
}
