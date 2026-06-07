import type { Metadata } from "next";
import { CookieNotice } from "@/components/CookieNotice";
import { Inter, Inter_Tight } from "next/font/google";
import { Metrika } from "@/components/Metrika";
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
  metadataBase: new URL("https://leadfix.ru"),
  title: {
    default: "LeadFix — аудит лендинга и поиск точек потери заявок",
    template: "%s | LeadFix"
  },
  description: "LeadFix проверяет оффер, CTA, доверие, структуру, формы и мобильную версию лендинга, чтобы быстро найти причины потери заявок.",
  applicationName: "LeadFix",
  keywords: [
    "аудит лендинга",
    "аудит сайта",
    "проверка лендинга",
    "конверсия сайта",
    "увеличение заявок",
    "аудит сайта под Яндекс Директ",
    "анализ оффера",
    "CTA",
    "лидогенерация"
  ],
  authors: [{ name: "LeadFix" }],
  creator: "LeadFix",
  publisher: "LeadFix",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://leadfix.ru",
    siteName: "LeadFix",
    title: "LeadFix — аудит лендинга и поиск точек потери заявок",
    description: "Проверьте оффер, CTA, доверие, структуру и мобильную версию сайта перед запуском рекламы.",
    images: [
      {
        url: "/leadfix-logo.png",
        width: 1200,
        height: 630,
        alt: "LeadFix"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadFix — аудит лендинга и поиск точек потери заявок",
    description: "Проверьте, где сайт теряет заявки: оффер, CTA, доверие, структура и мобильная версия.",
    images: ["/leadfix-logo.png"]
  },
  robots: {
    index: true,
    follow: true
  },
  verification: {
    yandex: "6a5c525b3269f922"
  },
  icons: {
    icon: "/favicon.svg"
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://leadfix.ru/#organization",
      name: "LeadFix",
      url: "https://leadfix.ru",
      logo: "https://leadfix.ru/leadfix-logo.png",
      sameAs: ["https://t.me/LeadFixRu"]
    },
    {
      "@type": "WebSite",
      "@id": "https://leadfix.ru/#website",
      url: "https://leadfix.ru",
      name: "LeadFix",
      inLanguage: "ru-RU",
      publisher: {
        "@id": "https://leadfix.ru/#organization"
      }
    },
    {
      "@type": "Service",
      "@id": "https://leadfix.ru/#service",
      name: "Аудит продающей способности сайтов",
      provider: {
        "@id": "https://leadfix.ru/#organization"
      },
      areaServed: "RU",
      serviceType: "Аудит лендингов и посадочных страниц",
      description: "Проверка оффера, CTA, доверия, структуры, форм и мобильной версии сайта для поиска точек потери заявок."
    }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable} ${interTight.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <SiteFooter />
        <CookieNotice />
        <Metrika />
      </body>
    </html>
  );
}
