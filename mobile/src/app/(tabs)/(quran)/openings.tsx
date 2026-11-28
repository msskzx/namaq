import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/openings'));
export { ErrorBoundary } from '@/components/CrashScreen';
