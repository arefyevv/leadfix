import { IssueCard } from "./IssueCard";
import { MetricCard } from "./MetricCard";
import type { AuditAnalysis } from "@/types/audit";

type PreviewReportProps = {
  analysis: AuditAnalysis;
  onCheckout: () => void;
  onReset: () => void;
};

export function PreviewReport({ analysis, onCheckout, onReset }: PreviewReportProps) {
  const { previewReport } = analysis;

  return (
    <section className="report screen">
      <div className="report__inner">
        <h2 className="report__title">Предварительный отчёт</h2>
        <p className="report__subtitle">Мы проверили HTML страницы и нашли первые точки, где сайт может терять заявки.</p>
        <div className="url-pill">{analysis.url}</div>

        <div className="report-card">
          <div className="report-grid">
            <MetricCard value={`${previewReport.score}/100`} label="оценка продающей способности" accent />
            <MetricCard value={String(previewReport.criticalIssues)} label="критичные проблемы" />
            <MetricCard value={String(previewReport.mediumIssues)} label="средние проблемы" />
            <MetricCard value={String(previewReport.lowIssues)} label="низкий приоритет" />
          </div>
        </div>

        <section className="report-section">
          <h3 className="section-heading">Первые найденные проблемы</h3>
          <div className="insight-grid">
            {previewReport.insights.length > 0 ? (
              previewReport.insights.map((insight) => (
                <IssueCard
                  key={insight.title}
                  critical={insight.priority === "Критично"}
                  title={insight.title}
                  priority={insight.priority}
                  text={insight.description}
                />
              ))
            ) : (
              <IssueCard
                title="Критичных ошибок не найдено"
                priority="Низкий"
                text="Базовые элементы страницы присутствуют. Для более глубокого аудита потребуется проверка структуры, визуальной и мобильной версии."
              />
            )}
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
