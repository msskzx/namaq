/** The card a share button sits in: its `[data-share-image]` part when it marks one, else the whole `[data-share-card]`. */
export function shareTarget(button: HTMLElement): HTMLElement | null {
  const card = button.closest<HTMLElement>('[data-share-card]');
  return card?.querySelector<HTMLElement>('[data-share-image]') ?? card;
}

/** The card's own address (a path, or a `#card` on this page), or the page's when it has none. */
export const shareUrl = (href?: string) => (typeof window === 'undefined' ? href : new URL(href ?? '', window.location.href).href);
