export function modeHref(mode: 'text' | 'themes', query: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams(mode === 'themes' ? { mode } : {});
  for (const key of ['a', 'b']) {
    const value = query[key];
    if (typeof value === 'string') params.set(key, value);
  }
  const search = params.toString();
  return search ? `/quran/compare?${search}` : '/quran/compare';
}

export function viewHref(ayat: boolean, query: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  for (const key of ['a', 'af', 'at', 'b', 'bf', 'bt']) {
    const value = query[key];
    if (typeof value === 'string') params.set(key, value);
  }
  if (ayat) params.set('view', 'ayat');
  const search = params.toString();
  return search ? `/quran/compare?${search}` : '/quran/compare';
}
