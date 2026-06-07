"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PreviewReport } from "@/components/PreviewReport";
import { fetchAudit, getAuditCache, normalizeClientUrl } from "@/lib/clientAudit";
import type { AuditAnalysis } from "@/types/audit";

const loadingSteps = [
  "Открываем сайт",
  "Смотрим первый экран",
  "Проверяем оффер",
  "Ищем CTA и формы",
  "Оцениваем доверие",
  "Проверяем структуру",
  "Собираем предварительный отчёт"
];

const MIN_LOADING_MS = 5600;

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function ReportRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState<AuditAnalysis | null>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loadingIndex, setLoadingIndex] = useState(0);

  useEffect(() => {
    const rawUrl = searchParams.get("url");
    let normalizedUrl = "";

    try {
      normalizedUrl = normalizeClientUrl(rawUrl ?? "");
    } catch {
      setError("В ссылке отчёта указан некорректный адрес сайта.");
      return;
    }

    setUrl(normalizedUrl);
    setError("");
    setAnalysis(null);
    setLoadingIndex(0);

    let cancelled = false;
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setLoadingIndex(Math.min(index, loadingSteps.length - 1));
    }, 850);

    const cachedAnalysis = getAuditCache(normalizedUrl);
    const analysisRequest = cachedAnalysis ? Promise.resolve(cachedAnalysis) : fetchAudit(normalizedUrl);

    Promise.all([analysisRequest, delay(MIN_LOADING_MS)])
      .then(([result]) => {
        if (!cancelled) {
          setLoadingIndex(loadingSteps.length - 1);
          setAnalysis(result);
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "Не удалось открыть сайт. Проверьте адрес или попробуйте позже.");
        }
      })
      .finally(() => window.clearInterval(timer));

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [searchParams]);

  return (
    <div className="legal-shell report-shell">
      <Header />
      <main>
        {error ? (
          <section className="analysis screen">
            <div className="analysis__inner route-error">
              <h1>Не удалось собрать отчёт</h1>
              <p>{error}</p>
              <button className="report-button report-button--primary" type="button" onClick={() => router.push("/")}>Проверить другой сайт</button>
            </div>
          </section>
        ) : analysis ? (
          <PreviewReport
            analysis={analysis}
            onCheckout={() => router.push(`/checkout?url=${encodeURIComponent(analysis.url)}`)}
            onReset={() => router.push("/")}
          />
        ) : (
          <LoadingScreen url={url} steps={loadingSteps} stepIndex={loadingIndex} />
        )}
      </main>
    </div>
  );
}
