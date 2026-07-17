import type { AuditAnalysis, AuditInsight } from "@/types/audit";

type PreviewReportProps = {
  analysis: AuditAnalysis;
  onCheckout: () => void;
  onReset: () => void;
};

type CategoryStatus = "Хорошо" | "Требует внимания" | "Критично";

type Category = {
  name: string;
  status: CategoryStatus;
  comment: string;
  scope: string;
};

const lockedSections = [
  "Оффер и понимание предложения",
  "Доверие и доказательства",
  "Конверсионные действия",
  "Структура, текст и визуал",
  "UX и техническое качество",
  "Реклама и аналитика",
  "Roadmap исправлений"
];

function getScoreInterpretation(score: number) {
  if (score <= 40) return "Слабая продающая способность";
  if (score <= 70) return "Есть точки потери заявок";
  if (score <= 85) return "Нормальная структура, есть что улучшить";
  return "Высокая продающая способность";
}

function getSummary(analysis: AuditAnalysis) {
  const { previewReport } = analysis;
  const issuesCount = previewReport.criticalIssues + previewReport.mediumIssues + previewReport.lowIssues;
  const firstIssue = previewReport.insights[0]?.title.toLocaleLowerCase("ru-RU");

  if (issuesCount === 0) {
    return "Базовые элементы продающей страницы присутствуют: явных критичных ошибок в коде страницы не найдено. Следующий шаг: проверить визуальную и мобильную версии, и убедиться, что главное предложение достаточно конкретно для вашей аудитории.";
  }

  const opening =
    previewReport.score <= 40
      ? "Страница теряет заметную часть заявок уже на базовом уровне."
      : previewReport.score <= 70
        ? "У страницы есть точки потери заявок, которые снижают эффективность трафика."
        : "Базовая структура собрана, но отдельные элементы могут снижать конверсию.";
  const priority = firstIssue
    ? `В первую очередь стоит исправить: ${firstIssue}.`
    : "В первую очередь устраните критичные замечания.";

  return `${opening} Мы нашли ${issuesCount} ${getIssuesWord(issuesCount)}, из них критичных: ${previewReport.criticalIssues}. ${priority}`;
}

function getIssuesWord(count: number) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "проблем";
  if (lastDigit === 1) return "проблему";
  if (lastDigit >= 2 && lastDigit <= 4) return "проблемы";
  return "проблем";
}

function getIssueImpact(insight: AuditInsight) {
  const title = insight.title.toLocaleLowerCase("ru-RU");

  if (title.includes("cta") || title.includes("призыв")) return "Посетителю неясно, какой шаг сделать дальше. Это снижает число переходов к заявке.";
  if (title.includes("форм") || title.includes("контакт")) return "Пользователь может принять решение, но не найти быстрый способ связаться с вами.";
  if (title.includes("довер")) return "Без доказательств результата посетитель откладывает решение или уходит сравнивать конкурентов.";
  if (title.includes("h1") || title.includes("title")) return "Первый смысловой сигнал страницы не объясняет предложение достаточно быстро.";
  if (title.includes("текст") || title.includes("description")) return "Страница не закрывает базовые вопросы клиента и хуже формирует ожидания.";
  return "Замечание создаёт лишнее сомнение перед заявкой и может снижать конверсию страницы.";
}

function getManualCheck(insight: AuditInsight) {
  const title = insight.title.toLocaleLowerCase("ru-RU");

  if (title.includes("cta") || title.includes("призыв")) return "Видна ли основная кнопка на первом экране и понятен ли результат клика.";
  if (title.includes("форм") || title.includes("контакт")) return "Можно ли оставить заявку за 30 секунд с телефона.";
  if (title.includes("довер")) return "Есть ли рядом с основной кнопкой реальные кейсы, отзывы, цифры или гарантии.";
  if (title.includes("h1") || title.includes("title")) return "Понятны ли за 5 секунд услуга, аудитория и основная выгода.";
  if (title.includes("текст") || title.includes("description")) return "Отвечает ли страница на главные вопросы клиента до формы.";
  return "Проверьте элемент на мобильном и десктопном экранах глазами нового посетителя.";
}

