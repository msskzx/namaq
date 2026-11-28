export const REST = 'وغيرها';

export function fitted(names: readonly string[], room: number, widths: Readonly<Record<string, number>>) {
  const all = names.join('، ');
  const sizes = names.map(name => widths[`${name}، `]);
  if (!room || names.length < 2 || sizes.some(w => w === undefined) || widths[REST] === undefined) return all;
  if (sizes.reduce((sum, w) => sum + w, 0) <= room) return all;
  let used = widths[REST];
  let shown = 0;
  while (shown < names.length - 1 && used + sizes[shown] <= room) used += sizes[shown++];
  return shown ? `${names.slice(0, shown).join('، ')}، ${REST}` : all;
}
