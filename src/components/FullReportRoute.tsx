"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FullReport } from "@/components/FullReport";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/LoadingScreen";
import { fetchAudit, getAuditCache, isAiAudit, normalizeClientUrl } from "@/lib/clientAudit";
import { demoAuditAnalysis } from "@/lib/demoAudit";
import type { AuditAnalysis } from "@/types/audit";

const DESKTOP_SCREENSHOT_SIZE = { width: 1366, height: 768 } as const;

function normalizeReportScreenshotSizes(analysis: AuditAnalysis): AuditAnalysis {
  if (!analysis.screenshots?.length) return analysis;

  return {
    ...analysis,
    screenshots: analysis.screenshots.map((screenshot) => screenshot.id === "mobile"
      ? screenshot
      : { ...screenshot, ...DESKTOP_SCREENSHOT_SIZE })
  };
}

export function FullReportRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState<AuditAnalysis | null>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const displayAnalysis = useMemo(() => analysis ? normalizeReportScreenshotSizes(analysis) : null, [analysis]);
  const reportDate = useMemo(() => new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date()), []);

  useEffect(() => {
    let normalizedUrl = "";
    const rawUrl = searchParams.get("url") ?? "";

    if (!rawUrl) {
      setAnalysis(demoAuditAnalysis);
      return;
    }

    try {
      normalizedUrl = normalizeClientUrl(rawUrl);
    } catch {
      setError("В ссылке отчёта указан некорректный адрес сайта.");
      return;
    }

    const leadId = searchParams.get("lead") ?? "";
    const plan = searchParams.get("plan") ?? "";
    const requiresAi = Boolean(leadId);

    setUrl(normalizedUrl);
    const cachedAnalysis = getAuditCache(normalizedUrl, leadId);
    if (cachedAnalysis && (!requiresAi || isAiAudit(cachedAnalysis))) {
      setAnalysis(cachedAnalysis);
      return;
    }

    fetchAudit(normalizedUrl, { requireAi: requiresAi, leadId, plan })
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
        ) : displayAnalysis ? (
          <FullReport analysis={displayAnalysis} reportDate={reportDate} />
        ) : (
          <LoadingScreen url={url} steps={["Загружаем данные отчёта", "Готовим полный аудит"]} stepIndex={0} />
        )}
      </main>
    </div>
  );
}
