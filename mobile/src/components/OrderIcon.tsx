import { createLucideIcon } from 'lucide-react-native';

export default createLucideIcon('OrderIcon', [
  ['path', { d: 'M3 5h10', key: 'a' }],
  ['path', { d: 'M3 12h10', key: 'b' }],
  ['path', { d: 'M3 19h10', key: 'c' }],
  ['path', { d: 'M19 4v5', key: 'one' }],
  ['path', { d: 'M17.5 15c.7 1.3 2.3 1.3 3.5 -.5', key: 'two-tick' }],
  ['path', { d: 'M17.5 15v5', key: 'two-stem' }],
]);
