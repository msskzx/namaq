# القرآن

`mobile/src/app/(tabs)/(quran)/quran.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["القرآن"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  me -.-> sheet0{{"WordSheet"}}
```

## Ways in

- The tab bar's «القرآن».
- [الرئيسية](home.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `HitRow` | (onPress) | [المصحف](read.md) | [components/SearchResults.tsx:49](../../mobile/src/components/SearchResults.tsx#L49) |
|  | (onPress) | [المصحف](read.md) | [components/SearchResults.tsx:56](../../mobile/src/components/SearchResults.tsx#L56) |
|  | (onPress) | [متشابهات القرآن](branches.md) | [components/SearchResults.tsx:70](../../mobile/src/components/SearchResults.tsx#L70) |
|  | (onPress) | [مقارنة السور](compare.md) | [components/SearchResults.tsx:76](../../mobile/src/components/SearchResults.tsx#L76) |
|  | (onPress) | [قصة النبي](prophets-slug.md) | [components/SearchResults.tsx:83](../../mobile/src/components/SearchResults.tsx#L83) |
|  | (onPress) | [القصة](story.md) | [components/SearchResults.tsx:84](../../mobile/src/components/SearchResults.tsx#L84) |
|  | (onPress) | [قصص السيرة](stories.md) | [components/SearchResults.tsx:84](../../mobile/src/components/SearchResults.tsx#L84) |
|  | (onPress) | [الترجمة](person.md) | [components/SearchResults.tsx:91](../../mobile/src/components/SearchResults.tsx#L91) |
|  | (onPress) | [الغزوة](battle.md) | [components/SearchResults.tsx:91](../../mobile/src/components/SearchResults.tsx#L91) |
|  | (onPress) | [حديث الأربعين](hadith-forty.md) | [components/SearchResults.tsx:98](../../mobile/src/components/SearchResults.tsx#L98) |
|  | (onPress) | [حديث الصحيح](hadith-sahih.md) | [components/SearchResults.tsx:98](../../mobile/src/components/SearchResults.tsx#L98) |
|  | (onPress) | [أبواب الكتاب](hadith-kitab.md) | [components/SearchResults.tsx:98](../../mobile/src/components/SearchResults.tsx#L98) |
|  | (onPress) | [تحفة الأطفال](tuhfa.md) | [components/SearchResults.tsx:109](../../mobile/src/components/SearchResults.tsx#L109) |
|  | (onPress) | [الذكر](dhikr.md) | [components/SearchResults.tsx:119](../../mobile/src/components/SearchResults.tsx#L119) |
|  | (onPress) | [المصحف](read.md) | [components/SearchResults.tsx:125](../../mobile/src/components/SearchResults.tsx#L125) |
| `WordView` | (open) | [المصحف](read.md) | [components/WordSheet.tsx:111](../../mobile/src/components/WordSheet.tsx#L111) |
| `QURAN_TILES` | المصحف | [المصحف](read.md) | [screens/quran.tsx:19](../../mobile/src/screens/quran.tsx#L19) |
|  | متشابهات القرآن | [متشابهات القرآن](branches.md) | [screens/quran.tsx:20](../../mobile/src/screens/quran.tsx#L20) |
|  | مقارنة السور | [مقارنة السور](compare.md) | [screens/quran.tsx:21](../../mobile/src/screens/quran.tsx#L21) |
|  | قصص الأنبياء | [قصص الأنبياء](prophets.md) | [screens/quran.tsx:22](../../mobile/src/screens/quran.tsx#L22) |
|  | تحفة الأطفال | [تحفة الأطفال](tuhfa.md) | [screens/quran.tsx:23](../../mobile/src/screens/quran.tsx#L23) |
|  | ألفاظ القرآن | [ألفاظ القرآن](words.md) | [screens/quran.tsx:24](../../mobile/src/screens/quran.tsx#L24) |
|  | الأقسام | [الأقسام](oaths.md) | [screens/quran.tsx:25](../../mobile/src/screens/quran.tsx#L25) |
|  | مشاهد | [مشاهد](lataif.md) | [screens/quran.tsx:26](../../mobile/src/screens/quran.tsx#L26) |
|  | مصطلحات البلاغة | [مصطلحات البلاغة](terms.md) | [screens/quran.tsx:27](../../mobile/src/screens/quran.tsx#L27) |
|  | القراءات | [القراءات](qiraat.md) | [screens/quran.tsx:28](../../mobile/src/screens/quran.tsx#L28) |
|  | فواتح السور | [فواتح السور](openings.md) | [screens/quran.tsx:29](../../mobile/src/screens/quran.tsx#L29) |
|  | ترتيب السور | [ترتيب السور](order.md) | [screens/quran.tsx:30](../../mobile/src/screens/quran.tsx#L30) |

## Sheets

- `WordSheet`
