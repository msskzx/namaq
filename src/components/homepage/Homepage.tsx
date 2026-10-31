'use client';

import { useRef, useState } from 'react';
import { BookOpen, GitBranch, ListChecks, Shuffle, Users } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import BranchTree from '@/app/quran/branches/BranchTree';
import type { HomePreviews } from '@/lib/homePreviewData';
import TreeIntro from './TreeIntro';
import styles from './Home.module.css';

export default function Homepage({ data, fontClass = '' }: { data: HomePreviews; fontClass?: string }) {
  const ar = useLanguage().language === 'ar';
  const [preview, setPreview] = useState(data.branches);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const launchTree = useRef<HTMLDivElement>(null);
  const randomTree = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`/api/quran/random-tree?${new URLSearchParams({ exclude: preview.id })}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not load tree');
      setPreview(await response.json());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  const steps = [
    { Icon: GitBranch, title: ar ? 'استكشف' : 'Explore', text: ar ? 'شاهد مواضع التشابه والاختلاف في العبارات المشتركة.' : 'See where shared phrases agree and where their wording differs.', href: '/quran/branches', action: ar ? 'متشابهات القرآن' : 'Phrase trees' },
    { Icon: BookOpen, title: ar ? 'اقرأ في السياق' : 'Read in context', text: ar ? 'انتقل من العبارة إلى الآية، وواصل القراءة في المصحف.' : 'Move from a phrase to its ayah and continue reading in the mushaf.', href: '/quran/read', action: ar ? 'افتح المصحف' : 'Open the reader' },
    { Icon: ListChecks, title: ar ? 'اختبر ما لاحظته' : 'Test what you noticed', text: ar ? 'أجب عن أسئلة الأشجار، ثم راجع الإجابة والآيات المرتبطة بها.' : 'Answer questions about the trees, then review the answer and its ayat.', href: '/quizzes?topic=BRANCHES', action: ar ? 'اختبار فردي' : 'Solo quiz' },
    { Icon: Users, title: ar ? 'تعلّموا معًا' : 'Learn together', text: ar ? 'ابدأ اختبارًا جماعيًا وشارك رقمه، أو انضم إلى غيرك من هاتفك.' : 'Start a party and share its number, or join others from your phone.', href: '/quizzes/party', action: ar ? 'اختبار جماعي' : 'Party quiz' },
  ];
  return (
    <div className={`${styles.page} ${fontClass}`} dir={ar ? 'rtl' : 'ltr'}>
      <div className={styles.content}>
        <section className={styles.feature} aria-labelledby="openings-title">
          <div className={styles.featureHeading}><div>
            <h1 id="openings-title">{ar ? 'متشابهات القرآن' : 'Quran phrase trees'}</h1>
            <p>{ar ? 'استكشف العبارات المشتركة بين الآيات في شجرة تفاعلية، واقرأ كل آية في سياقها.' : 'Explore shared Quranic phrases in an interactive tree, and read each ayah in context.'}</p>
            <div className={styles.launchActions}>
              <Button href="/quran/branches"><GitBranch size={18} aria-hidden />{ar ? 'تصفّح الكل' : 'Browse all'}</Button>
              <Button onClick={randomTree} disabled={loading}><Shuffle size={18} aria-hidden />{ar ? 'عشوائي' : 'Random'}</Button>
            </div>
            {error && <p role="alert">{ar ? 'تعذّر تحميل الشجرة. حاول مجددًا.' : 'Could not load a tree. Try again.'}</p>}
          </div></div>
          <div ref={launchTree} className={styles.launchTree} dir="rtl" aria-busy={loading}>
            {loading && <LoadingSpinner className="absolute inset-0 z-10 bg-[var(--home-paper)]" />}
            <div inert={loading}>
              <BranchTree key={preview.id} tree={preview.tree} prefixes={preview.prefixes.filter(prefix => prefix.word)} offsets={preview.offsets} subtreeLinks={preview.subtreeLinks} names={preview.names} surround={{ on: false }} label={ar ? 'مثال تفاعلي لشجرة عبارات قرآنية' : 'Interactive Quran phrase tree example'} />
            </div>
            <TreeIntro target={launchTree} ar={ar} />
          </div>
        </section>
        <section className={styles.feature} aria-labelledby="journey-title">
          <div className={styles.featureHeading}><div>
            <h2 id="journey-title">{ar ? 'من الملاحظة إلى التعلّم' : 'From noticing to learning'}</h2>
            <p>{ar ? 'ابدأ بالاستكشاف أو القراءة أو سؤال. يمكنك العودة إلى الآيات كلما أردت فهم الإجابة.' : 'Start with exploration, reading or a question. Return to the ayat whenever you want to understand an answer.'}</p>
          </div></div>
          <ol className={styles.learningSteps}>{steps.map(({ Icon, title, text, href, action }) => <li key={href}>
            <Icon aria-hidden /><h3>{title}</h3><p>{text}</p><Button href={href}><Icon size={16} aria-hidden />{action}</Button>
          </li>)}</ol>
        </section>
      </div>
    </div>
  );
}
