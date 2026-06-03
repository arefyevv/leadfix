import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadFix — аудит продающей способности сайтов",
  description: "AI-аудитор продающей способности сайтов",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
