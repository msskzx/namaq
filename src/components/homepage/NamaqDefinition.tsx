"use client";

import { useLanguage } from "../language/LanguageContext";
import translations from "../language/translations";

const words = ['نَمَق', 'يَنمُق', 'نَمْقًا', 'نامِق', 'مَنْموق', 'نَمَّقَ', 'ينمِّق', 'تنميقًا', 'مُنمِّق', 'نَمْق', 'نَمَق'];

export default function NamaqDefinition() {
  const { language } = useLanguage();
  const t = translations[language];
  const ar = language === 'ar';
  return (
    <details className="mt-8 border-t border-[var(--home-rule)] pt-4">
      <summary className="cursor-pointer text-lg">{ar ? 'اسم نمق' : 'The name Namaq'}</summary>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {[t.verbNamaq, t.nounNamaq].map(entry => (
          <section key={entry.title} className="space-y-3 leading-loose">
            <h2 className="text-xl">{entry.title}</h2>
            <p>{entry.definition}</p>
            {entry.forms.filter(form => form !== entry.definition).map(form => <p key={form} className="text-[var(--home-muted)]">{form}</p>)}
          </section>
        ))}
      </div>
      <p className="mt-6 font-arabic text-lg leading-loose text-[var(--home-muted)]" dir="rtl" lang="ar">{words.join(' · ')}</p>
    </details>
  );
}
