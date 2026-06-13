"use client";

import type { AnalyzeResponse, AuditAnalysis } from "@/types/audit";

const CACHE_PREFIX = "leadfix:audit:";

type FetchAuditOptions = {
  requireAi?: boolean;
};

export function normalizeClientUrl(value: string) {
  const rawUrl = value.trim();
  const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  return new URL(withProtocol).href;
}

export function getAuditCache(url: string) {
  try {
    const value = window.sessionStorage.getItem(`${CACHE_PREFIX}${url}`);
    return value ? (JSON.parse(value) as AuditAnalysis) : null;
  } catch {
    return null;
  }
}

export function setAuditCache(analysis: AuditAnalysis) {
  try {
    window.sessionStorage.setItem(`${CACHE_PREFIX}${analysis.url}`, JSON.stringify(analysis));
  } catch {
    // The report still works when storage is unavailable.
  }
}

export function isAiAudit(analysis: AuditAnalysis) {
  return analysis.aiProvider === "proxyapi" || analysis.auditResult.metadata.generatedBy === "proxyapi";
}

export async function fetchAudit(url: string, options: FetchAuditOptions = {}) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, requireAi: options.requireAi === true })
  });
  const data = (await response.json()) as AnalyzeResponse | { error?: string };

  if (!response.ok || !("analysis" in data)) {
    throw new Error(("error" in data && data.error) || "Не удалось открыть сайт. Проверьте адрес или попробуйте позже.");
  }

  setAuditCache(data.analysis);
  return data.analysis;
}
