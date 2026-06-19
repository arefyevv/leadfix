import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { SaasDemoReport } from "@/components/SaasDemoReport";
import { SiteFooter } from "@/components/SiteFooter";
import { demoAuditAnalysis } from "@/lib/demoAudit";

export const metadata: Metadata = {
  title: "Пример аудита лендинга v2",
  description: "Экспериментальный дизайн демо-отчёта LeadFix в стиле SaaS-аналитики.",
  robots: {
    index: false,
    follow: false
  }
};

export default function SampleAuditV2Page() {
  const reportDate = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date("2026-06-13"));

  return (
    <div className="demo-report-v2-shell">
      <Header />
      <main>
        <SaasDemoReport analysis={demoAuditAnalysis} reportDate={reportDate} />
      </main>
      <SiteFooter />
    </div>
  );
}
