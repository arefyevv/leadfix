import { readFileSync } from "node:fs";
import path from "node:path";
import type { AuditAnalysis } from "@/types/audit";
import { AUDIT_CATEGORIES } from "@/lib/audit/config";
import { auditResultJsonSchema } from "@/lib/audit/schema";

const MAX_PAGE_TEXT_LENGTH = 14_000;
const MAX_KNOWLEDGE_LENGTH = 28_000;

function compact(value: string, maxLength = MAX_KNOWLEDGE_LENGTH) {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function readAuditFile(fileName: string) {
  return readFileSync(path.join(process.cwd(), "src", "lib", "audit", fileName), "utf8");
}

export function loadAuditKnowledge() {
  return {
    methodology: readAuditFile("methodology.md"),
    checklist: readAuditFile("audit-checklist.md"),
    criteria: readAuditFile("criteria.csv"),
    scoring: readAuditFile("scoring.md")
  };
}

export function buildAuditPrompt(analysis: AuditAnalysis) {
  const knowledge = loadAuditKnowledge();
  const pageSnapshot = {
    url: analysis.url,
    title: analysis.title,
    description: analysis.description,
    h1: analysis.h1.slice(0, 5),
    h2: analysis.h2.slice(0, 24),
    buttonsAndLinks: analysis.buttonsAndLinks.slice(0, 60),
    hasForm: analysis.hasForm,
    hasTelInput: analysis.hasTelInput,
    hasEmailInput: analysis.hasEmailInput,
    hasPhone: analysis.hasPhone,
    hasEmail: analysis.hasEmail,
    trustSignals: analysis.trustSignals,
    ctaSignals: analysis.ctaSignals,
    ruleBasedPreview: analysis.previewReport,
    pageText: compact(analysis.pageText, MAX_PAGE_TEXT_LENGTH)
  };

  const system = [
    "Ты CRO-аудитор LeadFix для лендингов российского малого и среднего бизнеса.",
    "Работай строго по методологии LeadFix и критериям ниже.",
    "Не выдумывай данные, которых нет в HTML.",
    "Если нужны реклама, Метрика, CRM, скриншоты или ручной тест, помечай пункт как needsHumanReview.",
    "Не обещай гарантированный рост продаж или конверсии.",
    "Возвращай только JSON по схеме."
  ].join(" ");

  const user = [
    "# Методология LeadFix",
    compact(knowledge.methodology),
    "",
    "# Чеклист",
    compact(knowledge.checklist, 8_000),
    "",
    "# Критерии и веса",
    compact(knowledge.criteria, 18_000),
    "",
    "# Scoring",
    compact(knowledge.scoring, 8_000),
    "",
    "# Категории и веса для расчёта",
    JSON.stringify(AUDIT_CATEGORIES),
    "",
    "# Данные сайта",
    JSON.stringify(pageSnapshot),
    "",
    "# Требование к результату",
    "Верни полный AuditResult JSON. Каждая проблема должна ссылаться на criterionId, иметь evidence, impact, complexity, confidence и needsHumanReview. Общий score должен учитывать веса категорий."
  ].join("\n");

  return {
    system,
    user,
    schema: auditResultJsonSchema
  };
}
