"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { AuditAnalysis, AuditCategoryId, AuditResult } from "@/types/audit";

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
    imageUrl?: string;
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

function getDetailedIssuesFromAuditResult(auditResult: AuditResult, screenshots: AuditAnalysis["screenshots"]): DetailedIssue[] {
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
      markers: [issue.criterionId, issue.severity === "critical" ? "Критично" : "Проверить"],
      imageUrl: screenshots?.find((screenshot) => screenshot.id === issue.screenshotId)?.url
    }
  }));
}

const categoryPlainText: Record<AuditCategoryId, { label: string; help: string }> = {
  offer: {
    label: "Оффер и первый экран",
    help: "Понятно ли за первые секунды, что предлагают, кому это нужно и какую пользу получит клиент."
  },
  ads: {
    label: "Соответствие рекламе",
    help: "Совпадает ли страница с ожиданием человека после клика по объявлению или поисковому запросу."
  },
  mobile: {
    label: "Мобильная версия",
    help: "Удобно ли пройти путь до заявки со смартфона без лишней прокрутки и ошибок."
  },
  cta: {
    label: "Кнопки и путь к заявке",
    help: "Понятно ли, куда нажимать и что произойдёт после действия. CTA — это призыв к действию."
  },
  trust: {
    label: "Доверие и доказательства",
    help: "Есть ли факты, кейсы, отзывы и гарантии, которые снижают сомнения перед заявкой."
  },
  forms: {
    label: "Формы и снижение трения",
    help: "Не мешает ли форма оставить заявку: лишние поля, непонятный следующий шаг, страх перед отправкой."
  },
  structure: {
    label: "Структура страницы",
    help: "Логично ли выстроены блоки: от первого понимания ценности до решения оставить заявку."
  },
  technical: {
    label: "Скорость и технические барьеры",
    help: "Нет ли проблем, которые мешают загрузке, клику, отправке формы или просмотру страницы."
  }
};

const methodologySteps = [
  "Проверяем, где пользователь теряет понимание ценности.",
  "Находим барьеры на пути к заявке.",
  "Расставляем проблемы по влиянию и сложности исправления.",
  "Формируем порядок внедрения: сначала то, что быстрее влияет на заявки."
];

function getCategoryLabel(categoryId: AuditCategoryId, fallback: string) {
  return categoryPlainText[categoryId]?.label ?? fallback;
}

function getCategoryHelp(categoryId: AuditCategoryId) {
  return categoryPlainText[categoryId]?.help ?? "Оцениваем влияние этой зоны на путь пользователя к заявке.";
}

function getSeverityLabel(severity: "critical" | "high" | "medium" | "low") {
  if (severity === "critical") return "Критично";
  if (severity === "high") return "Важно";
  if (severity === "medium") return "Средне";
  return "Низкий риск";
}

function getSeverityTone(severity: "critical" | "high" | "medium" | "low") {
  if (severity === "critical") return "critical";
  if (severity === "high") return "important";
  if (severity === "medium") return "medium";
  return "low";
}

function getTrafficVerdict(reportScore: number, criticalIssuesCount: number, summary: AuditResult["finalSummary"]) {
  if (reportScore >= 80 && criticalIssuesCount === 0) {
    return {
      title: "Можно запускать трафик",
      summary: "Критичных барьеров мало. Дальше лучше усиливать отдельные слабые места и проверять эффект по заявкам."
    };
  }

  if (reportScore >= 60) {
    return {
      title: "Можно, но после приоритетных правок",
      summary: summary.topPriority
    };
  }

  return {
    title: "Сначала закрыть критичные барьеры",
    summary: summary.mainConversionLoss
  };
}

function formatConfidence(confidence: number) {
  return `${Math.round(confidence > 1 ? confidence : confidence * 100)}%`;
}

function getGaugeSegmentColor(value: number) {
  if (value < 40) return "#ee8f8b";
  if (value < 60) return "#f0ad67";
  if (value < 75) return "#d9ca54";
  return "#63cd82";
}

