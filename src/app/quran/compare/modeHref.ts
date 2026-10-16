export function modeHref(mode: 'text' | 'themes', query: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams(mode === 'themes' ? { mode } : {});
  for (const key of ['a', 'b']) {
    const value = query[key];
    if (typeof value === 'string') params.set(key, value);
  }
  const search = params.toString();
  return search ? `/quran/compare?${search}` : '/quran/compare';
}
