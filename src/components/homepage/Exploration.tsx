import ExplorationCard from '../common/ExplorationCard';
import cards from '../common/ExplorationCard.module.css';
import { useLanguage } from '../language/LanguageContext';
import styles from './Home.module.css';

export default function Exploration() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const entries = [
    { href: '/people', title: ar ? 'الأشخاص' : 'People', description: ar ? 'السير والأسماء والأنساب' : 'Biographies, names and genealogies' },
    { href: '/sources', title: ar ? 'المصادر' : 'Sources', description: ar ? 'اقرأ النصوص الأصلية وتتبّع الشواهد' : 'Read original texts and follow the evidence' },
    { href: '/graphs?kind=person', title: ar ? 'الشبكة' : 'Graph', description: ar ? 'استكشف العلاقات بين الأشخاص' : 'Explore the relationships between people' },
    { href: '/events', title: ar ? 'الأحداث' : 'Events', description: ar ? 'الأحداث والمعارك والمشاركون فيها' : 'Events, battles and the people involved' },
    { href: '/quran', title: ar ? 'القرآن' : 'Quran', description: ar ? 'القراءة والموضوعات والمقارنات' : 'Reading, themes and comparisons' },
    { href: '/hadith', title: ar ? 'الحديث' : 'Hadith', description: ar ? 'استكشف النصوص والأسانيد' : 'Explore texts and chains of transmission' },
    { href: '/quizzes', title: ar ? 'اختبر معرفتك' : 'Test your knowledge', description: ar ? 'أسئلة مع إحالات إلى المصادر' : 'Questions with references to the sources' },
  ];

  return (
    <section className={styles.exploration} aria-labelledby="explore-title">
      <div className={styles.sectionHeading}>
        <h2 id="explore-title">{ar ? 'أبواب الاستكشاف' : 'Ways to explore'}</h2>
        <span aria-hidden="true">✦</span>
      </div>
      <ol className={cards.grid}>
        {entries.map((entry, index) => (
          <li key={entry.href}>
            <ExplorationCard url={entry.href} title={entry.title} desc={entry.description} number={index + 1} language={language} />
          </li>
        ))}
      </ol>
    </section>
  );
}
