import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/components/LanguageContext";
import NavBar from "@/components/homepage/NavBar";
import Footer from "@/components/homepage/Footer";
import CookieConsent from "@/components/CookieConsent";
import ConditionalAnalytics from "@/components/ConditionalAnalytics";
import SWRProvider from "@/components/SWRProvider";
import CustomThemeProvider from "@/components/CustomThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Namaq - Data Driven Interactive Learning",
  description: "Data driven interactive learning platform to learn about all kinds of useful topics, starting with the family and relations of Prophet Muhammad ﷺ and his companions, historic events, battles and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CustomThemeProvider>
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
        </CustomThemeProvider>
      </body>
    </html>
  );
}
