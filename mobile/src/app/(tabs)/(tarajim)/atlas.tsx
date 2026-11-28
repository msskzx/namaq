import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/atlas'));
export { ErrorBoundary } from '@/components/CrashScreen';
