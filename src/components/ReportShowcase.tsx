const reportMetrics = [
  ["Score", "61/100", "Общая оценка"],
  ["Critical", "2", "Исправить первым"],
  ["Medium", "5", "Влияет на заявки"],
  ["Quick wins", "4", "Можно сделать быстро"]
];

const reportIssues = [
  {
    status: "critical",
    label: "Critical",
    title: "Первый экран не объясняет ценность продукта за 5 секунд.",
    recommendation: "Сделать оффер конкретнее: результат, аудитория, причина выбрать вас."
  },
  {
    status: "critical",
    label: "Critical",
    title: "CTA теряется на фоне других элементов.",
    recommendation: "Повторить главный CTA в hero и убрать конкурирующие действия."
  },
  {
    status: "medium",
    label: "Medium",
    title: "Нет социальных доказательств рядом с формой.",
    recommendation: "Добавить цифры, кейсы или короткий отзыв до отправки заявки."
  }
];

const quickWins = [
  "Упростить заголовок",
  "Добавить повторный CTA",
  "Поднять отзывы выше",
  "Убрать лишние поля формы"
];

const analysisCards = [
  ["Ошибки оффера", "Понятно ли, что получит клиент и почему стоит оставить заявку."],
  ["CTA и формы", "Видны ли кнопки, понятен ли следующий шаг, нет ли лишних полей."],
  ["Доверие", "Есть ли доказательства, цифры, отзывы и гарантии перед формой."],
  ["Мобильная версия", "Удобно ли читать, нажимать и оставить заявку с телефона."],
  ["Быстрые победы", "Что можно исправить быстро без полного редизайна страницы."]
];

export function ReportShowcase() {
  return (
    <section className="landing-section result-showcase report-showcase" id="cases">
      <div className="report-showcase__inner">
        <div className="report-showcase__head">
          <span className="report-showcase__badge">Пример отчёта</span>
          <h2>Посмотрите, что именно покажет аудит</h2>
          <p>
            Отчёт собирает критичные ошибки, quick wins и рекомендации по офферу, CTA,
            доверию, структуре, формам и мобильной версии в понятный план исправлений.
          </p>
        </div>

        <div className="report-showcase__stage">
          <div className="audit-report-mockup" aria-label="Пример отчёта аудита сайта">
            <div className="audit-report-mockup__top">
              <div>
                <span>Site</span>
                <strong>example-shop.ru</strong>
              </div>
              <div>
                <span>Audit type</span>
                <strong>Conversion audit</strong>
              </div>
              <button type="button">PDF preview</button>
            </div>

            <div className="audit-report-mockup__summary">
              <div className="audit-report-score">
                <span>Conversion score</span>
                <strong>61/100</strong>
                <i>+32% potential uplift</i>
              </div>

              <div className="audit-report-metrics">
                {reportMetrics.slice(1).map(([label, value, caption]) => (
                  <article key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <small>{caption}</small>
                  </article>
                ))}
              </div>
            </div>

            <div className="audit-report-mockup__body">
              <div className="audit-report-issues">
                <div className="audit-report-block-title">
                  <span>Найденные проблемы</span>
                  <b>Priority map</b>
                </div>
                {reportIssues.map((issue) => (
                  <article className={`audit-report-issue audit-report-issue--${issue.status}`} key={issue.title}>
                    <span>{issue.label}</span>
                    <h3>{issue.title}</h3>
                    <p>{issue.recommendation}</p>
                  </article>
                ))}
              </div>

              <aside className="audit-report-roadmap">
                <span>Что исправить в первую очередь</span>
                <ol>
                  <li>Переписать оффер первого экрана</li>
                  <li>Выделить главный CTA</li>
                  <li>Добавить доверие перед формой</li>
                  <li>Упростить мобильную форму</li>
                </ol>
                <div className="audit-report-quickwins">
                  <b>Quick wins</b>
                  {quickWins.map((item) => (
                    <small key={item}>{item}</small>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </div>

        <div className="report-showcase__cards" aria-label="Типы анализа в отчёте">
          {analysisCards.map(([title, text]) => (
            <article key={title}>
              <span />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="report-showcase__cta">
          <a href="#audit">Проверить свой сайт</a>
          <p>Первые ошибки покажем бесплатно</p>
        </div>
      </div>
    </section>
  );
}
