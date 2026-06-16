import { AUDIT_CATEGORIES } from "@/lib/audit/config";

const categoryIds = AUDIT_CATEGORIES.map((category) => category.id);
const categoryTitles = AUDIT_CATEGORIES.map((category) => category.title);

export const auditResultJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "overallScore",
    "categoryScores",
    "issues",
    "quickWins",
    "highImpactFixes",
    "structuralImprovements",
    "implementationPlan",
    "rewrittenExamples",
    "limitations",
    "humanReviewNeeded",
    "finalSummary",
    "qualityReview"
  ],
  properties: {
    overallScore: { type: "integer", minimum: 0, maximum: 100 },
    categoryScores: {
      type: "array",
      minItems: AUDIT_CATEGORIES.length,
      maxItems: AUDIT_CATEGORIES.length,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["categoryId", "title", "weight", "score", "weightedScore", "status", "summary"],
        properties: {
          categoryId: { type: "string", enum: categoryIds },
          title: { type: "string", enum: categoryTitles },
          weight: { type: "integer", minimum: 0, maximum: 100 },
          score: { type: "integer", minimum: 0, maximum: 10 },
          weightedScore: { type: "number", minimum: 0, maximum: 100 },
          status: { type: "string", enum: ["Хорошо", "Нормально", "Требует внимания", "Слабое место"] },
          summary: { type: "string", minLength: 20, maxLength: 260 }
        }
      }
    },
    issues: {
      type: "array",
      minItems: 3,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "id",
          "criterionId",
          "categoryId",
          "title",
          "location",
          "problem",
          "evidence",
          "impact",
          "complexity",
          "priorityScore",
          "severity",
          "confidence",
          "recommendation",
          "example",
          "expectedResult",
          "needsHumanReview",
          "screenshotId"
        ],
        properties: {
          id: { type: "string", pattern: "^issue_[0-9]{3}$" },
          criterionId: { type: "string", pattern: "^[A-Z]{2}-[0-9]{2}$" },
          categoryId: { type: "string", enum: categoryIds },
          title: { type: "string", minLength: 8, maxLength: 120 },
          location: { type: "string", minLength: 4, maxLength: 120 },
          problem: { type: "string", minLength: 30, maxLength: 360 },
          evidence: { type: "string", minLength: 20, maxLength: 360 },
          impact: { type: "integer", minimum: 1, maximum: 5 },
          complexity: { type: "integer", minimum: 1, maximum: 5 },
          priorityScore: { type: "number", minimum: 0, maximum: 10 },
          severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
          confidence: { type: "number", minimum: 0, maximum: 1 },
          recommendation: { type: "string", minLength: 30, maxLength: 360 },
          example: { type: "string", minLength: 10, maxLength: 260 },
          expectedResult: { type: "string", minLength: 20, maxLength: 220 },
          needsHumanReview: { type: "boolean" },
          screenshotId: { type: "string", enum: ["desktop", "mobile", "hero", "cases", "trust", "form", "pricing", "faq", "cta", "none"] }
        }
      }
    },
    quickWins: { type: "array", minItems: 1, maxItems: 8, items: { type: "string", minLength: 8, maxLength: 180 } },
    highImpactFixes: { type: "array", minItems: 1, maxItems: 8, items: { type: "string", minLength: 8, maxLength: 180 } },
    structuralImprovements: { type: "array", minItems: 1, maxItems: 8, items: { type: "string", minLength: 8, maxLength: 180 } },
    implementationPlan: {
      type: "object",
      additionalProperties: false,
      required: ["first24h", "firstWeek", "nextMonth"],
      properties: {
        first24h: { type: "array", minItems: 1, maxItems: 5, items: { type: "string", minLength: 8, maxLength: 180 } },
        firstWeek: { type: "array", minItems: 1, maxItems: 5, items: { type: "string", minLength: 8, maxLength: 180 } },
        nextMonth: { type: "array", minItems: 1, maxItems: 5, items: { type: "string", minLength: 8, maxLength: 180 } }
      }
    },
    rewrittenExamples: { type: "array", minItems: 1, maxItems: 5, items: { type: "string", minLength: 10, maxLength: 240 } },
    limitations: { type: "array", minItems: 1, maxItems: 6, items: { type: "string", minLength: 10, maxLength: 220 } },
    humanReviewNeeded: { type: "array", minItems: 1, maxItems: 6, items: { type: "string", minLength: 10, maxLength: 220 } },
    finalSummary: {
      type: "object",
      additionalProperties: false,
      required: ["mainConversionLoss", "topPriority", "expectedBusinessEffect"],
      properties: {
        mainConversionLoss: { type: "string", minLength: 20, maxLength: 260 },
        topPriority: { type: "string", minLength: 20, maxLength: 220 },
        expectedBusinessEffect: { type: "string", minLength: 20, maxLength: 220 }
      }
    },
    qualityReview: {
      type: "object",
      additionalProperties: false,
      required: ["passed", "score", "failedChecks", "warnings"],
      properties: {
        passed: { type: "boolean" },
        score: { type: "integer", minimum: 0, maximum: 100 },
        failedChecks: { type: "array", maxItems: 8, items: { type: "string", minLength: 4, maxLength: 180 } },
        warnings: { type: "array", maxItems: 8, items: { type: "string", minLength: 4, maxLength: 180 } }
      }
    }
  }
} as const;
