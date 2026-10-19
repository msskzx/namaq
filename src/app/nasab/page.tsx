import type { Metadata } from 'next';
import NasabView from '@/components/nasab/NasabView';
import styles from '@/components/nasab/Nasab.module.css';

export const metadata: Metadata = {
  title: 'النسب',
};

export default function NasabPage() {
  return (
    <div className={styles.page}>
      <NasabView />
    </div>
  );
}
