import type { AuditAnalysis, AuditResult, PreviewReport } from "@/types/audit";
import { buildAuditPrompt } from "@/lib/audit/prompt";
import { reviewAuditResult } from "@/lib/audit/quality";

const PROXYAPI_BASE_URL = "https://api.proxyapi.ru/openai/v1";
const AI_TIMEOUT_MS = 18_000;
const DEFAULT_MODEL = "gpt-5.4-mini";

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

function extractOutputText(data: OpenAIResponse) {
  if (typeof data.output_text === "string") return data.output_text;

  return data.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text ?? "")
    .join("")
    .trim();
}

function previewReportFromAuditResult(auditResult: AuditResult): PreviewReport {
  const insights = auditResult.issues.slice(0, 5).map((issue) => ({
    title: issue.title,
    description: issue.problem,
    priority: issue.severity === "critical" ? "Критично" : issue.severity === "high" ? "Важно" : "Низкий"
  })) satisfies PreviewReport["insights"];

  return {
    score: auditResult.overallScore,
    criticalIssues: auditResult.issues.filter((issue) => issue.severity === "critical").length,
    mediumIssues: auditResult.issues.filter((issue) => issue.severity === "high" || issue.severity === "medium").length,
    lowIssues: auditResult.issues.filter((issue) => issue.severity === "low").length,
    insights
  };
}

function isValidAuditResult(value: unknown): value is Omit<AuditResult, "metadata" | "analyzedUrl"> {
  if (!value || typeof value !== "object") return false;

  const result = value as AuditResult;
  return (
    Number.isInteger(result.overallScore) &&
    result.overallScore >= 0 &&
    result.overallScore <= 100 &&
    Array.isArray(result.categoryScores) &&
    Array.isArray(result.issues) &&
    result.issues.length >= 3 &&
    typeof result.implementationPlan === "object" &&
    typeof result.finalSummary === "object" &&
    typeof result.qualityReview === "object"
  );
}

export async function enhanceAuditWithAI(analysis: AuditAnalysis): Promise<AuditAnalysis> {
  const apiKey = process.env.PROXYAPI_API_KEY;
  if (!apiKey) return analysis;

  const model = process.env.PROXYAPI_AUDIT_MODEL || process.env.OPENAI_AUDIT_MODEL || DEFAULT_MODEL;
  const baseUrl = (process.env.PROXYAPI_BASE_URL || PROXYAPI_BASE_URL).replace(/\/$/, "");
  const prompt = buildAuditPrompt(analysis);

  try {
    const response = await fetch(`${baseUrl}/responses`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: prompt.system
          },
          {
            role: "user",
            content: prompt.user
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "leadfix_audit_result",
            strict: true,
            schema: prompt.schema
          }
        }
      }),
      signal: AbortSignal.timeout(AI_TIMEOUT_MS),
      cache: "no-store"
    });

    if (!response.ok) return analysis;

    const data = (await response.json()) as OpenAIResponse;
    const outputText = extractOutputText(data);
    if (!outputText) return analysis;

    const parsedAuditResult = JSON.parse(outputText) as unknown;
    if (!isValidAuditResult(parsedAuditResult)) return analysis;
    const auditResult = reviewAuditResult({
      ...(parsedAuditResult as Omit<AuditResult, "metadata" | "analyzedUrl">),
      metadata: {
        methodology: "LeadFix Conversion Audit Method",
        version: "1.0",
        language: "ru",
        generatedBy: "proxyapi"
      },
      analyzedUrl: analysis.url
    });

    return {
      ...analysis,
      previewReport: previewReportFromAuditResult(auditResult),
      auditResult,
      aiProvider: "proxyapi",
      aiModel: model
    };
  } catch {
    return analysis;
  }
}
