import Link from 'next/link';
import styles from './ExplorationCard.module.css';

interface ExplorationCardProps {
  title: string;
  desc: string;
  url: string;
  number?: number;
  language?: 'ar' | 'en';
}

export default function ExplorationCard({ title, desc, url, number, language = 'ar' }: ExplorationCardProps) {
  return (
    <Link href={url} className={styles.card}>
      {number !== undefined && <span className={styles.number}>{number.toLocaleString(language === 'ar' ? 'ar-u-nu-arab' : 'en', { minimumIntegerDigits: 2 })}</span>}
      <div><h3>{title}</h3><p>{desc}</p></div>
      <span className={styles.rule} aria-hidden="true" />
    </Link>
  );
}
