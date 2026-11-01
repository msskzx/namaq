"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeColor from "./ThemeColor";

function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeColor />
      {children}
    </NextThemesProvider>
  );
};

export default CustomThemeProvider; 