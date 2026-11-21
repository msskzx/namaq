'use client';

import Pagination from '@/components/common/Pagination';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';

/**
 * The shared pagination, moving by address: the review's pages (a number to go to), or compare's surah pairs (`labels`: a list
 * to pick from, with the pair before and after one tap away).
 */
export default function Pager({ page, hrefs, labels, label }: { page: number; hrefs: string[]; labels?: string[]; label?: string }) {
  const router = useNavigatingRouter();
  return <Pagination page={page} pageCount={hrefs.length} hrefs={hrefs} showSelect pageLabels={labels} selectLabel={label} language="ar" onChange={target => router.push(hrefs[target - 1])} />;
}
