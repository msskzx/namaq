import { createLucideIcon } from 'lucide-react-native';

/**
 * «حياتهم جنبًا إلى جنب» (owner, 2026-11-23: the icon should read as a timeline): two lives as two rails side by side,
 * each with its events as solid dots, and a year's line across both.
 */
export default createLucideIcon('LifeIcon', [
  ['path', { d: 'M2 6h20', key: 'rail-a' }],
  ['path', { d: 'M2 18h20', key: 'rail-b' }],
  ['path', { d: 'M12 2v20', key: 'year', strokeDasharray: '2 3', strokeWidth: '1.25' }],
  ['circle', { cx: '18', cy: '6', r: '1.25', key: 'a1' }],
  ['circle', { cx: '6', cy: '6', r: '1.25', key: 'a2' }],
  ['circle', { cx: '12', cy: '18', r: '1.25', key: 'b1' }],
  ['circle', { cx: '5', cy: '18', r: '1.25', key: 'b2' }],
]);
