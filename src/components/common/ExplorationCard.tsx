import { ArrowLeft, ArrowRight } from 'lucide-react';
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
  const ar = language === 'ar';
  const Forward = ar ? ArrowLeft : ArrowRight;
  return (
    <article className={styles.card}>
      {number !== undefined && <span className={styles.number}>{number.toLocaleString(language === 'ar' ? 'ar-u-nu-arab' : 'en', { minimumIntegerDigits: 2 })}</span>}
      <div><h3><Link href={url} className={styles.title}>{title}<Forward size={18} aria-hidden /></Link></h3><p>{desc}</p></div>
      <span className={styles.rule} aria-hidden="true" />
    </article>
  );
}
