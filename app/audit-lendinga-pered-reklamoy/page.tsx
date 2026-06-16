import type { Metadata } from "next";
import { Header } from "@/components/Header";

const launchChecks = [
  "понятен ли оффер за первые секунды",
  "виден ли основной CTA и снижает ли он тревожность",
  "не теряются ли заявки на мобильной версии",
  "есть ли доказательства доверия рядом с формой",
  "совпадает ли страница с обещанием из рекламы"
];

export const metadata: Metadata = {
  title: "Проверка лендинга перед запуском рекламы",
  description: "Проверьте лендинг до запуска рекламы. LeadFix помогает найти слабый оффер, проблемы с CTA, формами, доверием и мобильной версией.",
  alternates: {
    canonical: "/audit-lendinga-pered-reklamoy"
  }
};

export default function AuditBeforeAdsPage() {
  return (
    <div className="legal-shell seo-shell">
      <Header />
      <main className="seo-page">
        <section className="seo-hero">
          <p className="seo-page__eyebrow">Коммерческий интент</p>
          <h1>Проверьте лендинг до запуска рекламы</h1>
          <p className="seo-page__lead">
            Если запустить трафик на слабую посадочную, реклама не исправит оффер, CTA, формы и доверие.
            LeadFix показывает, где лендинг может терять заявки ещё до первых расходов на трафик.
          </p>
          <div className="seo-actions">
            <a className="seo-button seo-button--primary" href="/#audit">Проверить лендинг</a>
            <a className="seo-button seo-button--ghost" href="/primer-audita-lendinga">Посмотреть пример отчёта</a>
          </div>
        </section>

        <section className="seo-section">
          <div className="section-head">
            <div className="section-kicker">Что проверяем</div>
            <h2>Фокус на точках потери заявок, а не на общих советах</h2>
            <p>Перед запуском рекламы важно быстро понять, выдержит ли лендинг платный трафик и где он разваливается.</p>
          </div>
          <div className="seo-list-card">
            <ul className="seo-list">
              {launchChecks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="seo-section">
          <div className="section-head">
            <div className="section-kicker">Когда нужен аудит</div>
            <h2>Типовые ситуации перед запуском трафика</h2>
            <p>Страница полезна владельцам бизнеса, директологам и маркетологам, когда лендинг уже готов, но риск слить бюджет слишком высокий.</p>
          </div>
          <div className="seo-card-grid">
            <article className="seo-card">
              <h3>Новый лендинг</h3>
              <p>Нужно убедиться, что страница понятна до первой рекламной кампании и не теряет заявку на первом экране.</p>
            </article>
            <article className="seo-card">
              <h3>Перезапуск рекламы</h3>
              <p>Трафик уже запускали, но заявок было мало. Нужен разбор перед новой попыткой.</p>
            </article>
            <article className="seo-card">
              <h3>Подрядчик просит правки</h3>
              <p>Нужно быстро понять, где проблема: в рекламе, в оффере, в форме или в мобильной версии.</p>
            </article>
          </div>
        </section>

        <section className="seo-section seo-section--muted">
          <div className="section-head">
            <div className="section-kicker">Следующий шаг</div>
            <h2>Сначала проверка, потом масштабирование</h2>
            <p>Правильная последовательность перед запуском рекламы: проверить оффер, путь к заявке и доверие, а уже потом увеличивать бюджет.</p>
          </div>
          <div className="seo-actions">
            <a className="seo-button seo-button--primary" href="/#audit">Запустить проверку</a>
            <a className="seo-button seo-button--ghost" href="/pochemu-net-zayavok-s-saita">Почему заявок может не быть</a>
          </div>
        </section>
      </main>
    </div>
  );
}
