"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { AuditAnalysis, AuditResult } from "@/types/audit";

type FullReportProps = {
  analysis: AuditAnalysis;
  reportDate: string;
};

type AuditStatus = "Хорошо" | "Требует внимания" | "Слабое место";

type AuditDirection = {
  title: string;
  score: number;
  status: AuditStatus;
  summary: string;
  categories: string[];
  recommendation: string;
};

type DetailedIssue = {
  title: string;
  priority: "Критично" | "Важно";
  category: string;
  location: string;
  problem: string;
  impact: string;
  fix: string;
  example: string;
  effort: "Низкая" | "Средняя";
  effect: string;
  screenshot: {
    title: string;
    note: string;
    markers: string[];
  };
};

type ScoreRow = {
  category: string;
  score: number;
  status: "Хорошо" | "Нормально" | "Требует внимания" | "Слабое место";
  priority: "Высокий" | "Средний" | "Низкий";
};

const reportScore = 74;

const scoreLevels = [
  { range: "0–39", title: "Критический риск", tone: "critical", summary: "Лендинг не готов к рекламе. Бюджет, скорее всего, сливается." },
  { range: "40–59", title: "Слабая готовность", tone: "weak", summary: "Есть база, но много барьеров для заявки. Нужны правки до масштабирования." },
  { range: "60–74", title: "Средняя готовность", tone: "medium", summary: "Лендинг может давать заявки, но часть трафика теряется из-за заметных проблем." },
  { range: "75–89", title: "Хорошая готовность", tone: "good", summary: "Можно вести трафик. Есть точки роста, но критичных провалов мало." },
  { range: "90–100", title: "Сильная готовность", tone: "strong", summary: "Лендинг хорошо подготовлен к рекламе. Нужны точечные улучшения и A/B-тесты." }
] as const;

const auditGroups = [
  {
    title: "Оффер и понимание предложения",
    description: "Понимает ли пользователь, что ему предлагают, для кого это решение и какую выгоду он получит.",
    items: ["УТП и главное предложение", "Первый экран", "Оффер", "Целевая аудитория", "Боли и потребности клиента"]
  },
  {
    title: "Доверие и доказательства",
    description: "Достаточно ли у пользователя оснований поверить компании и не откладывать обращение.",
    items: ["Доверие и экспертность", "Отзывы, кейсы и результаты", "Возражения клиентов", "Гарантии и снижение риска", "Ценообразование и тарифы"]
  },
  {
    title: "Конверсионные действия",
    description: "Насколько легко и понятно пользователю совершить целевое действие: нажать кнопку, заполнить форму и оставить заявку.",
    items: ["Призывы к действию", "Формы захвата", "Мотивация к действию", "Конверсионные барьеры"]
  },
  {
    title: "Структура, текст и визуал",
    description: "Насколько страница логично, понятно и убедительно подаёт информацию.",
    items: ["Структура лендинга", "Продающий текст и читаемость", "Визуальное оформление"]
  },
  {
    title: "UX и техническое качество",
    description: "Не мешает ли сайт пользователю технически и интерфейсно: на мобильных устройствах, при загрузке и при взаимодействии с элементами.",
    items: ["Мобильная версия", "Скорость загрузки", "UX и удобство взаимодействия", "Технические ошибки"]
  },
  {
    title: "Реклама и аналитика",
    description: "Насколько лендинг соответствует ожиданиям пользователя после клика по рекламе и можно ли измерять заявки из Яндекс Директа.",
    items: ["Соответствие трафику из Яндекс Директа", "Аналитика и отслеживание конверсий"]
  }
];

