import type { Metadata } from "next";
import { FullReport } from "@/components/FullReport";
import { Header } from "@/components/Header";
import { demoAuditAnalysis } from "@/lib/demoAudit";

export const metadata: Metadata = {
  title: "Демо полного отчета LeadFix",
  robots: {
    index: false,
    follow: true
  }
};

export default function FullReportDemoPage() {
  const reportDate = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date("2026-06-13"));

  return (
    <div className="legal-shell report-shell">
      <Header />
      <main>
        <FullReport analysis={demoAuditAnalysis} reportDate={reportDate} />
      </main>
    </div>
  );
}
