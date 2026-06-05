import { Suspense } from "react";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ReportRoute } from "@/components/ReportRoute";

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
