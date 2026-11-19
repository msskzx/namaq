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
  /**
   * `isnad-sahih` is a judgment on the chain alone («بإسناد صحيح», «صحيح الإسناد»), not on the hadith.
   * `in-sahih` is the compiler's own judgment by placing it in his Sahih («صحيح البخاري», «صحيح مسلم», «الصحيحين»), as
   * al-Nawawi names the book; used only where Ibn Hajar's Nata'ij has no sentence of its own on that route.
   */
  rank: 'sahih' | 'hasan' | 'hasan-sahih' | 'isnad-sahih' | 'in-sahih';
  scholar: string;
  quote: string;
  citation: AdhkarCitation;
  reportedBy?: string;
};

export type Dhikr = {
  id: string;
  occasions: readonly AdhkarOccasion[];
  /**
   * `parts`: where the book breaks the words (a narrator's remark, a line end), the pieces as printed, in order;
   * `text` is them joined by spaces, after any `fixes`.
   */
  content: { kind: 'text'; text: string; parts?: readonly string[] } | {
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
  /** A remark in the report shown with the reference (a narrator's doubt, the Prophet ﷺ as the source of a companion's words). */
  noteQuote?: string;
  /**
   * Printing slips corrected in the shown text, each from a named source (owner, 2026-11-19: every fix comes from a
   * source): `printed` is in the book, `reads` is what is shown, `quote` at `citation` gives the right reading.
   */
  fixes?: readonly { printed: string; reads: string; quote: string; citation: AdhkarCitation }[];
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
    "id": "morning-evening-master-forgiveness",
    "occasions": [
      "morning",
      "evening"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ أنْتَ رَبِّي لا إِلهَ إِلاَّ أنْتَ، خَلَقْتَنِي وأنا عَبْدُكَ وأنا على عَهْدِكَ وَوَعْدِكَ ما اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرّ مَا صَنَعْتُ، أبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأبُوءُ بِذَنبي فاغْفِرْ لي فإنَّه لا يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 76,
      "url": "https://shamela.ws/book/1956/74",
      "report": 205
    },
    "collections": [
      "صحيح البخاري"
    ],
    "grades": [
      {
        "rank": "in-sahih",
        "scholar": "البخاري",
        "quote": "صحيح البخاري",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 76,
          "url": "https://shamela.ws/book/1956/74",
          "report": 205
        },
        "reportedBy": "النووي"
      }
    ],
    "occasionQuote": "إذا قال ذلك حين يُمسي فمات من ليلته دخل الجنة، أو كانَ من أهل الجنة، وإذا قال ذلك حين يُصبح فَمَاتَ مِنْ يَوْمِهِ ... مثله",
    "virtueQuote": "دخل الجنة، أو كانَ من أهل الجنة",
    "noteQuote": "سَيِّدُ الاسْتِغْفَارِ"
  },
  {
    "id": "morning-evening-hundred-praise",
    "occasions": [
      "morning",
      "evening"
    ],
    "content": {
      "kind": "text",
      "text": "سُبْحانَ اللَّهِ وبحمده"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 76,
      "url": "https://shamela.ws/book/1956/74",
      "report": 206
    },
    "collections": [
      "صحيح مسلم"
    ],
    "grades": [
      {
        "rank": "sahih",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث صحيح، أخرجه مسلم والترمذي",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 343,
          "url": "https://shamela.ws/book/30108/931"
        }
      }
    ],
    "occasionQuote": "مَنْ قالَ حِينَ يُصْبحُ وَحِينَ يُمْسِي",
    "repeat": {
      "count": 100,
      "quote": "مائة مَرَّةٍ",
      "scope": "whole-selection"
    },
    "virtueQuote": "لَمْ يأْتِ أحَدٌ يَوْمَ القِيامَةِ بأفْضَلَ مِمَّا جاءَ بِهِ إِلاَّ أحَدٌ قالَ مثْلَ ما قالَ أوْ زَادَ عليه"
  },
  {
    "id": "evening-kingdom",
    "occasions": [
      "evening"
    ],
    "content": {
      "kind": "text",
      "text": "أمْسَيْنا وأمْسَى المُلْكُ لِلَّهِ، والحَمْدُ لِلَّهِ، لا إِلهَ إِلاَّ الله وحده لا شريك له لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ على كُلّ شئ قَديرٌ، رَبّ أسألُكَ خَيْرَ ما فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَها وأعُوذ بِكَ مِنْ شَرّ ما في هَذِهِ اللَّيْلَةِ وَشَرّ مَا بَعْدَهَا، رَبّ أَعُوذُ بِكَ مِنَ الكَسَل وَسُوءِ الكِبَرِ، أعُوذُ بِكَ مِنْ عَذَابٍ في النَّارِ وَعَذَابٍ في القَبْرِ",
      "parts": [
        "أمْسَيْنا وأمْسَى المُلْكُ لِلَّهِ، والحَمْدُ لِلَّهِ، لا إِلهَ إِلاَّ الله وحده لا شريك له",
        "لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ على كُلّ شئ قَديرٌ، رَبّ أسألُكَ خَيْرَ ما فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَها وأعُوذ بِكَ مِنْ شَرّ ما في هَذِهِ",
        "اللَّيْلَةِ وَشَرّ مَا بَعْدَهَا، رَبّ أَعُوذُ بِكَ مِنَ الكَسَل وَسُوءِ الكِبَرِ، أعُوذُ بِكَ مِنْ عَذَابٍ في النَّارِ وَعَذَابٍ في القَبْرِ"
      ]
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 77,
      "url": "https://shamela.ws/book/1956/75",
      "report": 210
    },
    "collections": [
      "صحيح مسلم"
    ],
    "grades": [
      {
        "rank": "sahih",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث صحيح، أخرجه مسلم والنسائي",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 355,
          "url": "https://shamela.ws/book/30108/944"
        }
      }
    ],
    "occasionQuote": "كان النبي ﷺ إذا أمسى قال",
    "noteQuote": "قال الراوي: أراه قال"
  },
  {
    "id": "evening-perfect-words",
    "occasions": [
      "evening"
    ],
    "content": {
      "kind": "text",
      "text": "أعُوذُ بكلمات الله التامات من شر ما خَلَقَ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 78,
      "url": "https://shamela.ws/book/1956/76",
      "report": 211
    },
    "collections": [
      "صحيح مسلم"
    ],
    "grades": [
      {
        "rank": "sahih",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث صحيح، أخرجه مسلم عن أبي الطاهر",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 356,
          "url": "https://shamela.ws/book/30108/945"
        }
      }
    ],
    "occasionQuote": "لَوْ قُلْتَ حِينَ أمْسَيْتَ",
    "virtueQuote": "لَمْ تَضُرَّكَ"
  },
  {
    "id": "evening-pleased",
    "occasions": [
      "evening"
    ],
    "content": {
      "kind": "text",
      "text": "رَضِيتُ بالله رَبًّا، وبالإسلام دينا، وبمحمد ﷺ نَبِيًّا"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 79,
      "url": "https://shamela.ws/book/1956/77",
      "report": 214
    },
    "collections": [
      "كتاب الترمذي"
    ],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث حسن، أخرجه الترمذي",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 371,
          "url": "https://shamela.ws/book/30108/963"
        }
      }
    ],
    "occasionQuote": "مَنْ قالَ حِينَ يُمْسِي",
    "virtueQuote": "كانَ حَقًّا على الله تعالى أنْ يُرْضِيَهُ",
    "fixes": [
      {
        "printed": "رَبًَّا",
        "reads": "رَبًّا",
        "quote": "رَضِيتُ بالله رَبًّا",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 18,
          "url": "https://shamela.ws/book/1956/16",
          "report": 29
        }
      },
      {
        "printed": "نَبِيًَّا",
        "reads": "نَبِيًّا",
        "quote": "نبيًّا",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 79,
          "url": "https://shamela.ws/book/1956/77",
          "report": 214
        }
      }
    ]
  },
  {
    "id": "morning-bear-witness",
    "occasions": [
      "morning"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ إِنِّي أصْبَحْتُ أُشْهِدُكَ وأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلائِكَتَكَ وَجَمِيعَ خَلْقِكَ أنَّكَ أنتَ الله الذي لا إِلهَ إِلاَّ أنْتَ، وأنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 79,
      "url": "https://shamela.ws/book/1956/77",
      "report": 215
    },
    "collections": [
      "سنن أبي داود"
    ],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث حسن غريب، أخرجه أبو داود",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 375,
          "url": "https://shamela.ws/book/30108/968"
        }
      }
    ],
    "occasionQuote": "مَن قالَ حينَ يُصْبحُ أوْ يُمْسِي",
    "repeat": {
      "count": 4,
      "quote": "فإنْ قالَهَا أَرْبَعًا",
      "scope": "whole-selection"
    },
    "virtueQuote": "أعْتَقَ اللَّهُ رُبُعَهُ مِنَ النَّارِ، فَمَنْ قَالَهَا مَرَّتَيْنِ أعْتَقَ اللَّهُ نصْفَهُ مِنَ النَّار، وَمَنْ قَالَها ثَلاثًا أَعْتَقَ الله ثَلاثَةَ أرْبَاعِهِ، فإنْ قالَهَا أَرْبَعًا أعْتَقَه اللَّهُ تَعالى مِنَ النَّارِ"
  },
  {
    "id": "morning-thanks",
    "occasions": [
      "morning"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ ما أصْبَحَ بِي مِنْ نِعْمَةٍ فَمِنْكَ وَحْدَكَ لا شَرِيكَ لَكَ، لَكَ الحَمْدُ وَلَكَ الشُّكْرُ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 79,
      "url": "https://shamela.ws/book/1956/77",
      "report": 216
    },
    "collections": [
      "سنن أبي داود"
    ],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث حسن، أخرجه النسائي في الكبرى",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 380,
          "url": "https://shamela.ws/book/30108/974"
        }
      }
    ],
    "occasionQuote": "مَنْ قالَ حِينَ يُصْبحُ",
    "virtueQuote": "فَقَدْ أدَّى شُكْرَ يَوْمِهِ"
  },
  {
    "id": "morning-evening-oneness",
    "occasions": [
      "morning",
      "evening"
    ],
    "content": {
      "kind": "text",
      "text": "لا إلهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَريكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ على كُلّ شئ قَدِيرٌ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 80,
      "url": "https://shamela.ws/book/1956/78",
      "report": 219
    },
    "collections": [
      "سنن أبي داود",
      "ابن ماجه"
    ],
    "grades": [
      {
        "rank": "sahih",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث صحيح، أخرجه أحمد",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 386,
          "url": "https://shamela.ws/book/30108/981"
        }
      }
    ],
    "occasionQuote": "مَنْ قالَ إِذَا أصْبَحَ",
    "instructionQuote": "وَإنْ قَالَهَا إِذَا أمْسَى كانَ له مِثْلُ ذلكَ حتى يصبح",
    "virtueQuote": "كانَ لَهُ عِدْلُ رَقَبَةٍ مِنْ وَلَدِ إسْمَاعِيلَ ﷺ، وكُتِبَ لَهُ عَشْرُ حَسَنَاتٍ، وَحُطَّ عَنْهُ عَشْرُ سَيِّئاتٍ، وَرُفِعَ لَهُ عَشْرُ دَرَجاتٍ، وكانَ فِي حِرْزٍ مِنَ الشَّيْطانِ حتى يُمْسِيَ"
  },
  {
    "id": "morning-evening-wellness",
    "occasions": [
      "morning",
      "evening"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ عافِني فِي بَدَني، اللَّهُمَّ عافِنِي في سَمْعِي، اللَّهُمَّ عافِني في بَصَري، اللَّهُمَّ إني أعُوذُ بِكَ مِنَ الكُفْرِ وَالفَقْرِ، اللَّهُمَّ إني أعُوذُ بِكَ مِنْ عَذَابِ القَبرِ، لا إِلهَ إِلاَّ أنْتَ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 81,
      "url": "https://shamela.ws/book/1956/79",
      "report": 221
    },
    "collections": [
      "سنن أبي داود"
    ],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث حسن، أخرجه أبو داود والنسائي",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 390,
          "url": "https://shamela.ws/book/30108/986"
        }
      }
    ],
    "occasionQuote": "إني أسمعك تدعو كلّ غداة",
    "instructionQuote": "تعيدها حين تصبح ثلاثًا، وثلاثًا حين تُمسي",
    "noteQuote": "إني سمعتُ رسولَ الله ﷺ يدعو بهنّ",
    "fixes": [
      {
        "printed": "أعُوذَ بِكَ مِنْ عَذَابِ",
        "reads": "أعُوذُ بِكَ مِنْ عَذَابِ",
        "quote": "اللَّهُمَّ إني أعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 68,
          "url": "https://shamela.ws/book/1956/66",
          "report": 174
        }
      }
    ]
  },
  {
    "id": "morning-fitra",
    "occasions": [
      "morning"
    ],
    "content": {
      "kind": "text",
      "text": "أصْبَحْنَا على فِطْرَةِ الإِسْلامِ، وكَلِمَةِ الإِخْلاصِ، وَدِيْنِ نبِيِّنا مُحَمَّدٍ ﷺ، وَمِلَّةِ إِبْرَاهِيمَ ﷺ حَنِيفًا مُسْلِمًا ومَا أنا مِنَ المُشْرِكِينَ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 82,
      "url": "https://shamela.ws/book/1956/80",
      "report": 225
    },
    "collections": [
      "كتاب ابن السني"
    ],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث حسن، أخرجه ابن السني",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 401,
          "url": "https://shamela.ws/book/30108/998"
        }
      }
    ],
    "occasionQuote": "كان رسول الله ﷺ إذا أصبح قال",
    "fixes": [
      {
        "printed": "نبِيِّا",
        "reads": "نبِيِّنا",
        "quote": "ودين نبيّنا محمد",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 82,
          "url": "https://shamela.ws/book/1956/80",
          "report": 225
        }
      }
    ]
  },
  {
    "id": "morning-evening-living",
    "occasions": [
      "morning",
      "evening"
    ],
    "content": {
      "kind": "text",
      "text": "يا حَيُّ يَا قَيُّومُ بِكَ أسْتَغِيثُ فأصْلِحْ لي شأنِي كُلَّهُ وَلاَ تَكِلْني إلى نَفْسِي طَرْفَةَ عَيْنِ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 83,
      "url": "https://shamela.ws/book/1956/81",
      "report": 230
    },
    "collections": [],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث حسن غريب، أخرجه النسائي",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 407,
          "url": "https://shamela.ws/book/30108/1005"
        }
      }
    ],
    "occasionQuote": "تَقُولِينَ إذَا أصْبَحْتِ وَإذَا أمْسَيْتِ"
  },
  {
    "id": "morning-knowledge",
    "occasions": [
      "morning"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ إني أسألُكَ عِلْمًا نافعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 83,
      "url": "https://shamela.ws/book/1956/81",
      "report": 232
    },
    "collections": [
      "سنن ابن ماجه",
      "كتاب ابن السني"
    ],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث حسن، أخرجه ابن السني عن أبي يعلى",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 411,
          "url": "https://shamela.ws/book/30108/1010"
        }
      }
    ],
    "occasionQuote": "كان إذا أصبح قال"
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
  },
  {
    "id": "sleep-three-surahs",
    "occasions": [
      "sleep"
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
      "page": 90,
      "url": "https://shamela.ws/book/1956/88",
      "report": 255
    },
    "collections": [
      "الصحيحين"
    ],
    "grades": [
      {
        "rank": "in-sahih",
        "scholar": "البخاري ومسلم",
        "quote": "الصحيحين",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 90,
          "url": "https://shamela.ws/book/1956/88",
          "report": 255
        },
        "reportedBy": "النووي"
      }
    ],
    "occasionQuote": "ثم نفث فيهما وقرأ فيهما",
    "repeat": {
      "count": 3,
      "quote": "يفعل ذلك ثلاثَ مرّاتٍ",
      "scope": "whole-selection"
    },
    "instructionQuote": "ثُم مسح بهما ما استطاع من جسده، يبدأ بهما على رأسه ووجهه، وما أقبل من جسده"
  },
  {
    "id": "sleep-baqarah-end",
    "occasions": [
      "sleep"
    ],
    "content": {
      "kind": "quran",
      "ranges": [
        {
          "surah": 2,
          "from": 285,
          "to": 286
        }
      ]
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 90,
      "url": "https://shamela.ws/book/1956/88",
      "report": 256
    },
    "collections": [
      "الصحيحين"
    ],
    "grades": [
      {
        "rank": "in-sahih",
        "scholar": "البخاري ومسلم",
        "quote": "الصحيحين",
        "citation": {
          "source": "adhkar-nawawi",
          "volume": 1,
          "page": 90,
          "url": "https://shamela.ws/book/1956/88",
          "report": 256
        },
        "reportedBy": "النووي"
      }
    ],
    "occasionQuote": "مَنْ قَرأ بِهِما في لَيْلَةٍ",
    "virtueQuote": "كَفَتاهُ"
  },
  {
    "id": "sleep-kursi",
    "occasions": [
      "sleep"
    ],
    "content": {
      "kind": "quran",
      "ranges": [
        {
          "surah": 2,
          "from": 255,
          "to": 255
        }
      ]
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 90,
      "url": "https://shamela.ws/book/1956/88",
      "report": 258
    },
    "collections": [
      "صحيح البخاري"
    ],
    "grades": [
      {
        "rank": "sahih",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث صحيح، أخرجه البخاري",
        "citation": {
          "source": "nataij-afkar",
          "volume": 3,
          "page": 47,
          "url": "https://shamela.ws/book/30108/1094"
        }
      }
    ],
    "occasionQuote": "إذا أويتَ إلى فراشِكَ فاقرأ آيةَ الكرسي",
    "virtueQuote": "فإنه لن يزالَ معكَ من الله تعالى حافظ، ولا يقربَك شيطانٌ حتى تُصْبِحَ"
  },
  {
    "id": "sleep-punishment",
    "occasions": [
      "sleep"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ قِني عَذَابَكَ يَوْمَ تَبْعَثُ عِبادَكَ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 91,
      "url": "https://shamela.ws/book/1956/89",
      "report": 259
    },
    "collections": [
      "سنن أبي داود"
    ],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث حسن أخرجه أحمد عن عبد الصمد",
        "citation": {
          "source": "nataij-afkar",
          "volume": 3,
          "page": 49,
          "url": "https://shamela.ws/book/30108/1096"
        }
      }
    ],
    "occasionQuote": "كان إذا أرادَ أن يرقدَ",
    "repeat": {
      "count": 3,
      "quote": "ثَلاثَ مَرَّاتٍ",
      "scope": "whole-selection"
    },
    "instructionQuote": "وضعَ يدَه اليمنى تحتَ خدّه"
  },
  {
    "id": "sleep-lord-of-heavens",
    "occasions": [
      "sleep"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ رَبَّ السَّمَوَاتِ وَرَبَّ الأرْضِ وَرَبَّ العَرْشِ العَظِيمِ، رَبَّنا ورب كل شئ، فالِقَ الحَبّ وَالنَّوَى، مُنَزِّل التَّوْرَاةِ وَالإِنجِيلِ وَالقُرآنِ، أعُوذُ بِكَ مِنْ شَرّ كُلّ ذِي شَرٍّ أنْتَ آخِذٌ بِنَاصِيَتِهِ، أنْتَ الأوَّلُ فَلَيْسَ قَبْلَكَ شئ، وأنْتَ الآخِرُ فَلَيْسَ بعدك شئ، وأَنْتَ الظَّاهِرُ فَلَيْسَ فوقك شئ، وأنْتَ الباطِنُ فَلَيْسَ دونك شئ، اقْضِ عَنَّا الدَّيْنَ، وأغْنِنا مِنَ الفَقْرِ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 91,
      "url": "https://shamela.ws/book/1956/89",
      "report": 260
    },
    "collections": [
      "صحيح مسلم"
    ],
    "grades": [
      {
        "rank": "sahih",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث صحيح، أخرجه مسلم عن زهير بن حرب",
        "citation": {
          "source": "nataij-afkar",
          "volume": 3,
          "page": 56,
          "url": "https://shamela.ws/book/30108/1104"
        }
      }
    ],
    "occasionQuote": "كان يقولُ إذا أوى إلى فراشه"
  },
  {
    "id": "sleep-noble-face",
    "occasions": [
      "sleep"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ إني أعُوذُ بِوَجْهِكَ الكَرِيمِ وَكَلِماتِكَ التَّامَّة مِنْ شر ما أنت آخذ بناصيته، اللَّهُمّ أنْتَ تَكْشِفُ المَغْرَمَ والمَأثمَ، اللَّهُمَّ لا يُهْزَمُ جُنْدُكَ، وَلا يُخْلَفُ وَعْدُكَ، ولا ينفع ذا الجد مِنْكَ الجَدُّ، سُبْحانَكَ اللَّهُمَّ وَبِحَمْدِكَ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 91,
      "url": "https://shamela.ws/book/1956/89",
      "report": 261
    },
    "collections": [
      "سنن أبي داود",
      "النسائي"
    ],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث حسن، أخرجه أبو داود عن عباس بن عبد العظيم العنبري",
        "citation": {
          "source": "nataij-afkar",
          "volume": 2,
          "page": 385,
          "url": "https://shamela.ws/book/30108/980"
        }
      }
    ],
    "occasionQuote": "كان يقول عند مضجعه"
  },
  {
    "id": "sleep-cast-out",
    "occasions": [
      "sleep"
    ],
    "content": {
      "kind": "text",
      "text": "بِسْمِ الله وَضَعْتُ جَنْبِي، اللَّهُمَّ اغْفِرْ لي ذَنْبِي، وأخسئ شَيْطانِي، وَفُكَّ رِهانِي، وَاجْعَلْنِي فِي النَّدِيّ الأعْلَى"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 91,
      "url": "https://shamela.ws/book/1956/89",
      "report": 263
    },
    "collections": [
      "سنن أبي داود"
    ],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث حسن، أخرجه أبو داود عن جعفر بن مسافر",
        "citation": {
          "source": "nataij-afkar",
          "volume": 3,
          "page": 60,
          "url": "https://shamela.ws/book/30108/1109"
        }
      }
    ],
    "occasionQuote": "كان إذا أخذ مضجعه من الليل قالَ"
  },
  {
    "id": "sleep-kafirun",
    "occasions": [
      "sleep"
    ],
    "content": {
      "kind": "quran",
      "ranges": [
        {
          "surah": 109,
          "from": 1,
          "to": 6
        }
      ]
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 92,
      "url": "https://shamela.ws/book/1956/90",
      "report": 264
    },
    "collections": [
      "سنن أبي داود",
      "الترمذي"
    ],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث حسن، أخرجه أبو داود عن عبد الله بن محمد النفيلي",
        "citation": {
          "source": "nataij-afkar",
          "volume": 3,
          "page": 61,
          "url": "https://shamela.ws/book/30108/1110"
        }
      }
    ],
    "occasionQuote": "اقْرأ (قُلْ يا أيُّها الكافِرُونَ) ثُمَّ نَمْ على خاتِمَتِها",
    "virtueQuote": "فإنَّها بَرَاءَةٌ مِنَ الشِّرْكِ"
  },
  {
    "id": "sleep-gave-plenty",
    "occasions": [
      "sleep"
    ],
    "content": {
      "kind": "text",
      "text": "الحَمْدُ لِلَّهِ الَّذي كفاني وآوَانِي وأطْعَمَنِي وَسَقَانِي، وَالَّذِي مَنَّ عَليَّ فأفْضَلَ، وَالَّذي أعطانِي فأجْزَل، الحَمْدُ لِلَّهِ على كُلّ حالٍ ; اللَّهُمَّ رَبَّ كل شئ وَمَلِيكَهُ، وَإِلهَ كُلِّ شئ، أعُوذُ بِكَ مِنَ النَّارِ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 92,
      "url": "https://shamela.ws/book/1956/90",
      "report": 268
    },
    "collections": [
      "سنن أبي داود"
    ],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث حسن، أخرجه أبو داود والنسائي",
        "citation": {
          "source": "nataij-afkar",
          "volume": 3,
          "page": 67,
          "url": "https://shamela.ws/book/30108/1117"
        }
      }
    ],
    "occasionQuote": "كان يقول إذا أخذ مضجعه"
  },
  {
    "id": "sleep-created-my-soul",
    "occasions": [
      "sleep"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ أنْتَ خَلَقْتَ نَفْسِي وأنْتَ تَتَوَفَّاها، لَكَ مَمَاتُها وَمَحْياها، إنْ أحْيَيْتَها فاحْفَظْها، وَإنْ أمَتَّها فاغْفِرْ لَهَا، اللَّهُمَّ إنِّي أسألُكَ العافِيَةَ"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 93,
      "url": "https://shamela.ws/book/1956/91",
      "report": 273
    },
    "collections": [
      "صحيح مسلم"
    ],
    "grades": [
      {
        "rank": "sahih",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث صحيح، أخرجه مسلم عن عقبة بن مكرم",
        "citation": {
          "source": "nataij-afkar",
          "volume": 3,
          "page": 71,
          "url": "https://shamela.ws/book/30108/1121"
        }
      }
    ],
    "occasionQuote": "أمر رجلًا إذا أخذ مضجعة",
    "noteQuote": "قال ابن عمر: سمعتها من رسول الله ﷺ"
  },
  {
    "id": "sleep-in-your-name-forgive",
    "occasions": [
      "sleep"
    ],
    "content": {
      "kind": "text",
      "text": "اللَّهُمَّ باسْمِكَ رَبي وَضَعْتُ جَنْبِي فاغْفِرْ لي ذَنْبِي"
    },
    "citation": {
      "source": "adhkar-nawawi",
      "volume": 1,
      "page": 94,
      "url": "https://shamela.ws/book/1956/92",
      "report": 277
    },
    "collections": [],
    "grades": [
      {
        "rank": "hasan",
        "scholar": "ابن حجر العسقلاني",
        "quote": "هذا حديث حسن، ورجاله من شيخ الطبراني",
        "citation": {
          "source": "nataij-afkar",
          "volume": 3,
          "page": 80,
          "url": "https://shamela.ws/book/30108/1131"
        }
      }
    ],
    "occasionQuote": "كان يقول إذا اضطجع للنوم"
  }
];

export function adhkarFor(occasion: AdhkarOccasion): readonly Dhikr[] {
  return ADHKAR.filter(item => item.occasions.includes(occasion));
}

export function dhikrById(id: string): Dhikr | undefined {
  return ADHKAR.find(item => item.id === id);
}
