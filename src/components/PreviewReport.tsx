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
};

const lockedSections = [
  "Подробный анализ оффера",
  "Рекомендации по CTA",
  "Анализ доверия",
  "Рекомендации по формам",
  "Mobile UX",
  "Roadmap исправлений",
  "PDF-версия отчёта"
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
    return "Базовые элементы продающей страницы присутствуют: явных критичных ошибок в HTML не найдено. Следующий шаг: проверить визуальную и мобильную версии, и убедиться, что оффер достаточно конкретен для вашей аудитории.";
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
  if (title.includes("довер")) return "Есть ли рядом с CTA реальные кейсы, отзывы, цифры или гарантии.";
  if (title.includes("h1") || title.includes("title")) return "Понятны ли за 5 секунд услуга, аудитория и основная выгода.";
  if (title.includes("текст") || title.includes("description")) return "Отвечает ли страница на главные вопросы клиента до формы.";
  return "Проверьте элемент на мобильном и десктопном экранах глазами нового посетителя.";
}

function getCategories(analysis: AuditAnalysis): Category[] {
  const hasContacts = analysis.hasPhone || analysis.hasEmail || analysis.hasTelInput || analysis.hasEmailInput;

  return [
    {
      name: "Оффер",
      status: analysis.h1.length > 0 ? "Хорошо" : "Критично",
      comment: analysis.h1.length > 0 ? "Главный заголовок найден. Его конкретику нужно оценить вручную." : "На странице не найден H1 с главным предложением."
    },
    {
      name: "CTA",
      status: analysis.ctaSignals.length > 0 ? "Хорошо" : "Критично",
      comment: analysis.ctaSignals.length > 0 ? "Найдены явные призывы к действию." : "Не найден понятный призыв к следующему шагу."
    },
    {
      name: "Доверие",
      status: analysis.trustSignals.length > 0 ? "Хорошо" : "Требует внимания",
      comment: analysis.trustSignals.length > 0 ? `Найдены сигналы: ${analysis.trustSignals.join(", ")}.` : "Не найдены отзывы, кейсы, гарантии или сертификаты."
    },
    {
      name: "Формы",
      status: analysis.hasForm || hasContacts ? "Хорошо" : "Критично",
      comment: analysis.hasForm ? "Форма заявки присутствует на странице." : hasContacts ? "Контакты найдены, но форма заявки не обнаружена." : "Не найдены форма и доступные контакты."
    },
    {
      name: "Мобильная версия",
      status: "Требует внимания",
      comment: "Требуется ручная проверка адаптации, читаемости и доступности CTA."
    },
    {
      name: "Структура",
      status: analysis.h2.length > 0 && analysis.pageText.length >= 500 ? "Хорошо" : "Требует внимания",
      comment: analysis.h2.length > 0 && analysis.pageText.length >= 500 ? "Базовая текстовая структура страницы присутствует." : "Структуру и объём контента стоит проверить вручную."
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

  return (
    <section className="report preview-report screen">
      <div className="report__inner preview-report__inner">
        <header className="preview-report__header">
          <div>
            <p className="preview-report__eyebrow">LeadFix Preview Report</p>
            <h1>Предварительный аудит сайта</h1>
            <p>Это краткая версия отчёта. Полные рекомендации доступны после оплаты.</p>
          </div>
          <div className="preview-report__meta">
            <span>{analysis.url}</span>
            <time>{reportDate}</time>
          </div>
        </header>

        <section className="preview-score">
          <div className="preview-score__main">
            <span>Оценка продающей способности</span>
            <strong>{previewReport.score}<small>/100</small></strong>
          </div>
          <div className="preview-score__comment">
            <span className="preview-score__status">{getScoreInterpretation(previewReport.score)}</span>
            <p>Оценка собрана по базовым HTML-сигналам: офферу, CTA, контактам, доверию и структуре контента.</p>
          </div>
          <div className="preview-score__metrics">
            <div><strong>{previewReport.criticalIssues}</strong><span>Критично</span></div>
            <div><strong>{previewReport.mediumIssues}</strong><span>Важно</span></div>
            <div><strong>{previewReport.lowIssues}</strong><span>Низкий приоритет</span></div>
          </div>
        </section>

        <section className="preview-report__section preview-summary">
          <p className="preview-report__eyebrow">Executive Summary</p>
          <h2>Что важно исправить в первую очередь</h2>
          <p>{getSummary(analysis)}</p>
        </section>

        <section className="preview-report__section">
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
                      <div><b>Что проверить вручную</b><span>{getManualCheck(insight)}</span></div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="preview-empty">
              <h3>Базовые ошибки не найдены</h3>
              <p>Для точной оценки оффера, визуальной и мобильной версии нужна расширенная проверка.</p>
            </div>
          )}
        </section>

        <section className="preview-report__section">
          <div className="preview-section-heading">
            <div>
              <p className="preview-report__eyebrow">Мини-разбор</p>
              <h2>Состояние ключевых категорий</h2>
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
                <p>{category.comment}</p>
                <span className="preview-category__locked-score">Score категории: доступно в полном отчёте</span>
              </article>
            ))}
          </div>
        </section>

        <section className="preview-report__section preview-locked">
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

        <section className="preview-unlock">
          <p className="preview-report__eyebrow">Следующий шаг</p>
          <h2>Разблокировать полный отчёт</h2>
          <p>Получите полный список проблем, приоритеты исправлений и рекомендации, которые можно передать дизайнеру, маркетологу или подрядчику.</p>
          <div className="report-actions">
            <button className="report-button report-button--primary" type="button" onClick={onCheckout}>Получить полный аудит</button>
            <button className="report-button report-button--secondary" type="button" onClick={onReset}>Проверить другой сайт</button>
          </div>
        </section>
      </div>
    </section>
  );
}
