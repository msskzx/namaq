import ExplorationCard from '../common/ExplorationCard';
import { NAV_SECTIONS } from '../common/NavBar';
import cards from '../common/ExplorationCard.module.css';
import { useLanguage } from '../language/LanguageContext';
import styles from './Home.module.css';

export default function Exploration() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const descriptions: Record<string, string> = {
    '/quran': ar ? 'القراءة والموضوعات والمقارنات' : 'Reading, themes and comparisons',
    '/hadith': ar ? 'استكشف النصوص والأسانيد' : 'Explore texts and chains of transmission',
    '/biographies': ar ? 'السير والأنساب والأحداث وشبكة العلاقات' : 'Biographies, lineages, events and the relationship graph',
    '/sources': ar ? 'اقرأ النصوص الأصلية وتتبّع الشواهد' : 'Read original texts and follow the evidence',
    '/quizzes': ar ? 'أسئلة مع إحالات إلى المصادر' : 'Questions with references to the sources',
  };
  const entries = NAV_SECTIONS.map(section => ({ href: section.href, title: section.label[language], description: descriptions[section.href] }));

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
