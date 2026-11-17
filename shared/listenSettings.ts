import { keyStore } from './storage';
import { DEFAULT_RECITER, isRepeatPlan, ONCE, RECITERS, type RepeatPlan } from './quran/recitation';

/** Listening's defaults, kept on this device: the reciter, and how a range plays (each ayah's and the range's times, the pause, the speed). */
const json = (raw: string | null): unknown => { try { return raw ? JSON.parse(raw) : null; } catch { return null; } };

const plan = keyStore<RepeatPlan>('listen-plan', raw => { const value = json(raw); return isRepeatPlan(value) ? value : ONCE; });
export const readListenPlan = plan.read;
export const subscribeListenPlan = plan.subscribe;
export const serverListenPlan = () => ONCE;
export const writeListenPlan = (value: RepeatPlan) => plan.write(JSON.stringify(value));

const reciter = keyStore<number>('reciter', raw => { const value = json(raw); return typeof value === 'number' && RECITERS.some(item => item.id === value) ? value : DEFAULT_RECITER; });
export const readReciter = reciter.read;
export const subscribeReciter = reciter.subscribe;
export const serverReciter = () => DEFAULT_RECITER;
export const writeReciter = (value: number) => reciter.write(JSON.stringify(value));
