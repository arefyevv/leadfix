import type { AuditAnalysis } from "@/types/audit";

type FullReportProps = {
  analysis: AuditAnalysis;
  reportDate: string;
};

type AuditStatus = "Хорошо" | "Требует внимания" | "Критично";

type ReportCategory = {
  title: string;
  score: number;
  status: AuditStatus;
  summary: string;
  findings: string[];
  recommendation: string;
};

type DetailedIssue = {
  title: string;
  priority: "Критично" | "Важно";
  category: string;
  problem: string;
  impact: string;
  fix: string;
  example: string;
};

const quickWins = [
  "Уточнить главное предложение на первом экране",
  "Добавить пояснение результата рядом с основной кнопкой",
  "Разместить один сильный кейс до формы заявки",
  "Сократить форму до минимального набора полей"
];

function getScoreLabel(score: number) {
  if (score <= 40) return "Слабая продающая способность";
  if (score <= 70) return "Есть точки потери заявок";
  if (score <= 85) return "Нормальная структура, есть что улучшить";
  return "Высокая продающая способность";
}

function getSummary(analysis: AuditAnalysis) {
  const { previewReport } = analysis;
  const issuesCount = previewReport.insights.length;

  if (issuesCount === 0) {
    return "Базовые элементы страницы собраны корректно: найдено главное предложение, кнопки действия и элементы доверия. Для роста заявок важно вручную проверить конкретику предложения, порядок аргументов и мобильный сценарий.";
  }

  return `Страница получает ${previewReport.score} из 100 баллов. Автоматическая проверка выявила ${issuesCount} потенциальных точек потери заявок. Первый приоритет: устранить критичные замечания в главном предложении, кнопках действия и сценарии обращения, затем усилить доверие и мобильную версию.`;
}

function getCategories(analysis: AuditAnalysis): ReportCategory[] {
  const hasContacts = analysis.hasPhone || analysis.hasEmail || analysis.hasTelInput || analysis.hasEmailInput;
  const structureScore = analysis.h2.length > 0 && analysis.pageText.length >= 500 ? 82 : 54;

  return [
    {
      title: "Главное предложение",
      score: analysis.h1.length > 0 ? 72 : 28,
      status: analysis.h1.length > 0 ? "Требует внимания" : "Критично",
      summary: analysis.h1.length > 0 ? "Главный заголовок найден, но его конкретику нужно проверить вручную." : "Главный заголовок не найден.",
      findings: ["Проверить, понятна ли услуга за 5 секунд.", "Добавить конкретный результат для клиента.", "Убрать общие формулировки без измеримой пользы."],
      recommendation: "Сформулировать главный заголовок по схеме: результат + аудитория + срок или отличие."
    },
    {
      title: "Кнопки действия",
      score: analysis.ctaSignals.length > 0 ? 76 : 24,
      status: analysis.ctaSignals.length > 0 ? "Требует внимания" : "Критично",
      summary: analysis.ctaSignals.length > 0 ? `Найдены призывы к действию: ${analysis.ctaSignals.join(", ")}.` : "Явный призыв к действию не найден.",
      findings: ["Оставить один главный сценарий действия.", "Проверить видимость основной кнопки на первом экране.", "Добавить короткое пояснение о следующем шаге."],
      recommendation: "Сделать кнопку конкретной: пользователь должен понимать, что получит после нажатия."
    },
    {
      title: "Доверие",
      score: analysis.trustSignals.length > 0 ? 70 : 36,
      status: analysis.trustSignals.length > 0 ? "Требует внимания" : "Критично",
      summary: analysis.trustSignals.length > 0 ? `Найдены сигналы доверия: ${analysis.trustSignals.join(", ")}.` : "Отзывы, кейсы и гарантии не обнаружены.",
      findings: ["Поднять сильный кейс ближе к первой кнопке действия.", "Добавить цифры результата.", "Использовать реальные отзывы с контекстом."],
      recommendation: "Показать доказательства до того, как пользователь принимает решение оставить заявку."
    },
    {
      title: "Формы",
      score: analysis.hasForm ? 84 : hasContacts ? 62 : 22,
      status: analysis.hasForm ? "Хорошо" : hasContacts ? "Требует внимания" : "Критично",
      summary: analysis.hasForm ? "Форма заявки найдена." : hasContacts ? "Контакты есть, но форма заявки не найдена." : "Форма и доступные контакты не найдены.",
      findings: ["Оставить только обязательные поля.", "Подписать ожидаемый срок ответа.", "Проверить удобство заполнения с телефона."],
      recommendation: "Снизить усилие пользователя: короткая форма и понятный результат отправки."
    },
    {
      title: "Структура",
      score: structureScore,
      status: structureScore >= 70 ? "Хорошо" : "Требует внимания",
      summary: structureScore >= 70 ? "Контент и подзаголовки формируют базовый каркас страницы." : "Структуру страницы стоит усилить.",
      findings: ["Выстроить блоки от предложения к доказательствам.", "Убрать повторы и второстепенные детали.", "Завершать смысловые блоки подходящей кнопкой действия."],
      recommendation: "Провести пользователя по логике: проблема, решение, доказательства, действие."
    },
    {
      title: "Мобильная версия",
      score: 58,
      status: "Требует внимания",
      summary: "Требуется ручная проверка адаптива и мобильного сценария.",
      findings: ["Проверить первый экран на ширине 360 пикселей.", "Убедиться, что кнопки удобно нажимать.", "Проверить видимость контактов и формы."],
      recommendation: "Пройти весь путь заявки с телефона и убрать лишние шаги."
    }
  ];
}

