import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => ({ default: require('@/screens/info').AboutScreen }), { warm: false });
export { ErrorBoundary } from '@/components/CrashScreen';
