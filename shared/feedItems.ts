
export const rajabItem = (n: number, paragraph: number) => `${n}-${paragraph}`;
export const momentItem = (battle: string, n: number) => `${battle}-${n}`;
export const storyItem = (slug: string, phase: number) => `${slug}-${phase}`;
export const virtueItem = (person: string, index: number) => `${person}-${index}`;
export const tieItem = (a: string, b: string) => `${a},${b}`;
export const nameItem = (person: string, name: string) => `${person}|${name}`;

export const sceneItem = (unit: string, n: number) => `${unit}-${n}`;
export const eventItem = (slug: string, event: number) => `${slug}-${event}`;

export function lastNumber(item: string): { head: string; n: number } | null {
  const at = item.lastIndexOf('-');
  const n = Number(item.slice(at + 1));
  return at > 0 && Number.isInteger(n) ? { head: item.slice(0, at), n } : null;
}
