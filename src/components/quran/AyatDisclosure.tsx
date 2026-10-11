import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { num } from '@/lib/quran/arabicNumber';

export type AyatLine = { ayah: number; text: string };

export default function AyatDisclosure({ title, lines }: { title: string; lines: AyatLine[] }) {
  return (
    <details className="group rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 [&::-webkit-details-marker]:hidden">
        <FontAwesomeIcon icon={faChevronDown} aria-hidden className="text-xs transition-transform group-open:rotate-180" />
        <span className="flex-1">{title}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{`${num(lines.length)} آية`}</span>
      </summary>
      <div className="px-3 pb-2">
        {lines.map(l => (
          <p key={l.ayah} className="text-2xl leading-[2.2] font-arabic">
            <span className="text-sm text-amber-600 dark:text-amber-400 me-2">{num(l.ayah)}</span>
            {l.text}
          </p>
        ))}
      </div>
    </details>
  );
}
