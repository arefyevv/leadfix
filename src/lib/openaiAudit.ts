import { readFile } from "node:fs/promises";
import type { AuditAnalysis, AuditResult, PreviewReport } from "@/types/audit";
import { buildAuditPrompt } from "@/lib/audit/prompt";
import { reviewAuditResult } from "@/lib/audit/quality";
import { getScreenshotFilePath } from "@/lib/screenshotAudit";

const PROXYAPI_BASE_URL = "https://openai.api.proxyapi.ru/v1";
const AI_TIMEOUT_MS = Number(process.env.PROXYAPI_AUDIT_TIMEOUT_MS || 240_000);
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

type ProxyApiContentItem =
  | { type: "input_text"; text: string }
  | { type: "input_image"; image_url: string };

function extractOutputText(data: OpenAIResponse) {
  if (typeof data.output_text === "string") return data.output_text;

  const outputText = data.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text ?? "")
    .join("")
    .trim();

  return outputText;
}

function parseAuditResultOutput(outputText: string) {
  try {
    return JSON.parse(outputText) as unknown;
  } catch {
    const match = outputText.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) as unknown : null;
  }
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

async function buildVisionContent(analysis: AuditAnalysis, promptText: string): Promise<ProxyApiContentItem[] | string> {
  if (!analysis.screenshots?.length) return promptText;

  const content: ProxyApiContentItem[] = [
    {
      type: "input_text",
      text: `${promptText}\n\n# Visual evidence\nAnalyze the attached screenshots. Available screenshot ids may include: desktop, mobile, hero, cases, trust, form, pricing, faq, cta. Use the most specific screenshotId for each finding. If the finding is about cases, use screenshotId=\"cases\" only when that screenshot is attached. If it is about the form, use screenshotId=\"form\". If it is about prices, use screenshotId=\"pricing\". If no attached screenshot shows the relevant area, use screenshotId=\"none\". Do not use screenshotId=\"desktop\" as a generic fallback for findings about lower page blocks. Write issue text in simple Russian for a business owner: short, concrete, no jargon.`
    }
  ];

  for (const screenshot of analysis.screenshots) {
    const screenshotUrl = new URL(screenshot.url, "https://leadfix.local");
    const filePath = getScreenshotFilePath(screenshotUrl.searchParams.get("lead") || "", screenshot.id);
    if (!filePath) continue;

    try {
      content.push({
        type: "input_text",
        text: `Screenshot id: ${screenshot.id}`
      });
      const base64Image = await readFile(filePath, "base64");
      content.push({
        type: "input_image",
        image_url: `data:${screenshot.mimeType};base64,${base64Image}`
      });
    } catch (error) {
      console.error("Audit screenshot read failed", { screenshotId: screenshot.id, error });
    }
  }

  return content.length > 1 ? content : promptText;
}

export async function enhanceAuditWithAI(analysis: AuditAnalysis): Promise<AuditAnalysis> {
  const apiKey = process.env.PROXYAPI_API_KEY;
  if (!apiKey) return analysis;

  const model = process.env.PROXYAPI_AUDIT_MODEL || process.env.OPENAI_AUDIT_MODEL || DEFAULT_MODEL;
  const baseUrl = (process.env.PROXYAPI_BASE_URL || PROXYAPI_BASE_URL).replace(/\/$/, "");
  const prompt = buildAuditPrompt(analysis);
  const userContent = await buildVisionContent(analysis, prompt.user);

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
            content: userContent
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

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("ProxyAPI audit request failed", response.status, errorText.slice(0, 800));
      return analysis;
    }

    const data = (await response.json()) as OpenAIResponse;
    const outputText = extractOutputText(data);
    if (!outputText) return analysis;

    const parsedAuditResult = parseAuditResultOutput(outputText);
    if (!isValidAuditResult(parsedAuditResult)) {
      console.error("ProxyAPI audit response rejected by validator", outputText.slice(0, 1200));
      return analysis;
    }
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
  } catch (error) {
    console.error("ProxyAPI audit request failed", error);
    return analysis;
  }
}
