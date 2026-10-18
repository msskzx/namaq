"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faCodeBranch, faSpellCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/common/Button";
import { matchBranches } from "@/lib/quiz/branchAnswers";
import type { BranchAnswer } from "@/lib/quiz/branchQuestions";
import { branchesHref } from "@/lib/quran/branches";
import { num } from "@/lib/quran/arabicNumber";

type Question = { phrase?: string; branches?: BranchAnswer[] };
type Names = Record<number, string>;

export const branchesCorrect = (question: Question, typed: string[]) =>
  matchBranches(typed, (question.branches ?? []).map((branch) => branch.words)).every(Boolean);

function Ayat({ branch, names }: { branch: BranchAnswer; names: Names }) {
  return (
    <span className="flex flex-wrap gap-1">
      {branch.ayat.map(({ key, page }) => {
        const [surah, ayah] = key.split(":").map(Number);
        return (
          <Link key={key} href={`/quran/read/${page}`} className="rounded bg-amber-100 px-1.5 text-xs text-amber-800 hover:underline dark:bg-white/10 dark:text-amber-300">
            {names[surah] ? `${names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`}
          </Link>
        );
      })}
    </span>
  );
}

function Words({ branch, matched }: { branch: BranchAnswer; matched: number }) {
  return (
    <span className="font-arabic text-lg leading-loose">
      <span className="font-semibold">{branch.words.slice(0, matched).join(" ")}</span>
      {matched < branch.words.length && <span className="text-gray-500 dark:text-gray-400">{` ${branch.words.slice(matched).join(" ")}`}</span>}
    </span>
  );
}

export function BranchFeedback({ question, typed, names, ar }: { question: Question; typed: string[]; names: Names; ar: boolean }) {
  const branches = question.branches ?? [];
  const matches = matchBranches(typed, branches.map((branch) => branch.words));
  const missed = branches.filter((_, index) => !matches.some((hit) => hit?.branch === index));
  return (
    <div className="flex flex-col gap-3">
      {typed.map((answer, index) => {
        const hit = matches[index];
        return (
          <div key={index} className="flex items-start gap-2">
            <FontAwesomeIcon icon={hit ? faCircleCheck : faCircleXmark} className={`mt-1.5 ${hit ? "text-green-600" : "text-red-500"}`} />
            <div className="flex flex-col gap-1">
              <span className="text-gray-700 dark:text-gray-300">{answer.trim() || (ar ? "بدون إجابة" : "No answer")}</span>
              {hit && (
                <>
                  <Words branch={branches[hit.branch]} matched={hit.words} />
                  <Ayat branch={branches[hit.branch]} names={names} />
                </>
              )}
            </div>
          </div>
        );
      })}
      {missed.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">{ar ? "الصحيح:" : "Correct:"}</span>
          {missed.map((branch, index) => (
            <div key={index} className="flex flex-col gap-1">
              <Words branch={branch} matched={1} />
              <Ayat branch={branch} names={names} />
            </div>
          ))}
        </div>
      )}
      {question.phrase && (
        <Button className="self-start" size="sm" variant="outline" href={branchesHref(question.phrase)}>
          <FontAwesomeIcon icon={faCodeBranch} />
          {ar ? "شجرة الفواتح" : "Openings tree"}
        </Button>
      )}
    </div>
  );
}

export function BranchInputs({ typed, onChange, onCheck, ar }: { typed: string[]; onChange: (typed: string[]) => void; onCheck: () => void; ar: boolean }) {
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        onCheck();
      }}
    >
      {typed.map((value, index) => (
        <label key={index} className="flex flex-col gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">{ar ? `الفرع ${num(index + 1)}` : `Branch ${index + 1}`}</span>
          <input
            type="text"
            dir="rtl"
            lang="ar"
            value={value}
            onChange={(event) => onChange(typed.map((item, at) => (at === index ? event.target.value : item)))}
            className="w-full rounded border border-amber-400 bg-transparent px-3 py-2 text-lg text-gray-900 dark:text-gray-100"
          />
        </label>
      ))}
      <Button className="self-start" variant="primary" type="submit" disabled={typed.every((value) => !value.trim())}>
        <FontAwesomeIcon icon={faSpellCheck} />
        {ar ? "تحقق" : "Check"}
      </Button>
    </form>
  );
}
