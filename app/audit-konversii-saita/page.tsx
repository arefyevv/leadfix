import type { Metadata } from "next";
import { Header } from "@/components/Header";

const conversionChecks = [
  "понятно ли посетителю, что предлагает сайт и для кого это решение",
  "виден ли основной призыв к действию без лишнего поиска по странице",
  "нет ли трения в форме, кнопках, тексте и следующем шаге",
  "хватает ли доверия перед отправкой заявки",
  "не теряется ли конверсия на мобильной версии или из-за технических барьеров"
];

const situations = [
  {
    title: "Трафик есть, заявок мало",
    text: "Нужно понять, проблема в посадочной странице, оффере, форме, доверии или в качестве трафика."
  },
  {
    title: "Конверсия ниже ожиданий",
    text: "Сайт получает переходы, но посетители не доходят до заявки или не понимают ценность предложения."
  },
  {
    title: "Планируете правки",
    text: "Перед редизайном или доработками полезно увидеть, какие изменения сильнее всего влияют на заявки."
  }
];

export const metadata: Metadata = {
  title: "Аудит конверсии сайта: найдите причины низкой конверсии",
  description:
    "Проверьте конверсию сайта или лендинга. LeadFix помогает найти проблемы в оффере, CTA, доверии, формах, мобильной версии и пути к заявке.",
  alternates: {
    canonical: "/audit-konversii-saita"
  }
};

export default function SiteConversionAuditPage() {
  return (
    <div className="legal-shell seo-shell">
      <Header />
      <main className="seo-page">
        <section className="seo-hero">
          <p className="seo-page__eyebrow">Аудит конверсии сайта</p>
          <h1>Найдите, почему сайт или лендинг плохо конвертит посетителей в заявки</h1>
          <p className="seo-page__lead">
            Низкая конверсия сайта редко сводится к одной кнопке или цвету блока. LeadFix помогает увидеть,
            где посадочная страница теряет заявки: в оффере, CTA, доверии, форме, структуре, мобильной версии
            или технических барьерах.
          </p>
          <div className="seo-actions">
            <a className="seo-button seo-button--primary" href="/#audit">
              Проверить конверсию сайта
            </a>
            <a className="seo-button seo-button--ghost" href="/primer-audita-lendinga">
              Посмотреть пример аудита
            </a>
          </div>
        </section>

        <section className="seo-section">
          <div className="section-head">
            <div className="section-kicker">Что влияет на заявки</div>
            <h2>Аудит показывает не абстрактную оценку, а точки потери конверсии</h2>
            <p>
              Задача страницы не в том, чтобы дать универсальный чеклист. Важно быстро понять, какие элементы
              мешают пользователю оставить заявку и какие правки стоит делать в первую очередь.
            </p>
          </div>
          <div className="seo-list-card">
            <ul className="seo-list">
              {conversionChecks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="seo-section">
          <div className="section-head">
            <div className="section-kicker">Когда нужен аудит</div>
            <h2>Подходит для сайтов, где уже есть трафик или скоро будет запуск рекламы</h2>
            <p>
              Аудит конверсии полезен владельцам бизнеса, маркетологам и подрядчикам, когда нужно принимать
              решения по лендингу на основе проблем страницы, а не вкусовых правок.
            </p>
          </div>
          <div className="seo-card-grid">
            {situations.map((item) => (
              <article className="seo-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-section">
          <div className="section-head">
            <div className="section-kicker">Связанные сценарии</div>
            <h2>Если проблема уже проявилась, начните с диагностики причин</h2>
            <p>
              Если сайт получает переходы, но заявок нет или они слишком дорогие, сначала стоит найти слабые
              места страницы. После этого проще решать, что менять: оффер, структуру, форму, доверие или трафик.
            </p>
          </div>
          <div className="seo-actions">
            <a className="seo-button seo-button--ghost" href="/pochemu-net-zayavok-s-saita">
              Почему нет заявок
            </a>
            <a className="seo-button seo-button--ghost" href="/audit-lendinga-pered-reklamoy">
              Проверка перед рекламой
            </a>
          </div>
        </section>

        <section className="seo-section seo-section--muted">
          <div className="section-head">
            <div className="section-kicker">Следующий шаг</div>
            <h2>Запустите проверку и получите список проблем, которые мешают заявкам</h2>
            <p>
              LeadFix анализирует посадочную страницу и формирует понятный план правок без раскрытия внутренней
              логики оценки на публичной странице.
            </p>
          </div>
          <div className="seo-actions">
            <a className="seo-button seo-button--primary" href="/#audit">
              Запустить аудит конверсии
            </a>
            <a className="seo-button seo-button--ghost" href="/o-servise">
              Как работает LeadFix
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
