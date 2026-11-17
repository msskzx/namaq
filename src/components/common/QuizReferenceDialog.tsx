'use client';

import { useRef } from 'react';
import { BookOpen, ExternalLink as Opens, X } from 'lucide-react';
import Button from '@/components/common/Button';
import Sheet from '@/components/common/Sheet';
import { useLanguage } from '@/components/language/LanguageContext';
import type { QuizReference } from '@/lib/quiz/quizReference';

interface QuizReferenceDialogProps {
  reference: QuizReference | null;
  onClose: () => void;
}

/** One quiz reference on the current page: the cited excerpt with a way to read it in place. */
export default function QuizReferenceDialog({ reference, onClose }: QuizReferenceDialogProps) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const dialog = useRef<HTMLDialogElement>(null);
  if (!reference) return null;
  const close = () => { if (typeof dialog.current?.close === 'function' && dialog.current.open) dialog.current.close(); else onClose(); };
  const label = ar ? 'إغلاق المرجع' : 'Close reference';

  return (
    <Sheet ref={dialog} open kind="center" label={ar ? 'الشاهد' : 'Reference'} onClose={onClose} dir={ar ? 'rtl' : 'ltr'} lang={ar ? 'ar' : 'en'} className="max-h-[80dvh] max-w-lg overflow-y-auto">
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen size={18} aria-hidden className="text-[var(--home-accent)]" />
            {ar ? 'الشاهد' : 'Reference'}
          </h2>
          <Button autoFocus size="round" variant="muted" onClick={close} aria-label={label} title={label}><X aria-hidden /></Button>
        </div>
        <p dir="rtl" lang="ar" className="arabic-source">{reference.excerptArabic}</p>
        <p className="text-sm text-[var(--home-muted)]">
          {reference.sourceTitle}
          {reference.pageReference ? (ar ? ` — ص${reference.pageReference}` : ` — p. ${reference.pageReference}`) : null}
        </p>
        <Button href={reference.readerUrl} target="_blank" variant="outline" className="self-start">
          <Opens size={16} aria-hidden />
          {ar ? 'فتح المرجع في القارئ' : 'Visit reference'}
        </Button>
      </div>
    </Sheet>
  );
}
