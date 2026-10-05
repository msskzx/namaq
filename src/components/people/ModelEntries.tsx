import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import { useLanguage } from '@/components/language/LanguageContext';
import {
  citationLabel,
  isBookText,
  originLabel,
  predicateLabel,
  predicateOrder,
  statusLabel,
  valueLines,
  type ModelEntryDto,
  type ModelSpanDto,
} from '@/lib/modelView';

export default function ModelEntries({
  entries,
  spans,
}: {
  entries: ModelEntryDto[];
  spans: ModelSpanDto[];
}) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const rank = (predicate: string) => {
    const index = predicateOrder.indexOf(predicate);
    return index === -1 ? predicateOrder.length : index;
  };
  const groups = [...new Set(entries.map((e) => e.predicate))].sort((a, b) => rank(a) - rank(b));

  return (
    <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4">
      <h2 className="text-3xl mb-2 text-gray-900 dark:text-gray-200">
        <FontAwesomeIcon icon={faQuoteRight} className="w-7 h-7 text-amber-500 me-2" />
        {ar ? 'من نص الكتاب (تجريبي)' : 'From the text of the book (experimental)'}
      </h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {ar
          ? 'كل قيمة هنا مقروءة مباشرة من نص السير، ومعها من قالها. لم تُراجَع بعد.'
          : 'Every value here is read directly from the text of the Siyar, with who said it. None is reviewed yet.'}
      </p>
      <div className="flex flex-col gap-5">
        {groups.map((predicate) => (
          <section key={predicate}>
            <h3 className="mb-2 text-xl text-gray-900 dark:text-gray-200">
              {predicateLabel(predicate, language)}
            </h3>
            <ul className="flex flex-col gap-3">
              {entries
                .filter((e) => e.predicate === predicate)
                .map((entry) => (
                  <li key={`${entry.unit}/${entry.assertionId}`} className="flex flex-col gap-1">
                    {valueLines(entry, language).map((line, i) => (
                      <p
                        key={i}
                        className="text-lg text-gray-800 dark:text-gray-200"
                        {...(isBookText(entry) ? { lang: 'ar', dir: 'rtl' } : {})}
                      >
                        {line}
                      </p>
                    ))}
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      {entry.origins.map((origin, i) => (
                        <Badge
                          key={i}
                          size="sm"
                          color="gray"
                          text={originLabel(origin, language)}
                        />
                      ))}
                      <Badge
                        size="sm"
                        color={entry.reviewed ? 'blue' : 'amber'}
                        text={statusLabel(entry, language)}
                      />
                      {citationLabel(entry, spans, language) && (
                        <span>{citationLabel(entry, spans, language)}</span>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
