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

const implementationPlan = [
  ["День 1", "Быстрые правки", "Главное предложение, кнопка действия, пояснения и порядок блоков первого экрана."],
  ["Дни 2–4", "Доверие и формы", "Кейсы, цифры, отзывы, гарантии и упрощение заявки."],
  ["Дни 5–7", "Мобильная версия", "Проверка адаптива, размеров кнопок и доступности контактов."],
  ["Дни 8–14", "Тестирование", "Запуск трафика, замер конверсии и итерация по данным."]
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

  return (
    <section className="full-report full-audit screen">
      <div className="full-report__inner full-audit__inner">
        <header className="full-audit__header">
          <div>
            <p className="full-audit__eyebrow">Полный отчёт LeadFix</p>
            <h1>Полный аудит продающей способности</h1>
            <p>Приоритеты исправлений и рекомендации для дизайнера, маркетолога или подрядчика.</p>
            <div className="full-audit__details">
              <div><b>Дата аудита</b><span>{reportDate}</span></div>
              <div><b>Сайт</b><span>{analysis.url}</span></div>
              <div><b>Ниша</b><span>Не определена</span></div>
            </div>
          </div>
          <div className="full-audit__header-actions">
            <button className="pdf-button" type="button">Скачать PDF</button>
            <button className="telegram-button" type="button">Отправить в Telegram</button>
          </div>
        </header>

        <section className="full-audit__score">
          <div>
            <p className="full-audit__eyebrow">Итоговая оценка</p>
            <strong>{analysis.previewReport.score}<small>/100</small></strong>
          </div>
          <div>
            <h2>{getScoreLabel(analysis.previewReport.score)}</h2>
            <p>{getSummary(analysis)}</p>
          </div>
          <dl>
            <div><dt>Критично</dt><dd>{analysis.previewReport.criticalIssues}</dd></div>
            <div><dt>Важно</dt><dd>{analysis.previewReport.mediumIssues}</dd></div>
            <div><dt>Быстрые правки</dt><dd>{quickWins.length}</dd></div>
          </dl>
        </section>

        <section className="full-audit__section">
          <SectionHeading eyebrow="Краткий вывод" title="Главный вывод" />
          <div className="full-audit__summary">
            <p>{getSummary(analysis)}</p>
            <div>
              <b>Первый приоритет</b>
              <span>Усилить главное предложение и первую кнопку действия, затем добавить доказательства результата перед формой.</span>
            </div>
          </div>
        </section>

        <section className="full-audit__section">
          <SectionHeading eyebrow="Порядок работ" title="Приоритетный план исправлений" />
          <div className="full-audit__priority-grid">
            <PriorityColumn label="01 / Сначала" tone="critical" items={["Главное предложение первого экрана", "Основная кнопка и следующий шаг", "Доступность формы или контактов"]} />
            <PriorityColumn label="02 / Затем" tone="attention" items={["Кейсы и цифры результата", "Отзывы рядом с точкой решения", "Сценарий мобильной заявки"]} />
            <PriorityColumn label="03 / После" tone="good" items={["Дополнительные кнопки по странице", "Заголовок и описание для поисковиков", "Сравнительный тест формулировок"]} />
          </div>
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
          <SectionHeading eyebrow="Быстрые правки" title="Что можно улучшить за 1 день" />
          <div className="full-audit__quick-wins">
            {quickWins.map((item, index) => <div key={item}><strong>{String(index + 1).padStart(2, "0")}</strong><span>{item}</span></div>)}
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

        <section className="full-audit__section">
          <SectionHeading eyebrow="План внедрения" title="План работ на 7–14 дней" />
          <div className="full-audit__timeline">
            {implementationPlan.map(([period, title, description]) => (
              <article key={period}><strong>{period}</strong><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
        </section>

        <section className="full-audit__cta">
          <p className="full-audit__eyebrow">Внедрение</p>
          <h2>Нужна помощь с исправлениями?</h2>
          <p>Передайте отчёт вашей команде или закажите доработку сайта по готовому плану.</p>
          <div className="final-cta__actions">
            <button className="report-button report-button--primary" type="button">Заказать доработку сайта</button>
            <button className="report-button report-button--secondary" type="button">Получить консультацию</button>
          </div>
        </section>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="full-audit__section-heading"><p className="full-audit__eyebrow">{eyebrow}</p><h2>{title}</h2></div>;
}

function PriorityColumn({ label, items, tone }: { label: string; items: string[]; tone: "critical" | "attention" | "good" }) {
  return <article className={`full-audit__priority is-${tone}`}><h3>{label}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}
