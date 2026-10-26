"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faUsers } from "@fortawesome/free-solid-svg-icons";
import styles from "@/components/common/PaperPage.module.css";
import Button from "@/components/common/Button";
import { useLanguage } from "@/components/language/LanguageContext";
import { useNavigatingRouter } from "@/components/common/NavigationLoader";
import { playerId, saveName, savedName, startParty } from "@/lib/party/client";
import { NameForm } from "./PartyRoom";

export default function PartyStartPage() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const router = useNavigatingRouter();
  const [name, setName] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => setName(savedName()), []);

  return (
    <div className={styles.page}>
      <div className="mx-auto max-w-3xl px-4 py-8" dir={ar ? "rtl" : "ltr"}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>{ar ? "نمق · اختبر معرفتك" : "Namaq · Test your knowledge"}</p>
          <h1>{ar ? "اختبار جماعي" : "Party quiz"}</h1>
          <p>{ar
            ? "يبدأ أحدكم الاختبار ويشارك رقمه، ويدخل الباقون من أجهزتهم. يجيب الجميع السؤال نفسه، وتظهر الإجابة والترتيب بعد أن يجيب الكل."
            : "One of you starts a party and shares its number, and the others join on their own devices. Everyone answers the same question, and the answer and leaderboard show once everyone has answered."}</p>
        </header>
        {name !== null && (
          <div className="grid gap-5 md:grid-cols-2">
            <section className={styles.panel} aria-label={ar ? "ابدأ اختبارًا" : "Start a party"}>
              <h2 className="mb-3 text-lg font-semibold">{ar ? "ابدأ اختبارًا" : "Start a party"}</h2>
              <NameForm initial={name} ar={ar} error={error} label={busy ? (ar ? "يبدأ…" : "Starting…") : (ar ? "ابدأ" : "Start")} onSubmit={async (value) => {
                if (busy) return;
                setBusy(true);
                setError(null);
                saveName(value);
                try {
                  router.push(`/quizzes/party/${await startParty(playerId(), value)}`);
                } catch {
                  setError(ar ? "تعذر بدء الاختبار. حاول مرة أخرى." : "Couldn't start a party. Try again.");
                  setBusy(false);
                }
              }} />
            </section>
            <section className={styles.panel} aria-label={ar ? "انضم إلى اختبار" : "Join a party"}>
              <h2 className="mb-3 text-lg font-semibold">{ar ? "انضم إلى اختبار" : "Join a party"}</h2>
              <form className="flex flex-col gap-2" onSubmit={(event) => {
                event.preventDefault();
                if (/^\d{6}$/.test(code)) router.push(`/quizzes/party/${code}`);
              }}>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-[var(--home-ink)]">{ar ? "رقم الاختبار" : "Party number"}</span>
                  <input dir="ltr" inputMode="numeric" autoComplete="off" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                    className="w-full max-w-xs rounded border border-[var(--home-rule)] bg-transparent px-3 py-2 text-2xl tracking-[0.2em] text-[var(--home-ink)] tabular-nums" />
                </label>
                <Button className="self-start" variant="primary" type="submit" disabled={code.length !== 6}><FontAwesomeIcon icon={ar ? faArrowLeft : faArrowRight} />{ar ? "انضم" : "Join"}</Button>
              </form>
            </section>
          </div>
        )}
        <p className="mt-6 text-sm text-[var(--home-muted)]"><FontAwesomeIcon icon={faUsers} className="me-2" />{ar ? "يمكنك أن تختبر وحدك أيضًا من " : "You can also take a quiz alone from "}<Link className="text-[var(--home-accent)] underline" href="/quizzes">{ar ? "صفحة الاختبارات" : "the quizzes page"}</Link>.</p>
      </div>
    </div>
  );
}
