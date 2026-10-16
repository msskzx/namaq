'use client';

import { useRouter } from 'next/navigation';
import { faFont, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toggle from '@/components/common/Toggle';

export default function CompareModeToggle({ themes, textHref, themesHref }: { themes: boolean; textHref: string; themesHref: string }) {
  const router = useRouter();
  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 pt-4 flex items-center gap-2 text-sm">
      <span className={themes ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}>المواضيع</span>
      <Toggle
        label="المقارنة بالمواضيع"
        checked={themes}
        onChange={(checked) => router.push(checked ? themesHref : textHref)}
        offIcon={<FontAwesomeIcon icon={faFont} className="size-3" />}
        onIcon={<FontAwesomeIcon icon={faLayerGroup} className="size-3" />}
      />
      <span className={themes ? 'text-gray-500 dark:text-gray-400' : 'font-semibold text-amber-600 dark:text-amber-400'}>النص</span>
    </div>
  );
}
