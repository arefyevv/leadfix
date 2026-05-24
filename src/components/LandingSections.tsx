import { MetricCard } from "./MetricCard";
import { PricingCard } from "./PricingCard";
import type { Plan } from "./types";

const audiences = [
  ["Владельцам бизнеса", "Понять, почему трафик есть, а заявок мало: оффер, доверие, форма, мобильная версия."],
  ["Маркетологам", "Быстро найти слабые места посадочной страницы перед запуском рекламы или A/B-тестом."],
  ["Директологам", "Показать клиенту, где лендинг теряет конверсию ещё до увеличения бюджета."],
  ["Веб-студиям", "Использовать аудит как входной продукт перед доработкой сайта или редизайном."]
];

const auditChecks = [
  ["Оффер", "Понятна ли выгода за первые секунды."],
  ["CTA", "Объясняет ли кнопка следующий шаг."],
  ["Доверие", "Есть ли доказательства до формы."],
  ["Формы", "Не мешают ли поля отправке заявки."],
  ["Мобильная версия", "Удобно ли действовать с телефона."],
  ["Структура страницы", "Логично ли ведёт экран к заявке."]
];

const landingPlans: Plan[] = [
  { name: "Экспресс", price: "3 900 ₽", description: "Краткий аудит + PDF" },
  { name: "Стандарт", price: "9 900 ₽", description: "Полный аудит + рекомендации", recommended: true },
  { name: "Эксперт", price: "19 900 ₽", description: "Аудит + созвон + разбор" }
];

const faq = [
  ["Это полностью AI-аудит?", "На этом этапе интерфейс работает на mock-данных. Продуктовая логика заложена под AI-аудит, но backend и AI пока не подключены."],
  ["Можно ли гарантировать рост заявок?", "Нет. Аудит показывает потенциальные точки потери заявок и рекомендации, но рост зависит от трафика, ниши, предложения и внедрения."],
  ["Когда я получу отчёт?", "В текущем прототипе отчёт показывается сразу после сценария проверки. В реальном продукте срок будет зависеть от выбранного тарифа."],
  ["Подойдёт ли для лендинга на Tilda?", "Да. LeadFix подходит для лендингов на Tilda, Taplink, конструкторов и кастомных сайтов."],
  ["Что будет в PDF?", "Оценка продающей способности, критичные проблемы, quick wins, рекомендации по офферу, CTA, доверию, формам и мобильной версии."]
];

export function LandingSections() {
  return (
    <div className="landing-flow">
      <section className="landing-section" id="for">
        <div className="section-kicker">Для кого</div>
        <div className="section-head">
          <h2>Когда сайт уже есть, но заявки не убеждают</h2>
          <p>LeadFix помогает быстро увидеть, что именно мешает пользователю оставить заявку.</p>
        </div>
        <div className="audience-grid">
          {audiences.map(([title, text], index) => (
            <article className="landing-card audience-card" key={title}>
              <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" id="audit-checks">
        <div className="section-kicker">Что проверяет аудит</div>
        <div className="section-head section-head--split">
          <h2>Не общий “разбор сайта”, а конкретные точки конверсии</h2>
          <p>Каждый блок отчёта привязан к решению: что мешает заявке и что исправить в первую очередь.</p>
        </div>
        <div className="check-grid">
          {auditChecks.map(([title, text]) => (
            <article className="landing-card check-card" key={title}>
              <div className="check-marker" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section result-showcase" id="cases">
        <div className="section-kicker">Как выглядит результат</div>
        <div className="showcase-layout">
          <div className="section-head">
            <h2>Отчёт выглядит как продуктовая аналитика, а не текстовый чек-лист</h2>
            <p>Пользователь видит оценку, критичные проблемы, quick wins и дорожную карту внедрения.</p>
            <div className="showcase-metrics">
              <MetricCard value="61/100" label="оценка продающей способности" accent />
              <MetricCard value="2" label="критичные проблемы" />
              <MetricCard value="4" label="quick wins" />
            </div>
          </div>
          <div className="report-mockup" aria-label="Mockup preview report">
            <div className="mockup-top">
              <span />
              <span />
              <span />
            </div>
            <div className="mockup-score">
              <strong>61</strong>
              <p>Conversion score</p>
            </div>
            <div className="mockup-bars">
              <i style={{ width: "60%" }} />
              <i style={{ width: "40%" }} />
              <i style={{ width: "25%" }} />
              <i style={{ width: "80%" }} />
            </div>
            <div className="mockup-issues">
              <span>Critical: слабый оффер</span>
              <span>High: доверие до формы</span>
              <span>Quick win: microcopy под CTA</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section" id="pricing">
        <div className="section-kicker">Тарифы</div>
        <div className="section-head">
          <h2>Выберите глубину аудита</h2>
          <p>Для быстрой проверки, полноценного отчёта или экспертного разбора с созвоном.</p>
        </div>
        <div className="pricing-grid landing-pricing">
          {landingPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} selected={Boolean(plan.recommended)} onSelect={() => undefined} />
          ))}
        </div>
      </section>

      <section className="landing-section faq-section" id="faq">
        <div className="section-kicker">FAQ</div>
        <div className="section-head">
          <h2>Частые вопросы</h2>
          <p>Коротко о формате аудита, ожиданиях и применимости для разных сайтов.</p>
        </div>
        <div className="faq-list">
          {faq.map(([question, answer]) => (
            <details className="faq-item" key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
