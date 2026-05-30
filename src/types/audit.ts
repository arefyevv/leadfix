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
};

export type AnalyzeResponse = {
  analysis: AuditAnalysis;
  previewReport: PreviewReport;
};
