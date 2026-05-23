import { IssueCard } from "./IssueCard";
import { MetricCard } from "./MetricCard";
import type { MockAnalysis } from "./types";

type PreviewReportProps = {
  analysis: MockAnalysis;
  onCheckout: () => void;
  onReset: () => void;
};

export function PreviewReport({ analysis, onCheckout, onReset }: PreviewReportProps) {
  return (
    <section className="report screen">
      <div className="report__inner">
        <h2 className="report__title">Предварительный отчёт</h2>
        <p className="report__subtitle">Мы нашли первые точки, где сайт может терять заявки. Это mock-preview без backend и AI.</p>
        <div className="url-pill">{analysis.url}</div>

        <div className="report-card">
          <div className="report-grid">
            <MetricCard value="61/100" label="оценка продающей способности" accent />
            <MetricCard value="2" label="критичные проблемы" />
            <MetricCard value="5" label="средние проблемы" />
            <MetricCard value="3" label="низкий приоритет" />
          </div>
        </div>

        <section className="report-section">
          <h3 className="section-heading">Первые найденные проблемы</h3>
          <div className="insight-grid">
            <IssueCard
              critical
              title="Слабый оффер на первом экране"
              priority="Критично"
              text="Пользователь не сразу понимает, какую конкретную выгоду получит и почему стоит оставить заявку именно здесь."
            />
            <IssueCard
              title="CTA не объясняет следующий шаг"
              priority="Важно"
              text="Кнопка есть, но она не снижает сомнение перед кликом и не объясняет, что произойдёт после нажатия."
            />
            <IssueCard
              title="Недостаточно доверия до формы"
              priority="Важно"
              text="Перед заявкой не хватает доказательств: кейсов, цифр, отзывов, гарантий или понятного объяснения процесса."
            />
          </div>
        </section>

        <section className="locked-section">
          <h3>Ещё 12 рекомендаций доступны в полном отчёте</h3>
          <p>Полный аудит покажет, что исправить в первую очередь, как усилить оффер, CTA, доверие, формы и мобильную версию.</p>
          <div className="locked-grid" aria-hidden="true">
            <div className="locked-card"><span /><span /><span /></div>
            <div className="locked-card"><span /><span /><span /></div>
            <div className="locked-card"><span /><span /><span /></div>
          </div>
          <div className="report-actions">
            <button className="report-button report-button--primary" type="button" onClick={onCheckout}>Получить полный аудит</button>
            <button className="report-button report-button--secondary" type="button" onClick={onReset}>Проверить другой сайт</button>
          </div>
        </section>
      </div>
    </section>
  );
}
