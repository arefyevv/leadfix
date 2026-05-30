import type { AuditAnalysis } from "@/types/audit";

type FullReportProps = {
  analysis: AuditAnalysis;
  reportDate: string;
};

const breakdown = [
  ["Offer clarity", 60, "12/20"],
  ["CTA", 40, "8/20"],
  ["Trust", 25, "5/20"],
  ["Structure", 80, "16/20"],
  ["Mobile UX", 100, "20/20"]
] as const;

export function FullReport({ analysis, reportDate }: FullReportProps) {
  return (
    <section className="full-report screen">
      <div className="full-report__inner">
        <section className="report-top">
          <div>
            <h2>Полный аудит сайта</h2>
            <p>Найдены точки потери заявок и рекомендации по увеличению конверсии.</p>
            <div className="report-meta">
              <span className="meta-pill">{analysis.url}</span>
              <span className="meta-pill">{reportDate}</span>
            </div>
          </div>
          <button className="pdf-button" type="button">Скачать PDF</button>
        </section>

        <section className="report-block">
          <h3>Summary</h3>
          <div className="summary-grid">
            <div className="summary-card"><strong>{analysis.previewReport.score}/100</strong><span>Общая оценка</span></div>
            <div className="summary-card"><strong>+32%</strong><span>Потенциал роста</span></div>
            <div className="summary-card"><strong>{analysis.previewReport.criticalIssues}</strong><span>Критичных проблем</span></div>
            <div className="summary-card"><strong>4</strong><span>Quick wins</span></div>
          </div>
        </section>

        <section className="report-block">
          <h3>Conversion score breakdown</h3>
          <div className="breakdown-list">
            {breakdown.map(([name, width, score]) => (
              <div className="breakdown-row" key={name}>
                <b>{name}</b>
                <div className="score-bar"><i style={{ width: `${width}%` }} /></div>
                <span>{score}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="report-block">
          <h3>Critical problems</h3>
          <div className="issue-grid">
            <CriticalIssue title="Слабый оффер" priority="Critical" critical problem="На первом экране не сформулирована конкретная выгода для пользователя." why="Пользователь не понимает ценность предложения за первые секунды." fix="Сделать оффер более конкретным и ориентированным на результат." />
            <CriticalIssue title="Недостаточно доверия" priority="High" problem="Перед формой отсутствуют кейсы, цифры или доказательства." why="Это увеличивает сомнение перед отправкой заявки." fix="Добавить кейсы, цифры результатов, отзывы или гарантии." />
          </div>
        </section>

        <section className="report-block">
          <h3>Что можно улучшить за 1 день</h3>
          <div className="quick-grid">
            <div className="quick-card">Переместить CTA выше</div>
            <div className="quick-card">Сократить hero-text</div>
            <div className="quick-card">Добавить microcopy под кнопкой</div>
            <div className="quick-card">Добавить доверие рядом с формой</div>
          </div>
        </section>

        <section className="report-block">
          <h3>Mobile UX</h3>
          <div className="mobile-layout">
            <div className="phone-preview" aria-label="Mock mobile preview">
              <div className="phone-screen">
                <div className="phone-line" />
                <div className="phone-line phone-line--short" />
                <div className="phone-line" />
                <div className="phone-cta" />
                <div className="phone-line" />
                <div className="phone-line phone-line--short" />
              </div>
            </div>
            <ul className="mobile-notes">
              <li><b>CTA виден быстро.</b> Но рядом не хватает объяснения следующего шага.</li>
              <li><b>Hero-текст занимает много внимания.</b> Можно быстрее довести до действия.</li>
              <li><b>Форма выглядит доступной.</b> Добавьте доказательства рядом, чтобы снизить сомнение.</li>
            </ul>
          </div>
        </section>

        <section className="report-block">
          <h3>Recommendations roadmap</h3>
          <div className="roadmap">
            <div className="roadmap-step"><strong>Step 1</strong>исправить оффер</div>
            <div className="roadmap-step"><strong>Step 2</strong>усилить CTA</div>
            <div className="roadmap-step"><strong>Step 3</strong>добавить trust</div>
            <div className="roadmap-step"><strong>Step 4</strong>улучшить формы</div>
          </div>
        </section>

        <section className="final-cta">
          <h3>Хотите внедрить рекомендации?</h3>
          <div className="final-cta__actions">
            <button className="report-button report-button--primary" type="button">Заказать доработку сайта</button>
            <button className="report-button report-button--secondary" type="button">Получить консультацию</button>
          </div>
        </section>
      </div>
    </section>
  );
}

function CriticalIssue({ title, problem, why, fix, priority, critical = false }: { title: string; problem: string; why: string; fix: string; priority: string; critical?: boolean }) {
  return (
    <article className="critical-issue">
      <h4>{title}</h4>
      <div className="issue-field"><b>Проблема</b><p>{problem}</p></div>
      <div className="issue-field"><b>Почему это важно</b><p>{why}</p></div>
      <div className="issue-field"><b>Что исправить</b><p>{fix}</p></div>
      <span className={critical ? "priority priority--critical" : "priority"}>{priority}</span>
    </article>
  );
}
