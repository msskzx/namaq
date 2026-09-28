'use client';

import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faBookOpen, faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
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

  useEffect(() => {
    if (!reference) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [reference, onClose]);

  if (!reference) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={ar ? 'إغلاق المرجع' : 'Close reference'}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50"
      />
      <div role="dialog" aria-modal="true" aria-label={ar ? 'الشاهد' : 'Reference'} className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-black">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            <FontAwesomeIcon icon={faBookOpen} />
            {ar ? 'الشاهد' : 'Reference'}
          </h2>
          <Button autoFocus size="icon" variant="outline" onClick={onClose} aria-label={ar ? 'إغلاق المرجع' : 'Close reference'}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
        <p dir="rtl" lang="ar" className="arabic-source mb-3 text-gray-800 dark:text-gray-200">{reference.excerptArabic}</p>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {reference.sourceTitle}
          {reference.pageReference ? (ar ? ` — ص${reference.pageReference}` : ` — p. ${reference.pageReference}`) : null}
        </p>
        <Button href={reference.readerUrl} target="_blank" variant="outline">
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          {ar ? 'فتح المرجع في القارئ' : 'Visit reference'}
        </Button>
      </div>
    </div>
  );
}
