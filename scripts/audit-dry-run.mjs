import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";

const root = process.cwd();
const outputPath = path.join(root, "tmp", "audit-prompt-preview.txt");
const url = process.argv[2];

const categories = [
  { id: "offer", title: "Оффер и первый экран", weight: 20 },
  { id: "ads", title: "Соответствие рекламе и запросу", weight: 15 },
  { id: "mobile", title: "Мобильная версия", weight: 15 },
  { id: "cta", title: "CTA и путь к заявке", weight: 15 },
  { id: "trust", title: "Доверие и доказательства", weight: 15 },
  { id: "forms", title: "Формы и снижение трения", weight: 8 },
  { id: "structure", title: "Структура страницы", weight: 7 },
  { id: "technical", title: "Скорость и технические барьеры", weight: 5 }
];

function compact(value, maxLength = 14000) {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function loadHtml() {
  if (!url) {
    return {
      finalUrl: "https://example.local/",
      html: `
        <html>
          <head><title>Аудит лендинга</title><meta name="description" content="Проверим сайт и покажем ошибки"></head>
          <body>
            <h1>Покажем, где лендинг теряет заявки</h1>
            <p>Аудит лендинга под рекламу, CTA, формы и доверие.</p>
            <a href="#form">Получить аудит</a>
            <form id="form"><input type="tel" placeholder="Телефон"><button>Оставить заявку</button></form>
          </body>
        </html>
      `
    };
  }

  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  const response = await fetch(withProtocol, {
    headers: {
      "Accept": "text/html,application/xhtml+xml",
      "User-Agent": "LeadFixDryRun/1.0"
    },
    redirect: "follow"
  });

  if (!response.ok) {
    throw new Error(`Не удалось открыть сайт: ${response.status}`);
  }

  return {
    finalUrl: response.url || withProtocol,
    html: await response.text()
  };
}

function analyzeHtml(html, finalUrl) {
  const $ = cheerio.load(html);
  $("script, style, noscript, template, svg").remove();

  const title = compact($("title").first().text());
  const description = compact($('meta[name="description"]').first().attr("content") ?? "");
  const h1 = unique($("h1").map((_, element) => compact($(element).text())).get());
  const h2 = unique($("h2").map((_, element) => compact($(element).text())).get());
  const buttonsAndLinks = unique(
    $("button, a")
      .map((_, element) => compact($(element).text() || $(element).attr("aria-label") || ""))
      .get()
  );
  const pageText = compact($("body").text(), 14000);
  const searchableText = `${pageText} ${buttonsAndLinks.join(" ")}`.toLocaleLowerCase("ru-RU");

  return {
    url: finalUrl,
    title,
    description,
    h1,
    h2,
    buttonsAndLinks,
    hasForm: $("form").length > 0,
    hasTelInput: $('input[type="tel"]').length > 0,
    hasEmailInput: $('input[type="email"]').length > 0,
    hasPhone: /(?:\+?7|8)[\s(-]*\d{3}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}/.test(searchableText),
    hasEmail: /[\w.+-]+@[\w.-]+\.[a-zа-я]{2,}/iu.test(searchableText),
    trustSignals: ["отзывы", "кейсы", "клиенты", "гарантия", "сертификат", "лицензия"].filter((word) => searchableText.includes(word)),
    ctaSignals: ["заказать", "получить", "оставить заявку", "рассчитать", "купить", "связаться"].filter((word) => searchableText.includes(word)),
    pageText
  };
}

async function main() {
  const [{ finalUrl, html }, methodology, checklist, criteria, scoring] = await Promise.all([
    loadHtml(),
    readFile(path.join(root, "src", "lib", "audit", "methodology.md"), "utf8"),
    readFile(path.join(root, "src", "lib", "audit", "audit-checklist.md"), "utf8"),
    readFile(path.join(root, "src", "lib", "audit", "criteria.csv"), "utf8"),
    readFile(path.join(root, "src", "lib", "audit", "scoring.md"), "utf8")
  ]);

  const pageSnapshot = analyzeHtml(html, finalUrl);
  const system = [
    "Ты CRO-аудитор LeadFix для лендингов российского малого и среднего бизнеса.",
    "Работай строго по методологии LeadFix и критериям ниже.",
    "Не выдумывай данные, которых нет в HTML.",
    "Если нужны реклама, Метрика, CRM, скриншоты или ручной тест, помечай пункт как needsHumanReview.",
    "Не обещай гарантированный рост продаж или конверсии.",
    "Возвращай только JSON по схеме."
  ].join(" ");

  const prompt = [
    "SYSTEM:",
    system,
    "",
    "METHODOLOGY:",
    compact(methodology, 28000),
    "",
    "CHECKLIST:",
    compact(checklist, 8000),
    "",
    "SCORING:",
    compact(scoring, 8000),
    "",
    "CRITERIA:",
    compact(criteria, 18000),
    "",
    "CATEGORY WEIGHTS:",
    JSON.stringify(categories, null, 2),
    "",
    "PAGE DATA:",
    JSON.stringify(pageSnapshot, null, 2),
    "",
    "OUTPUT:",
    "Верни полный AuditResult JSON. Каждая проблема должна ссылаться на criterionId, иметь evidence, impact, complexity, confidence и needsHumanReview. Общий score должен учитывать веса категорий.",
    "",
    `PROMPT_SIZE_CHARS: ${system.length + methodology.length + checklist.length + scoring.length + criteria.length + JSON.stringify(pageSnapshot).length}`
  ].join("\n");

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, prompt, "utf8");
  console.log(`Dry-run prompt saved: ${outputPath}`);
  console.log(`URL: ${finalUrl}`);
  console.log(`Prompt chars: ${prompt.length}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
