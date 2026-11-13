"use client";

import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";
import styles from "@/components/common/PaperPage.module.css";
import Button from "@/components/common/Button";
import { useLanguage } from "@/components/language/LanguageContext";
import { useNavigatingRouter } from "@/components/common/NavigationLoader";
import surahRows from "@shared/data/quran/surahs.json";
import { ayahHref } from "@shared/ayahMarks";
import { num } from "@shared/quran/arabicNumber";
import { JUZ_STARTS, type JuzRange } from "@shared/quran/juz";
import { WRITE_KEY } from "@/app/quran/read/writeKey";
import { openingKeys, openingRound, OPENINGS_KEY, type Openings } from "@shared/quran/openings";

/** The last juz range chosen, kept for next time (the app's openings-range). */
const RANGE_KEY = "quran-openings-range";
const names = new Map(surahRows.map((row) => [row.number, row.name]));
const juzName = (n: number) => { const [surah, ayah] = JUZ_STARTS[n - 1].split(":").map(Number); return `${names.get(surah)} ${num(ayah)}`; };

/** The surah openings quiz setup (the app's): which juz; the quiz itself runs in the mushaf, in write mode. */
export default function OpeningsPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const router = useNavigatingRouter();
  const [range, setRange] = useState<JuzRange>({ from: 1, to: 30 });
  useEffect(() => {
    try {
      const kept = JSON.parse(localStorage.getItem(RANGE_KEY) ?? "null") as JuzRange | null;
      if (kept && kept.from >= 1 && kept.to <= 30 && kept.from <= kept.to) setRange(kept);
    } catch {}
  }, []);
  const change = (next: JuzRange) => {
    setRange(next);
    try { localStorage.setItem(RANGE_KEY, JSON.stringify(next)); } catch {}
  };
  const whole = range.from === 1 && range.to === 30;
  const count = openingKeys(whole ? null : range).length;
  const start = () => {
    const round: Openings = { range: whole ? null : range, keys: openingRound(whole ? null : range, Math.random), at: 0 };
    try {
      sessionStorage.setItem(OPENINGS_KEY, JSON.stringify(round));
      localStorage.setItem(WRITE_KEY, "on");
    } catch {}
    const key = round.keys[0];
    router.push(`${ayahHref(key)}?recite=${key}&openings=1`);
  };
  const picker = (label: string, value: number, onPick: (n: number) => void) => (
    <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-[var(--home-muted)]">
      {label}
      <select value={value} onChange={(event) => onPick(Number(event.target.value))}
        className="h-11 rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] px-2 text-base text-[var(--home-ink)]">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{ar ? `${num(n)} · ${juzName(n)}` : `${n} · ${juzName(n)}`}</option>)}
      </select>
    </label>
  );
  const counted = ar
    ? count ? `${num(count)} ${count > 10 ? "سورة" : count > 2 ? "سور" : count === 2 ? "سورتان" : "سورة واحدة"} تبدأ فيها` : "لا تبدأ سورة في هذه الأجزاء."
    : count ? `${count} surah${count === 1 ? "" : "s"} start here` : "No surah starts in these juz.";
  return (
    <div className={styles.page}>
      <div className="mx-auto max-w-xl px-4 py-8" dir={ar ? "rtl" : "ltr"}>
        <h1 className="mb-4 text-2xl font-bold text-[var(--home-ink)]">{ar ? "أوائل السور" : "Surah openings"}</h1>
        <section className={`${styles.panel} mb-4`} aria-label={ar ? "الأجزاء" : "Juz"}>
          <p className="mb-2 font-semibold text-[var(--home-ink)]">{ar ? "الأجزاء" : "Juz"}</p>
          <div className="flex gap-3">
            {picker(ar ? "من" : "From", range.from, (n) => change({ from: n, to: Math.max(n, range.to) }))}
            {picker(ar ? "إلى" : "To", range.to, (n) => change({ from: Math.min(n, range.from), to: n }))}
          </div>
          <p className="mt-3 text-sm text-[var(--home-muted)]">{counted}</p>
        </section>
        <p className="mb-4 text-[var(--home-muted)]">{ar
          ? "يفتح المصحف عند أول سورة منها، ترى اسمها وتكتب أول آية فيها، ثم التالية."
          : "The mushaf opens at the start of one of them: you see its name and write its first ayah, then the next."}</p>
        {count > 0 && <Button variant="primary" size="lg" onClick={start}><Play aria-hidden />{ar ? "ابدأ" : "Start"}</Button>}
      </div>
    </div>
  );
}
