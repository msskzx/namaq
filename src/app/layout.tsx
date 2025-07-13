import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/components/LanguageContext";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import ConditionalAnalytics from "@/components/ConditionalAnalytics";
import SWRProvider from "@/components/SWRProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Namaq - Learn Arabic Language & Islamic History",
  description: "Learn Arabic language, Islamic history, grammar, and the teachings of Prophet Muhammad ﷺ and his companions through interactive educational content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <SWRProvider>
            <div className="min-h-screen flex flex-col">
              <NavBar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <SpeedInsights />
            <ConditionalAnalytics />
            <CookieConsent />
          </SWRProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
