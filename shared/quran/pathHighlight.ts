export const pathToggleKey = (id: string, keys: string[]): string => keys.length === 1 ? `path:${keys[0]}` : `node:${id}`;

export function togglePath(current: Map<string, string[]>, id: string, keys: string[]): Map<string, string[]> {
  const next = new Map(current);
  const key = pathToggleKey(id, keys);
  if (!next.delete(key)) next.set(key, keys);
  return next;
}

export const litPaths = (pinned: Map<string, string[]>): Set<string> => new Set([...pinned.values()].flat());
