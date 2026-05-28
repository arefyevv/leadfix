import { MetricCard } from "./MetricCard";
import { PricingCard } from "./PricingCard";
import { ReportShowcase } from "./ReportShowcase";
import type { Plan } from "./types";

const audiences = [
  ["Владельцам бизнеса", "Понять, почему трафик есть, а заявок мало: оффер, доверие, форма, мобильная версия."],
  ["Маркетологам", "Быстро найти слабые места посадочной страницы перед запуском рекламы или A/B-тестом."],
  ["Директологам", "Показать клиенту, где лендинг теряет конверсию еще до увеличения бюджета."],
  ["Веб-студиям", "Использовать аудит как входной продукт перед доработкой сайта или редизайном."]
];

const audienceUseCases = [
  "Проверить посадочную страницу до того, как бюджет начнет сливать заявки.",
  "Понять, какие блоки реально мешают конверсии, а не менять сайт вслепую.",
  "Показать клиенту конкретные причины, почему текущий сайт просит улучшений.",
  "Быстро найти очевидные проблемы в оффере, CTA, доверии и мобильной версии.",
  "Проверить типовые ошибки лендинга без долгой ручной экспертизы.",
  "Получить понятный список задач для дизайнера, маркетолога или разработчика."
];

const auditChecks = [
  {
    title: "Оффер и первый экран",
    description: "Понимает ли посетитель за 5 секунд: что вы предлагаете; для кого это; почему выбрать именно вас."
  },
  {
    title: "CTA и формы",
    description: "Проверяем: заметны ли кнопки; есть ли призыв к действию; насколько легко оставить заявку."
  },
  {
    title: "Доверие",
    description: "Анализируем: кейсы; отзывы; цифры; гарантии; подтверждение экспертности."
  },
  {
    title: "Структура и UX",
    description: "Смотрим: логичность блоков; читаемость; визуальную перегрузку; насколько сайт ведёт к заявке."
  },
  {
    title: "Mobile-версия",
    description: "Проверяем: удобство на телефоне; размеры текста и кнопок; проблемы адаптации; скорость восприятия."
  },
  {
    title: "Потери конверсии",
    description: "Находим: критичные ошибки; слабые места; элементы, которые могут снижать количество заявок."
  }
];

const scenarios = [
  ["Перед запуском рекламы", "Проверить посадочную страницу до того, как бюджет начнет сливать заявки."],
  ["Перед редизайном", "Понять, какие блоки реально мешают конверсии, а не менять сайт вслепую."],
  ["Перед продажей доработок", "Показать клиенту конкретные причины, почему текущий сайт просит улучшений."],
  ["После падения заявок", "Быстро найти очевидные проблемы в оффере, CTA, доверии и мобильной версии."],
  ["Для Tilda и конструкторов", "Проверить типовые ошибки лендинга без долгой ручной экспертизы."],
  ["Для кастомных сайтов", "Получить понятный список задач для дизайнера, маркетолога или разработчика."]
];

const testimonials = [
  ["Стало понятно, почему люди уходят до формы. Самые важные проблемы оказались не в дизайне, а в оффере и CTA.", "Маркетолог"],
  ["Удобно показывать клиенту не мнение, а структурированный разбор с приоритетами.", "Веб-студия"],
  ["За 10 минут нашли проблемы, которые месяцами не замечали в рекламной воронке.", "Владелец бизнеса"]
];

const landingPlans: Plan[] = [
  {
    name: "Экспресс",
    price: "990 ₽ / 1 сайт",
    description: "Для быстрой проверки перед запуском рекламы.",
    features: [
      "анализ первого экрана",
      "проверка оффера",
      "проверка CTA",
      "базовая оценка доверия",
      "3-5 найденных проблем",
      "общий балл сайта",
      "что исправить первым"
    ],
    format: ["web-отчёт", "без PDF", "без ручной проверки"],
    audience: "Нужно быстро понять, есть ли явные ошибки на лендинге."
  },
  {
    name: "Стандарт",
    price: "4 900 ₽ / 1 сайт",
    description: "Полный аудит лендинга под заявки.",
    recommended: true,
    features: [
      "анализ оффера",
      "анализ CTA",
      "структура страницы",
      "доверие и соцдоказательства",
      "мобильная версия",
      "формы и точки трения",
      "визуальная иерархия",
      "список критичных ошибок",
      "рекомендации по исправлению",
      "приоритеты: что исправить первым",
      "PDF-отчёт"
    ],
    format: ["AI-анализ + быстрая ручная проверка", "PDF-отчёт", "срок: до 24 часов"],
    audience: "Перед запуском или оптимизацией рекламы в Яндекс Директе."
  },
  {
    name: "Подписка",
    price: "9 900 ₽ / месяц",
    description: "Для тех, кто регулярно запускает лендинги и рекламу.",
    features: [
      "до 5 аудитов в месяц",
      "повторная проверка после правок",
      "история отчётов",
      "сравнение до/после",
      "PDF-отчёты",
      "приоритетные рекомендации",
      "поддержка в Telegram"
    ],
    format: ["web-отчёт + PDF", "AI-анализ + выборочная ручная проверка"],
    audience: "Маркетологам, директологам, агентствам и владельцам нескольких проектов."
  }
];