const scoreRows: ScoreRow[] = [
  ["УТП и главное предложение", 72, "Требует внимания", "Высокий"],
  ["Первый экран", 68, "Требует внимания", "Высокий"],
  ["Оффер", 70, "Требует внимания", "Высокий"],
  ["Целевая аудитория", 76, "Нормально", "Средний"],
  ["Боли и потребности клиента", 69, "Требует внимания", "Высокий"],
  ["Доверие и экспертность", 70, "Требует внимания", "Высокий"],
  ["Отзывы, кейсы и результаты", 60, "Слабое место", "Высокий"],
  ["Призывы к действию", 76, "Нормально", "Средний"],
  ["Формы захвата", 84, "Хорошо", "Низкий"],
  ["Возражения клиентов", 66, "Требует внимания", "Средний"],
  ["Гарантии и снижение риска", 60, "Слабое место", "Средний"],
  ["Ценообразование и тарифы", 78, "Нормально", "Средний"],
  ["Структура лендинга", 82, "Хорошо", "Низкий"],
  ["Продающий текст и читаемость", 72, "Требует внимания", "Средний"],
  ["Визуальное оформление", 79, "Нормально", "Низкий"],
  ["Мобильная версия", 58, "Слабое место", "Высокий"],
  ["Скорость загрузки", 74, "Нормально", "Средний"],
  ["UX и удобство взаимодействия", 72, "Требует внимания", "Средний"],
  ["Конверсионные барьеры", 65, "Требует внимания", "Высокий"],
  ["Мотивация к действию", 61, "Требует внимания", "Средний"],
  ["Соответствие трафику из Яндекс Директа", 64, "Требует внимания", "Высокий"],
  ["Аналитика и отслеживание конверсий", 55, "Слабое место", "Высокий"],
  ["Технические ошибки", 81, "Хорошо", "Низкий"]
].map(([category, score, status, priority]) => ({ category, score, status, priority })) as ScoreRow[];

const quickImprovements = [
  "Переписать главный заголовок первого экрана.",
  "Уточнить подзаголовок через конкретную выгоду.",
  "Сделать CTA более понятным и прямым.",
  "Добавить пояснение рядом с кнопкой: что произойдёт после клика.",
  "Добавить 2–3 доказательства доверия рядом с формой.",
  "Сократить форму до минимального количества полей.",
  "Проверить мобильный сценарий от первого экрана до заявки.",
  "Настроить цели в Яндекс Метрике на формы, кнопки, телефон и мессенджеры.",
  "Сравнить первый экран с основными объявлениями в Яндекс Директе."
];

const executiveSummary = [
  "Лендинг можно использовать для платного трафика только с ограничениями: критичных технических провалов нет, но часть заявок теряется на уровне смысла и доверия.",
  "Главный риск — пользователь не считывает конкретный результат и следующий шаг достаточно быстро после клика по рекламе.",
  "Сначала нужно усилить первый экран, CTA, доказательства рядом с формой и мобильный путь до заявки."
];

const topProblems = [
  { title: "Оффер недостаточно конкретный", area: "Первый экран", impact: "Пользователь не понимает выгоду за 5 секунд.", tone: "critical" },
  { title: "CTA не объясняет следующий шаг", area: "Кнопки и форма", impact: "Перед кликом остаётся лишнее сомнение.", tone: "critical" },
  { title: "Доверие не поддерживает заявку", area: "Отзывы / кейсы / форма", impact: "Нет быстрых доказательств перед обращением.", tone: "important" }
];

const pageMapItems = [
  { index: "01", title: "Первый экран", note: "Уточнить результат, аудиторию и связь с рекламным запросом.", tone: "critical" },
  { index: "02", title: "CTA и форма", note: "Пояснить, что произойдёт после клика и убрать лишнее трение.", tone: "critical" },
  { index: "03", title: "Доверие", note: "Добавить кейсы, цифры результата и ответы на возражения.", tone: "important" },
  { index: "04", title: "Мобильный путь", note: "Проверить видимость CTA, размеры кнопок и заполнение формы.", tone: "important" }
];

const specialistTasks = [
  {
    role: "Дизайнер",
    tasks: ["Пересобрать первый экран вокруг одного главного обещания.", "Усилить визуальную иерархию CTA, формы и доказательств.", "Проверить мобильные состояния ключевых блоков."]
  },
  {
    role: "Копирайтер / маркетолог",
    tasks: ["Переписать заголовок и подзаголовок через конкретный результат.", "Добавить блок возражений и доказательств рядом с точками решения.", "Согласовать текст первого экрана с рекламными объявлениями."]
  },
  {
    role: "Разработчик / Tilda",
    tasks: ["Сократить форму и добавить пояснение следующего шага.", "Проверить адаптив на 360–430 px.", "Убедиться, что клики по кнопкам, телефону и мессенджерам отслеживаются."]
  },
  {
    role: "Директолог / аналитик",
    tasks: ["Сверить объявления с первым экраном.", "Настроить цели в Метрике на все ключевые действия.", "После правок запустить повторный аудит и сравнить score."]
  }
];

