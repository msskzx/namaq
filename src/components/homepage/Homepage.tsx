'use client';

import { useRef } from 'react';
import { BookOpen, Feather } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import { useLanguage } from '../language/LanguageContext';
import Button from '../common/Button';
import BranchTree from '@/app/quran/branches/BranchTree';
import type { HomePreviews } from '@/lib/homePreviewData';
import TreeIntro from './TreeIntro';
import styles from './Home.module.css';

export default function Homepage({ data, fontClass = '' }: { data: HomePreviews; fontClass?: string }) {
  const ar = useLanguage().language === 'ar';
  const preview = data.branches;
  const launchTree = useRef<HTMLDivElement>(null);
  const steps = [
    { Icon: TreeIcon, title: ar ? 'استكشف' : 'Explore', text: ar ? 'شاهد مواضع التشابه والاختلاف في العبارات المشتركة.' : 'See where shared phrases agree and where their wording differs.', href: '/quran/branches', action: ar ? 'متشابهات القرآن' : 'Phrase trees' },
    { Icon: BookOpen, title: ar ? 'اقرأ في السياق' : 'Read in context', text: ar ? 'انتقل من العبارة إلى الآية، وواصل القراءة في المصحف.' : 'Move from a phrase to its ayah and continue reading in the mushaf.', href: '/quran/read', action: ar ? 'افتح المصحف' : 'Open the reader' },
    { Icon: Feather, title: ar ? 'اختبر ما لاحظته' : 'Test what you noticed', text: ar ? 'أجب عن أسئلة في آيات القرآن وحدك أو مع غيرك، ثم راجع الإجابة والآيات المرتبطة بها.' : 'Answer questions on the ayat of the Quran alone or with others, then review the answer and its ayat.', href: '/quizzes', action: ar ? 'الاختبارات' : 'Quizzes' },
  ];
  return (
    <div className={`${styles.page} ${fontClass}`} dir={ar ? 'rtl' : 'ltr'}>
      <div className={styles.content}>
        <section className={`${styles.feature} ${styles.launch}`} aria-labelledby="openings-title">
          <h1 id="openings-title" className={styles.launchTitle}>{ar ? 'متشابهات القرآن' : 'Quran phrase trees'}</h1>
          <div className={styles.launchText}>
            <p>{ar ? 'استكشف العبارات المشتركة بين الآيات في شجرة تفاعلية، واقرأ كل آية في سياقها.' : 'Explore shared Quranic phrases in an interactive tree, and read each ayah in context.'}</p>
            <div className={styles.launchActions}>
              <Button href="/quran/branches"><TreeIcon size={18} aria-hidden />{ar ? 'تصفّح الكل' : 'Browse all'}</Button>
            </div>
          </div>
          <div ref={launchTree} className={styles.launchTree} dir="rtl">
            <div>
              <BranchTree key={preview.id} tree={preview.tree} prefixes={preview.prefixes.filter(prefix => prefix.word)} offsets={preview.offsets} subtreeLinks={preview.subtreeLinks} names={preview.names} surround={{ on: false }} viewportHeight={null} label={ar ? 'مثال تفاعلي لشجرة عبارات قرآنية' : 'Interactive Quran phrase tree example'} />
            </div>
            <TreeIntro key={preview.id} target={launchTree} ar={ar} names={preview.names} />
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
