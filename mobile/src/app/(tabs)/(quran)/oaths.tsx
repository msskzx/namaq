import { lazyScreen } from '@/lib/lazyScreen';

export default lazyScreen(() => require('@/screens/oaths'));
export { ErrorBoundary } from '@/components/CrashScreen';
