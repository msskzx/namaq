"use client";

import Link from "next/link";
import styles from "@/components/common/PaperPage.module.css";
import { useLanguage } from "@/components/language/LanguageContext";
import { GROUPS, SOURCES, type Source } from "@shared/sources";

/** What one source adds beyond its card: Siyar's scans and OCR text, the corpus's counting notes. */
function Extra({ id, language }: { id: string; language: "ar" | "en" }) {
  if (id === "siyar")
    return (
      <>
        <p className="mt-1 leading-loose">
          <span className="text-[var(--home-muted)]">{language === 'ar' ? 'النسخة المصورة: ' : 'Scanned edition: '}</span>
          <a className="underline decoration-[var(--home-rule)] underline-offset-4 hover:text-[var(--home-accent)]" href="https://archive.org/details/sanbz" target="_blank" rel="noreferrer">
            {language === 'ar' ? 'Archive.org، الطبعة الثالثة، ١٤٠٥/١٩٨٥' : 'Archive.org, third edition, 1405/1985'}
          </a>
        </p>
        <p className="mt-1 leading-loose">
          <span className="text-[var(--home-muted)]">{language === 'ar' ? 'نص OCR للبحث: ' : 'Searchable OCR text: '}</span>
          <a className="underline decoration-[var(--home-rule)] underline-offset-4 hover:text-[var(--home-accent)]" href="https://archive.org/download/sanbz/sansera1_djvu.txt" target="_blank" rel="noreferrer">
            {language === 'ar' ? 'السيرة النبوية، المجلد الأول' : 'Prophet’s Sira, volume 1'}
          </a>
          {' · '}
          <a className="underline decoration-[var(--home-rule)] underline-offset-4 hover:text-[var(--home-accent)]" href="https://archive.org/download/sanbz/sansera2_djvu.txt" target="_blank" rel="noreferrer">
            {language === 'ar' ? 'السيرة النبوية، المجلد الثاني' : 'Prophet’s Sira, volume 2'}
          </a>
        </p>
        <p className="mt-2 text-sm leading-loose text-[var(--home-muted)]">
          {language === 'ar'
            ? 'ملفات النص ناتجة عن التعرف الضوئي على الحروف، وهي للبحث والمقارنة. تُراجع الحواشي على صفحات النسخة المصورة.'
            : 'The text files are OCR aids for searching and comparison. Check footnotes against the scanned pages.'}
        </p>
      </>
    );
  if (id === "quranic-arabic-corpus")
    return (
      <>
        <p className="mt-2 text-sm leading-loose text-[var(--home-muted)]">
          {language === 'ar'
            ? 'تُعدّ الكلمة بمدخلها المعجمي كما حلّلتها المدوّنة القرآنية العربية (Quranic Arabic Corpus، الإصدار ٠٫٤)، فـ«والله» و«بالله» و«لله» كلها تحت «ٱللَّه»، ويُعدّ كل جزء من الكلمة له مدخل على حدة، فـ«مما» مرة لـ«مِن» ومرة لـ«مَا». التحليل من المدوّنة لا منّا، ولم يراجعه أحد من أهل العلم. لا مدخل في المدوّنة لـ٣٣٠٧ كلمة: الضمائر المنفصلة، وحروف الجر المتصلة بضمير مثل «لهم»، والحروف المقطّعة. والمداخل التي تتفق في الرسم تحمل رقمها في المدوّنة، فـ«صَٰلِح ١» صفة الصلاح و«صَٰلِح ٢» اسم النبي صالح.'
            : 'Each word is counted under its lemma as the Quranic Arabic Corpus (version 0.4) analyses it, so «والله», «بالله» and «لله» all count under «ٱللَّه». Each part of a word that has its own lemma counts separately, so «مما» counts once for «مِن» and once for «مَا». The analysis is the corpus’s, not ours, and no scholar has reviewed it. The corpus gives no lemma to 3,307 words: separate pronouns, prepositions joined to a pronoun such as «لهم», and the disjoined letters. Lemmas that share a spelling carry the corpus’s number, so «صَٰلِح ١», the word for righteous, and «صَٰلِح ٢», the prophet Salih, count apart.'}
        </p>
        <p className="mt-2 text-sm leading-loose text-[var(--home-muted)]">
          {language === 'ar'
            ? 'وتُعدّ الكلمات المتقابلة بالطريقة نفسها، كل طرف بمدخله، إلا «الآخرة»: مدخلها «آخِر» يشمل «آخر» و«آخرين» أيضًا، فيُعدّ ذلك الطرف بصيغة «الآخرة» وحدها. والأزواج من اختيارنا.'
            : 'The opposite words count each side the same way, under its lemma, except «الآخرة». Its lemma «آخِر» also covers «آخر» and «آخرين», so that side counts the form «الآخرة» alone. We chose the pairs.'}
        </p>
      </>
    );
  return null;
}

function SourceCard({ source, language }: { source: Source; language: "ar" | "en" }) {
  const t = (bi: { ar: string; en: string }) => bi[language];
  return (
    <section id={source.id} className="scroll-mt-20 rounded-[var(--card-radius)] border border-[var(--home-rule)] bg-[var(--home-card)] px-4 py-3">
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
            <a className="underline decoration-[var(--home-rule)] underline-offset-4 hover:text-[var(--home-accent)]" href={source.link.url} target="_blank" rel="noreferrer">{source.link.label}</a>
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
    </section>
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
            {language === 'ar'
              ? 'الأعمال والبيانات التي اعتمد عليها نمق، ولمن يعود كل منها، وبأي ترخيص. '
              : 'The works and data Namaq relies on, whom each one belongs to, and under what licence. '}
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
