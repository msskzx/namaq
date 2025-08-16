"use client";

import React from 'react';
import { useLanguage } from '@/components/language/LanguageContext';
import AnalyticsOptOut from '@/components/cookies/AnalyticsOptOut';



export default function PrivacyPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-950">
        <div className="mx-auto bg-white dark:bg-gray-950">
          <div className={`rounded-lg shadow-lg p-8 ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <h1 className="text-3xl font-bold text-amber-400 mb-6">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </h1>

            <div className="space-y-6 text-gray-700 dark:text-gray-200">
              <section>
                <h2 className="text-xl font-semibold text-amber-400 mb-3">
                  {language === 'ar' ? 'المعلومات التي نجمعها' : 'Information We Collect'}
                </h2>
                <p className="mb-3">
                  {language === 'ar'
                    ? 'نجمع المعلومات لتقديم خدمات أفضل لمستخدمينا وتحسين منصتنا التعليمية.'
                    : 'We collect information to provide better services to our users and improve our educational platform.'
                  }
                </p>
                <ul className={`list-disc list-inside space-y-1 ${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                  {language === 'ar' ? (
                    <>
                      <li>بيانات الاستخدام والتحليلات لتحسين خدماتنا</li>
                      <li>تفضيلات اللغة لتقديم محتوى محلي</li>
                      <li>مقاييس الأداء لتحسين تجربة المستخدم</li>
                    </>
                  ) : (
                    <>
                      <li>Usage data and analytics to improve our services</li>
                      <li>Language preferences to provide localized content</li>
                      <li>Performance metrics to optimize user experience</li>
                    </>
                  )}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-400 mb-3">
                  {language === 'ar' ? 'ملفات تعريف الارتباط والتحليلات' : 'Cookies and Analytics'}
                </h2>
                <p className="mb-3">
                  {language === 'ar'
                    ? 'نستخدم ملفات تعريف الارتباط وأدوات التحليلات لفهم كيفية استخدامك لموقعنا وتحسين تجربتك.'
                    : 'We use cookies and analytics tools to understand how you use our website and improve your experience.'
                  }
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">
                    {language === 'ar' ? 'تحليلات Vercel' : 'Vercel Analytics'}
                  </h3>
                  <p className="text-sm mb-2">
                    {language === 'ar'
                      ? 'نستخدم تحليلات Vercel لجمع بيانات الاستخدام المجهولة بما في ذلك:'
                      : 'We use Vercel Analytics to collect anonymous usage data including:'
                    }
                  </p>
                  <ul className={`list-disc list-inside text-sm space-y-1 ${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                    {language === 'ar' ? (
                      <>
                        <li>مشاهدات الصفحات وأنماط التنقل</li>
                        <li>مقاييس الأداء وأوقات التحميل</li>
                        <li>معلومات الجهاز والمتصفح</li>
                        <li>الموقع الجغرافي (مستوى البلد فقط)</li>
                      </>
                    ) : (
                      <>
                        <li>Page views and navigation patterns</li>
                        <li>Performance metrics and loading times</li>
                        <li>Device and browser information</li>
                        <li>Geographic location (country level only)</li>
                      </>
                    )}
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-400 mb-3">
                  {language === 'ar' ? 'حقوقك' : 'Your Rights'}
                </h2>
                <p className="mb-3">
                  {language === 'ar' ? 'لديك الحق في:' : 'You have the right to:'}
                </p>
                <ul className={`list-disc list-inside space-y-1 ${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                  {language === 'ar' ? (
                    <>
                      <li>الانسحاب من تتبع التحليلات</li>
                      <li>طلب حذف بياناتك</li>
                      <li>الوصول إلى معلومات حول البيانات التي نجمعها</li>
                      <li>التواصل معنا بشأن مخاوف الخصوصية</li>
                    </>
                  ) : (
                    <>
                      <li>Opt-out of analytics tracking</li>
                      <li>Request deletion of your data</li>
                      <li>Access information about data we collect</li>
                      <li>Contact us with privacy concerns</li>
                    </>
                  )}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-400 mb-3">
                  {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                </h2>
                <p>
                  {language === 'ar'
                    ? 'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على privacy@namaq.com'
                    : 'If you have any questions about this privacy policy, please contact us at privacy@namaq.com'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-400 mb-3">
                  {language === 'ar' ? 'تحديثات هذه السياسة' : 'Updates to This Policy'}
                </h2>
                <p>
                  {language === 'ar'
                    ? 'قد نحدث سياسة الخصوصية هذه من وقت لآخر. سنخطر المستخدمين بأي تغييرات جوهرية.'
                    : 'We may update this privacy policy from time to time. We will notify users of any material changes.'
                  }
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-amber-400 mb-3">
                  {language === 'ar' ? 'إعدادات التحليلات' : 'Analytics Settings'}
                </h2>
                <p className="mb-4">
                  {language === 'ar'
                    ? 'يمكنك التحكم في جمع بيانات التحليلات لتحسين تجربتك.'
                    : 'You can control the collection of analytics data to improve your experience.'
                  }
                </p>
                <AnalyticsOptOut />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}