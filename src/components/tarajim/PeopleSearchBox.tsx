'use client';

import { useEffect, useRef, useState } from 'react';
import { SearchField } from '@/components/common/Field';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';

/**
 * The Tarajim search field (the app's tarajim hub and «كل التراجم»): what is typed goes to /people?search=…, which lists
 * the people found as rows. On /people it follows the typing (`live`); on the hub it opens /people on Enter.
 */
export default function PeopleSearchBox({ initial = '', title, live = false, placeholder }: { initial?: string; title?: string; live?: boolean; placeholder: string }) {
  const router = useNavigatingRouter();
  const [value, setValue] = useState(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const href = (text: string) => {
    const params = new URLSearchParams();
    if (text.trim()) params.set('search', text.trim());
    if (title) params.set('title', title);
    const query = params.toString();
    return query ? `/people?${query}` : '/people';
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const change = (text: string) => {
    setValue(text);
    if (!live) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => router.replace(href(text)), 250);
  };
  return (
    <form role="search" onSubmit={event => { event.preventDefault(); if (live) router.replace(href(value)); else if (value.trim()) router.push(href(value)); }}>
      <SearchField label="ابحث في التراجم" placeholder={placeholder} value={value} onChangeText={change} enterKeyHint="search" />
    </form>
  );
}
