'use client';

import { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { faFont, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toggle from '@/components/common/Toggle';

export default function CompareModeToggle({ themes, textHref, themesHref }: { themes: boolean; textHref: string; themesHref: string }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [shown, setShown] = useOptimistic(themes);
  const label = (on: boolean) => (on ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400');
  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 pt-4 flex items-center gap-2 text-sm">
      <span className={label(!shown)}>النص</span>
      <Toggle
        label="المقارنة بالمواضيع"
        checked={shown}
        onChange={(checked) =>
          startTransition(() => {
            setShown(checked);
            router.push(checked ? themesHref : textHref);
          })
        }
        offIcon={<FontAwesomeIcon icon={faFont} className="size-3" />}
        onIcon={<FontAwesomeIcon icon={faLayerGroup} className="size-3" />}
      />
      <span className={label(shown)}>المواضيع</span>
    </div>
  );
}
