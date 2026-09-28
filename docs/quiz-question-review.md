# Reviewing quiz questions

Review every pending candidate as one complete multiple-choice question: read
the Arabic prompt, all four displayed choices, the marked answer and every
claim named as evidence. Question review checks whether the quiz item works; it
does not change the historical claim's review status.

Approve a question only when the prompt is grammatical Arabic, the answer is
supported by the evidence, exactly one displayed choice is true and the other
three choices are unambiguous. Check person names, title names and Arabic gender
agreement against the current catalog and profile data.

Reject the candidate with a concrete reason when:

- the prompt states or mechanically reveals its answer;
- it asks who a named person's father or mother was;
- masculine wording is used for a woman or feminine wording for a man;
- raw slugs, internal family names or incomplete text appear;
- a distractor is also true, ambiguous or indistinguishable from the answer;
- the evidence does not support the exact answer;
- a virtue passage names its subject, combines too much unrelated material or
  is too vague to identify one person;
- a battle question merely tests whether someone appeared in a roster.

Use an Arabic prompt override only to repair or shorten the wording without
changing the answer, choice set or evidence. If any of those generated fields
is wrong, reject the candidate and fix the shared generator or historical data
before regenerating it.

After review, `npm run quiz:validate` must report no issues. Dry-run
`npm run quiz:project`, inspect the reported changes, then apply with
`npm run quiz:project -- --apply`.
