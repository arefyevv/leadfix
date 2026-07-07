import { analyzeHtml } from "@/lib/analyzeHtml";
import { readAuditReportByLeadId, saveAuditReportByLeadId } from "@/lib/auditReports";
import { saveAuditToSheets } from "@/lib/auditSheets";
import { enhanceAuditWithAI } from "@/lib/openaiAudit";
import { captureAuditScreenshots } from "@/lib/screenshotAudit";
import type { AuditAnalysis } from "@/types/audit";

const REQUEST_TIMEOUT_MS = 12_000;

type GeneratePaidAuditInput = {
  url: string;
  leadId: string;
  plan: string;
};

export function normalizeAuditUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Введите адрес сайта");
  }

  const rawUrl = value.trim();
  const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  const url = new URL(withProtocol);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Поддерживаются только http и https адреса");
  }

  if (
    url.hostname === "localhost" ||
    url.hostname === "0.0.0.0" ||
    url.hostname === "::1" ||
    url.hostname === "[::1]" ||
    /^127\./.test(url.hostname) ||
    /^169\.254\./.test(url.hostname) ||
    /^10\./.test(url.hostname) ||
    /^192\.168\./.test(url.hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(url.hostname)
  ) {
    throw new Error("Локальные адреса недоступны для анализа");
  }

  return url;
}

export function isAuditInputError(error: unknown, message: string) {
  return (
    error instanceof SyntaxError ||
    message === "Введите адрес сайта" ||
    message === "Поддерживаются только http и https адреса" ||
    message === "Локальные адреса недоступны для анализа" ||
    message === "Invalid URL"
  );
}

export async function loadAuditHtml(url: URL) {
  const response = await fetch(url, {
    headers: {
      "Accept": "text/html,application/xhtml+xml",
      "User-Agent": "LeadFixPreviewAudit/1.0"
    },
    redirect: "follow",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Сайт ответил с ошибкой ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
    throw new Error("По этому адресу не найдена HTML-страница");
  }

  return {
    html: await response.text(),
    finalUrl: response.url || url.href
  };
}

export function buildReportUrl({ url, plan, leadId }: GeneratePaidAuditInput) {
  const baseUrl = (process.env.LEADFIX_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://leadfix.ru").replace(/\/$/, "");
  const reportUrl = new URL("/full-report", baseUrl);
  reportUrl.searchParams.set("url", url);
  reportUrl.searchParams.set("plan", plan || "Экспресс");
  reportUrl.searchParams.set("lead", leadId);

  return reportUrl.toString();
}

export async function generatePaidAudit(input: GeneratePaidAuditInput): Promise<AuditAnalysis> {
  const storedReport = await readAuditReportByLeadId(input.leadId);
  if (storedReport) return storedReport.analysis;

  const url = normalizeAuditUrl(input.url);
  const { html, finalUrl } = await loadAuditHtml(url);
  const screenshots = await captureAuditScreenshots({ url: finalUrl, leadId: input.leadId });
  const baseAnalysis = {
    ...analyzeHtml(html, finalUrl),
    screenshots,
    plan: input.plan
  };
  const analysis = await enhanceAuditWithAI(baseAnalysis, { plan: input.plan });

  if (analysis.auditResult.metadata.generatedBy !== "proxyapi") {
    throw new Error("AI audit did not complete. Check ProxyAPI key, model, balance and server logs.");
  }

  await saveAuditReportByLeadId(input.leadId, analysis);
  await saveAuditToSheets(input.leadId, analysis).catch((sheetsError) => {
    console.error("Google Sheets audit log failed", sheetsError);
  });

  return analysis;
}
