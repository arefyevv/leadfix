import { createSign } from "node:crypto";
import type { AuditAnalysis, AuditIssue } from "@/types/audit";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type SheetAppend = {
  sheetName: string;
  values: Array<Array<string | number | boolean>>;
};

const SHEET_HEADERS: Record<string, string[]> = {
  "Audit Log": [
    "audit_id",
    "created_at",
    "url",
    "tariff",
    "leadfix_score",
    "ai_provider",
    "ai_model",
    "generated_by",
    "issues_total",
    "critical_count",
    "high_count",
    "medium_count",
    "low_count",
    "top_findings",
    "quick_wins",
    "limitations",
    "quality_passed",
    "quality_score"
  ],
  "Findings Log": [
    "audit_id",
    "created_at",
    "url",
    "tariff",
    "finding_id",
    "criterion_id",
    "category_id",
    "severity",
    "priority_score",
    "impact",
    "complexity",
    "confidence",
    "screenshot_id",
    "location",
    "title",
    "problem",
    "evidence",
    "recommendation",
    "example",
    "expected_result",
    "needs_human_review"
  ],
  "Implementation Log": [
    "audit_id",
    "created_at",
    "url",
    "tariff",
    "horizon",
    "task"
  ],
  "Results After Fixes": [
    "audit_id",
    "created_at",
    "url",
    "tariff",
    "baseline_score",
    "after_score",
    "checked_at",
    "status"
  ]
};

function getSpreadsheetId() {
  return process.env.GOOGLE_SHEETS_AUDIT_LOG_SPREADSHEET_ID || process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "";
}

function getServiceAccountEmail() {
  return process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
}

function getServiceAccountPrivateKey() {
  return (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n");
}

function isConfigured() {
  return Boolean(getSpreadsheetId() && getServiceAccountEmail() && getServiceAccountPrivateKey());
}

function base64Url(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function signJwt(payload: Record<string, unknown>) {
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = base64Url(JSON.stringify(payload));
  const unsignedToken = `${header}.${body}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(getServiceAccountPrivateKey());

  return `${unsignedToken}.${base64Url(signature)}`;
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const assertion = signJwt({
    iss: getServiceAccountEmail(),
    scope: GOOGLE_SHEETS_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    iat: now,
    exp: now + 3600
  });
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    }),
    cache: "no-store"
  });
  const data = (await response.json()) as GoogleTokenResponse;

  if (!response.ok || !data.access_token) {
    throw new Error(`Google token request failed: ${data.error_description || data.error || response.status}`);
  }

  return data.access_token;
}

async function appendRows(accessToken: string, append: SheetAppend) {
  if (append.values.length === 0) return;

  const spreadsheetId = getSpreadsheetId();
  const range = encodeURIComponent(`${append.sheetName}!A1`);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        majorDimension: "ROWS",
        values: append.values
      }),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Google Sheets append failed for ${append.sheetName}: ${response.status} ${errorText.slice(0, 300)}`);
  }
}

async function ensureWorkbook(accessToken: string) {
  const spreadsheetId = getSpreadsheetId();
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`,
    {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      },
      cache: "no-store"
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Google Sheets metadata request failed: ${response.status} ${errorText.slice(0, 300)}`);
  }

  const data = (await response.json()) as { sheets?: Array<{ properties?: { title?: string } }> };
  const existingTitles = new Set((data.sheets ?? []).map((sheet) => sheet.properties?.title).filter(Boolean));
  const missingTitles = Object.keys(SHEET_HEADERS).filter((title) => !existingTitles.has(title));

  if (missingTitles.length > 0) {
    const updateResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requests: missingTitles.map((title) => ({
          addSheet: {
            properties: { title }
          }
        }))
      }),
      cache: "no-store"
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text().catch(() => "");
      throw new Error(`Google Sheets tab creation failed: ${updateResponse.status} ${errorText.slice(0, 300)}`);
    }
  }

  for (const [sheetName, headers] of Object.entries(SHEET_HEADERS)) {
    await ensureHeader(accessToken, sheetName, headers);
  }
}

function columnName(index: number) {
  let value = index;
  let result = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }

  return result;
}

