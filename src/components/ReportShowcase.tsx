"use client";

import { useState } from "react";

type AnalysisKey = "offer" | "cta" | "trust" | "mobile" | "structure";

const reportScreenshot = "/screenshots/report-demo-full.png";

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
    text: "Смотрим, удобно ли читать, нажимать и оставлять заявку с телефона."
  },
  {
    key: "structure",
    title: "Структура и путь к заявке",
    text: "Смотрим, ведёт ли страница к заявке по понятному сценарию или распадается на слабо связанные блоки."
  }
];

export function ReportShowcase() {
  const [hoveredCard, setHoveredCard] = useState<AnalysisKey | null>(null);
  const [selectedCard, setSelectedCard] = useState<AnalysisKey | null>(null);
  const activeCard = hoveredCard ?? selectedCard;

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

        <div
          className={`report-showcase__stage report-showcase__stage--real${activeCard ? ` is-highlighting is-${activeCard}` : ""}`}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <figure className="report-showcase__shot report-showcase__shot--main">
            <div className="report-showcase__shot-viewport">
              <div className="report-showcase__shot-canvas">
                <img
                  className="report-showcase__image report-showcase__image--base"
                  src={reportScreenshot}
                  alt="Фрагмент полного отчёта LeadFix с оценкой и выводом"
                  loading="lazy"
                />
                <img
                  className="report-showcase__image report-showcase__image--blur"
                  src={reportScreenshot}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
                <img
                  className="report-showcase__image report-showcase__image--focus"
                  src={reportScreenshot}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
                <span className="report-showcase__zone report-showcase__zone--offer" aria-hidden="true" />
                <span className="report-showcase__zone report-showcase__zone--cta" aria-hidden="true" />
                <span className="report-showcase__zone report-showcase__zone--trust" aria-hidden="true" />
                <span className="report-showcase__zone report-showcase__zone--mobile" aria-hidden="true" />
                <span className="report-showcase__zone report-showcase__zone--structure" aria-hidden="true" />
              </div>
            </div>
          </figure>

          <div className="report-showcase__cards" aria-label="Типы анализа в отчёте">
            {analysisCards.map((card) => (
              <article
                className={activeCard === card.key ? "is-active" : undefined}
                key={card.key}
                onClick={() => setSelectedCard(card.key)}
                onFocus={() => setHoveredCard(card.key)}
                onMouseEnter={() => {
                  setHoveredCard(card.key);
                }}
                tabIndex={0}
              >
                <span className="report-showcase__marker" aria-hidden="true" />
                <div className="report-showcase__card-copy">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="report-showcase__cta">
          <a href="/primer-audita-lendinga">Посмотреть пример аудита</a>
          <p>Первые ошибки покажем бесплатно</p>
        </div>
      </div>
    </section>
  );
}
