import LoadingDots from '@/components/common/LoadingDots';

export default function Loading() {
  return (
    <div data-route-loading className="min-h-screen bg-[var(--home-paper)]">
      <LoadingDots fill="page" />
    </div>
  );
}
