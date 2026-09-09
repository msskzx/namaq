import type { Metadata } from "next";
import { Amiri, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/components/language/LanguageContext";
import AppChrome from "@/components/common/AppChrome";
import CookieConsent from "@/components/cookies/CookieConsent";
import ConditionalAnalytics from "@/components/cookies/ConditionalAnalytics";
import SWRProvider from "@/components/common/SWRProvider";
import CustomThemeProvider from "@/components/theme/CustomThemeProvider";

// Amiri is a naskh revival drawn for vocalized classical Arabic, which is what
// the source accounts are. Its Latin comes along for the interface, so one
// family covers both scripts.
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
  title: "Namaq - Data Driven Interactive Learning",
  description: "Data driven interactive learning platform to learn about all kinds of useful topics",
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
