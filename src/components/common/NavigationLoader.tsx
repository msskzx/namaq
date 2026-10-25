'use client';

import React, { createContext, Suspense, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

const SHOW_AFTER_MS = 150;
const GIVE_UP_MS = 8000;

const NavigationContext = createContext<(href: string) => void>(() => {});

function isNewUrl(href: string) {
  const target = new URL(href, window.location.href);
  return target.origin === window.location.origin && target.pathname + target.search !== window.location.pathname + window.location.search;
}

function linkTarget(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const anchor = (event.target as Element | null)?.closest?.('a[href]');
  if (!(anchor instanceof HTMLAnchorElement) || anchor.target && anchor.target !== '_self' || anchor.hasAttribute('download')) return null;
  return anchor.href;
}

function UrlWatcher({ onChange }: { onChange(): void }) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useEffect(onChange, [pathname, search, onChange]);
  return null;
}

export function NavigationLoaderProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState(false);
  const [shown, setShown] = useState(false);
  const pathname = usePathname();
  const start = useCallback((href: string) => { if (isNewUrl(href)) setPending(true); }, []);
  const stop = useCallback(() => setPending(false), []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => { const href = linkTarget(event); if (href) start(href); };
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', stop);
    return () => { document.removeEventListener('click', onClick, true); window.removeEventListener('popstate', stop); };
  }, [start, stop]);

  useEffect(() => {
    if (!pending) { setShown(false); return; }
    const show = setTimeout(() => setShown(true), SHOW_AFTER_MS);
    const giveUp = setTimeout(stop, GIVE_UP_MS);
    return () => { clearTimeout(show); clearTimeout(giveUp); };
  }, [pending, stop]);

  return (
    <NavigationContext.Provider value={start}>
      {children}
      <Suspense fallback={null}><UrlWatcher onChange={stop} /></Suspense>
      {shown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="rounded-md border border-[var(--home-rule)] bg-[var(--home-paper-deep)] px-5 py-2 shadow-[0_4px_16px_var(--home-shadow)]">
            <LoadingSpinner size="lg" variant={pathname.startsWith('/graphs') ? 'graph' : 'tree'} />
          </div>
        </div>
      )}
    </NavigationContext.Provider>
  );
}

export function useNavigatingRouter() {
  const router = useRouter();
  const start = useContext(NavigationContext);
  return useMemo(() => ({
    ...router,
    push: (...args: Parameters<typeof router.push>) => { start(args[0]); router.push(...args); },
    replace: (...args: Parameters<typeof router.replace>) => { start(args[0]); router.replace(...args); },
  }), [router, start]);
}
