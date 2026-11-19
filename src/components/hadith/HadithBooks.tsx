import type { BookBox } from '@shared/hadith';
import { num } from '@shared/quran/arabicNumber';
import Card from '@/components/common/Card';

// «من أخرجه» (owner, 2026-11-19; sketch /mnt/project-files/hadith-sciences, row 3): the hadith on top and each place it is
// recorded under it, as the app's mobile/src/components/HadithBooks.tsx draws it. The hadith page, its feed card and the
// quiz's look-up draw this one view; a Sahih page passes its own boxes and a link per box.
const said = (box: BookBox, namer: string) => [box.number ? `${box.name} ${num(box.number)}` : box.name, ...(box.named ? [`سمّاه ${namer}`] : []), ...box.notes].join('، ');

/** `namer` is who names the books marked `named` (al-Nawawi, or Ibn Rajab for the eight he adds). */
export default function HadithBooks({ top, boxes, hrefOf, namer = 'النووي' }: { top: string; boxes: BookBox[]; hrefOf?: (box: BookBox) => string | undefined; namer?: string }) {
  const line = (shown: boolean) => <span className={`h-px flex-1 ${shown ? 'bg-[var(--home-rule)]' : ''}`} />;
  return (
    <div role={hrefOf ? undefined : 'img'} aria-label={hrefOf ? undefined : boxes.map(box => said(box, namer)).join('؛ ')} className="flex flex-col items-center">
      <Card className="px-3.5 py-0.5 text-center text-[0.97rem] text-[var(--home-green)]">{top}</Card>
      <span className="h-3 w-px bg-[var(--home-rule)]" />
      <div className="flex self-stretch">
        {boxes.map((box, i) => {
          const href = hrefOf?.(box);
          const inside = <>
            <span className="block break-words text-[0.94rem] leading-snug">{box.name}</span>
            {box.number ? <span className="block text-[0.8125rem] text-[var(--home-muted)]">{num(box.number)}</span> : null}
          </>;
          return (
            <div key={box.key} className="flex min-w-0 flex-1 flex-col items-center">
              <span className="flex self-stretch">{line(i > 0)}{line(i < boxes.length - 1)}</span>
              <span className="h-3 w-px bg-[var(--home-rule)]" />
              {href
                ? <Card href={href} aria-label={said(box, namer)} className="max-w-[94%] px-2 py-0.5 text-center">{inside}</Card>
                : <Card className="max-w-[94%] px-2 py-0.5 text-center">{inside}</Card>}
              {box.named && <span className="mt-0.5 text-center text-[0.78rem] text-[var(--home-accent)]">سمّاه {namer}</span>}
              {box.notes.map(note => <span key={note} className="text-center text-[0.78rem] text-[var(--home-muted)]">{note}</span>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