function getGaugePoint(value: number, radius: number) {
  const angle = (180 - value * 1.8) * (Math.PI / 180);
  return {
    x: 150 + Math.cos(angle) * radius,
    y: 150 - Math.sin(angle) * radius
  };
}

function getGaugeSegments(score: number) {
  return Array.from({ length: 76 }, (_, index) => {
    const value = (index / 75) * 100;
    const inner = getGaugePoint(value, 104);
    const outer = getGaugePoint(value, 132);

    return {
      id: index,
      value,
      x1: inner.x,
      y1: inner.y,
      x2: outer.x,
      y2: outer.y,
      color: getGaugeSegmentColor(value),
      opacity: value <= score ? 1 : 0.12
    };
  });
}

function getQualityReviewNote(result: AuditResult) {
  const notes = [
    ...result.qualityReview.failedChecks,
    ...result.qualityReview.warnings,
    ...result.limitations
  ].filter(Boolean);

  if (notes.length === 0) {
    return ["Данных достаточно: отчёт прошёл внутреннюю проверку качества без заметных ограничений."];
  }

  return notes;
}

function formatReportText(text: string) {
  return text
    .replace(/\bCTA\b/g, "кнопка / призыв к действию (CTA)")
    .replace(/\bHTML\b/g, "код страницы (HTML)");
}

function getIssueScreenshot(
  issue: AuditResult["issues"][number],
  screenshots: AuditAnalysis["screenshots"],
  shownScreenshotIds?: Set<string>
) {
  if (!issue.screenshotId || issue.screenshotId === "none") return undefined;
  if (shownScreenshotIds?.has(issue.screenshotId)) return undefined;
  if (isGenericScreenshotMismatch(issue)) return undefined;

  const screenshot = screenshots?.find((item) => item.id === issue.screenshotId);
  if (screenshot && shownScreenshotIds) shownScreenshotIds.add(issue.screenshotId);
  return screenshot?.url;
}

function isGenericScreenshotMismatch(issue: AuditResult["issues"][number]) {
  if (issue.screenshotId !== "desktop") return false;
  const targetText = `${issue.location} ${issue.title} ${issue.categoryId}`.toLowerCase();
  const shouldUseSpecificBlock = [
    "кейс",
    "отзыв",
    "форма",
    "контакт",
    "тариф",
    "цена",
    "стоимость",
    "faq",
    "вопрос",
    "ответ"
  ].some((keyword) => targetText.includes(keyword));

  return shouldUseSpecificBlock;
}

