import translations from '@/components/language/translations';
import type { RelationType } from '@/lib/relationship/types';

export function relationPrompt(subject: string, relation: string, language: 'en' | 'ar'): string {
  const labels = translations[language].relationTypes;
  const label = Object.hasOwn(labels, relation) ? labels[relation as RelationType] : undefined;
  if (!label) return language === 'ar' ? `بمَن ارتبط ${subject}؟` : `Who was connected to ${subject}?`;
  if (relation === 'CALLED_TO_ISLAM') {
    return language === 'ar' ? `مَن دعا ${subject} إلى الإسلام؟` : `Whom did ${subject} call to Islam?`;
  }
  if (relation === 'ANSWERED_CALL_OF') {
    return language === 'ar' ? `بدعوة مَن أسلم ${subject}؟` : `Whose call to Islam did ${subject} answer?`;
  }
  if (relation === 'ACCOMPANIED_BY') {
    return language === 'ar' ? `مَن رافق ${subject}؟` : `Who accompanied ${subject}?`;
  }
  const role = relation === 'MILK_BROTHER' ? 'أخ من الرضاعة'
    : relation === 'MILK_SISTER' ? 'أخت من الرضاعة' : label;
  return language === 'ar'
    ? `${subject} ${role} مَن؟`
    : `${subject} was the ${label.toLowerCase()} of whom?`;
}
