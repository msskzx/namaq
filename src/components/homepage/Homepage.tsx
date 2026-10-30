'use client';

import { BookOpen, GitBranch, ListChecks, Users } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext';
import Button from '../common/Button';
import BranchTree from '@/app/quran/branches/BranchTree';
import type { HomePreviews } from '@/lib/homePreviewData';
import Hero from './Hero';
import WorkInProgressBanner from './WorkInProgressBanner';
import { BRANCHES_HREF } from './homeLinks';
import styles from './Home.module.css';

export default function Homepage({ data, fontClass = '' }: { data: HomePreviews; fontClass?: string }) {
  const ar = useLanguage().language === 'ar';
  const steps = [
    { Icon: GitBranch, title: ar ? 'استكشف' : 'Explore', text: ar ? 'شاهد مواضع التشابه والاختلاف في العبارات المشتركة.' : 'See where shared phrases agree and where their wording differs.', href: '/quran/branches', action: ar ? 'أشجار العبارات' : 'Phrase trees' },
    { Icon: BookOpen, title: ar ? 'اقرأ في السياق' : 'Read in context', text: ar ? 'انتقل من العبارة إلى الآية، وواصل القراءة في المصحف.' : 'Move from a phrase to its ayah and continue reading in the mushaf.', href: '/quran/read', action: ar ? 'افتح المصحف' : 'Open the reader' },
    { Icon: ListChecks, title: ar ? 'اختبر ما لاحظته' : 'Test what you noticed', text: ar ? 'أجب عن أسئلة الأشجار، ثم راجع الإجابة والآيات المرتبطة بها.' : 'Answer questions about the trees, then review the answer and its ayat.', href: '/quizzes?topic=BRANCHES', action: ar ? 'اختبار فردي' : 'Solo quiz' },
  ];
  return (
    <div className={`${styles.page} ${fontClass}`} dir={ar ? 'rtl' : 'ltr'}>
      <WorkInProgressBanner />
      <div className={styles.content}>
        <Hero />
        <section className={styles.feature} aria-labelledby="openings-title">
          <div className={styles.featureHeading}><div>
            <p className={styles.eyebrow}>{ar ? 'ابدأ بملاحظة' : 'Start with a discovery'}</p>
            <h2 id="openings-title">{ar ? 'بداية مشتركة، فكيف تتفرّع الكلمات؟' : 'A shared beginning. Where do the words branch?'}</h2>
            <p>{ar ? 'ثلاث آيات تبدأ بعبارة «إن المتقين». تتبّع مسارًا، وافتح الآيات لتقرأها في سياقها.' : 'Three ayat begin with “Indeed, the righteous”. Follow a path and open the ayat to read them in context.'}</p>
            <p className={styles.exampleCaption}>{ar ? 'استخدم أزرار المسار والآيات داخل الشجرة. مرّر أفقيًا لرؤية بقيتها.' : 'Use the path and ayat buttons inside the tree. Scroll sideways to see more.'}</p>
          </div></div>
          <div className={styles.launchTree} dir="rtl">
            <BranchTree tree={data.branches.tree} names={{ 15: 'الحجر', 51: 'الذاريات', 52: 'الطور' }} zoomable={false} label={ar ? 'مثال تفاعلي لشجرة عبارات قرآنية' : 'Interactive Quran phrase tree example'} />
          </div>
          <div className={styles.launchActions}><Button href={BRANCHES_HREF}><GitBranch size={18} aria-hidden />{ar ? 'استكشف الشجرة كاملة' : 'Explore the complete tree'}</Button></div>
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
        <section className={styles.partyInvitation} aria-labelledby="party-title">
          <Users size={28} aria-hidden />
          <div><h2 id="party-title">{ar ? 'تعلّموا معًا' : 'Learn together'}</h2><p>{ar ? 'ابدأ اختبارًا جماعيًا وشارك رقمه، أو انضم إلى غيرك من هاتفك. أجيبوا ثم اكتشفوا الإجابة معًا.' : 'Start a party and share its number, or join others from your phone. Answer and discover the correct answer together.'}</p></div>
          <Button href="/quizzes/party"><Users size={18} aria-hidden />{ar ? 'اختبار جماعي' : 'Party quiz'}</Button>
        </section>
      </div>
    </div>
  );
}