function getCategories(analysis: AuditAnalysis): Category[] {
  const hasContacts = analysis.hasPhone || analysis.hasEmail || analysis.hasTelInput || analysis.hasEmailInput;
  const hasLeadAction = analysis.ctaSignals.length > 0 || analysis.hasForm || hasContacts;
  const hasContentStructure = analysis.h2.length > 0 && analysis.pageText.length >= 500;

  return [
    {
      name: "Оффер и понимание предложения",
      status: analysis.h1.length > 0 ? "Хорошо" : "Критично",
      comment: analysis.h1.length > 0 ? "Главный заголовок найден. В полном отчёте проверяем конкретику, выгоду и совпадение с ожиданием клиента." : "На странице не найден главный заголовок с предложением.",
      scope: "УТП, первый экран, оффер, аудитория, боли клиента"
    },
    {
      name: "Доверие и доказательства",
      status: analysis.trustSignals.length > 0 ? "Хорошо" : "Требует внимания",
      comment: analysis.trustSignals.length > 0 ? `Найдены сигналы: ${analysis.trustSignals.join(", ")}.` : "Не найдены отзывы, кейсы, гарантии или сертификаты.",
      scope: "Экспертность, кейсы, отзывы, гарантии, возражения"
    },
    {
      name: "Конверсионные действия",
      status: hasLeadAction ? "Хорошо" : "Критично",
      comment: analysis.hasForm ? "Форма заявки присутствует на странице." : hasContacts ? "Контакты найдены, но форму и CTA стоит проверить дополнительно." : "Не найдены форма и доступные контакты.",
      scope: "CTA, формы захвата, мотивация к действию, барьеры"
    },
    {
      name: "Структура, текст и визуал",
      status: hasContentStructure ? "Хорошо" : "Требует внимания",
      comment: hasContentStructure ? "Базовая текстовая структура страницы присутствует." : "Структуру, иерархию и объём контента нужно проверить дополнительно.",
      scope: "Структура лендинга, читаемость, визуальная логика"
    },
    {
      name: "UX и техническое качество",
      status: "Требует внимания",
      comment: "Мобильную версию, скорость, кликабельность и удобство форм нужно проверять по рендеру страницы.",
      scope: "Мобильная версия, скорость, UX, технические ошибки"
    },
    {
      name: "Реклама и аналитика",
      status: "Требует внимания",
      comment: "В полном отчёте проверяется связка рекламного обещания, первого экрана, CTA и отслеживания заявок.",
      scope: "Яндекс Директ, соответствие трафику, цели и конверсии"
    }
  ];
}

