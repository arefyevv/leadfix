import type { Metadata } from "next";
import { FullReport } from "@/components/FullReport";
import { Header } from "@/components/Header";
import { demoAuditAnalysis } from "@/lib/demoAudit";

export const metadata: Metadata = {
  title: "Пример аудита лендинга",
  description: "Посмотрите демо-отчёт LeadFix: как выглядит результат аудита лендинга, какие проблемы показываются в отчёте и что получает клиент после проверки сайта.",
  alternates: {
    canonical: "/primer-audita-lendinga"
  }
};

export default function SampleAuditPage() {
  const reportDate = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date("2026-06-13"));

  return (
    <div className="legal-shell demo-report-shell">
      <Header />
      <main>
        <FullReport analysis={demoAuditAnalysis} reportDate={reportDate} />
      </main>
    </div>
  );
}
