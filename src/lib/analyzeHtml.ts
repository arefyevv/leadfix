import * as cheerio from "cheerio";
import type { AuditInsight, AuditAnalysis, PreviewReport } from "@/types/audit";

const TRUST_WORDS = ["отзывы", "кейсы", "клиенты", "гарантия", "сертификат", "лицензия"];
const CTA_WORDS = ["заказать", "получить", "оставить заявку", "рассчитать", "купить", "связаться"];

function compactText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function findWords(text: string, words: string[]) {
  const normalizedText = text.toLocaleLowerCase("ru-RU");
  return words.filter((word) => normalizedText.includes(word));
}

function createPreviewReport(data: Omit<AuditAnalysis, "previewReport">): PreviewReport {
  let score = 100;
  const insights: AuditInsight[] = [];

  function addInsight(penalty: number, insight: AuditInsight) {
    score -= penalty;
    insights.push(insight);
  }

  if (data.h1.length === 0) {
    addInsight(15, {
      title: "На странице нет главного заголовка",
      description: "Главное предложение страницы не выделено отдельным заголовком. Добавьте один понятный заголовок с ключевой выгодой для клиента.",
      priority: "Критично"
    });
  }

  if (data.ctaSignals.length === 0) {
    addInsight(20, {
      title: "Не найден понятный призыв к действию",
      description: "На странице нет кнопки с ясным следующим шагом. Добавьте заметную кнопку: заказать, получить расчёт или оставить заявку.",
      priority: "Критично"
    });
  }

  if (!data.hasForm && !data.hasPhone && !data.hasEmail) {
    addInsight(20, {
      title: "Нет формы и доступных контактов",
      description: "Пользователю некуда отправить заявку и не с кем связаться. Добавьте форму или видимые контактные данные.",
      priority: "Критично"
    });
  }

  if (data.trustSignals.length === 0) {
    addInsight(15, {
      title: "Не найдены сигналы доверия",
      description: "На странице не видно отзывов, кейсов, клиентов, гарантий или сертификатов. Добавьте доказательства результата.",
      priority: "Важно"
    });
  }

  if (data.title.length < 30) {
    addInsight(5, {
      title: data.title ? "Заголовок страницы слишком короткий" : "У страницы нет заголовка для поисковиков",
      description: "Раскройте в заголовке услугу и основную ценность страницы. Это улучшит понятность страницы и отображение в поиске.",
      priority: "Низкий"
    });
  }

  if (!data.description) {
    addInsight(5, {
      title: "Нет описания страницы для поисковиков",
      description: "Добавьте краткое описание предложения страницы, чтобы сайт понятнее отображался в поиске.",
      priority: "Низкий"
    });
  }

  if (data.pageText.length < 500) {
    addInsight(10, {
      title: "На странице мало текста",
      description: "Контента недостаточно, чтобы раскрыть предложение и снять основные вопросы клиента. Усильте аргументацию.",
      priority: "Важно"
    });
  }

  return {
    score: Math.max(0, score),
    criticalIssues: insights.filter((insight) => insight.priority === "Критично").length,
    mediumIssues: insights.filter((insight) => insight.priority === "Важно").length,
    lowIssues: insights.filter((insight) => insight.priority === "Низкий").length,
    insights
  };
}

export function analyzeHtml(html: string, url: string): AuditAnalysis {
  const $ = cheerio.load(html);

  $("script, style, noscript, template, svg").remove();

  const title = compactText($("title").first().text());
  const description = compactText($('meta[name="description"]').first().attr("content") ?? "");
  const h1 = unique($("h1").map((_, element) => compactText($(element).text())).get());
  const h2 = unique($("h2").map((_, element) => compactText($(element).text())).get());
  const pageText = compactText($("body").text());
  const buttonsAndLinks = unique(
    $("button, a")
      .map((_, element) => compactText($(element).text() || $(element).attr("aria-label") || ""))
      .get()
  );
  const searchableText = compactText(`${pageText} ${buttonsAndLinks.join(" ")}`);

  const analysisWithoutReport: Omit<AuditAnalysis, "previewReport"> = {
    url,
    title,
    description,
    h1,
    h2,
    pageText,
    buttonsAndLinks,
    hasForm: $("form").length > 0,
    hasTelInput: $('input[type="tel"]').length > 0,
    hasEmailInput: $('input[type="email"]').length > 0,
    hasPhone: /(?:\+?7|8)[\s(-]*\d{3}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}/.test(searchableText),
    hasEmail: /[\w.+-]+@[\w.-]+\.[a-zа-я]{2,}/iu.test(searchableText),
    trustSignals: findWords(searchableText, TRUST_WORDS),
    ctaSignals: findWords(searchableText, CTA_WORDS)
  };

  return {
    ...analysisWithoutReport,
    previewReport: createPreviewReport(analysisWithoutReport)
  };
}
