export function wordTokens(norm: string[], keys: string | undefined): string[] {
  const k = keys?.split(' ');
  return k?.length === norm.length ? norm.map((w, i) => k[i]?.replace(/\d+$/, '') || w) : norm;
}
