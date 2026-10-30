import { GitBranch, ListChecks } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext';
import Logo from '../common/Logo';
import Button from '../common/Button';
import styles from './Home.module.css';

export default function Hero() {
  const ar = useLanguage().language === 'ar';
  return (
    <section className={styles.introduction} aria-labelledby="home-title">
      <Logo className={styles.launchLogo} />
      <p className={styles.eyebrow}>{ar ? 'استكشف · اقرأ · اختبر معرفتك' : 'Explore · Read · Test yourself'}</p>
      <h1 id="home-title" className={styles.launchTitle}>{ar ? 'تتبّع الكلمات، واكتشف الصلات بين الآيات.' : 'Follow the words. Discover connections between ayat.'}</h1>
      <p className={styles.description}>{ar ? 'تعلّم من خلال أشجار العبارات القرآنية المشتركة. اقرأ الآيات في سياقها، ثم اختبر ما لاحظته وحدك أو مع غيرك.' : 'Learn through visual trees of shared Quranic phrases. Read the ayat in context, then test what you notice on your own or with others.'}</p>
      <div className={styles.launchActions}>
        <Button variant="primary" href="/quran/branches"><GitBranch size={18} aria-hidden />{ar ? 'استكشف الأشجار' : 'Explore the trees'}</Button>
        <Button href="/quizzes?topic=BRANCHES"><ListChecks size={18} aria-hidden />{ar ? 'اختبر معرفتك' : 'Try a quiz'}</Button>
      </div>
    </section>
  );
}
