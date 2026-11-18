"use client";

import { Bookmark } from "lucide-react";
import Button from "@/components/common/Button";
import { useLanguage } from "@/components/language/LanguageContext";
import NamaqDefinition from "@/components/homepage/NamaqDefinition";
import styles from "@/components/common/PaperPage.module.css";
import { ABOUT_INTRO, ABOUT_REFERENCES } from "@shared/infoPages";

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className={`${styles.page} mx-auto w-full max-w-4xl px-4 py-8 sm:px-6`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className={styles.heading}>
        <h1>
          {language === 'ar' ? 'عن نمَق' : 'About Namaq'}
        </h1>
        <p className="mt-3 text-lg">{ABOUT_INTRO[language]}</p>
      </header>

      <section className="space-y-4" aria-labelledby="about-references">
        <h2 id="about-references" className="text-2xl">
          {language === 'ar' ? 'المراجع' : 'References'}
        </h2>
        <div className="space-y-3 leading-loose">
          {ABOUT_REFERENCES.map(text => <p key={text.en}>{text[language]}</p>)}
        </div>
        <Button href="/attributions">
          <Bookmark size={16} aria-hidden />
          {language === 'ar' ? 'العزو' : 'Attributions'}
        </Button>
      </section>
      <NamaqDefinition />
    </div>
  );
}
