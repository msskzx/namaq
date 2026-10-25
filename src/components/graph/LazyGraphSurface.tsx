'use client';

import React, { forwardRef, lazy, Suspense, useEffect, useState } from 'react';
import type GraphSurfaceComponent from './GraphSurface';
import type { GraphSurfaceMethods } from './GraphSurface';
import LoadingSpinner from '@/components/common/LoadingSpinner';

type GraphSurfaceProps = React.ComponentProps<typeof GraphSurfaceComponent>;

const Lazy = lazy(() => import('./GraphSurface'));

const LazyGraphSurface = forwardRef<GraphSurfaceMethods, GraphSurfaceProps>(function LazyGraphSurface(props, ref) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <LoadingSpinner variant="graph" />;
  return (
    <Suspense fallback={<LoadingSpinner variant="graph" />}>
      <Lazy {...props} ref={ref} />
    </Suspense>
  );
});

export default LazyGraphSurface;
export type { GraphSurfaceMethods };
