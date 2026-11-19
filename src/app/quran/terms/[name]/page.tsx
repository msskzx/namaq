import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { num } from '@shared/quran/arabicNumber';
import { plainName } from '@shared/quran/balaghaTerms';
import { TERMS, termOf, termView } from '@/lib/balaghaTerms';
import { TermExampleCard, TermQuotes } from '@/components/balagha/TermParts';

export const generateStaticParams = () => TERMS.terms.map(term => ({ name: plainName(term.name) }));

// Next hands the param decoded already.
const nameOf = async (params: Promise<{ name: string }>) => (await params).name;

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const term = termOf(await nameOf(params));
  return { title: term ? plainName(term.name) : 'مصطلحات البلاغة' };
}

/**
 * A balagha term's page (owner, 2026-11-18; the app's term screen): its definition in the scholars' words, each quote whole
 * with its page, then every paragraph of al-Suyuti's under it that quotes an ayah, the quoted words lit.
 */
export default async function BalaghaTermPage({ params }: { params: Promise<{ name: string }> }) {
  const term = termOf(await nameOf(params));
  if (!term) notFound();
  const { chapter, examples } = await termView(term);
  return (
    <div dir="rtl" lang="ar" className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-4 text-[var(--home-ink)]">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-3xl">{plainName(term.name)}</h1>
        <p className="text-[0.9375rem] text-[var(--home-muted)]">{`${chapter} · الإتقان للسيوطي`}</p>
      </div>
      <TermQuotes term={term} />
      <h2 className="mt-1 text-[0.9375rem] text-[var(--home-muted)]">{`أمثلته في الإتقان (${num(examples.length)})`}</h2>
      {examples.map(example => <TermExampleCard key={example.entry} example={example} />)}
    </div>
  );
}
