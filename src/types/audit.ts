export type InsightPriority = "Критично" | "Важно" | "Низкий";

export type AuditInsight = {
  title: string;
  description: string;
  priority: InsightPriority;
};

export type PreviewReport = {
  score: number;
  criticalIssues: number;
  mediumIssues: number;
  lowIssues: number;
  insights: AuditInsight[];
};

export type AuditCategoryId = "offer" | "ads" | "mobile" | "cta" | "trust" | "forms" | "structure" | "technical";
export type AuditIssueSeverity = "critical" | "high" | "medium" | "low";
export type AuditCategoryStatus = "Хорошо" | "Нормально" | "Требует внимания" | "Слабое место";

export type AuditCategoryScore = {
  categoryId: AuditCategoryId;
  title: string;
  weight: number;
  score: number;
  weightedScore: number;
  status: AuditCategoryStatus;
  summary: string;
};

export type AuditIssue = {
  id: string;
  criterionId: string;
  categoryId: AuditCategoryId;
  title: string;
  location: string;
  problem: string;
  evidence: string;
  impact: number;
  complexity: number;
  priorityScore: number;
  severity: AuditIssueSeverity;
  confidence: number;
  recommendation: string;
  example: string;
  expectedResult: string;
  needsHumanReview: boolean;
  screenshotId?: AuditScreenshotId | "none";
};

export type AuditScreenshotId = "desktop" | "mobile" | "hero" | "cases" | "trust" | "form" | "pricing" | "faq" | "cta";

export type AuditScreenshot = {
  id: AuditScreenshotId;
  url: string;
  width: number;
  height: number;
  mimeType: "image/jpeg";
};

export type AuditResult = {
  metadata: {
    methodology: string;
    version: string;
    language: "ru";
    generatedBy: "leadfix_rules" | "proxyapi";
  };
  analyzedUrl: string;
  overallScore: number;
  categoryScores: AuditCategoryScore[];
  issues: AuditIssue[];
  quickWins: string[];
  highImpactFixes: string[];
  structuralImprovements: string[];
  implementationPlan: {
    first24h: string[];
    firstWeek: string[];
    nextMonth: string[];
  };
  rewrittenExamples: string[];
  limitations: string[];
  humanReviewNeeded: string[];
  finalSummary: {
    mainConversionLoss: string;
    topPriority: string;
    expectedBusinessEffect: string;
  };
  qualityReview: {
    passed: boolean;
    score: number;
    failedChecks: string[];
    warnings: string[];
  };
};

export type AuditAnalysis = {
  url: string;
  title: string;
  description: string;
  h1: string[];
  h2: string[];
  pageText: string;
  buttonsAndLinks: string[];
  hasForm: boolean;
  hasTelInput: boolean;
  hasEmailInput: boolean;
  hasPhone: boolean;
  hasEmail: boolean;
  trustSignals: string[];
  ctaSignals: string[];
  previewReport: PreviewReport;
  auditResult: AuditResult;
  screenshots?: AuditScreenshot[];
  aiProvider?: "proxyapi";
  aiModel?: string;
};

export type AnalyzeResponse = {
  analysis: AuditAnalysis;
  previewReport: PreviewReport;
};
