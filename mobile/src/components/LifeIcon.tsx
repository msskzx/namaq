import { createLucideIcon } from 'lucide-react-native';

/**
 * «حياتهم جنبًا إلى جنب» (owner, 2026-11-23): two lives as two rails side by side. An event both shared joins the rails
 * (a dot on each, tied by a line); an event only one of them had is a dot on his rail alone.
 */
export default createLucideIcon('LifeIcon', [
  ['path', { d: 'M2 6h20', key: 'rail-a' }],
  ['path', { d: 'M2 18h20', key: 'rail-b' }],
  ['path', { d: 'M12 6v12', key: 'shared' }],
  ['circle', { cx: '12', cy: '6', r: '2.25', key: 'shared-a' }],
  ['circle', { cx: '12', cy: '18', r: '2.25', key: 'shared-b' }],
  ['circle', { cx: '19', cy: '6', r: '1.25', key: 'only-a' }],
  ['circle', { cx: '5', cy: '18', r: '1.25', key: 'only-b' }],
]);
