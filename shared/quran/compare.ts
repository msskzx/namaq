export function wordTokens(norm: string[], keys: string | undefined): string[] {
  const k = keys?.split(' ');
  // The corpus numbers homograph lemmas (إذا, إذا2); the letters are the same word here.
  return k?.length === norm.length ? norm.map((w, i) => k[i]?.replace(/\d+$/, '') || w) : norm;
}
