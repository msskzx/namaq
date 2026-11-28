import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/prophets/slug'));
export { ErrorBoundary } from '@/components/CrashScreen';
