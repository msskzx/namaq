'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/common/Pagination';

export default function PageLinks({ page, pageCount, hrefs }: { page: number; pageCount: number; hrefs: string[] }) {
  const router = useRouter();
  return <Pagination page={page} pageCount={pageCount} onChange={next => router.push(hrefs[next - 1])} />;
}
