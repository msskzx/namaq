"use client";

import Link from "next/link";
import ExternalLink from "@/components/common/ExternalLink";
import styles from "@/components/common/PaperPage.module.css";
import { useLanguage } from "@/components/language/LanguageContext";
import { GROUPS, SOURCES, type Source } from "@shared/sources";
import Card from '@/components/common/Card';
import { ATTRIBUTIONS_INTRO, SOURCE_EXTRAS } from "@shared/infoPages";

const linkClass = "underline decoration-[var(--home-rule)] underline-offset-4 hover:text-[var(--home-accent)]";

/** What one source adds beyond its card (shared/infoPages.ts, which the app's page reads too): Siyar's scans and OCR text, the corpus's counting notes. */
function Extra({ id, language }: { id: string; language: "ar" | "en" }) {
  const extra = SOURCE_EXTRAS[id];
  if (!extra) return null;
  return (
    <>
      {extra.links?.map((row, i) => (
        <p key={i} className="mt-1 leading-loose">
          {row.map((link, j) => (
            <span key={link.url}>
              {j > 0 && ' · '}
              {link.prefix[language] && <span className="text-[var(--home-muted)]">{link.prefix[language]}</span>}
              <ExternalLink className={linkClass} href={link.url}>{link.label[language]}</ExternalLink>
            </span>
          ))}
        </p>
      ))}
      {extra.notes.map(note => <p key={note.en} className="mt-2 text-sm leading-loose text-[var(--home-muted)]">{note[language]}</p>)}
    </>
  );
}

function SourceCard({ source, language }: { source: Source; language: "ar" | "en" }) {
  const t = (bi: { ar: string; en: string }) => bi[language];
  return (
    <Card as="section" id={source.id} className="scroll-mt-20 px-4 py-3">
      <h3 className="mb-2 text-xl" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {t(source.title)}
      </h3>
      <dl className="space-y-1 leading-loose">
        {source.author && (
          <div>
            <dt className="inline text-[var(--home-muted)]">{language === 'ar' ? 'المؤلف: ' : 'Author: '}</dt>
            <dd className="inline">{t(source.author)}</dd>
          </div>
        )}
        {source.edition && (
          <div>
            <dt className="inline text-[var(--home-muted)]">{language === 'ar' ? 'الطبعة: ' : 'Edition: '}</dt>
            <dd className="inline" dir="rtl" lang="ar">{source.edition}</dd>
          </div>
        )}
        <div>
          <dt className="inline text-[var(--home-muted)]">{language === 'ar' ? 'المصدر: ' : 'Source: '}</dt>
          <dd className="inline">
            <ExternalLink className="underline decoration-[var(--home-rule)] underline-offset-4 hover:text-[var(--home-accent)]" href={source.link.url}>{source.link.label}</ExternalLink>
          </dd>
        </div>
        <div>
          <dt className="inline text-[var(--home-muted)]">{language === 'ar' ? 'الترخيص: ' : 'Licence: '}</dt>
          <dd className="inline">{t(source.licence)}</dd>
        </div>
        <div>
          <dt className="inline text-[var(--home-muted)]">{language === 'ar' ? 'يُستعمل في: ' : 'Used in: '}</dt>
          <dd className="inline">
            {source.uses.map((use, i) => (
              <span key={i}>
                {i > 0 && (language === 'ar' ? '، ' : ', ')}
                {use.href ? <Link className="underline decoration-[var(--home-rule)] underline-offset-4 hover:text-[var(--home-accent)]" href={use.href}>{t(use)}</Link> : t(use)}
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <Extra id={source.id} language={language} />
    </Card>
  );
}

export default function AttributionsPage() {
  const { language } = useLanguage();

  return (
    <div className={`${styles.page} mx-auto w-full max-w-4xl px-4 py-8 sm:px-6`}>
      <main dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <header className={styles.heading}>
          <h1>{language === 'ar' ? 'المصادر والتراخيص' : 'Sources and licences'}</h1>
          <p className="mt-3 text-lg">
            {ATTRIBUTIONS_INTRO[language]}{' '}
            <Link href="/sources" className="text-[var(--home-accent)] underline underline-offset-4">
              {language === 'ar' ? 'الكتب وحدها' : 'The books alone'}
            </Link>
          </p>
        </header>
        {GROUPS.map(({ group, title }) => (
          <div key={group} className="mb-10">
            <h2 className="mb-4 text-2xl text-[var(--home-accent)]">{title[language]}</h2>
            <div className="space-y-4">
              {SOURCES.filter(source => source.group === group).map(source => (
                <SourceCard key={source.id} source={source} language={language} />
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
