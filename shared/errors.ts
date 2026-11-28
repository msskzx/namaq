export type ReportedError = { where: string; reason: string; at: number; times: number };

const KEEP = 20;
const recent: ReportedError[] = [];

const messageOf = (error: unknown): string => {
  if (error instanceof Error) return `${error.name === 'Error' ? '' : `${error.name}: `}${error.message}`;
  if (typeof error === 'string') return error;
  try { return JSON.stringify(error) ?? String(error); } catch { return String(error); }
};

export function causeChain(error: unknown): string {
  const lines: string[] = [];
  const seen = new Set<unknown>();
  for (let at: unknown = error; at !== undefined && at !== null && !seen.has(at); at = at instanceof Error ? at.cause : undefined) {
    seen.add(at);
    lines.push(lines.length ? `← ${messageOf(at)}` : messageOf(at));
  }
  return lines.join('\n');
}

export function reportError(where: string, error: unknown) {
  const reason = causeChain(error);
  const index = recent.findIndex(item => item.where === where && item.reason === reason);
  if (index >= 0) {
    const [same] = recent.splice(index, 1);
    recent.unshift({ ...same, at: Date.now(), times: same.times + 1 });
    return;
  }
  recent.unshift({ where, reason, at: Date.now(), times: 1 });
  recent.length = Math.min(recent.length, KEEP);
  console.warn(`[${where}] ${reason}`);
}

export const recentErrors = (): readonly ReportedError[] => recent.slice();