const faq = [
  ["Это полностью AI-аудит?", "На текущем этапе интерфейс работает на mock-данных. Продуктовая логика заложена под AI-аудит, но backend и AI пока не подключены."],
  ["Можно ли гарантировать рост заявок?", "Нет. Аудит показывает потенциальные точки потери заявок и рекомендации, но рост зависит от трафика, ниши, предложения и внедрения."],
  ["Когда я получу отчет?", "В текущем прототипе отчет показывается сразу после сценария проверки. В реальном продукте срок будет зависеть от выбранного тарифа."],
  ["Подойдет ли для лендинга на Tilda?", "Да. LeadFix подходит для лендингов на Tilda, Taplink, конструкторов и кастомных сайтов."],
  ["Что будет в PDF?", "Оценка продающей способности, критичные проблемы, quick wins и рекомендации по офферу, CTA, доверию, формам и мобильной версии."],
  ["Можно проверить несколько страниц?", "Да. В подписке можно проверять несколько лендингов, сравнивать результаты и повторно смотреть страницу после правок."]
];

export function LandingSections() {
  return (
    <div className="landing-flow">
      <section className="landing-section" id="audience">
        <div className="section-kicker">Для кого</div>
        <div className="section-head">
          <h2>Когда сайт уже есть, но заявки не убеждают</h2>
          <p>LeadFix помогает быстро увидеть, что именно мешает пользователю оставить заявку.</p>
        </div>
        <div className="audience-grid">
          {audiences.map(([title, text], index) => (
            <article className={`landing-card audience-card audience-card--${index + 1}`} key={title}>
              <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
          <article className="audience-note" aria-label="Сценарии использования">
            <h3>Сценарии</h3>
            <ul>
              {audienceUseCases.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="landing-section scenario-text-section">
        <div className="scenario-text-list">
          {scenarios.map(([, text]) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </section>

      <section className="landing-section" id="audit-checks">
        <div className="section-kicker">Что проверяет аудит</div>
        <div className="section-head">
          <h2>Не общий разбор сайта, а точки потери конверсии</h2>
          <p>Каждый блок отчета привязан к решению: что мешает заявке и что исправить в первую очередь.</p>
        </div>
        <div className="audit-accordion-layout">
          <div className="audit-visual-placeholder" aria-hidden="true">
            <div className="audit-visual-placeholder__top">
              <span />
              <span />
              <span />
            </div>
            <div className="audit-visual-placeholder__screen">
              <i />
              <i />
              <i />
            </div>
          </div>

          <div className="audit-accordion">
            {auditChecks.map((item, index) => (
              <details className="audit-accordion__item" key={item.title} name="audit-checks">
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{item.title}</b>
                </summary>
                <p>{item.description}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ReportShowcase />

      <section className="landing-section result-showcase legacy-result-showcase" id="cases-legacy">
        <div className="section-kicker">Как выглядит результат</div>
        <div className="showcase-layout">
          <div className="section-head">
            <h2>Отчет выглядит как продуктовая аналитика, а не текстовый чек-лист</h2>
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

      <section className="landing-section">
        <div className="section-kicker">Сценарии</div>
        <div className="section-head">
          <h2>Где LeadFix быстрее всего дает пользу</h2>
          <p>Аудит помогает не спорить о вкусе, а увидеть конкретные точки, где сайт теряет действие.</p>
        </div>
        <div className="scenario-grid">
          {scenarios.map(([title, text]) => (
            <article className="scenario-card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section testimonials-section">
        <div className="section-kicker">Отзывы</div>
        <div className="section-head">
          <h2>Разбор, который удобно объяснять клиенту или команде</h2>
          <p>Формат отчета помогает быстро перейти от субъективных мнений к списку конкретных исправлений.</p>
        </div>
        <div className="testimonial-grid">
          {testimonials.map(([text, author]) => (
            <article className="testimonial-card" key={text}>
              <div className="stars">★★★★★</div>
              <p>{text}</p>
              <strong>{author}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" id="pricing">
        <div className="section-kicker">Тарифы</div>
        <div className="section-head">
          <h2>Выберите глубину аудита</h2>
          <p>Для быстрой проверки, полноценного отчета или экспертного разбора с созвоном.</p>
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

      <section className="landing-section landing-final">
        <div className="section-head">
          <h2>Проверьте сайт до следующего запуска рекламы</h2>
          <p>Введите адрес страницы и получите предварительный разбор точек, где сайт может терять заявки.</p>
          <a className="landing-final__button" href="#audit">Проверить сайт</a>
        </div>
      </section>
    </div>
  );
}
