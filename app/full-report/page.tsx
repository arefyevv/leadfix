import { Suspense } from "react";
import type { Metadata } from "next";
import { FullReportRoute } from "@/components/FullReportRoute";

export const metadata: Metadata = {
  title: "Полный отчёт",
  robots: {
    index: false,
    follow: false
  }
};

export default function FullReportPage() {
  return <Suspense><FullReportRoute /></Suspense>;
}