export function FullReport({ analysis, reportDate }: FullReportProps) {
  const auditResult = analysis.auditResult;
  const reportScore = auditResult.overallScore;
  const scoreRows: ScoreRow[] = auditResult.categoryScores.map((category) => ({
    category: getCategoryLabel(category.categoryId, category.title),
    score: category.score * 10,
    status: category.status,
    priority: getPriorityByScore(category.score)
  }));
  const priorityIssues = [...auditResult.issues]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 5);
  const implementationPriorities = [
    { title: "Сначала: 24 часа", tone: "high", items: auditResult.implementationPlan.first24h },
    { title: "Затем: первая неделя", tone: "medium", items: auditResult.implementationPlan.firstWeek },
    { title: "После: следующий месяц", tone: "low", items: auditResult.implementationPlan.nextMonth }
  ];
  const visibleImplementationPriorities = implementationPriorities.map((group) => ({
    ...group,
    items: group.items.slice(0, 3)
  }));
  const auditDirections = auditResult.categoryScores.map((category) => ({
    ...category,
    title: getCategoryLabel(category.categoryId, category.title),
    score: category.score * 10,
    status: getReportStatus(category.score),
    help: getCategoryHelp(category.categoryId),
    issues: auditResult.issues.filter((issue) => issue.categoryId === category.categoryId)
  }));
  const firstPriority = priorityIssues[0]?.location || "Оффер и путь к заявке";
  const lossZones = priorityIssues.slice(0, 3).map((issue) => issue.location).join(", ") || firstPriority;
  const criticalIssuesCount = auditResult.issues.filter((issue) => issue.severity === "critical").length;
  const manualChecks = auditResult.humanReviewNeeded.length > 0
    ? auditResult.humanReviewNeeded
    : ["Проверить страницу на смартфоне, клики по кнопкам и отправку формы."];
  const providerLabel = analysis.aiProvider
    ? `ИИ-анализ через ProxyAPI${analysis.aiModel ? `, модель: ${analysis.aiModel}` : ""}`
    : "Правила LeadFix без внешней модели";
  const siteHeading = analysis.h1[0] || "Главный заголовок не найден";
  const displayUrl = analysis.url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  const reportPlan = "Экспресс";
  const activeScoreLevel = getScoreLevel(reportScore);
  const gaugeSegments = getGaugeSegments(reportScore);
  const isDemoReport = displayUrl === "demo.leadfix.ru";
  const mediumIssuesCount = auditResult.issues.filter((issue) => issue.severity === "medium").length;
  const heroMetricCards = [
    { value: auditResult.issues.length, label: ["Проблем", "найдено"] },
    { value: isDemoReport ? 1 : criticalIssuesCount, label: ["Критическая"] },
    { value: isDemoReport ? 3 : mediumIssuesCount, label: ["Средних"] },
    { value: isDemoReport ? 1 : Math.min(priorityIssues.length, 1), label: ["Рекомендация"] }
  ];
  const shownIssueScreenshotIds = new Set<string>();
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
            <div className="full-audit-sidebar__brand">
              <img src="/leadfix-logo-black.svg" alt="LeadFix" />
            </div>
            <div className="full-audit-sidebar__meta">
              <div><span>Адрес сайта</span><a href={analysis.url} target="_blank" rel="noreferrer">{analysis.url}</a></div>
              <div><span>Дата аудита</span><b>{reportDate}</b></div>
              <div><span>Тариф</span><b>{reportPlan}</b></div>
              <div><span>Главный заголовок сайта</span><b>{formatReportText(siteHeading)}</b></div>
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
            <h2>
              <span>Аудит лендинга </span>
              <span className="preview-report__title-url">{displayUrl}</span>
            </h2>
            <div className="full-audit-content__hero-metrics">
              {heroMetricCards.map((metric) => (
                <div className="full-audit-content__hero-stat" key={metric.label.join(" ")}>
                  <b>{metric.value}</b>
                  <span className="full-audit-content__hero-stat-label">
                    {metric.label.map((labelLine) => <span key={labelLine}>{labelLine}</span>)}
                  </span>
                </div>
              ))}
            </div>
          </header>

          <section className="full-audit-content__score readiness-score" aria-label="Готовность лендинга к платному трафику">
            <div className={`readiness-score__gauge is-${activeScoreLevel.tone}`}>
              <div className="readiness-score__arc" style={{ "--score": reportScore } as CSSProperties}>
                <svg viewBox="0 0 300 188" role="img" aria-label={`Оценка ${reportScore} из 100`}>
                  <g className="readiness-score__arc-segments" aria-hidden="true">
                    {gaugeSegments.map((segment) => (
                      <line
                        key={segment.id}
                        x1={segment.x1}
                        y1={segment.y1}
                        x2={segment.x2}
                        y2={segment.y2}
                        stroke={segment.color}
                        opacity={segment.opacity}
                      />
                    ))}
                  </g>
                  <g className="readiness-score__arc-labels" aria-hidden="true">
                    <text x="30" y="176">0</text>
                    <text x="38" y="42">40</text>
                    <text x="150" y="0">60</text>
                    <text x="262" y="42">80</text>
                    <text x="270" y="176">100</text>
                  </g>
                </svg>
                <strong>{reportScore}</strong>
              </div>
              <p>Готовность сайта к платному трафику</p>
            </div>
            <div className="readiness-score__verdict">
              <p className="full-audit__eyebrow readiness-score__eyebrow">Краткий итог</p>
              <h2>{activeScoreLevel.title}</h2>
              <p>{activeScoreLevel.summary}</p>
              <p>Главные зоны потерь: {formatReportText(lossZones)}.</p>
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
                <div key={direction.categoryId}>
                  <dt>{direction.title}</dt>
                  <dd>{direction.score}</dd>
                  <span style={{ "--value": `${direction.score}%` } as CSSProperties} />
                </div>
              ))}
            </dl>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Что исправить первым" title="Приоритетные проблемы" />
            <p className="full-audit__lead">Короткий список главных проблем. Подробный разбор и примеры решений находятся ниже.</p>
            <div className="full-audit__priority-list">
              {priorityIssues.map((issue, index) => (
                <article className={`full-audit-priority is-${getSeverityTone(issue.severity)}`} key={issue.id}>
                  <div className="full-audit-priority__number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="full-audit-priority__body">
                    <div className="full-audit-priority__head">
                      <span>{getCategoryLabel(issue.categoryId, issue.categoryId)}</span>
                      <b>{getSeverityLabel(issue.severity)}</b>
                    </div>
                    <h3>{formatReportText(issue.title)}</h3>
                    <div className="full-audit-priority__meta">
                      <span>Где: {formatReportText(issue.location)}</span>
                      <span>Приоритет: {issue.priorityScore}/10</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="План правок" title="Что сделать и в каком порядке" />
            <div className="full-audit__implementation">
              {visibleImplementationPriorities.map((group) => (
                <article className={`is-${group.tone}`} key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>{group.items.map((item) => <li key={item}>{formatReportText(item)}</li>)}</ul>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Карта отчёта" title="8 зон, где лендинг может терять заявки" />
            <p className="full-audit__lead">Навигация по зонам проверки: оценка, статус и найденные слабые места.</p>
            <div className="full-audit__categories">
              {auditDirections.map((direction, index) => (
                <article className="full-audit-category" key={direction.categoryId}>
                  <div className="full-audit-category__top">
                    <div>
                      <span className="full-audit-category__index">{String(index + 1).padStart(2, "0")}</span>
                      <h3>{direction.title}</h3>
                    </div>
                    <strong>{direction.score}<small>/100</small></strong>
                  </div>
                  <span className={`full-audit__status status-${direction.status === "Хорошо" ? "good" : direction.status === "Слабое место" ? "critical" : "attention"}`}>{direction.status}</span>
                  <p>{formatReportText(direction.help)}</p>
                  <div className="full-audit-category__recommendation">
                    <b>Вывод по зоне</b>
                    <span>{formatReportText(direction.summary)}</span>
                  </div>
                  <div className="full-audit-category__issues">
                    {direction.issues.length > 0 ? direction.issues.slice(0, 2).map((issue) => (
                      <span key={issue.id}>{formatReportText(issue.title)}</span>
                    )) : <span className="full-audit-category__empty">Критичных проблем в этой зоне не найдено.</span>}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Детальный разбор" title="Почему эти проблемы мешают заявкам" />
            <div className="full-audit__issues">
              {auditResult.issues.map((issue, index) => {
                const issueScreenshotUrl = getIssueScreenshot(issue, analysis.screenshots, shownIssueScreenshotIds);

                return (
                <article className={`full-audit-issue is-${getSeverityTone(issue.severity)}`} key={issue.id}>
                  <div className="full-audit-issue__index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="full-audit-issue__body">
                    <div className="full-audit-issue__head">
                      <div>
                        <span>{getCategoryLabel(issue.categoryId, issue.categoryId)}</span>
                        <h3>{formatReportText(issue.title)}</h3>
                      </div>
                      <b>{getSeverityLabel(issue.severity)}</b>
                    </div>
                    <div className="full-audit-issue__location">
                      <span>Где на странице</span>
                      <b>{formatReportText(issue.location)}</b>
                    </div>
                    {issueScreenshotUrl ? (
                      <ScreenshotFrame
                        title={`Скриншот: ${formatReportText(issue.location)}`}
                        note={formatReportText(issue.evidence)}
                        markers={[issue.criterionId, getSeverityLabel(issue.severity)]}
                        imageUrl={issueScreenshotUrl}
                      />
                    ) : (
                      <p className="full-audit-issue__screenshot-note">Скриншот этой зоны не найден. Ориентируйтесь на указанное место на странице и описание проблемы.</p>
                    )}
                    <div className="full-audit-issue__grid">
                      <div className="is-problem"><b>Что не так</b><p>{formatReportText(issue.problem)}</p></div>
                      <div className="is-problem"><b>Почему это мешает заявкам</b><p>{formatReportText(issue.evidence)}</p></div>
                      <div className="is-solution"><b>Что исправить</b><p>{formatReportText(issue.recommendation)}</p></div>
                      <div className="is-solution"><b>Какой результат ожидаем</b><p>{formatReportText(issue.expectedResult)}</p></div>
                      <div className="is-solution"><b>Пример решения</b><p>{formatReportText(issue.example)}</p></div>
                    </div>
                    <div className="full-audit-issue__meta">
                      <div><span>Сложность</span><b>{issue.complexity}/5</b></div>
                      <div><span>Уверенность проверки</span><b>{formatConfidence(issue.confidence)}</b></div>
                    </div>
                  </div>
                </article>
                );
              })}
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
            <SectionHeading eyebrow="Как читать отчёт" title="Методология простыми словами" />
            <details className="full-audit__details full-audit__methodology-details">
              <summary>
                <span>Методика</span>
                <b>Как LeadFix читает лендинг</b>
              </summary>
              <p className="full-audit__lead">Аудит оценивает не красоту страницы, а способность лендинга превращать платный трафик в заявки. Внутренние критерии и prompt не показываются в отчёте.</p>
              <div className="full-audit__methodology">
                {methodologySteps.map((step, index) => (
                  <article key={step}>
                    <span className="full-audit__methodology-index">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{step}</h3>
                  </article>
                ))}
              </div>
            </details>
          </section>

          <section className="full-audit__section full-audit__potential">
            <p className="full-audit__eyebrow">После исправлений</p>
            <h2>Что даст исправление проблем</h2>
            <p>Правки снижают барьеры перед заявкой: пользователь быстрее понимает предложение, видит доказательства и легче оставляет контакт.</p>
            <strong>Меньше потерь на ключевых шагах</strong>
            <small>Фактический результат зависит от трафика, ниши, цены, продукта и качества внедрения.</small>
          </section>

          <section className="full-audit__section">
            <details className="full-audit__details full-audit__tech-details">
              <summary>
                <span>Проверить вручную</span>
                <b>Что нельзя оценить только по HTML</b>
              </summary>
              <div className="full-audit__check-list">
                {manualChecks.map((item) => <article key={item}>{formatReportText(item)}</article>)}
              </div>
            </details>
          </section>

          <section className="full-audit__section">
            <details className="full-audit__details full-audit__tech-details">
              <summary>
                <span>Техническая информация</span>
                <b>Источник анализа и ограничения</b>
              </summary>
              <div className="full-audit__check-list">
                <article>{providerLabel}</article>
                {auditResult.limitations.map((item) => <article key={item}>{formatReportText(item)}</article>)}
                {auditResult.qualityReview.warnings.map((item) => <article key={item}>{formatReportText(item)}</article>)}
              </div>
            </details>
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

function ScreenshotFrame({ title, note, markers, imageUrl }: { title: string; note?: string; markers: string[]; imageUrl?: string }) {
  return (
    <figure className="full-audit-screenshot" aria-label={title}>
      <div className="full-audit-screenshot__chrome">
        <span />
        <span />
        <span />
      </div>
      <div className="full-audit-screenshot__canvas">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="full-audit-screenshot__image" src={imageUrl} alt="" loading="lazy" />
        ) : (
          <>
            <div className="full-audit-screenshot__hero-line" />
            <div className="full-audit-screenshot__text-line" />
            <div className="full-audit-screenshot__text-line is-short" />
            <div className="full-audit-screenshot__cta" />
          </>
        )}
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
