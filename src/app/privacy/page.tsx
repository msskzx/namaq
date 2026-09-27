"use client";

import React from 'react';
import { useLanguage } from '@/components/language/LanguageContext';
import AnalyticsOptOut from '@/components/cookies/AnalyticsOptOut';

export default function PrivacyPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-black">
        <div className="mx-auto bg-white dark:bg-black">
          <div className={`rounded-lg shadow-lg p-8 ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <h1 className="text-3xl font-bold text-amber-400 mb-6">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </h1>

            <div className="space-y-6 text-gray-700 dark:text-gray-200">
              <section>
                <h2 className="text-xl font-semibold text-amber-400 mb-3">
                  {language === 'ar' ? 'ما نخزنه' : 'What We Store'}
                </h2>
                <p className="mb-3">
                  {language === 'ar'
                    ? 'الشيء الأساسي الذي نحفظه هو تفضيلاتك الظاهرة على الموقع:'
                    : 'The main thing we store is the display preferences you set on the site:'
                  }
                </p>
                <ul className={`list-disc list-inside space-y-1 ${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                  {language === 'ar' ? (
                    <>
                      <li>لغة الواجهة المختارة</li>
                      <li>المظهر الفاتح أو الداكن</li>
                    </>
                  ) : (
                    <>
                      <li>Your chosen interface language</li>
                      <li>Light or dark theme</li>
                    </>
                  )}
                </ul>
                <p className="mt-3">
                  {language === 'ar'
                    ? 'هذه التفضيلات تُحفظ في متصفحك فقط (تخزين محلي أو ملف تعريف ارتباط)، ولا تُرسل إلى أي طرف آخر.'
                    : 'These preferences are stored only in your browser (local storage or a cookie), and are never sent to anyone else.'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-400 mb-3">
                  {language === 'ar' ? 'التحليلات' : 'Analytics'}
                </h2>
                <p className="mb-3">
                  {language === 'ar'
                    ? 'ندمج تحليلات Vercel في الموقع، لكننا لا نطّلع عليها بانتظام في هذه المرحلة من التطوير. إذا وافقت، تُجمع بيانات مجهولة مثل مشاهدات الصفحات، مقاييس الأداء، ونوع الجهاز والموقع الجغرافي على مستوى البلد فقط. لا شيء يُجمع دون موافقتك.'
                    : 'We embed Vercel Analytics in the site, but do not regularly review it at this stage of development. If you consent, anonymous data is collected: page views, performance metrics, and device and country-level location. Nothing is collected without your consent.'
                  }
                </p>
                <AnalyticsOptOut />
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-400 mb-3">
                  {language === 'ar' ? 'الحسابات' : 'Accounts'}
                </h2>
                <p>
                  {language === 'ar'
                    ? 'نمق لا يقدم حاليًا إنشاء حساب أو تسجيل دخول، ولا يجمع أي معلومات شخصية.'
                    : 'Namaq does not currently offer accounts or sign-in, and collects no personal information.'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-400 mb-3">
                  {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                </h2>
                <p>
                  {language === 'ar'
                    ? 'لأي أسئلة حول هذه السياسة، راسلنا على msskzx@gmail.com'
                    : 'For any questions about this policy, contact us at msskzx@gmail.com'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-400 mb-3">
                  {language === 'ar' ? 'تحديثات هذه السياسة' : 'Updates to This Policy'}
                </h2>
                <p>
                  {language === 'ar'
                    ? 'إذا أضفنا ميزة تغيّر ما نخزنه، مثل الحسابات، أو غيّرنا كيفية استخدامنا للتحليلات، ستُحدَّث هذه الصفحة في نفس التغيير.'
                    : 'If we add a feature that changes what we store, such as accounts, or change how we use analytics, this page will be updated in the same change.'
                  }
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
