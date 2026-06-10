import type { AuditResult } from "@/types/audit";

export function reviewAuditResult(result: AuditResult): AuditResult {
  const failedChecks: string[] = [];
  const warnings = [...result.qualityReview.warnings];

  const issuesWithoutEvidence = result.issues.filter((issue) => !issue.evidence.trim());
  if (issuesWithoutEvidence.length > 0) {
    failedChecks.push("У каждой проблемы должно быть evidence.");
  }

  const lowConfidenceIssues = result.issues.filter((issue) => issue.confidence < 0.7 && !issue.needsHumanReview);
  if (lowConfidenceIssues.length > 0) {
    failedChecks.push("Проблемы с confidence ниже 0.7 должны уходить в human review.");
  }

  const overpromises = [
    ...result.issues.map((issue) => issue.expectedResult),
    result.finalSummary.expectedBusinessEffect
  ].filter((value) => /гарант|точно увелич|увеличит конверсию на \d+/iu.test(value));
  if (overpromises.length > 0) {
    failedChecks.push("В отчёте нельзя обещать гарантированный рост без теста.");
  }

  if (result.issues.length < 3) {
    warnings.push("В отчёте меньше 3 проблем, проверьте полноту анализа.");
  }

  const score = Math.max(0, 100 - failedChecks.length * 18 - warnings.length * 4);

  return {
    ...result,
    qualityReview: {
      passed: failedChecks.length === 0,
      score,
      failedChecks,
      warnings
    }
  };
}