async function ensureHeader(accessToken: string, sheetName: string, headers: string[]) {
  const spreadsheetId = getSpreadsheetId();
  const lastColumn = columnName(headers.length);
  const range = encodeURIComponent(`${sheetName}!A1:${lastColumn}1`);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Google Sheets header read failed for ${sheetName}: ${response.status} ${errorText.slice(0, 300)}`);
  }

  const data = (await response.json()) as { values?: string[][] };
  if (data.values?.[0]?.length) return;

  const updateResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        majorDimension: "ROWS",
        values: [headers]
      }),
      cache: "no-store"
    }
  );

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text().catch(() => "");
    throw new Error(`Google Sheets header write failed for ${sheetName}: ${updateResponse.status} ${errorText.slice(0, 300)}`);
  }
}

function safeText(value: unknown) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(" | ");
  return String(value);
}

function getIssueCounts(issues: AuditIssue[]) {
  return {
    critical: issues.filter((issue) => issue.severity === "critical").length,
    high: issues.filter((issue) => issue.severity === "high").length,
    medium: issues.filter((issue) => issue.severity === "medium").length,
    low: issues.filter((issue) => issue.severity === "low").length
  };
}

function buildAuditLogRow(auditId: string, analysis: AuditAnalysis, createdAt: string) {
  const result = analysis.auditResult;
  const counts = getIssueCounts(result.issues);
  const topFindings = result.issues
    .slice()
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 5)
    .map((issue) => issue.title);

  return [
    auditId,
    createdAt,
    analysis.url,
    analysis.plan || "",
    result.overallScore,
    analysis.aiProvider || "",
    analysis.aiModel || "",
    result.metadata.generatedBy,
    result.issues.length,
    counts.critical,
    counts.high,
    counts.medium,
    counts.low,
    topFindings.join(" | "),
    result.quickWins.join(" | "),
    result.limitations.join(" | "),
    result.qualityReview.passed,
    result.qualityReview.score
  ];
}

function buildFindingRows(auditId: string, analysis: AuditAnalysis, createdAt: string) {
  return analysis.auditResult.issues.map((issue) => [
    auditId,
    createdAt,
    analysis.url,
    analysis.plan || "",
    issue.id,
    issue.criterionId,
    issue.categoryId,
    issue.severity,
    issue.priorityScore,
    issue.impact,
    issue.complexity,
    issue.confidence,
    safeText(issue.screenshotId),
    issue.location,
    issue.title,
    issue.problem,
    issue.evidence,
    issue.recommendation,
    issue.example,
    issue.expectedResult,
    issue.needsHumanReview
  ]);
}

function buildImplementationRows(auditId: string, analysis: AuditAnalysis, createdAt: string) {
  const plan = analysis.auditResult.implementationPlan;
  return [
    ...plan.first24h.map((item) => [auditId, createdAt, analysis.url, analysis.plan || "", "first24h", item]),
    ...plan.firstWeek.map((item) => [auditId, createdAt, analysis.url, analysis.plan || "", "firstWeek", item]),
    ...plan.nextMonth.map((item) => [auditId, createdAt, analysis.url, analysis.plan || "", "nextMonth", item])
  ];
}

function buildResultsRow(auditId: string, analysis: AuditAnalysis, createdAt: string) {
  return [
    auditId,
    createdAt,
    analysis.url,
    analysis.plan || "",
    analysis.auditResult.overallScore,
    "",
    "",
    "baseline"
  ];
}

export async function saveAuditToSheets(auditId: string, analysis: AuditAnalysis) {
  if (!isConfigured()) return;

  const createdAt = new Date().toISOString();
  const accessToken = await getAccessToken();
  await ensureWorkbook(accessToken);
  const appends: SheetAppend[] = [
    {
      sheetName: "Audit Log",
      values: [buildAuditLogRow(auditId, analysis, createdAt)]
    },
    {
      sheetName: "Findings Log",
      values: buildFindingRows(auditId, analysis, createdAt)
    },
    {
      sheetName: "Implementation Log",
      values: buildImplementationRows(auditId, analysis, createdAt)
    },
    {
      sheetName: "Results After Fixes",
      values: [buildResultsRow(auditId, analysis, createdAt)]
    }
  ];

  for (const append of appends) {
    await appendRows(accessToken, append);
  }
}
