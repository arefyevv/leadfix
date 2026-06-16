"use client";

import { useEffect, useRef, useState } from "react";

type AnalysisKey = "offer" | "cta" | "trust" | "mobile" | "structure";

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

const zoneViewportPositions: Record<AnalysisKey, number> = {
  offer: 0.02,
  cta: 0.48,
  trust: 0.48,
  mobile: 0.62,
  structure: 0.84
};

export function ReportShowcase() {
  const [hoveredCard, setHoveredCard] = useState<AnalysisKey | null>(null);
  const [selectedCard, setSelectedCard] = useState<AnalysisKey | null>(null);
  const activeCard = hoveredCard ?? selectedCard;
  const shotViewportRef = useRef<HTMLDivElement | null>(null);
  const shotCanvasRef = useRef<HTMLDivElement | null>(null);
  const [canvasOffset, setCanvasOffset] = useState(0);

  useEffect(() => {
    const viewport = shotViewportRef.current;
    const canvas = shotCanvasRef.current;
    if (!viewport || !canvas) return;

    if (!selectedCard) {
      setCanvasOffset(0);
      return;
    }

    const maxOffset = Math.max(0, canvas.scrollHeight - viewport.clientHeight);
    if (maxOffset <= 0) {
      setCanvasOffset(0);
      return;
    }

    const targetTop = zoneViewportPositions[selectedCard] * canvas.scrollHeight;
    const nextOffset = Math.max(0, Math.min(maxOffset, targetTop - viewport.clientHeight * 0.16));
    setCanvasOffset(nextOffset);
  }, [selectedCard]);

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
            <div className="report-showcase__shot-viewport" ref={shotViewportRef}>
              <div
                className="report-showcase__shot-canvas"
                ref={shotCanvasRef}
                style={{ transform: `translateY(-${canvasOffset}px)` }}
              >
                <img
                  className="report-showcase__image report-showcase__image--base"
                  src="/screenshots/report-real-overview.png"
                  alt="Фрагмент полного отчёта LeadFix с оценкой и выводом"
                  loading="lazy"
                />
                <img
                  className="report-showcase__image report-showcase__image--blur"
                  src="/screenshots/report-real-overview.png"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
                <img
                  className="report-showcase__image report-showcase__image--focus"
                  src="/screenshots/report-real-overview.png"
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
                onFocus={() => setSelectedCard(card.key)}
                onMouseEnter={() => setHoveredCard(card.key)}
                tabIndex={0}
              >
                <span />
                <h3>{card.title}</h3>
                <p>{card.text}</p>
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
