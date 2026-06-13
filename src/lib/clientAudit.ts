"use client";

import type { AnalyzeResponse, AuditAnalysis } from "@/types/audit";

const CACHE_PREFIX = "leadfix:audit:";

type FetchAuditOptions = {
  requireAi?: boolean;
  leadId?: string;
};

export function normalizeClientUrl(value: string) {
  const rawUrl = value.trim();
  const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  return new URL(withProtocol).href;
}

function getCacheKey(url: string, leadId?: string) {
  return `${CACHE_PREFIX}${leadId ? `${leadId}:` : ""}${url}`;
}

export function getAuditCache(url: string, leadId?: string) {
  try {
    const value = window.sessionStorage.getItem(getCacheKey(url, leadId));
    return value ? (JSON.parse(value) as AuditAnalysis) : null;
  } catch {
    return null;
  }
}

export function setAuditCache(analysis: AuditAnalysis, leadId?: string) {
  try {
    window.sessionStorage.setItem(getCacheKey(analysis.url, leadId), JSON.stringify(analysis));
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
    body: JSON.stringify({ url, requireAi: options.requireAi === true, leadId: options.leadId })
  });
  const data = (await response.json()) as AnalyzeResponse | { error?: string };

  if (!response.ok || !("analysis" in data)) {
    throw new Error(("error" in data && data.error) || "Не удалось открыть сайт. Проверьте адрес или попробуйте позже.");
  }

  setAuditCache(data.analysis, options.leadId);
  return data.analysis;
}
