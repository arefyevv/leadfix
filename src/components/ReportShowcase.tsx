"use client";

import { useState } from "react";

type AnalysisKey = "offer" | "cta" | "trust" | "mobile" | "wins";

const reportIssues = [
  {
    status: "critical",
    label: "Критично",
    title: "Первый экран не объясняет ценность продукта за 5 секунд.",
    recommendation: "Сделать оффер конкретнее: результат, аудитория и причина выбрать вас.",
    key: "offer" as AnalysisKey
  },
  {
    status: "critical",
    label: "Критично",
    title: "CTA теряется на фоне других элементов.",
    recommendation: "Выделить главный призыв и убрать конкурирующие действия.",
    key: "cta" as AnalysisKey
  },
  {
    status: "medium",
    label: "Важно",
    title: "Нет доказательств доверия рядом с формой.",
    recommendation: "Добавить цифры, кейсы или короткий отзыв до отправки заявки.",
    key: "trust" as AnalysisKey
  }
];

const quickWins = [
  "Переписать оффер",
  "Уточнить главный CTA",
  "Добавить доверие у формы",
  "Упростить мобильную форму"
];

const analysisCards: Array<{ key: AnalysisKey; title: string; text: string }> = [
  {
    key: "offer",
    title: "Оффер и первый экран",
    text: "Показываем, понятно ли за первые секунды, что предлагают, кому это нужно и зачем оставлять заявку."
  },
  {
    key: "cta",
    title: "Кнопки и формы",
    text: "Проверяем путь к заявке: кнопки, следующий шаг, форму и лишнее трение перед отправкой."
  },
  {
    key: "trust",
    title: "Доверие и доказательства",
    text: "Находим места, где не хватает фактов, цифр, кейсов, отзывов или понятных гарантий."
  },
  {
    key: "mobile",
    title: "Мобильная версия",
    text: "Смотрим, удобно ли читать, нажимать и оставить заявку с телефона."
  },
  {
    key: "wins",
    title: "План правок",
    text: "Собираем найденные проблемы в понятный порядок: что исправить сначала и что можно отложить."
  }
];

export function ReportShowcase() {
  const [activeArea, setActiveArea] = useState<AnalysisKey | null>(null);

  return (
    <section className="landing-section result-showcase report-showcase" id="cases">
      <div className="report-showcase__inner">
        <div className="report-showcase__head">
          <span className="report-showcase__badge">Пример отчёта</span>
          <h2>Посмотрите, что покажет аудит</h2>
          <p>
            Отчёт показывает оценку по зонам, приоритетные проблемы и порядок правок:
            оффер, кнопки, доверие, формы, структура, мобильная версия, техника и соответствие рекламе.
          </p>
        </div>

        <div className="report-showcase__cards" aria-label="Типы анализа в отчёте">
          {analysisCards.map((card) => (
            <article
              className={activeArea === card.key ? "is-active" : ""}
              key={card.key}
              onMouseEnter={() => setActiveArea(card.key)}
              onMouseLeave={() => setActiveArea(null)}
              onFocus={() => setActiveArea(card.key)}
              onBlur={() => setActiveArea(null)}
              tabIndex={0}
            >
              <span />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>

        <div className={`report-showcase__stage ${activeArea ? `is-highlighting is-${activeArea}` : ""}`}>
          <div className="audit-report-mockup" aria-label="Пример отчёта аудита сайта">
            <div className="audit-report-mockup__top">
              <div>
                <span>Сайт</span>
                <strong>example-shop.ru</strong>
              </div>
              <div>
                <span>Тип аудита</span>
                <strong>Аудит конверсии</strong>
              </div>
              <button type="button">PDF отчёт</button>
            </div>

            <div className="audit-report-mockup__summary">
              <div className="audit-report-score">
                <span>Готовность к платному трафику</span>
                <strong>61/100</strong>
                <i>Требует правок перед запуском</i>
              </div>

              <div className="audit-report-metrics">
                <article>
                  <span>Критично</span>
                  <strong>2</strong>
                  <small>Исправить первым</small>
                </article>
                <article>
                  <span>Важно</span>
                  <strong>5</strong>
                  <small>Влияет на заявки</small>
                </article>
                <article>
                  <span>План</span>
                  <strong>4</strong>
                  <small>Правки в первую очередь</small>
                </article>
              </div>
            </div>

            <div className="audit-report-mockup__body">
              <div className="audit-report-issues">
                <div className="audit-report-block-title">
                  <span>Найденные проблемы</span>
                  <b>Что исправить сначала</b>
                </div>
                {reportIssues.map((issue) => (
                  <article
                    className={`audit-report-issue audit-report-issue--${issue.status} audit-area-${issue.key}`}
                    key={issue.title}
                  >
                    <span>{issue.label}</span>
                    <h3>{issue.title}</h3>
                    <p>{issue.recommendation}</p>
                  </article>
                ))}
              </div>

              <aside className="audit-report-roadmap audit-area-wins">
                <span>Что исправить в первую очередь</span>
                <ol>
                  <li>Переписать оффер первого экрана</li>
                  <li>Выделить главный CTA</li>
                  <li>Добавить доверие перед формой</li>
                  <li>Упростить мобильную форму</li>
                </ol>
                <div className="audit-report-quickwins">
                  <b>Первые правки</b>
                  {quickWins.map((item) => (
                    <small key={item}>{item}</small>
                  ))}
                </div>
              </aside>
            </div>
          </div>

          <aside className="audit-side-mockup" aria-label="Краткий экран рекомендаций">
            <div className="audit-side-mockup__head">
              <span>Приоритеты</span>
              <strong>План на 24 часа</strong>
            </div>
            <div className="audit-side-mockup__score">
              <b>68/100</b>
              <span>готовность сайта к трафику</span>
            </div>
            <div className="audit-side-mockup__list audit-area-wins">
              <p><i /> Переписать оффер</p>
              <p><i /> Поднять главный CTA</p>
              <p><i /> Добавить доверие у формы</p>
            </div>
            <div className="audit-side-mockup__phone audit-area-mobile">
              <span />
              <b>Мобильная версия</b>
              <small>2 точки трения</small>
            </div>
          </aside>
        </div>

        <div className="report-showcase__cta">
          <a href="/checkout">Проверить сайт</a>
          <p>Первые ошибки покажем бесплатно</p>
        </div>
      </div>
    </section>
  );
}