const implementationPriorities = [
  {
    title: "Высокий приоритет",
    tone: "high",
    items: ["Усилить УТП и первый экран.", "Согласовать первый экран с рекламными объявлениями.", "Добавить конкретику в оффер.", "Усилить доверие: отзывы, кейсы, данные компании.", "Проверить мобильную версию.", "Настроить цели аналитики.", "Устранить конверсионные барьеры перед формой."]
  },
  {
    title: "Средний приоритет",
    tone: "medium",
    items: ["Переписать блок выгод.", "Добавить FAQ с ответами на возражения.", "Улучшить продающий текст.", "Добавить больше кейсов и результатов.", "Улучшить UX-сценарий страницы.", "Проверить скорость загрузки."]
  },
  {
    title: "Низкий приоритет",
    tone: "low",
    items: ["Доработать визуальные акценты.", "Добавить дополнительные отзывы.", "Расширить блок доверия и экспертности.", "Проверить корректность мотивации к действию.", "Протестировать альтернативные формулировки CTA."]
  }
];

const auditDirections: AuditDirection[] = [
  {
    title: "Оффер и понимание предложения",
    score: 71,
    status: "Требует внимания",
    summary: "Пользователь понимает направление предложения, но ценность и отличие от конкурентов считываются недостаточно быстро.",
    categories: ["УТП и главное предложение", "Первый экран", "Оффер", "Целевая аудитория", "Боли и потребности клиента"],
    recommendation: "Уточнить результат для клиента на первом экране и связать его с конкретной потребностью аудитории."
  },
  {
    title: "Доверие и доказательства",
    score: 67,
    status: "Слабое место",
    summary: "Лендингу не хватает убедительных доказательств, которые снижают сомнение перед обращением.",
    categories: ["Доверие и экспертность", "Отзывы, кейсы и результаты", "Возражения клиентов", "Гарантии и снижение риска", "Ценообразование и тарифы"],
    recommendation: "Добавить реальные кейсы, цифры результата и ответы на возражения рядом с точками принятия решения."
  },
  {
    title: "Конверсионные действия",
    score: 72,
    status: "Требует внимания",
    summary: "Форма работает, но CTA и путь к заявке можно сделать яснее и прямее.",
    categories: ["Призывы к действию", "Формы захвата", "Мотивация к действию", "Конверсионные барьеры"],
    recommendation: "Оставить один основной CTA, пояснить следующий шаг и убрать лишнее трение перед отправкой формы."
  },
  {
    title: "Структура, текст и визуал",
    score: 78,
    status: "Хорошо",
    summary: "Базовая структура страницы собрана корректно, но отдельные аргументы можно подать конкретнее.",
    categories: ["Структура лендинга", "Продающий текст и читаемость", "Визуальное оформление"],
    recommendation: "Сократить общие формулировки, усилить иерархию блоков и сохранить фокус на одном действии."
  },
  {
    title: "UX и техническое качество",
    score: 71,
    status: "Требует внимания",
    summary: "Главный риск находится в мобильном сценарии: его нужно проверить вручную до масштабирования рекламы.",
    categories: ["Мобильная версия", "Скорость загрузки", "UX и удобство взаимодействия", "Технические ошибки"],
    recommendation: "Пройти путь заявки на смартфоне, проверить скорость загрузки и работу интерактивных элементов."
  },
  {
    title: "Реклама и аналитика",
    score: 60,
    status: "Слабое место",
    summary: "Нужно проверить совпадение рекламных обещаний с первым экраном и корректность отслеживания заявок.",
    categories: ["Соответствие трафику из Яндекс Директа", "Аналитика и отслеживание конверсий"],
    recommendation: "Сопоставить объявления с оффером лендинга и настроить цели Метрики на все ключевые действия."
  }
];

