"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FullReport } from "@/components/FullReport";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/LoadingScreen";
import { fetchAudit, getAuditCache, isAiAudit, normalizeClientUrl } from "@/lib/clientAudit";
import type { AuditAnalysis } from "@/types/audit";

export function FullReportRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState<AuditAnalysis | null>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const reportDate = useMemo(() => new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date()), []);

  useEffect(() => {
    let normalizedUrl = "";

    try {
      normalizedUrl = normalizeClientUrl(searchParams.get("url") ?? "");
    } catch {
      setError("В ссылке отчёта указан некорректный адрес сайта.");
      return;
    }

    const requiresAi = Boolean(searchParams.get("lead"));

    setUrl(normalizedUrl);
    const cachedAnalysis = getAuditCache(normalizedUrl);
    if (cachedAnalysis && (!requiresAi || isAiAudit(cachedAnalysis))) {
      setAnalysis(cachedAnalysis);
      return;
    }

    fetchAudit(normalizedUrl, { requireAi: requiresAi })
      .then(setAnalysis)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : "Не удалось загрузить отчёт."));
  }, [searchParams]);

  return (
    <div className="legal-shell report-shell">
      <Header />
      <main>
        {error ? (
          <section className="analysis screen">
            <div className="analysis__inner route-error">
              <h1>Не удалось загрузить отчёт</h1>
              <p>{error}</p>
              <button className="report-button report-button--primary" type="button" onClick={() => router.push("/")}>Проверить другой сайт</button>
            </div>
          </section>
        ) : analysis ? (
          <FullReport analysis={analysis} reportDate={reportDate} />
        ) : (
          <LoadingScreen url={url} steps={["Загружаем данные отчёта", "Готовим полный аудит"]} stepIndex={0} />
        )}
      </main>
    </div>
  );
}