export function PreviewReport({ analysis, onCheckout, onReset }: PreviewReportProps) {
  const { previewReport } = analysis;
  const reportDate = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date());
  const categories = getCategories(analysis);
  const visibleInsights = previewReport.insights.slice(0, 3);
  const siteHeading = analysis.h1[0] || "УТП сайта не найдено в H1";
  const displayUrl = analysis.url.replace(/^https?:\/\//i, "").replace(/\/$/, "");

  function copyReportLink() {
    const reportUrl = typeof window !== "undefined" ? window.location.href : analysis.url;
    void navigator.clipboard?.writeText(reportUrl);
  }

  return (
    <section className="full-report full-audit preview-report preview-audit screen">
      <div className="full-report__inner full-audit__layout preview-report__inner">
        <aside className="full-audit-sidebar">
          <section className="full-audit-sidebar__site">
            <div className="full-audit-sidebar__meta">
              <div><span>Дата аудита</span><b>{reportDate}</b></div>
              <div><span>Адрес сайта</span><a href={analysis.url} target="_blank" rel="noreferrer">{analysis.url}</a></div>
              <div><span>УТП сайта</span><b>{siteHeading}</b></div>
            </div>
            <div className="full-audit-sidebar__actions">
              <button className="pdf-button" type="button" onClick={onCheckout}>Получить полный аудит</button>
              <button className="telegram-button" type="button" onClick={copyReportLink}>Скопировать ссылку на отчёт</button>
            </div>
          </section>

          <section className="full-audit-sidebar__score">
            <p className="full-audit__eyebrow">Краткая оценка</p>
            <strong>{previewReport.score}<small>/100</small></strong>
            <p>{getScoreInterpretation(previewReport.score)}</p>
            <dl>
              <div><dt>Критично</dt><dd>{previewReport.criticalIssues}</dd></div>
              <div><dt>Важно</dt><dd>{previewReport.mediumIssues}</dd></div>
              <div><dt>Низкий</dt><dd>{previewReport.lowIssues}</dd></div>
            </dl>
          </section>
        </aside>

        <main className="full-audit-content preview-audit-content">
        <header className="full-audit-content__hero preview-report__header">
          <div>
            <p className="preview-report__eyebrow">{analysis.aiProvider ? "ИИ-демо отчёта LeadFix" : "Демо отчёта LeadFix"}</p>
            <h1>
              <span>Краткий отчёт конверсии </span>
              <span className="preview-report__title-url">{displayUrl}</span>
            </h1>
          </div>
        </header>

        <section className="full-audit-content__score preview-score">
          <div className="preview-score__main">
            <span>Оценка продающей способности</span>
            <strong>{previewReport.score}<small>/100</small></strong>
          </div>
          <div className="preview-score__comment">
            <span className="preview-score__status">{getScoreInterpretation(previewReport.score)}</span>
            <p>Оценка собрана по базовым сигналам страницы и разложена по структуре полного отчёта: оффер, доверие, действия, структура, UX и реклама.</p>
          </div>
          <div className="preview-score__metrics">
            <div><strong>{previewReport.criticalIssues}</strong><span>Критично</span></div>
            <div><strong>{previewReport.mediumIssues}</strong><span>Важно</span></div>
            <div><strong>{previewReport.lowIssues}</strong><span>Низкий приоритет</span></div>
          </div>
        </section>

        <section className="full-audit__section preview-report__section preview-summary">
          <p className="preview-report__eyebrow">Краткий вывод</p>
          <h2>Что важно исправить в первую очередь</h2>
          <p>{getSummary(analysis)}</p>
        </section>

        <section className="full-audit__section preview-report__section">
          <div className="preview-section-heading">
            <div>
              <p className="preview-report__eyebrow">Найденные проблемы</p>
              <h2>Первые точки потери заявок</h2>
            </div>
            <span>Показано до 3 замечаний</span>
          </div>

          {visibleInsights.length > 0 ? (
            <div className="preview-issues">
              {visibleInsights.map((insight, index) => (
                <article className={insight.priority === "Критично" ? "preview-issue is-critical" : "preview-issue"} key={insight.title}>
                  <div className="preview-issue__number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="preview-issue__content">
                    <div className="preview-issue__head">
                      <h3>{insight.title}</h3>
                      <span className={insight.priority === "Критично" ? "priority priority--critical" : "priority"}>{insight.priority}</span>
                    </div>
                    <p>{insight.description}</p>
                    <div className="preview-issue__details">
                      <div><b>Почему это влияет на заявки</b><span>{getIssueImpact(insight)}</span></div>
                      <div><b>Что проверить дополнительно</b><span>{getManualCheck(insight)}</span></div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="preview-empty">
              <h3>Базовые ошибки не найдены</h3>
              <p>Для точной оценки главного предложения, визуальной и мобильной версии нужна расширенная проверка.</p>
            </div>
          )}
        </section>

        <section className="full-audit__section preview-report__section">
          <div className="preview-section-heading">
            <div>
              <p className="preview-report__eyebrow">Структура отчёта</p>
              <h2>Состояние по направлениям аудита</h2>
            </div>
          </div>
          <div className="preview-categories">
            {categories.map((category) => (
              <article className="preview-category" key={category.name}>
                <div className="preview-category__head">
                  <h3>{category.name}</h3>
                  <span className={`preview-category__status status-${category.status === "Хорошо" ? "good" : category.status === "Критично" ? "critical" : "attention"}`}>
                    {category.status}
                  </span>
                </div>
                <span className="preview-category__scope">{category.scope}</span>
                <p>{category.comment}</p>
                <span className="preview-category__locked-score">Оценка категории: доступно в полном отчёте</span>
              </article>
            ))}
          </div>
        </section>

        <section className="full-audit__section preview-report__section preview-locked">
          <div className="preview-section-heading">
            <div>
              <p className="preview-report__eyebrow">Полный отчёт</p>
              <h2>Разделы с подробными рекомендациями</h2>
            </div>
            <span>7 разделов</span>
          </div>
          <div className="preview-locked__grid">
            {lockedSections.map((section) => (
              <article className="preview-locked__card" key={section}>
                <div className="preview-lock-icon" aria-hidden="true" />
                <div className="preview-locked__blur" aria-hidden="true"><span /><span /><span /></div>
                <h3>{section}</h3>
                <p>Доступно в полном отчёте</p>
              </article>
            ))}
          </div>
        </section>

        <section className="full-audit__section preview-unlock">
          <p className="preview-report__eyebrow">Следующий шаг</p>
          <h2>Разблокировать полный отчёт</h2>
          <p>Получите полный список проблем, приоритеты исправлений и рекомендации, которые можно передать дизайнеру, маркетологу или подрядчику.</p>
          <div className="report-actions">
            <button className="report-button report-button--primary" type="button" onClick={onCheckout}>Получить полный аудит</button>
            <button className="report-button report-button--secondary" type="button" onClick={onReset}>Проверить другой сайт</button>
          </div>
        </section>
        </main>
      </div>
    </section>
  );
}
