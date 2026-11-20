import type { Metadata } from 'next';
import NasabView from '@/components/nasab/NasabView';
import styles from '@/components/nasab/Nasab.module.css';
import { nasabView, pickPeople } from '@/lib/tarajim';
import NasabPage from '../people/[slug]/nasab/NasabPage';

export const metadata: Metadata = {
  title: 'النسب',
};

/**
 * With no one asked for, the nasab search (the tarajim hub's «النسب», owner 2026-11-20): the app's nasab page with its
 * people search open, each pick going to that person's nasab. With `subject`s (the home page's link), the graph's tree.
 */
export default async function NasabRoute({ searchParams }: { searchParams: Promise<{ subject?: string | string[] }> }) {
  if (!(await searchParams).subject) return <NasabPage view={nasabView([])} people={pickPeople()} />;
  return (
    <div className={styles.page}>
      <NasabView />
    </div>
  );
}
