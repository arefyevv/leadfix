import type { AuditAnalysis, AuditIssue, AuditResult } from "@/types/audit";
import { AUDIT_CATEGORIES, AUDIT_METHOD_VERSION, getCategoryStatus } from "@/lib/audit/config";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function priorityScore(impact: number, complexity: number, confidence: number, multiplier = 1) {
  return Number(((impact * confidence * multiplier) / Math.max(1, complexity)).toFixed(2));
}

function issueFromPreview(analysis: AuditAnalysis, index: number): AuditIssue {
  const insight = analysis.previewReport.insights[index];
  const title = insight?.title ?? "Требуется ручная проверка ключевого сценария";
  const isCritical = insight?.priority === "Критично";
  const categoryId = title.toLocaleLowerCase("ru-RU").includes("довер") ? "trust" : title.toLocaleLowerCase("ru-RU").includes("форм") || title.toLocaleLowerCase("ru-RU").includes("контакт") ? "forms" : title.toLocaleLowerCase("ru-RU").includes("призыв") || title.toLocaleLowerCase("ru-RU").includes("cta") ? "cta" : "offer";
  const impact = isCritical ? 5 : 4;
  const complexity = categoryId === "offer" || categoryId === "cta" ? 1 : 2;
  const confidence = insight ? 0.82 : 0.58;

  return {
    id: `issue_${String(index + 1).padStart(3, "0")}`,
    criterionId: categoryId === "cta" ? "CT-03" : categoryId === "trust" ? "TR-01" : categoryId === "forms" ? "FR-01" : "OF-03",
    categoryId,
    title,
    location: categoryId === "offer" ? "Первый экран" : categoryId === "cta" ? "Кнопки и путь к заявке" : categoryId === "forms" ? "Форма и контакты" : "Блоки доверия",
    problem: insight?.description ?? "Автоматическая проверка нашла недостаточно данных для уверенного вывода по этому критерию.",
    evidence: insight ? `Найдено rule-based проверкой: ${insight.title}.` : "Нужны скриншоты, рекламный контекст или ручная проверка страницы.",
    impact,
    complexity,
    priorityScore: priorityScore(impact, complexity, confidence, isCritical ? 1.25 : 1),
    severity: isCritical ? "critical" : "high",
    confidence,
    recommendation: insight?.description ?? "Проверить критерий вручную и добавить доказательство в отчёт перед выдачей клиенту.",
    example: categoryId === "offer" ? "Найдём, где лендинг теряет заявки, и покажем план исправлений за 48 часов." : "Получить аудит лендинга",
    expectedResult: "Пользователь быстрее понимает ценность предложения и следующий шаг к заявке.",
    needsHumanReview: confidence < 0.7
  };
}

function createFallbackIssues(analysis: AuditAnalysis) {
  const issuesCount = Math.max(3, Math.min(5, analysis.previewReport.insights.length || 3));
  return Array.from({ length: issuesCount }, (_, index) => issueFromPreview(analysis, index));
}

export function createAuditResultFromAnalysis(analysis: Omit<AuditAnalysis, "auditResult">): AuditResult {
  const issues = createFallbackIssues(analysis as AuditAnalysis);
  const issueCategoryIds = new Set(issues.map((issue) => issue.categoryId));
  const hasOnlyManualReviewIssue =
    analysis.previewReport.insights.length === 1 &&
    analysis.previewReport.insights[0]?.title === "Нужна расширенная проверка по методологии";
  const overallScore = hasOnlyManualReviewIssue ? 72 : clamp(analysis.previewReport.score, 0, 100);

  const categoryScores = AUDIT_CATEGORIES.map((category) => {
    const hasIssue = issueCategoryIds.has(category.id);
    const score = clamp(Math.round((hasIssue ? overallScore - 18 : overallScore + 8) / 10), 0, 10);
    return {
      categoryId: category.id,
      title: category.title,
      weight: category.weight,
      score,
      weightedScore: Number(((score / 10) * category.weight).toFixed(1)),
      status: getCategoryStatus(score),
      summary: hasIssue
        ? "В этой зоне найдены барьеры, которые могут снижать путь пользователя к заявке."
        : "Критичных автоматических замечаний в этой зоне не найдено, но нужна ручная проверка."
    };
  });

  const quickWins = issues
    .filter((issue) => issue.impact >= 4 && issue.complexity <= 2)
    .map((issue) => issue.recommendation)
    .slice(0, 5);

  return {
    metadata: {
      methodology: "LeadFix Conversion Audit Method",
      version: AUDIT_METHOD_VERSION,
      language: "ru",
      generatedBy: "leadfix_rules"
    },
    analyzedUrl: analysis.url,
    overallScore,
    categoryScores,
    issues,
    quickWins: quickWins.length ? quickWins : ["Проверить первый экран, CTA и форму заявки вручную."],
    highImpactFixes: issues.filter((issue) => issue.impact >= 4).map((issue) => issue.title).slice(0, 5),
    structuralImprovements: ["Сверить порядок блоков с логикой: оффер, польза, доказательства, условия, CTA."],
    implementationPlan: {
      first24h: quickWins.slice(0, 3).length ? quickWins.slice(0, 3) : ["Собрать список критичных правок первого экрана и CTA."],
      firstWeek: ["Усилить доказательства, форму заявки и блоки возражений."],
      nextMonth: ["Проверить внедрение по Метрике, заявкам и ручному прохождению мобильного сценария."]
    },
    rewrittenExamples: ["Заменить общий оффер на формулу: кому + какой результат + за счёт чего."],
    limitations: [
      "HTML-анализ не заменяет A/B-тест и данные Яндекс Метрики.",
      "Без рекламных объявлений соответствие трафику оценивается как гипотеза.",
      "Мобильная версия и визуальные наложения требуют проверки по скриншотам."
    ],
    humanReviewNeeded: ["Проверить мобильный первый экран, клики по CTA, отправку формы и цели аналитики."],
    finalSummary: {
      mainConversionLoss: issues[0]?.title ?? "Нужна ручная проверка главного сценария заявки.",
      topPriority: issues[0]?.recommendation ?? "Проверить первый экран, CTA и форму.",
      expectedBusinessEffect: "Правки должны снизить трение на пути к заявке, но фактический эффект зависит от трафика, ниши и внедрения."
    },
    qualityReview: {
      passed: issues.every((issue) => issue.evidence && issue.confidence >= 0.5),
      score: issues.every((issue) => issue.evidence) ? 82 : 64,
      failedChecks: issues.some((issue) => !issue.evidence) ? ["У части проблем нет evidence."] : [],
      warnings: ["Fallback-отчёт собран без скриншотов и без данных рекламы."]
    }
  };
}
