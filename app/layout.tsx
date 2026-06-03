import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap"
});

const interTight = Inter_Tight({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
  display: "swap"
});

export const metadata: Metadata = {
  title: "LeadFix — аудит продающей способности сайтов",
  description: "AI-аудитор продающей способности сайтов",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable} ${interTight.variable}`}>
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