function getDetailedIssues(analysis: AuditAnalysis): DetailedIssue[] {
  const generated = analysis.previewReport.insights.slice(0, 4).map((insight) => ({
    title: insight.title,
    priority: insight.priority === "Критично" ? "Критично" as const : "Важно" as const,
    category: insight.title.toLocaleLowerCase("ru-RU").includes("trust") || insight.title.toLocaleLowerCase("ru-RU").includes("довер") ? "Доверие" : "Конверсия",
    problem: insight.description,
    impact: "Пользователь получает недостаточно аргументов для уверенного следующего шага. Это увеличивает сомнение и снижает вероятность заявки.",
    fix: "Уточнить формулировку, проверить расположение элемента на первом экране и добавить понятный сценарий действия.",
    example: "Покажите конкретный результат, следующий шаг и одно доказательство рядом с основной кнопкой."
  }));

  if (generated.length > 0) return generated;

  // Demo issues are placeholders until the paid report generator is connected.
  return [
    {
      title: "Главное предложение требует более конкретной выгоды",
      priority: "Важно",
      category: "Главное предложение",
      problem: "Автоматическая проверка нашла главный заголовок, но не может оценить, насколько быстро новый посетитель понимает ценность предложения.",
      impact: "Если выгода считывается медленно, часть платного трафика уходит до знакомства с аргументами и кейсами.",
      fix: "Проверить главный заголовок вручную и добавить конкретный результат, аудиторию или срок.",
      example: "Вместо общего описания услуги используйте формулировку с понятным результатом для клиента."
    },
    {
      title: "Проверить силу основной кнопки на первом экране",
      priority: "Важно",
      category: "Кнопки действия",
      problem: "Призывы к действию присутствуют, но их заметность и убедительность требуют визуальной проверки.",
      impact: "Даже правильный текст кнопки не работает, если пользователь не замечает её или не понимает результат клика.",
      fix: "Оставить одну основную кнопку и добавить короткое пояснение следующего шага.",
      example: "Получить расчёт за 15 минут. После отправки уточним задачу и предложим варианты."
    }
  ];
}

