# Marking which word each Ibn Qutaybah entry explains

Source: Ibn Qutaybah, «تفسير غريب القرآن». Each entry quotes part of an ayah (between ﴿ ﴾ or in parentheses) and then
glosses it. The quoted mushaf words are listed with ids `ayah:index` (index = word position in that ayah, from 0).

For EVERY entry in your chunk decide one mark:

- `words`: his gloss gives the meaning of one (or a few) specific quoted word(s). List exactly those ids. Examples:
  - «﴿وَالنَّخْلَ بَاسِقَاتٍ﴾ أي طوالا» → only باسقات.
  - «﴿لا رَيْبَ فِيهِ﴾ لا شكَّ فيه» → only ريب (he repeats the other words unchanged and swaps ريب → شك).
  - «﴿صِبْغَةَ اللَّهِ﴾ دين الله» → صبغة.
  - Two separate words each glossed («﴿مَثْنَى وَثُلاثَ﴾ …» with a meaning for each) → both ids.
  His own cues help: «واحدها…», «جمع…», «يقال: بسق…» root notes, a single word in the gloss replacing a single quoted word.
- `phrase`: the gloss explains the quoted words together and cannot be pinned to one word without twisting it (an idiom,
  a referent like «﴿الْمَغْضُوبِ عَلَيْهِمْ﴾ اليهود», «﴿أَعْجَازُ نَخْلٍ﴾ أصول نخل» where he explains the whole phrase,
  a grammar/construction note like «﴿بِسْمِ اللَّهِ﴾ اختصار كأنه قال: أبدأ باسم الله», a paraphrase of a clause).
  A referent («يعني الأنبياء») is NOT a word meaning → `phrase`.
- `unclear`: you cannot tell, the entry is mainly about another ayah/reading («ومن قرأ…»), or the gloss is for words not
  in the quoted list.

Rules:
- Judge only from his words. Never add a meaning he did not give. When in doubt between `words` and the others, do NOT
  pick `words`: a wrong word mark puts his note on the wrong word's page; `unclear` only hides it.
- A word id must be one of the entry's listed quoted words. Pick the word that carries the meaning; do not add particles
  (لا، في، و، الذين) unless the gloss is about the particle itself.
- If he glosses one word and then adds a remark about the whole phrase, still mark that word.

Output: one JSON object per line (JSONL), one line for every entry in the chunk, in order:
{"at":123,"mark":"words","words":["25:3"],"why":"gloss طوالا replaces باسقات"}
{"at":124,"mark":"phrase","why":"referent of the whole phrase"}
`why` is a few plain English words (Arabic words in Arabic script are fine).

Validate with: node <work>/check.mjs <work>/chunkN.ids.json <your output file>
Fix every problem it reports until it prints OK. Work through the chunk in parts if needed (append to the file), but the
final file must cover every entry. Do not read other agents' output folders.
