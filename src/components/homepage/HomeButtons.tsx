import { Compass, LibraryBig, NotebookPen, Presentation, SunMoon } from 'lucide-react';
import Card from '@/components/common/Card';

/**
 * The few buttons at the top of home, the app's HomeButtons (owner, 2026-11-18, in the story circles' place): what is not a
 * tab and still needs a way in from home. «مدونتي» holds what the reader kept: saved, forgotten and notes.
 */
const BUTTONS = [
  { label: 'القبلة', Icon: Compass, href: '/utilities?view=qibla' },
  { label: 'الأذكار', Icon: SunMoon, href: '/utilities?view=adhkar' },
  { label: 'المكتبة', Icon: LibraryBig, href: '/quran/books' },
  { label: 'مشاهد', Icon: Presentation, href: '/quran/lataif' },
  { label: 'مدونتي', Icon: NotebookPen, href: '/library?tab=saved' },
];

export default function HomeButtons() {
  return <nav aria-label="اختصارات" dir="rtl" className="flex gap-2">
    {BUTTONS.map(({ label, Icon, href }) => (
      <Card key={label} href={href} className="flex min-w-0 flex-1 flex-col items-center gap-1 px-0.5 py-2">
        <Icon size={22} strokeWidth={1.75} aria-hidden className="text-[var(--home-accent)]" />
        <span className="truncate text-[0.8125rem]">{label}</span>
      </Card>
    ))}
  </nav>;
}
