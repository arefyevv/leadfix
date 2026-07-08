"use client";

type AnalysisKey = "offer" | "cta" | "trust" | "mobile" | "team";

const reportScreenshot = "/screenshots/report-demo-full.png";

const analysisCards: Array<{ key: AnalysisKey; title: string; text: string }> = [
  {
    key: "offer",
    title: "Оценка готовности",
    text: "Общий балл показывает, насколько страница готова принимать платный трафик."
  },
  {
    key: "cta",
    title: "Приоритет проблем",
    text: "Отчёт выделяет, что сильнее всего мешает заявке и с чего начать правки."
  },
  {
    key: "trust",
    title: "Понятные рекомендации",
    text: "Каждая проблема объяснена простым языком: где она находится и почему влияет на заявки."
  },
  {
    key: "mobile",
    title: "План правок",
    text: "В конце есть список задач для дизайнера, маркетолога или разработчика."
  },
  {
    key: "team",
    title: "Ссылка или PDF для команды",
    text: "Отчёт можно открыть по ссылке или сохранить в PDF для обсуждения правок."
  }
];

export function ReportShowcase() {
  return (
    <section className="landing-section result-showcase report-showcase" id="cases">
      <div className="report-showcase__inner">
        <div className="report-showcase__head">
          <span className="report-showcase__badge">Пример отчёта</span>
          <h2>Посмотрите, как выглядит результат</h2>
          <p>
            Отчёт показывает общий балл, главные причины потери заявок, приоритет правок и задачи для команды.
          </p>
        </div>

        <div className="report-showcase__stage report-showcase__stage--real">
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

          <div className="report-showcase__cards" aria-label="Что будет в отчёте">
            {analysisCards.map((card) => (
              <article key={card.key}>
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
          <a className="report-showcase__cta-primary" href="#pricing">Проверить свой лендинг</a>
          <a className="report-showcase__cta-secondary" href="/primer-audita-lendinga">Смотреть демо-отчёт</a>
        </div>
      </div>
    </section>
  );
}
