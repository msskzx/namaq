import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/person'));
export { ErrorBoundary } from '@/components/CrashScreen';
