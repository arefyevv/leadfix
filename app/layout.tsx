import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadFix — аудит продающей способности сайтов",
  description: "AI-аудитор продающей способности сайтов"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