function getDetailedIssues(): DetailedIssue[] {
  return [
    {
      title: "Главное предложение требует большей конкретики",
      priority: "Критично",
      category: "УТП и первый экран",
      location: "Первый экран, заголовок и подзаголовок",
      problem: "Главный заголовок описывает направление, но не показывает конкретный результат для клиента.",
      impact: "Пользователь из рекламы принимает решение за несколько секунд. Если он не понимает выгоду сразу, вероятность ухода со страницы растёт.",
      fix: "Переписать заголовок по формуле: кому + какой результат + за счёт чего.",
      example: "Было: «Работаем каждый день, но его конкуренты уже получают больше заявок». Стало: «Найдём, почему лендинг теряет заявки из Яндекс Директа, и покажем, что исправить в первую очередь».",
      effort: "Средняя",
      effect: "Выше понимание предложения и меньше отказов после клика.",
      screenshot: {
        title: "Скрин первого экрана",
        note: "Проблемную зону нужно отметить на заголовке, подзаголовке и первом CTA.",
        markers: ["Заголовок", "Выгода", "CTA"]
      }
    },
    {
      title: "Основной CTA не объясняет следующий шаг",
      priority: "Критично",
      category: "CTA и формы",
      location: "Основные кнопки и форма заявки",
      problem: "Кнопка заметна, но формулировка не показывает, что именно получит пользователь после клика.",
      impact: "Неясный следующий шаг увеличивает сомнение перед заявкой и снижает кликабельность основной кнопки.",
      fix: "Сделать CTA прямым и добавить рядом короткое пояснение результата отправки формы.",
      example: "CTA: «Получить разбор лендинга». Пояснение: «Покажем основные точки потери заявок и приоритеты исправлений».",
      effort: "Низкая",
      effect: "Больше кликов по основной кнопке и меньше сомнений перед формой.",
      screenshot: {
        title: "Скрин CTA / формы",
        note: "На скрине нужно показать кнопку, поля формы и подпись следующего шага.",
        markers: ["Кнопка", "Поля", "Пояснение"]
      }
    },
    {
      title: "Недостаточно доказательств рядом с формой",
      priority: "Важно",
      category: "Доверие",
      location: "Блок доверия и зона перед отправкой заявки",
      problem: "Отзывы, кейсы и цифры результата не поддерживают пользователя в момент принятия решения.",
      impact: "Пользователь не получает подтверждений компетентности компании и откладывает отправку заявки.",
      fix: "Добавить рядом с формой 2–3 коротких доказательства: цифру результата, кейс и отзыв с контекстом.",
      example: "Разместить рядом с формой: «+28% к конверсии после переработки первого экрана» и короткую цитату клиента.",
      effort: "Средняя",
      effect: "Выше доверие в момент принятия решения.",
      screenshot: {
        title: "Скрин блока доверия",
        note: "Нужно отметить места, где должны появиться кейсы, цифры и отзыв.",
        markers: ["Кейс", "Цифра", "Отзыв"]
      }
    },
    {
      title: "Мобильный сценарий требует ручной проверки",
      priority: "Важно",
      category: "Мобильная версия",
      location: "Мобильный первый экран и форма",
      problem: "Нужно проверить первый экран, CTA и заполнение формы на ширине 360 пикселей.",
      impact: "Часть рекламного трафика приходит со смартфонов. Лишняя прокрутка или неудобная форма напрямую сокращают количество заявок.",
      fix: "Пройти путь пользователя на телефоне: объявление, первый экран, CTA, форма, подтверждение заявки.",
      example: "Основная кнопка должна быть видна без лишней прокрутки, а форма содержать только обязательные поля.",
      effort: "Средняя",
      effect: "Меньше потерь мобильного трафика до заявки.",
      screenshot: {
        title: "Мобильный скрин",
        note: "Показать первый экран и форму на ширине 360–390 px.",
        markers: ["Первый экран", "CTA", "Форма"]
      }
    }
  ];
}

function getReportStatus(score: number): AuditStatus {
  if (score <= 4) return "Слабое место";
  if (score <= 7) return "Требует внимания";
  return "Хорошо";
}

function getPriorityByScore(score: number): ScoreRow["priority"] {
  if (score <= 5) return "Высокий";
  if (score <= 7) return "Средний";
  return "Низкий";
}

function getDetailedIssuesFromAuditResult(auditResult: AuditResult): DetailedIssue[] {
  const issues = auditResult.issues.length > 0 ? auditResult.issues : [];
  if (issues.length === 0) return getDetailedIssues();

  return issues.slice(0, 6).map((issue) => ({
    title: issue.title,
    priority: issue.severity === "critical" ? "Критично" : "Важно",
    category: auditResult.categoryScores.find((category) => category.categoryId === issue.categoryId)?.title ?? issue.categoryId,
    location: issue.location,
    problem: issue.problem,
    impact: issue.evidence,
    fix: issue.recommendation,
    example: issue.example,
    effort: issue.complexity <= 2 ? "Низкая" : "Средняя",
    effect: issue.expectedResult,
    screenshot: {
      title: `Зона проверки: ${issue.location}`,
      note: issue.needsHumanReview ? "Нужна ручная проверка или скриншот этой зоны." : issue.evidence,
      markers: [issue.criterionId, issue.severity === "critical" ? "Критично" : "Проверить"]
    }
  }));
}

