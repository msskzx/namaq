"use client";

import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@/lib/quran/arabicNumber';
import paper from '@/components/common/PaperPage.module.css';
import { numberVerses, type Poem } from '@/lib/tajwid/poem';
import styles from './Poem.module.css';

export default function PoemView({ poem }: { poem: Poem }) {
  const ar = useLanguage().language === 'ar';
  const { title, author, composed, transcription, edition } = poem;
  const chapters = numberVerses(poem);
  const count = chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0);
  return (
    <div dir={ar ? 'rtl' : 'ltr'} className={`${paper.page} w-full max-w-7xl mx-auto px-4 py-8`}>
      <header className={paper.heading}>
        <p className={paper.eyebrow}>{ar ? 'نمق · التجويد' : 'Namaq · Tajwid'}</p>
        <h1 lang="ar" dir="rtl">{title}</h1>
        <p>{ar
          ? <>{author}، نظمها سنة {num(composed)}هـ، وأبياتها {num(count)}</>
          : <>By <span lang="ar" dir="rtl">{author}</span>. Composed in {composed} AH · {count} verses</>}</p>
        <details className={styles.sources}>
          <summary>{ar ? 'الضبط والمصدر' : 'Edition and source'}</summary>
          <p>{ar ? 'الضبط: ' : 'Vocalization: '}<a href={edition.url} lang="ar" dir="rtl">{edition.name}</a>{ar ? '، قوبل به كل بيت من ' : '. Compared verse by verse with a '}<a href={transcription}>{ar ? 'نسخة رقمية' : 'digital transcription'}</a>.</p>
        </details>
      </header>
      <div className={styles.layout}>
        <nav aria-label={ar ? 'أبواب المنظومة' : 'Poem chapters'} className={styles.contents}>
          <h2 className={styles.label}>{ar ? 'الأبواب' : 'Chapters'}</h2>
          <ol dir="rtl" lang="ar">{chapters.map((chapter, i) => (
            <li key={chapter.title}><a href={`#bab-${i + 1}`}><span>{chapter.title}</span><span className={styles.leader} aria-hidden="true" /><span>{num(chapter.verses[0].number)}</span></a></li>
          ))}</ol>
        </nav>
        <article className={styles.poem} dir="rtl" lang="ar" aria-label={title}>
          {chapters.map((chapter, i) => (
            <section key={chapter.title} id={`bab-${i + 1}`} className={styles.chapter} aria-labelledby={`bab-${i + 1}-title`}>
              <h2 id={`bab-${i + 1}-title`}>{chapter.title}</h2>
              {chapter.verses.map(({ number, first, second }) => (
                <p key={number} id={`bayt-${number}`} className={styles.bayt}>
                  <span className={styles.number}>{num(number)}</span>
                  <span className={styles.shatr}>{first}</span>
                  <span className={styles.shatr}>{second}</span>
                </p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
