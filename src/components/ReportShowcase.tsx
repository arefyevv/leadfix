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
  "Упростить заголовок",
  "Добавить повторный CTA",
  "Поднять отзывы выше",
  "Убрать лишние поля формы"
];

const analysisCards: Array<{ key: AnalysisKey; title: string; text: string }> = [
  {
    key: "offer",
    title: "Ошибки оффера",
    text: "Показываем, понятно ли пользователю, что он получит и почему стоит оставить заявку."
  },
  {
    key: "cta",
    title: "CTA и формы",
    text: "Проверяем заметность кнопок, следующий шаг и лишние поля в форме."
  },
  {
    key: "trust",
    title: "Доверие",
    text: "Находим места, где не хватает цифр, кейсов, отзывов или гарантий."
  },
  {
    key: "mobile",
    title: "Мобильная версия",
    text: "Смотрим, удобно ли читать, нажимать и оставить заявку с телефона."
  },
  {
    key: "wins",
    title: "Быстрые победы",
    text: "Отдельно выделяем правки, которые можно внедрить без редизайна."
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
            Отчёт показывает критичные ошибки, быстрые улучшения и рекомендации по офферу,
            CTA, доверию, структуре, формам и мобильной версии.
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
                <span>Оценка конверсии</span>
                <strong>61/100</strong>
                <i>+32% потенциал роста</i>
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
                  <span>Quick wins</span>
                  <strong>4</strong>
                  <small>Быстрые правки</small>
                </article>
              </div>
            </div>

            <div className="audit-report-mockup__body">
              <div className="audit-report-issues">
                <div className="audit-report-block-title">
                  <span>Найденные проблемы</span>
                  <b>Карта приоритетов</b>
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
                  <b>Быстрые правки</b>
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
              <b>+32%</b>
              <span>потенциал роста заявок</span>
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
