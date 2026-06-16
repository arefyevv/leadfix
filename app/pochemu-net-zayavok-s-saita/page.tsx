import type { Metadata } from "next";
import { Header } from "@/components/Header";

const reasons = [
  "нецелевой трафик или неправильное рекламное обещание",
  "слабый оффер и непонятный первый экран",
  "незаметный CTA или лишнее трение в форме",
  "недостаток доверия перед отправкой контактов",
  "ошибки мобильной версии и технические барьеры"
];

export const metadata: Metadata = {
  title: "Почему сайт не приносит заявки: причины и диагностика",
  description: "Разберитесь, почему сайт не приносит заявки. LeadFix помогает найти причины в лендинге, оффере, CTA, доверии, формах и мобильной версии.",
  alternates: {
    canonical: "/pochemu-net-zayavok-s-saita"
  }
};

export default function NoLeadsPage() {
  return (
    <div className="legal-shell seo-shell">
      <Header />
      <main className="seo-page">
        <section className="seo-hero">
          <p className="seo-page__eyebrow">Problem-aware страница</p>
          <h1>Почему с сайта нет заявок, хотя трафик уже есть</h1>
          <p className="seo-page__lead">
            Если посетители приходят, но не оставляют контакты, проблема может быть не в одном элементе.
            Нужно проверить и трафик, и сам лендинг: оффер, CTA, форму, доверие, мобильную версию и путь к заявке.
          </p>
          <div className="seo-actions">
            <a className="seo-button seo-button--primary" href="/#pricing">Проверить сайт</a>
            <a className="seo-button seo-button--ghost" href="/audit-lendinga-pered-reklamoy">Проверка перед рекламой</a>
          </div>
        </section>

        <section className="seo-section">
          <div className="section-head">
            <div className="section-kicker">Основные причины</div>
            <h2>Что чаще всего мешает заявкам</h2>
            <p>LeadFix не сводит проблему только к дизайну. Сначала нужно честно разложить все вероятные причины отсутствия заявок.</p>
          </div>
          <div className="seo-list-card">
            <ul className="seo-list">
              {reasons.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="seo-section">
          <div className="section-head">
            <div className="section-kicker">Что делает LeadFix</div>
            <h2>Помогает быстро отделить проблемы лендинга от других факторов</h2>
            <p>Сервис показывает, какие барьеры видны прямо на странице, и где стоит искать проблемы до следующего запуска рекламы.</p>
          </div>
          <div className="seo-card-grid">
            <article className="seo-card">
              <h3>Первый экран</h3>
              <p>Понимает ли посетитель за первые секунды, что ему предлагают и почему нужно оставить заявку именно здесь.</p>
            </article>
            <article className="seo-card">
              <h3>Форма и CTA</h3>
              <p>Есть ли понятный следующий шаг, не отпугивает ли форма и не остаётся ли лишняя тревожность перед отправкой.</p>
            </article>
            <article className="seo-card">
              <h3>Доверие и мобильная версия</h3>
              <p>Хватает ли доказательств рядом с действием и не ломается ли путь к заявке на телефоне.</p>
            </article>
          </div>
        </section>

        <section className="seo-section seo-section--muted">
          <div className="section-head">
            <div className="section-kicker">Диагностика</div>
            <h2>Когда стоит запускать аудит</h2>
            <p>Если трафик уже идёт, но заявок мало, лучше сначала найти точки потери на странице, а не менять сайт вслепую.</p>
          </div>
          <div className="seo-actions">
            <a className="seo-button seo-button--primary" href="/#audit">Найти точки потери заявок</a>
            <a className="seo-button seo-button--ghost" href="/primer-audita-lendinga">Как выглядит результат</a>
          </div>
        </section>
      </main>
    </div>
  );
}
