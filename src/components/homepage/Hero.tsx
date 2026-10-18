import { useLanguage } from '../language/LanguageContext';
import styles from './Home.module.css';

export default function Hero() {
  const { language } = useLanguage();
  const ar = language === 'ar';

  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <h1 id="home-title" className={styles.wordmark} lang="ar" dir="rtl">نَمَق</h1>
      <p className={styles.description}>{ar
        ? 'الهدف بناء إطار يعتمد على أمهات المصادر ويستخرج المعرفة منها بطريقة تساعد طلبة العلم على التعلّم والمقارنة، فتستكشف التاريخ الإسلامي من خلال السير والنصوص الأصلية والشبكات التفاعلية، وتجد رسومًا وأدوات تجعل الطلب مثمرًا، مع الحرص على أن تكون كل معلومة مدعومة بالدليل.'
        : 'The goal is to build a framework that uses the great sources and extracts the knowledge from them in a way that helps students of knowledge learn and compare, so you can explore Islamic history through biographies, original texts and interactive graphs, with visuals and tools that make the process fruitful, while making sure every piece of information is backed by evidence.'}</p>
    </section>
  );
}
