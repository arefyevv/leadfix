import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ReportRoute } from "@/components/ReportRoute";

export const metadata: Metadata = {
  title: "Предварительный отчёт",
  robots: {
    index: false,
    follow: false
  }
};

const loadingSteps = [
  "Открываем сайт",
  "Смотрим первый экран",
  "Проверяем оффер",
  "Ищем CTA и формы",
  "Собираем предварительный отчёт"
];

export default function ReportPage() {
  return (
    <Suspense
      fallback={(
        <>
          <Header />
          <main>
            <LoadingScreen url="" steps={loadingSteps} stepIndex={0} />
          </main>
        </>
      )}
    >
      <ReportRoute />
    </Suspense>
  );
}
