export const ADHKAR_OCCASIONS = ['morning', 'evening', 'waking', 'sleep', 'after-prayer'] as const;
export type AdhkarOccasion = typeof ADHKAR_OCCASIONS[number];

export type AdhkarCitation = {
  source: 'adhkar-nawawi' | 'nataij-afkar';
  volume: number;
  page: number;
  report?: number;
  url: string;
};

export type DhikrGrade = {
  /** `isnad-sahih` is a judgment on the chain alone («بإسناد صحيح», «صحيح الإسناد»), not on the hadith. */
  rank: 'sahih' | 'hasan' | 'hasan-sahih' | 'isnad-sahih';
  scholar: string;
  quote: string;
  citation: AdhkarCitation;
  reportedBy?: string;
};

export type Dhikr = {
  id: string;
  occasions: readonly AdhkarOccasion[];
  content: { kind: 'text'; text: string } | {
    kind: 'quran';
    ranges: readonly { surah: number; from: number; to: number }[];
  };
  citation: AdhkarCitation;
  collections: readonly string[];
  grades: readonly DhikrGrade[];
  occasionQuote: string;
  repeat?: { count: number; quote: string; scope: 'whole-selection' };
  instructionQuote?: string;
  virtueQuote?: string;
};

export const ADHKAR: readonly Dhikr[] = [
  {
    "id": "waking-life",
    "occasions": [
      "waking"
    ],
    "content": {
      "kind": "text",
      "text": "الحَمْدُ لِلَّهِ الَّذي أحْيانا بَعْدَما أماتَنا وإلَيْهِ النشور"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 19,
      "url": "https://shamela.ws/book/1956/17",
      "report": 37
    },
    "collections": [
      "صحيح البخاري"
    ],
    "grades": [
      {
        "rank": "sahih",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث صحيح",
        "citation": {
          "source": "nataij-afkar",
          "volume": 1,
          "page": 109,
          "url": "https://shamela.ws/book/30108/117"
        }
      }
    ],
    "occasionQuote": "وإذَا اسْتَيْقَظَ قالَ"
  },
  {
    "id": "waking-spirit",
    "occasions": [
      "waking"
    ],
    "content": {
      "kind": "text",
      "text": "الحَمْدُ لِلَّهِ الَّذي رَدَّ عَلَيّ رُوحِي، وَعافانِي في جَسَدِي، وأذِن لي بذكره"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 20,
      "url": "https://shamela.ws/book/1956/18",
      "report": 38
    },
    "collections": [
      "كتاب ابن السني"
    ],
    "grades": [
      {
        "rank": "isnad-sahih",
        "scholar": "النووي",
        "quote": "بإسناد صحيح",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 20,
          "url": "https://shamela.ws/book/1956/18",
          "report": 38
        }
      },
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "فإن الشطر الثاني الذي اقتصر عليه من أفراد محمد بن عجلان، وهو صدوق، لكن في حفظه شيء، وخصوصًا في روايته عن المقبري، فالذي ينفرد به من قبيل الحسن",
        "citation": {
          "source": "nataij-afkar",
          "volume": 1,
          "page": 113,
          "url": "https://shamela.ws/book/30108/122"
        }
      }
    ],
    "occasionQuote": "إذَا اسْتَيْقَظَ أَحَدُكُمْ فَلْيَقُلْ"
  },
  {
    "id": "prayer-peace",
    "occasions": [
      "after-prayer"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ أنْتَ السَّلامُ وَمِنْكَ السَّلامُ، تَبارَكْتَ يا ذَا الجَلالِ وَالإِكْرامِ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 71,
      "url": "https://shamela.ws/book/1956/69",
      "report": 183
    },
    "collections": [
      "صحيح مسلم"
    ],
    "grades": [
      {
        "rank": "sahih",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث صحيح",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 252,
          "url": "https://shamela.ws/book/30108/827"
        }
      }
    ],
    "occasionQuote": "إذا انصرف من صلاته"
  },
  {
    "id": "prayer-giving",
    "occasions": [
      "after-prayer"
    ],
    "content": {
      "kind": "text",
      "text": "لا إلهَ إِلاَّ اللَّهُ وَحْدَهُ لا شَريكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ على كُلّ شئ قَدِيرٌ، اللَّهُمَّ لا مانِعَ لِمَا أعْطَيْتَ، وَلاَ معطي لما مَنَعْتَ، وَلا يَنْفَعُ ذا الجد مِنْكَ الجَدُّ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 71,
      "url": "https://shamela.ws/book/1956/69",
      "report": 184
    },
    "collections": [
      "صحيحي البخاري ومسلم"
    ],
    "grades": [
      {
        "rank": "sahih",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث صحيح",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 256,
          "url": "https://shamela.ws/book/30108/832"
        }
      }
    ],
    "occasionQuote": "إذا فَرَغ من الصلاة وسلّم"
  },
  {
    "id": "prayer-help",
    "occasions": [
      "after-prayer"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ أعِنِّي على ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبادَتِكَ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 73,
      "url": "https://shamela.ws/book/1956/71",
      "report": 192
    },
    "collections": [
      "سنن أبي داود",
      "النسائي"
    ],
    "grades": [
      {
        "rank": "isnad-sahih",
        "scholar": "النووي",
        "quote": "بإسناد صحيح",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 73,
          "url": "https://shamela.ws/book/1956/71",
          "report": 192
        }
      },
      {
        "rank": "sahih",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث صحيح",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 297,
          "url": "https://shamela.ws/book/30108/879"
        }
      }
    ],
    "occasionQuote": "فِي دُبُرِ كُلّ صَلاةٍ"
  },
  {
    "id": "morning-evening-protection",
    "occasions": [
      "morning",
      "evening"
    ],
    "content": {
      "kind": "quran",
      "ranges": [
        {
          "surah": 112,
          "from": 1,
          "to": 4
        },
        {
          "surah": 113,
          "from": 1,
          "to": 5
        },
        {
          "surah": 114,
          "from": 1,
          "to": 6
        }
      ]
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 77,
      "url": "https://shamela.ws/book/1956/75",
      "report": 207
    },
    "collections": [
      "سنن أبي داود",
      "الترمذي",
      "النسائي"
    ],
    "grades": [
      {
        "rank": "hasan-sahih",
        "scholar": "الترمذي",
        "quote": "قال الترمذي: حديث حسن صحيح.",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 77,
          "url": "https://shamela.ws/book/1956/75",
          "report": 207
        },
        "reportedBy": "النووي"
      }
    ],
    "occasionQuote": "حِينَ تُمْسِي وَحِينَ تُصْبِحُ",
    "repeat": {
      "count": 3,
      "quote": "ثَلاثَ مَرَّاتٍ",
      "scope": "whole-selection"
    },
    "virtueQuote": "تَكْفِيكَ مِنْ كُلّ شئ"
  },
  {
    "id": "morning-by-you",
    "occasions": [
      "morning"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ بِكَ أصْبَحْنا وَبِكَ أمْسَيْنا، وَبِكَ نَحْيا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 77,
      "url": "https://shamela.ws/book/1956/75",
      "report": 208
    },
    "collections": [
      "سنن أبي داود",
      "الترمذي",
      "ابن ماجه"
    ],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "الترمذي",
        "quote": "قال الترمذي: حديث حسن.",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 77,
          "url": "https://shamela.ws/book/1956/75",
          "report": 208
        },
        "reportedBy": "النووي"
      }
    ],
    "occasionQuote": "إذا أصبح"
  },
  {
    "id": "evening-by-you",
    "occasions": [
      "evening"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ بِكَ أمْسَيْنا، وَبِكَ نَحْيا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 77,
      "url": "https://shamela.ws/book/1956/75",
      "report": 208
    },
    "collections": [
      "سنن أبي داود",
      "الترمذي",
      "ابن ماجه"
    ],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "الترمذي",
        "quote": "قال الترمذي: حديث حسن.",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 77,
          "url": "https://shamela.ws/book/1956/75",
          "report": 208
        },
        "reportedBy": "النووي"
      }
    ],
    "occasionQuote": "وإذا أمسى"
  },
  {
    "id": "morning-evening-sleep-creator",
    "occasions": [
      "morning",
      "evening",
      "sleep"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ فَاطِرَ السَّمَوَاتِ والأرض، عالم الغيب وَالشَّهَادَةِ رَبَّ كُلِّ شئ ومليكه، أشْهَدُ أنْ لا إِلهَ إِلاَّ أنْتَ، أعوذ بك من شر نفسي وَشَرِّ الشَّيْطانِ وَشِرْكِهِ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 78,
      "url": "https://shamela.ws/book/1956/76",
      "report": 212
    },
    "collections": [
      "سنن أبي داود",
      "الترمذي"
    ],
    "grades": [
      {
        "rank": "hasan-sahih",
        "scholar": "الترمذي",
        "quote": "قال الترمذي: حديث حسن صحيح.",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 78,
          "url": "https://shamela.ws/book/1956/76",
          "report": 212
        },
        "reportedBy": "النووي"
      }
    ],
    "occasionQuote": "قُلْها إذَا أصْبَحْتَ وَإذَا أمْسَيْتَ وَإذَا أخَذْتَ مَضْجَعَكَ"
  },
  {
    "id": "morning-evening-name",
    "occasions": [
      "morning",
      "evening"
    ],
    "content": {
      "kind": "text",
      "text": "بِسْمِ اللَّهِ الَّذي لاَ يَضُرُّ مَعَ اسْمِهِ شئ فِي الأرْضِ وَلا في السَّماءِ وَهُوَ السَّمِيعُ العَلِيم"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 78,
      "url": "https://shamela.ws/book/1956/76",
      "report": 213
    },
    "collections": [
      "سنن أبي داود",
      "الترمذي"
    ],
    "grades": [
      {
        "rank": "hasan-sahih",
        "scholar": "الترمذي",
        "quote": "قال الترمذي: هذا حديث حسن صحيح",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 78,
          "url": "https://shamela.ws/book/1956/76",
          "report": 213
        },
        "reportedBy": "النووي"
      }
    ],
    "occasionQuote": "في صَباحِ كُلّ يَوْمٍ وَمَساءِ كل ليلة",
    "repeat": {
      "count": 3,
      "quote": "ثَلاثَ مَرَّاتٍ",
      "scope": "whole-selection"
    },
    "virtueQuote": "لَمْ يَضُرَّه شئ"
  },
  {
    "id": "morning-evening-wellbeing",
    "occasions": [
      "morning",
      "evening"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ إني أسألُكَ العافِيَةَ فِي الدُّنْيَا والآخِرَةِ، اللَّهُمَّ إني أسألُكَ العَفْوَ وَالعَافِيَةَ في دِيني وَدُنْيَايَ وأهْلِي ومَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وآمِنْ رَوْعاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْن يَدَيَّ ومِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمالِي، وَمِنْ فَوْقِي، وأعُوذُ بِعَظَمَتِكَ أنْ أُغْتالَ مِنْ تَحْتِي"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 80,
      "url": "https://shamela.ws/book/1956/78",
      "report": 217
    },
    "collections": [
      "سنن أبي داود",
      "النسائي",
      "ابن ماجه"
    ],
    "grades": [
      {
        "rank": "isnad-sahih",
        "scholar": "الحاكم أبو عبد الله",
        "quote": "قال الحاكم أبو عبد الله: هذا حديث صحيح الإِسناد",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 80,
          "url": "https://shamela.ws/book/1956/78",
          "report": 217
        },
        "reportedBy": "النووي"
      },
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث حسن غريب لا نعرفه إلا من حديث عبادة بهذا السند.",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 382,
          "url": "https://shamela.ws/book/30108/976"
        }
      }
    ],
    "occasionQuote": "حين يُمسي وحين يُصبح"
  },
  {
    "id": "sleep-life",
    "occasions": [
      "sleep"
    ],
    "content": {
      "kind": "text",
      "text": "باسْمِكَ اللَّهُمَّ أحْيا وأمُوت"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 89,
      "url": "https://shamela.ws/book/1956/87",
      "report": 251
    },
    "collections": [
      "صحيح البخاري",
      "صحيح مسلم"
    ],
    "grades": [
      {
        "rank": "sahih",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث صحيح",
        "citation": {
          "source": "nataij-afkar",
          "volume": 1,
          "page": 109,
          "url": "https://shamela.ws/book/30108/117"
        }
      }
    ],
    "occasionQuote": "إذا أوى إلى فراشه"
  },
  {
    "id": "sleep-side",
    "occasions": [
      "sleep"
    ],
    "content": {
      "kind": "text",
      "text": "باسْمِكَ رَبي وَضَعْتُ جَنْبِي وَبِكَ أرفعه، إن أمسكت نَفْسِي فارْحَمْها، وَإِنْ أرْسَلْتَها فاحْفَظْها بما تَحْفَظُ بِهِ عِبادَكَ الصَّالِحينَ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 89,
      "url": "https://shamela.ws/book/1956/87",
      "report": 253
    },
    "collections": [
      "صحيحي البخاري ومسلم"
    ],
    "grades": [
      {
        "rank": "sahih",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث صحيح",
        "citation": {
          "source": "nataij-afkar",
          "volume": 3,
          "page": 35,
          "url": "https://shamela.ws/book/30108/1082"
        }
      }
    ],
    "occasionQuote": "إذَا أوَى أحَدُكُمْ إلى فِرَاشِهِ",
    "instructionQuote": "فَلْيَنْفُضْ فِرَاشَهُ بِدَاخلَةِ إِزَارِهِ"
  },
  {
    "id": "sleep-surrender",
    "occasions": [
      "sleep"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ أسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أمْرِي إِلَيْكَ، وَألجأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةَ وَرَهْبَةً إِلَيْكَ لا ملجأ وَلا منجا مِنْكَ إِلاَّ إِليْكَ، آمَنْتُ بِكِتابِكَ الَّذي أنْزَلْتَ، وَنَبِيِّكَ الَّذي أَرْسَلْتَ."
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 90,
      "url": "https://shamela.ws/book/1956/88",
      "report": 257
    },
    "collections": [
      "الصحيحين"
    ],
    "grades": [
      {
        "rank": "sahih",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث صحيح",
        "citation": {
          "source": "nataij-afkar",
          "volume": 3,
          "page": 45,
          "url": "https://shamela.ws/book/30108/1092"
        }
      }
    ],
    "occasionQuote": "إذَا أتَيْتَ مَضْجَعَكَ",
    "instructionQuote": "واجْعَلْهُنَّ آخِرَ ما تَقُولُ",
    "virtueQuote": "فإنْ مِتَّ مِتَّ على الفِطْرَةِ"
  },
  {
    "id": "sleep-fed",
    "occasions": [
      "sleep"
    ],
    "content": {
      "kind": "text",
      "text": "الحَمْدُ لِلَّهِ الَّذي أطْعَمَنا وَسَقَانا وكَفانا وآوَانا، فَكَمْ مِمَّنْ لا كافِيَ لَهُ، وَلا مُؤْوِيَ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 91,
      "url": "https://shamela.ws/book/1956/89",
      "report": 262
    },
    "collections": [
      "صحيح مسلم",
      "سنن أبي داود",
      "الترمذي"
    ],
    "grades": [
      {
        "rank": "hasan-sahih",
        "scholar": "الترمذي",
        "quote": "قال الترمذي: حديث حسن صحيح.",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 91,
          "url": "https://shamela.ws/book/1956/89",
          "report": 262
        },
        "reportedBy": "النووي"
      }
    ],
    "occasionQuote": "إذا أوى إلى فراشه"
  }
];

export function adhkarFor(occasion: AdhkarOccasion): readonly Dhikr[] {
  return ADHKAR.filter(item => item.occasions.includes(occasion));
}

export function dhikrById(id: string): Dhikr | undefined {
  return ADHKAR.find(item => item.id === id);
}
