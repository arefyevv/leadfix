import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AuditAnalysis, PreviewReport } from "@/types/audit";

const REPORTS_DIR = path.join(process.cwd(), "data", "audit-reports");

type StoredAuditReport = {
  analysis: AuditAnalysis;
  previewReport: PreviewReport;
  savedAt: string;
};

function normalizeLeadId(leadId: unknown) {
  if (typeof leadId !== "string") return "";
  const value = leadId.trim();
  return /^[a-zA-Z0-9_-]+$/.test(value) ? value : "";
}

function getReportPath(leadId: string) {
  return path.join(REPORTS_DIR, `${leadId}.json`);
}

export async function readAuditReportByLeadId(leadId: unknown) {
  const normalizedLeadId = normalizeLeadId(leadId);
  if (!normalizedLeadId) return null;

  try {
    const report = JSON.parse(await readFile(getReportPath(normalizedLeadId), "utf8")) as StoredAuditReport;
    return report.analysis ? report : null;
  } catch {
    return null;
  }
}

export async function saveAuditReportByLeadId(leadId: unknown, analysis: AuditAnalysis) {
  const normalizedLeadId = normalizeLeadId(leadId);
  if (!normalizedLeadId) return;

  await mkdir(REPORTS_DIR, { recursive: true });
  await writeFile(
    getReportPath(normalizedLeadId),
    JSON.stringify({
      analysis,
      previewReport: analysis.previewReport,
      savedAt: new Date().toISOString()
    } satisfies StoredAuditReport),
    "utf8"
  );
}
