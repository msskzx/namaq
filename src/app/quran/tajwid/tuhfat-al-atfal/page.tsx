import type { Metadata } from 'next';
import { num } from '@/lib/quran/arabicNumber';
import paper from '@/components/common/PaperPage.module.css';
import { numberVerses, type Poem } from '@/lib/tajwid/poem';
import poem from './poem.json';
import styles from './Poem.module.css';

export const metadata: Metadata = { title: 'تحفة الأطفال والغلمان' };

export default function TuhfatAlAtfalPage() {
  const { title, author, composed, transcription, edition } = poem as Poem;
  const chapters = numberVerses(poem as Poem);
  const contents = chapters.map((chapter, i) => (
    <li key={chapter.title}><a href={`#bab-${i + 1}`}><span>{chapter.title}</span><span>{num(chapter.verses[0].number)}</span></a></li>
  ));
  const count = chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0);
  return (
    <div dir="rtl" className={`${paper.page} w-full max-w-6xl mx-auto px-4 py-8`}>
      <header className={paper.heading}>
        <p className={paper.eyebrow}>نمق · التجويد</p>
        <h1>{title}</h1>
        <p>{author}، نظمها سنة {num(composed)}هـ، وأبياتها {num(count)}</p>
        <p className="text-sm">
          الضبط: <a className="underline" href={edition.url}>{edition.name}</a>، قوبل به كل بيت من <a className="underline" href={transcription}>نسخة رقمية</a>.
        </p>
      </header>
      <div className={styles.layout}>
        <nav aria-label="أبواب المنظومة" className={styles.contents}>
          <ol className={styles.wide}>{contents}</ol>
          <details className={styles.narrow}>
            <summary>الأبواب</summary>
            <ol>{contents}</ol>
          </details>
        </nav>
        <div>
          {chapters.map((chapter, i) => (
            <section key={chapter.title} id={`bab-${i + 1}`} className={styles.chapter}>
              <h2>{chapter.title}</h2>
              {chapter.verses.map(({ number, first, second }) => (
                <p key={number} id={`bayt-${number}`} className={styles.bayt}>
                  <span className={styles.number}>{num(number)}</span>
                  <span className={styles.shatr}>{first}</span>
                  <span className={styles.shatr}>{second}</span>
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
