"use client";

import { useLanguage } from "../language/LanguageContext";
import translations from "../language/translations";
import NamaqSlider from "./NamaqSlider";

export default function NamaqDef() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 my-12 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="grid grid-cols-3 lg:grid-cols-3 gap-8">

        <div className="col-span-1">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg border-l-4 border-rose-800 p-6 h-full flex flex-col">
            <h4 className="font-arabicDisplay text-amber-400 text-xl md:text-2xl font-bold mb-3 text-center" dir="rtl">
              {t.verbNammaq.verb}
            </h4>
            <p className="font-arabic text-gray-900 dark:text-gray-200 text-base md:text-lg leading-relaxed text-center mb-4 flex-grow" dir="rtl">
              {t.verbNammaq.definition}
            </p>
            <div className="space-y-2 mt-2">
              {t.verbNammaq.forms.map((form, index) => (
                <p key={index} className="font-arabic text-gray-700 dark:text-gray-200 text-sm md:text-base text-center" dir="rtl">
                  {form}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <NamaqSlider />
        </div>

        <div className="col-span-1">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg border-l-4 border-rose-800 p-6 h-full flex flex-col">
            <h4 className="font-arabicDisplay text-amber-400 text-xl md:text-2xl font-bold mb-3 text-center" dir="rtl">
              {t.verbNamaq.verb}
            </h4>
            <p className="font-arabic text-gray-900 dark:text-gray-200 text-base md:text-lg leading-relaxed text-center mb-4 flex-grow" dir="rtl">
              {t.verbNamaq.definition}
            </p>
            <div className="space-y-2 mt-2">
              {t.verbNamaq.forms.map((form, index) => (
                <p key={index} className="font-arabic text-gray-700 dark:text-gray-200 text-sm md:text-base text-center" dir="rtl">
                  {form}
                </p>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div >

  );
}