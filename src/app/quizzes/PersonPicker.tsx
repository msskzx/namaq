"use client";

import React, { useState } from "react";

type Suggestion = { slug: string; name: string; nameTransliterated: string | null };

/** Picks the person for the "A person's circle" topic; `onCommit` gets a slug, or the typed text when nothing matches. */
export default function PersonPicker({ person, onCommit, ar }: { person: string; onCommit: (person: string | undefined) => void; ar: boolean }) {
  const [input, setInput] = useState(person);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const optionValue = (suggestion: Suggestion) =>
    suggestions.filter((other) => other.name === suggestion.name).length > 1 ? `${suggestion.name} (${suggestion.nameTransliterated ?? suggestion.slug})` : suggestion.name;
  const commit = () => {
    const typedName = input.trim();
    const match = suggestions.find((suggestion) => [optionValue(suggestion), suggestion.slug].includes(typedName));
    onCommit(match?.slug ?? (typedName || undefined));
  };
  return (
    <label className="mt-4 block">
      <span className="mb-1 block text-sm font-semibold text-[var(--home-ink)]">{ar ? "الشخص" : "Person"}</span>
      <input
        type="text"
        value={input}
        onChange={async (event) => {
          const value = event.target.value;
          setInput(value);
          if (!value.trim()) {
            setSuggestions([]);
            return;
          }
          const response = await fetch(`/api/people/suggest?q=${encodeURIComponent(value)}`);
          if (response.ok) setSuggestions((await response.json()).data ?? []);
        }}
        onBlur={commit}
        list="quiz-people"
        placeholder={ar ? "ابحث عن شخص" : "Search for a person"}
        className="w-full rounded border border-[var(--home-rule)] bg-transparent px-3 py-2 text-[var(--home-ink)]"
      />
      <datalist id="quiz-people">
        {suggestions.map((suggestion) => <option key={suggestion.slug} value={optionValue(suggestion)}>{suggestion.nameTransliterated ?? suggestion.name}</option>)}
      </datalist>
      <span className="mt-1 block text-xs text-[var(--home-muted)]">{ar ? "تُضاف أسئلة هذا الشخص إلى المواضيع الأخرى المختارة." : "This person's questions are added to the other topics you chose."}</span>
    </label>
  );
}