export function FullReport({ analysis, reportDate }: FullReportProps) {
  const auditResult = analysis.auditResult;
  const reportScore = auditResult.overallScore;
  const detailedIssues = getDetailedIssuesFromAuditResult(auditResult);
  const scoreRows: ScoreRow[] = auditResult.categoryScores.map((category) => ({
    category: category.title,
    score: category.score * 10,
    status: category.status,
    priority: getPriorityByScore(category.score)
  }));
  const quickImprovements = auditResult.quickWins;
  const executiveSummary = [
    auditResult.finalSummary.mainConversionLoss,
    auditResult.finalSummary.topPriority,
    auditResult.finalSummary.expectedBusinessEffect
  ];
  const topProblems = auditResult.issues.slice(0, 3).map((issue) => ({
    title: issue.title,
    area: issue.location,
    impact: issue.problem,
    tone: issue.severity === "critical" ? "critical" : "important"
  }));
  const pageMapItems = auditResult.issues.slice(0, 4).map((issue, index) => ({
    index: String(index + 1).padStart(2, "0"),
    title: issue.location,
    note: issue.recommendation,
    tone: issue.severity === "critical" ? "critical" : "important"
  }));
  const implementationPriorities = [
    { title: "Высокий приоритет", tone: "high", items: auditResult.implementationPlan.first24h },
    { title: "Средний приоритет", tone: "medium", items: auditResult.implementationPlan.firstWeek },
    { title: "Низкий приоритет", tone: "low", items: auditResult.implementationPlan.nextMonth }
  ];
  const auditDirections: AuditDirection[] = auditResult.categoryScores.map((category) => ({
    title: category.title,
    score: category.score * 10,
    status: getReportStatus(category.score),
    summary: category.summary,
    categories: [category.title],
    recommendation: auditResult.issues.find((issue) => issue.categoryId === category.categoryId)?.recommendation ?? "Критичных замечаний не найдено, нужна ручная проверка по скриншотам."
  }));
  const firstPriority = auditResult.issues[0]?.location || "Оффер и CTA";
  const lossZones = auditResult.issues.slice(0, 4).map((issue) => issue.location).join(", ") || firstPriority;
  const criticalIssuesCount = auditResult.issues.filter((issue) => issue.severity === "critical").length;
  const highIssuesCount = auditResult.issues.filter((issue) => issue.severity === "high").length;
  const trafficVerdict = reportScore >= 80 && criticalIssuesCount === 0
    ? {
      title: "Да, можно запускать с точечными правками",
      summary: auditResult.finalSummary.expectedBusinessEffect
    }
    : reportScore >= 60
      ? {
        title: "Да, но только после приоритетных правок",
        summary: auditResult.finalSummary.topPriority
      }
      : {
        title: "Нет, сначала закрыть критичные барьеры",
        summary: auditResult.finalSummary.mainConversionLoss
      };
  const potentialLift = criticalIssuesCount > 0 ? "+15–35%" : highIssuesCount > 0 ? "+10–25%" : "+5–15%";
  const specialistTasksDynamic = [
    {
      role: "Дизайнер",
      tasks: auditResult.structuralImprovements.slice(0, 3)
    },
    {
      role: "Маркетолог / копирайтер",
      tasks: [...auditResult.rewrittenExamples, ...auditResult.highImpactFixes].slice(0, 3)
    },
    {
      role: "Разработчик / Tilda-специалист",
      tasks: [...auditResult.implementationPlan.first24h, ...auditResult.humanReviewNeeded].slice(0, 3)
    }
  ].filter((group) => group.tasks.length > 0);
  const providerLabel = analysis.aiProvider
    ? `ProxyAPI / ${analysis.aiModel || "модель не указана"}`
    : "LeadFix rules";
  const siteHeading = analysis.h1[0] || "УТП сайта не найдено в H1";
  const displayUrl = analysis.url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  const activeScoreLevel = getScoreLevel(reportScore);
  const [isReportLinkCopied, setIsReportLinkCopied] = useState(false);

  function copyReportLink() {
    const reportUrl = typeof window !== "undefined" ? window.location.href : analysis.url;
    void navigator.clipboard?.writeText(reportUrl);
    setIsReportLinkCopied(true);
    window.setTimeout(() => setIsReportLinkCopied(false), 1800);
  }

  return (
    <section className="full-report full-audit full-audit-document screen">
      <div className="full-report__inner full-audit__layout">
        <aside className="full-audit-sidebar">
          <section className="full-audit-sidebar__site">
            <div className="full-audit-sidebar__meta">
              <div><span>Дата аудита</span><b>{reportDate}</b></div>
              <div><span>Адрес сайта</span><a href={analysis.url} target="_blank" rel="noreferrer">{analysis.url}</a></div>
              <div><span>УТП сайта</span><b>{siteHeading}</b></div>
            </div>
            <div className="full-audit-sidebar__actions">
              <button className="pdf-button" type="button" onClick={() => window.print()}>Скачать PDF</button>
              <button className="telegram-button" type="button" onClick={copyReportLink}>
                {isReportLinkCopied ? "Ссылка скопирована" : "Скопировать ссылку на отчёт"}
              </button>
            </div>
          </section>
        </aside>

        <main className="full-audit-content">
          <header className="full-audit-content__hero">
            <p className="full-audit__eyebrow">Полный отчёт LeadFix</p>
            <h2>
              <span>Полный отчёт конверсии </span>
              <span className="preview-report__title-url">{displayUrl}</span>
            </h2>
            <div className="full-audit-content__hero-metrics">
              <div><span>Первый приоритет</span><b>{firstPriority}</b></div>
              <div><span>Контроль качества</span><b>{auditResult.qualityReview.score}/100</b></div>
              <div><span>Источник анализа</span><b>{providerLabel}</b></div>
            </div>
          </header>

          <section className="full-audit-content__score readiness-score" aria-label="Готовность лендинга к платному трафику">
            <div className={`readiness-score__gauge is-${activeScoreLevel.tone}`}>
              <div className="readiness-score__arc" style={{ "--score": reportScore } as CSSProperties}>
                <svg viewBox="0 0 300 172" role="img" aria-label={`Оценка ${reportScore} из 100`}>
                  <defs>
                    <linearGradient id="readiness-arc-gradient" x1="24" y1="0" x2="276" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f25d58" />
                      <stop offset="52%" stopColor="#f6c04e" />
                      <stop offset="100%" stopColor="#35c76f" />
                    </linearGradient>
                  </defs>
                  <path className="readiness-score__arc-track" d="M24 148 A126 126 0 0 1 276 148" pathLength="100" />
                  <path className="readiness-score__arc-progress" d="M24 148 A126 126 0 0 1 276 148" pathLength="100" />
                  <g className="readiness-score__arc-ticks" aria-hidden="true">
                    <text x="18" y="170">0</text>
                    <text x="72" y="30">40</text>
                    <text x="150" y="10">60</text>
                    <text x="228" y="30">80</text>
                    <text x="282" y="170">100</text>
                  </g>
                </svg>
                <strong>{reportScore}</strong>
              </div>
              <p>Готовность к платному трафику</p>
            </div>
            <div className="readiness-score__verdict">
              <p className="full-audit__eyebrow">Общая оценка</p>
              <h2>{activeScoreLevel.title}</h2>
              <p>{activeScoreLevel.summary}</p>
              <p>Главные зоны потерь: {lossZones}.</p>
              <div className="readiness-score__scale" style={{ "--score-position": `${reportScore}%` } as CSSProperties} aria-label="Шкала общей оценки">
                <div className="readiness-score__scale-track">
                  <span className="readiness-score__scale-marker"><b>{reportScore}</b></span>
                </div>
                <div className="readiness-score__scale-labels" aria-hidden="true">
                  {scoreLevels.map((level) => (
                    <span className={level.title === activeScoreLevel.title ? "is-active" : ""} key={level.title}>
                      <b>{level.range}</b>
                      {level.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <dl className="readiness-score__metrics">
              {auditDirections.map((direction) => (
                <div key={direction.title}>
                  <dt>{direction.title}</dt>
                  <dd>{direction.score}</dd>
                  <span style={{ "--value": `${direction.score}%` } as CSSProperties} />
                </div>
              ))}
            </dl>
          </section>

          <section className="full-audit__section full-audit__executive">
            <SectionHeading eyebrow="Короткий вывод" title="Что происходит с лендингом" />
            <div className="full-audit__executive-grid">
              {executiveSummary.map((item, index) => (
                <article key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
            <div className="full-audit__traffic-verdict">
              <b>Можно лить трафик?</b>
              <strong>{trafficVerdict.title}</strong>
              <p>{trafficVerdict.summary}</p>
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Сначала исправить" title="Топ проблем и быстрые победы" />
            <div className="full-audit__top-grid">
              <div className="full-audit__top-problems">
                {topProblems.map((item, index) => (
                  <article className={`is-${item.tone}`} key={item.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <b>{item.area}</b>
                      <h3>{item.title}</h3>
                      <p>{item.impact}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="full-audit__quick-panel">
                <h3>Быстрые победы на 1–2 дня</h3>
                <ul>
                  {quickImprovements.slice(0, 5).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Визуальная привязка" title="Карта проблемных блоков лендинга" />
            <p className="full-audit__lead">В финальном отчёте каждый пункт должен быть привязан к конкретному скриншоту блока. Ниже — структура таких скриншотов: зона страницы, маркер проблемы и действие.</p>
            <div className="full-audit__page-map">
              {pageMapItems.map((item) => (
                <article className={`is-${item.tone}`} key={item.title}>
                  <ScreenshotFrame title={item.title} markers={[item.index, item.tone === "critical" ? "Проблема" : "Усилить"]} />
                  <div>
                    <span>{item.index}</span>
                    <h3>{item.title}</h3>
                    <p>{item.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="6 направлений" title="Итоги по ключевым категориям аудита" />
            <p className="full-audit__lead">Это главный каркас отчёта: от оффера и соответствия рекламе до доверия, CTA и мобильного сценария.</p>
            <div className="full-audit__categories">
              {auditDirections.map((direction, index) => (
                <article className="full-audit-category" key={direction.title}>
                  <div className="full-audit-category__top">
                    <div>
                      <span className="full-audit-category__index">{String(index + 1).padStart(2, "0")}</span>
                      <h3>{direction.title}</h3>
                    </div>
                    <strong>{direction.score}<small>/100</small></strong>
                  </div>
                  <span className={`full-audit__status status-${direction.status === "Хорошо" ? "good" : direction.status === "Слабое место" ? "critical" : "attention"}`}>{direction.status}</span>
                  <p>{direction.summary}</p>
                  <div className="full-audit-category__scores">
                    {direction.categories.map((category) => {
                      const score = scoreRows.find((row) => row.category === category);
                      return <div key={category}><span>{category}</span><b>{score?.score ?? "—"}<small>/100</small></b></div>;
                    })}
                  </div>
                  <div className="full-audit-category__recommendation"><b>Что исправить</b><span>{direction.recommendation}</span></div>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Подробный разбор" title="Карточки проблем со скриншотами" />
            <div className="full-audit__issues">
              {detailedIssues.map((issue, index) => (
                <article className={issue.priority === "Критично" ? "full-audit-issue is-critical" : "full-audit-issue"} key={`${issue.title}-${index}`}>
                  <div className="full-audit-issue__index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="full-audit-issue__body">
                    <div className="full-audit-issue__head">
                      <div>
                        <span>{issue.category}</span>
                        <h3>{issue.title}</h3>
                      </div>
                      <b>{issue.priority}</b>
                    </div>
                    <div className="full-audit-issue__location">
                      <span>Где на странице</span>
                      <b>{issue.location}</b>
                    </div>
                    <div className="full-audit-issue__analysis">
                      <ScreenshotFrame title={issue.screenshot.title} note={issue.screenshot.note} markers={issue.screenshot.markers} />
                      <div className="full-audit-issue__grid">
                        <div><b>Что не так</b><p>{issue.problem}</p></div>
                        <div><b>Почему влияет на заявки</b><p>{issue.impact}</p></div>
                        <div><b>Что исправить</b><p>{issue.fix}</p></div>
                        <div><b>Пример улучшения</b><p>{issue.example}</p></div>
                      </div>
                    </div>
                    <div className="full-audit-issue__meta">
                      <div><span>Сложность</span><b>{issue.effort}</b></div>
                      <div><span>Ожидаемый эффект</span><b>{issue.effect}</b></div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Порядок работ" title="Приоритетный план внедрения" />
            <div className="full-audit__implementation">
              {implementationPriorities.map((group) => (
                <article className={`is-${group.tone}`} key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Кому передать" title="Задачи для специалистов" />
            <div className="full-audit__specialists">
              {(specialistTasksDynamic.length > 0 ? specialistTasksDynamic : specialistTasks).map((group) => (
                <article key={group.role}>
                  <h3>{group.role}</h3>
                  <ul>{group.tasks.map((task) => <li key={task}>{task}</li>)}</ul>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section">
            <details className="full-audit__details">
              <summary>
                <span>Все категории</span>
                <b>Полная таблица оценок</b>
              </summary>
              <div className="full-audit__score-table">
                <div className="full-audit__score-table-head">
                  <span>Категория</span><span>Оценка</span><span>Статус</span><span>Приоритет</span>
                </div>
                {scoreRows.map((row) => (
                  <article className="full-audit__score-row" key={row.category}>
                    <b>{row.category}</b>
                    <strong>{row.score}<small>/100</small></strong>
                    <span className={`score-status is-${getScoreTone(row.status)}`}>{row.status}</span>
                    <span className={`score-priority is-${getPriorityTone(row.priority)}`}>{row.priority}</span>
                  </article>
                ))}
              </div>
            </details>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Методология" title="Что проверял аудит" />
            <p className="full-audit__lead">Аудит оценивает не сайт «вообще», а способность лендинга превращать платный трафик из Яндекс Директа в заявки.</p>
            <p className="full-audit__lead full-audit__lead--secondary">Проверки сгруппированы по этапам принятия решения: от первого понимания предложения до заявки и измерения результата.</p>
            <div className="full-audit__methodology">
              {auditGroups.map((group, index) => (
                <article key={group.title}>
                  <span className="full-audit__methodology-index">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                  <div>
                    {group.items.map((item) => <span className="full-audit__methodology-chip" key={item}><i />{item}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section full-audit__potential">
            <p className="full-audit__eyebrow">Ориентир после исправлений</p>
            <h2>Ориентир влияния после исправлений</h2>
            <p>{auditResult.finalSummary.expectedBusinessEffect}</p>
            <strong>{potentialLift}</strong>
            <small>Это не гарантия результата, а ориентировочная оценка на основе найденных барьеров. Фактический результат зависит от качества трафика, ниши, цены, продукта, конкурентной среды, обработки заявок и корректности внедрения рекомендаций.</small>
          </section>

          <footer className="full-audit__disclaimer">
            Отчёт является аналитической рекомендацией и показывает возможные точки потери заявок на лендинге. Он не является гарантией роста продаж или финансового результата. Итоговая эффективность зависит от рекламного трафика, ниши, продукта, цены, отдела продаж и качества внедрения рекомендаций.
          </footer>
        </main>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="full-audit__section-heading"><p className="full-audit__eyebrow">{eyebrow}</p><h2>{title}</h2></div>;
}

function ScreenshotFrame({ title, note, markers }: { title: string; note?: string; markers: string[] }) {
  return (
    <figure className="full-audit-screenshot" aria-label={title}>
      <div className="full-audit-screenshot__chrome">
        <span />
        <span />
        <span />
      </div>
      <div className="full-audit-screenshot__canvas">
        <div className="full-audit-screenshot__hero-line" />
        <div className="full-audit-screenshot__text-line" />
        <div className="full-audit-screenshot__text-line is-short" />
        <div className="full-audit-screenshot__cta" />
        {markers.map((marker, index) => (
          <span className={`full-audit-screenshot__marker is-${index + 1}`} key={`${marker}-${index}`}>{marker}</span>
        ))}
      </div>
      <figcaption>
        <b>{title}</b>
        {note ? <span>{note}</span> : null}
      </figcaption>
    </figure>
  );
}

function getScoreTone(status: ScoreRow["status"]) {
  if (status === "Хорошо") return "good";
  if (status === "Слабое место") return "weak";
  if (status === "Нормально") return "normal";
  return "attention";
}

function getScoreLevel(score: number) {
  if (score <= 39) return scoreLevels[0];
  if (score <= 59) return scoreLevels[1];
  if (score <= 74) return scoreLevels[2];
  if (score <= 89) return scoreLevels[3];
  return scoreLevels[4];
}

function getPriorityTone(priority: ScoreRow["priority"]) {
  if (priority === "Высокий") return "high";
  if (priority === "Средний") return "medium";
  return "low";
}
