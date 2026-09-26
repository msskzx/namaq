"use client";

import React, { useCallback, useMemo } from "react";
import useSWR from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faFlag, faMagnifyingGlass, faRoute, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import Button from "@/components/common/Button";
import EventTimeline from "@/components/events/EventTimeline";
import { useLanguage } from "@/components/language/LanguageContext";
import translations from "@/components/language/translations";
import { fetcher } from "@/lib/swr";
import { filterTimeline, parseKinds, TIMELINE_KINDS, type TimelineItem, type TimelineKind } from "@/lib/timeline";

const KIND_LABELS: Record<TimelineKind, { ar: string; en: string }> = {
  event: { ar: "حدث", en: "Event" },
  battle: { ar: "معركة", en: "Battle" },
  ghazwah: { ar: "غزوة", en: "Ghazwah" },
  sariyyah: { ar: "سرية", en: "Sariyyah" },
};
const KIND_ICONS = { event: faCalendarAlt, battle: faShieldAlt, ghazwah: faFlag, sariyyah: faRoute } as const;

function EventsPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const ar = language === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: items, error, isLoading } = useSWR<TimelineItem[]>("/api/timeline", fetcher);

  const kinds = useMemo(() => parseKinds(searchParams.get("type")), [searchParams]);
  const query = searchParams.get("q") ?? "";
  const shown = useMemo(() => filterTimeline(items ?? [], kinds, query), [items, kinds, query]);

  const update = useCallback((changes: { type?: TimelineKind[]; q?: string }) => {
    const next = new URLSearchParams(searchParams.toString());
    if (changes.type !== undefined) {
      if (changes.type.length > 0) next.set("type", changes.type.join(","));
      else next.delete("type");
    }
    if (changes.q !== undefined) {
      if (changes.q) next.set("q", changes.q);
      else next.delete("q");
    }
    const search = next.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  const toggle = (kind: TimelineKind) =>
    update({ type: kinds.includes(kind) ? kinds.filter((value) => value !== kind) : [...kinds, kind] });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8" dir={ar ? "rtl" : "ltr"}>
        <div className="flex flex-col gap-3">
          <label className="relative block">
            <span className="sr-only">{ar ? "ابحث في الأحداث" : "Search events"}</span>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => update({ q: event.target.value })}
              placeholder={ar ? "ابحث بالاسم أو المكان" : "Search by name or place"}
              className="w-full rounded border border-amber-400 bg-transparent py-2 ps-9 pe-3 text-gray-900 dark:text-gray-100"
            />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label={ar ? "النوع" : "Type"}>
            {TIMELINE_KINDS.map((kind) => (
              <Button key={kind} variant="outline" size="sm" active={kinds.includes(kind)} aria-pressed={kinds.includes(kind)} onClick={() => toggle(kind)}>
                <FontAwesomeIcon icon={KIND_ICONS[kind]} className="h-3 w-3" />
                {KIND_LABELS[kind][ar ? "ar" : "en"]}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {error && <ErrorMessage title={t.eventsLoadError} />}
          {isLoading || !items ? (
            <LoadingSpinner fill />
          ) : shown.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">{ar ? "لا توجد نتائج مطابقة." : "Nothing matches."}</p>
          ) : (
            <EventTimeline events={shown} />
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsPage;