export function FullReport({ analysis, reportDate }: FullReportProps) {
  const categories = getCategories(analysis);
  const detailedIssues = getDetailedIssues(analysis);
  const siteHeading = analysis.h1[0] || "Главный заголовок на странице не найден";

  return (
    <section className="full-report full-audit screen">
      <div className="full-report__inner full-audit__layout">
        <aside className="full-audit-sidebar">
          <section className="full-audit-sidebar__site">
            <div className="full-audit-sidebar__meta">
              <div><span>Дата аудита</span><b>{reportDate}</b></div>
              <div><span>Адрес сайта</span><a href={analysis.url} target="_blank" rel="noreferrer">{analysis.url}</a></div>
              <div><span>H1 сайта</span><b>{siteHeading}</b></div>
            </div>
            <div className="full-audit-sidebar__actions">
              <button className="pdf-button" type="button">Скачать PDF</button>
              <button className="telegram-button" type="button">Отправить в Telegram</button>
            </div>
          </section>
        </aside>

        <main className="full-audit-content">
          <header className="full-audit-content__hero">
            <p className="full-audit__eyebrow">Аудит продающей способности</p>
            <h2>Что мешает сайту приносить больше заявок</h2>
            <p>Разбор ключевых точек потери конверсии и последовательный план исправлений.</p>
            <div className="full-audit-content__hero-metrics">
              <div><span>Первый приоритет</span><b>Оффер и CTA</b></div>
              <div><span>Потенциал роста</span><b>+32%</b></div>
            </div>
          </header>

          <section className="full-audit-content__score">
            <div>
              <p className="full-audit__eyebrow">Общая оценка</p>
              <strong>{analysis.previewReport.score}<small>/100</small></strong>
            </div>
            <div>
              <h2>{getScoreLabel(analysis.previewReport.score)}</h2>
              <p>{getSummary(analysis)}</p>
            </div>
            <dl>
              <div><dt>Критично</dt><dd>{analysis.previewReport.criticalIssues}</dd></div>
              <div><dt>Важно</dt><dd>{analysis.previewReport.mediumIssues}</dd></div>
              <div><dt>Quick wins</dt><dd>{quickWins.length}</dd></div>
            </dl>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Разбор сайта" title="Разбор по категориям" />
            <div className="full-audit__categories">
              {categories.map((category) => (
                <article className="full-audit-category" key={category.title}>
                  <div className="full-audit-category__top">
                    <h3>{category.title}</h3>
                    <strong>{category.score}<small>/100</small></strong>
                  </div>
                  <span className={`full-audit__status status-${category.status === "Хорошо" ? "good" : category.status === "Критично" ? "critical" : "attention"}`}>{category.status}</span>
                  <p>{category.summary}</p>
                  <ul>{category.findings.map((finding) => <li key={finding}>{finding}</li>)}</ul>
                  <div className="full-audit-category__recommendation"><b>Рекомендация</b><span>{category.recommendation}</span></div>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Подробные замечания" title="Ключевые проблемы" />
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
                    <div className="full-audit-issue__grid">
                      <div><b>Что не так</b><p>{issue.problem}</p></div>
                      <div><b>Почему влияет на заявки</b><p>{issue.impact}</p></div>
                      <div><b>Что исправить</b><p>{issue.fix}</p></div>
                      <div><b>Пример улучшения</b><p>{issue.example}</p></div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Мобильная версия" title="Проверка мобильного сценария" />
            <div className="full-audit__mobile">
              <div className="phone-preview" aria-label="Схема мобильной версии">
                <div className="phone-screen">
                  <div className="phone-line" />
                  <div className="phone-line phone-line--short" />
                  <div className="phone-line" />
                  <div className="phone-cta" />
                  <div className="phone-line" />
                  <div className="phone-line phone-line--short" />
                </div>
              </div>
              <div>
                <p>Автоматическая проверка кода страницы не заменяет визуальную проверку адаптива. Перед запуском рекламы вручную пройдите путь заявки на телефоне.</p>
                <ul>
                  <li>Проверьте первый экран на ширине 360 пикселей.</li>
                  <li>Убедитесь, что основная кнопка видна без лишней прокрутки.</li>
                  <li>Проверьте размеры кнопок и удобство полей формы.</li>
                  <li>Убедитесь, что контакты доступны в один клик.</li>
                </ul>
              </div>
            </div>
          </section>

        </main>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="full-audit__section-heading"><p className="full-audit__eyebrow">{eyebrow}</p><h2>{title}</h2></div>;
}
