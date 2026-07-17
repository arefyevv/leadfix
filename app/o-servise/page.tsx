import type { Metadata } from "next";
import { Header } from "@/components/Header";

const methodologyAreas = [
  "оффер и первый экран",
  "CTA и путь к заявке",
  "доверие и доказательства",
  "формы и снижение трения",
  "структура страницы",
  "мобильная версия и технические барьеры"
];

const limitations = [
  "аудит не гарантирует рост заявок без внедрения правок",
  "по одному лендингу нельзя оценить весь маркетинг и отдел продаж",
  "часть выводов зависит от контекста рекламы и исходных данных",
  "в публичный отчёт не выводятся внутренние критерии, scoring и промпты"
];

export const metadata: Metadata = {
  title: "О сервисе LeadFix",
  description: "Узнайте, как устроен LeadFix, что именно проверяет аудит лендинга, где заканчиваются автоматические выводы и что получает клиент.",
  alternates: {
    canonical: "/o-servise"
  }
};

export default function AboutServicePage() {
  return (
    <div className="legal-shell seo-shell">
      <Header />
      <main className="seo-page">
        <section className="seo-hero">
          <p className="seo-page__eyebrow">О сервисе</p>
          <h1>Как устроен LeadFix</h1>
          <p className="seo-page__lead">
            LeadFix помогает понять, где лендинг теряет заявки до запуска рекламы или перед доработкой страницы.
            Сервис сочетает базовую автоматическую проверку и глубокий AI-разбор для тарифов, где нужен расширенный контекст.
          </p>
          <div className="seo-actions">
            <a className="seo-button seo-button--primary" href="/#audit">Проверить лендинг</a>
            <a className="seo-button seo-button--ghost" href="/primer-audita-lendinga">Пример аудита</a>
          </div>
        </section>

        <section className="seo-section">
          <div className="section-head">
            <div className="section-kicker">Что проверяет аудит</div>
            <h2>Публичная методология верхнего уровня</h2>
            <p>Мы не публикуем внутренние веса, формулы и prompt-логику, но открыто показываем основные зоны анализа.</p>
          </div>
          <div className="seo-list-card">
            <ul className="seo-list">
              {methodologyAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="seo-section">
          <div className="section-head">
            <div className="section-kicker">Как читать результат</div>
            <h2>Что клиент получает на выходе</h2>
            <p>LeadFix показывает не просто score, а список проблем, их влияние на заявку и порядок правок для следующего шага.</p>
          </div>
          <div className="seo-card-grid">
            <article className="seo-card">
              <h3>Автоматическая проверка</h3>
              <p>Быстро находит базовые сигналы: заголовки, CTA, формы, контакты, доверие и очевидные барьеры.</p>
            </article>
            <article className="seo-card">
              <h3>Глубокий AI-разбор</h3>
              <p>Нужен там, где важно учесть контекст ниши, обещание в рекламе, читаемость оффера и качество аргументации.</p>
            </article>
            <article className="seo-card">
              <h3>Приоритет правок</h3>
              <p>Клиент получает порядок действий: что мешает заявке сейчас, что можно исправить быстро и что требует отдельной доработки.</p>
            </article>
          </div>
        </section>

        <section className="seo-section seo-section--muted">
          <div className="section-head">
            <div className="section-kicker">Ограничения</div>
            <h2>Что LeadFix не обещает</h2>
            <p>Прозрачность важнее громких обещаний. Аудит помогает найти точки потери, но не подменяет собой внедрение и аналитику бизнеса целиком.</p>
          </div>
          <div className="seo-list-card">
            <ul className="seo-list">
              {limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
