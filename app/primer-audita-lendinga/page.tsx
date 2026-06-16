import type { Metadata } from "next";
import { Header } from "@/components/Header";

const sampleIssues = [
  {
    title: "Оффер звучит слишком обще",
    summary: "Пользователь видит обещание роста заявок, но не понимает, за счет чего и для какого типа бизнеса подходит предложение."
  },
  {
    title: "CTA не объясняет следующий шаг",
    summary: "Кнопка не снижает тревожность и не отвечает на вопрос, что именно произойдет после отправки формы."
  },
  {
    title: "Рядом с формой не хватает доверия",
    summary: "Нет быстрых доказательств, сроков ответа и пояснения, какой результат получит клиент после обращения."
  }
];

const reportSections = [
  "оценка готовности лендинга к заявкам",
  "приоритетные проблемы по влиянию на конверсию",
  "разбор первого экрана, CTA, форм и доверия",
  "мобильная версия и технические барьеры",
  "порядок правок: что исправить сначала"
];

export const metadata: Metadata = {
  title: "Пример аудита лендинга",
  description: "Посмотрите HTML-пример аудита лендинга от LeadFix: какие проблемы показываются в отчете и что клиент получает после проверки сайта.",
  alternates: {
    canonical: "/primer-audita-lendinga"
  }
};

export default function SampleAuditPage() {
  return (
    <div className="legal-shell seo-shell">
      <Header />
      <main className="seo-page">
        <section className="seo-hero">
          <p className="seo-page__eyebrow">HTML-пример отчёта</p>
          <h1>Пример аудита лендинга</h1>
          <p className="seo-page__lead">
            Эта страница показывает, как выглядит аудит LeadFix в браузере: с приоритетами, пояснениями и конкретными правками.
            Мы не раскрываем внутренний scoring и промпты, но показываем формат результата, который получает клиент.
          </p>
          <div className="seo-actions">
            <a className="seo-button seo-button--primary" href="/#audit">Проверить свой сайт</a>
            <a className="seo-button seo-button--ghost" href="/full-report-demo">Открыть демо полного отчёта</a>
          </div>
        </section>

        <section className="seo-section">
          <div className="section-head">
            <div className="section-kicker">Что видно в примере</div>
            <h2>Не абстрактный score, а причины потери заявок</h2>
            <p>Отчёт нужен не ради красивой оценки, а чтобы понять, что мешает заявке и что исправлять в первую очередь.</p>
          </div>
          <div className="seo-shot-grid">
            <figure className="seo-shot-card">
              <img src="/screenshots/report-real-overview.png" alt="Обзор аудита LeadFix с оценкой и выводом" loading="lazy" />
              <figcaption>Общая оценка и решение: можно ли вести трафик прямо сейчас.</figcaption>
            </figure>
            <figure className="seo-shot-card">
              <img src="/screenshots/report-real-details.png" alt="Подробный разбор проблем в отчете LeadFix" loading="lazy" />
              <figcaption>Подробные проблемы, влияние на заявку и пример следующего шага.</figcaption>
            </figure>
          </div>
        </section>

        <section className="seo-section">
          <div className="section-head">
            <div className="section-kicker">Типовые выводы</div>
            <h2>Какие замечания показывает аудит</h2>
            <p>Ниже примеры проблем, которые LeadFix ищет на лендинге до запуска рекламы или перед доработкой страницы.</p>
          </div>
          <div className="seo-card-grid">
            {sampleIssues.map((issue) => (
              <article className="seo-card" key={issue.title}>
                <h3>{issue.title}</h3>
                <p>{issue.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-section">
          <div className="section-head">
            <div className="section-kicker">Что входит</div>
            <h2>Что получает клиент в полном отчёте</h2>
            <p>Состав результата зависит от тарифа, но ядро отчёта строится вокруг одних и тех же зон проверки.</p>
          </div>
          <div className="seo-list-card">
            <ul className="seo-list">
              {reportSections.map((section) => (
                <li key={section}>{section}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="seo-section seo-section--muted">
          <div className="section-head">
            <div className="section-kicker">Ограничения</div>
            <h2>Что важно понимать заранее</h2>
            <p>
              Аудит показывает вероятные точки потери заявок. Он не гарантирует рост конверсии сам по себе:
              результат зависит от трафика, оффера, цены, отдела продаж и того, насколько быстро внедряются правки.
            </p>
          </div>
          <div className="seo-actions">
            <a className="seo-button seo-button--primary" href="/#audit">Запустить проверку</a>
            <a className="seo-button seo-button--ghost" href="/o-servise">Как устроен LeadFix</a>
          </div>
        </section>
      </main>
    </div>
  );
}
