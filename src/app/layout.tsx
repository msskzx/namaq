import type { Metadata } from "next";
import { Amiri, Geist_Mono } from "next/font/google";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/components/language/LanguageContext";
import AppChrome from "@/components/common/AppChrome";
import CookieConsent from "@/components/cookies/CookieConsent";
import ConditionalAnalytics from "@/components/cookies/ConditionalAnalytics";
import SWRProvider from "@/components/common/SWRProvider";
import CustomThemeProvider from "@/components/theme/CustomThemeProvider";
import { SITE_URL } from "@/lib/siteUrl";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/siteMeta";

config.autoAddCss = false;

const amiri = Amiri({
  variable: "--font-amiri",
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} | ${SITE_DESCRIPTION}`,
  description: SITE_DESCRIPTION,
  openGraph: { siteName: SITE_NAME, title: SITE_NAME, description: SITE_DESCRIPTION, locale: "ar_AR", type: "website" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${amiri.variable} ${geistMono.variable} antialiased`}>
        <CustomThemeProvider>
          <LanguageProvider>
            <SWRProvider>
              <AppChrome>{children}</AppChrome>
              <SpeedInsights />
              <ConditionalAnalytics />
              <CookieConsent />
            </SWRProvider>
          </LanguageProvider>
        </CustomThemeProvider>
      </body>
    </html >
  );
}
