"use client";

import { useState } from "react";
import { AudienceLottieIcon } from "./AudienceLottieIcon";
import { PricingCard } from "./PricingCard";
import { ReportShowcase } from "./ReportShowcase";
import { auditPlans } from "./plans";

const audiences = [
  ["Владельцам бизнеса", "Понять, почему трафик есть, а заявок мало, до увеличения бюджета."],
  ["Маркетологам", "Отчет, который можно отдать дизайнеру, разработчику."],
  ["Директологам", "Покажите клиенту, почему реклама не спасет слабую посадочную."],
  ["Веб-студиям", "Использовать аудит как первый шаг перед доработкой сайта или редизайном."]
];

const audienceIcons = ["business", "marketing", "analytics", "design"] as const;

const audienceUseCases = [
  "Проверить посадочную страницу до того, как бюджет начнёт сливать заявки.",
  "Понять, какие блоки реально мешают конверсии, а не менять сайт вслепую.",
  "Показать клиенту конкретные причины, почему текущий сайт требует доработки.",
  "Быстро найти очевидные проблемы в оффере, CTA, доверии и мобильной версии.",
  "Проверить типовые ошибки лендинга без долгой ручной экспертизы.",
  "Получить понятный список задач для дизайнера, маркетолога или разработчика."
];

const audienceUseCaseHighlights = [
  "Проверить посадочную страницу",
  "какие блоки реально мешают конверсии",
  "Показать клиенту конкретные причины",
  "Быстро найти очевидные проблемы",
  "Проверить типовые ошибки лендинга",
  "Получить понятный список задач"
];

const auditChecks = [
  {
    title: "Оффер и первый экран",
    summary: "Проверяем, понятно ли за 5 секунд, что вы предлагаете, кому и почему это стоит выбрать.",
    details: [
      "Есть ли конкретное обещание результата, а не общий красивый слоган.",
      "Понятно ли, для какой аудитории и задачи сделано предложение.",
      "Совпадает ли первый экран с ожиданием пользователя из рекламы или поиска."
    ]
  },
  {
    title: "CTA и сценарий заявки",
    summary: "Смотрим, насколько легко пользователю понять следующий шаг и оставить заявку без лишнего трения.",
    details: [
      "Заметны ли основные кнопки и не конкурируют ли они между собой.",
      "Понятен ли текст действия: что произойдёт после клика.",
      "Нет ли лишних полей, сомнительных формулировок и барьеров перед отправкой."
    ]
  },
  {
    title: "Доверие и доказательства",
    summary: "Оцениваем, хватает ли пользователю оснований доверять компании до отправки контактов.",
    details: [
      "Есть ли кейсы, отзывы, цифры, сертификаты, гарантии или понятные факты.",
      "Не выглядят ли доказательства абстрактными и неподтверждёнными.",
      "Показывает ли сайт реальный опыт, процесс и ответственность исполнителя."
    ]
  },
  {
    title: "Структура и логика блоков",
    summary: "Проверяем, ведёт ли страница пользователя к решению или распадается на набор несвязанных блоков.",
    details: [
      "Есть ли понятная последовательность: проблема, решение, доказательства, действие.",
      "Не перегружена ли страница второстепенными блоками и повторяющимися смыслами.",
      "Понятно ли, какие блоки нужно усилить, переставить или убрать."
    ]
  },
  {
    title: "Мобильная версия",
    summary: "Проверяем, не теряются ли заявки на телефоне из-за мелкого текста, плохих отступов и неудобных кнопок.",
    details: [
      "Насколько удобно читать первый экран и ключевые блоки с мобильного.",
      "Достаточно ли крупные кнопки, поля и интерактивные элементы.",
      "Нет ли сломанных отступов, длинных строк, наложений и тяжёлых участков."
    ]
  },
  {
    title: "Приоритет правок",
    summary: "Собираем вывод не в стиле “всё улучшить”, а в виде списка задач по влиянию на заявки.",
    details: [
      "Разделяем критичные ошибки, средние проблемы и косметические замечания.",
      "Формируем быстрые улучшения: что можно исправить быстро и с максимальным эффектом.",
      "Даём понятный порядок действий для дизайнера, маркетолога или разработчика."
    ]
  }
];

const scenarios = [
  "Проверить посадочную страницу перед запуском рекламы.",
  "Понять, какие блоки реально мешают конверсии.",
  "Показать клиенту причины, почему сайт требует улучшений.",
  "Быстро найти проблемы в оффере, CTA, доверии и мобильной версии.",
  "Проверить типовые ошибки лендинга без долгой ручной экспертизы.",
  "Получить список задач для дизайнера, маркетолога или разработчика."
];

const faq = [
  [
    "Это полностью AI-аудит?",
    "Тест сайта делает базовую автоматическую проверку. Экспресс — полностью автоматический AI-аудит. LeadFix Pro включает AI-аудит и ручную экспертную проверку."
  ],
  [
    "Можно ли гарантировать рост заявок?",
    "Нет. Аудит показывает потенциальные точки потери заявок и рекомендации, но рост зависит от трафика, ниши, предложения и внедрения."
  ],
  [
    "Когда я получу отчёт?",
    "В прототипе отчёт показывается сразу после сценария проверки. В реальном продукте срок будет зависеть от выбранного тарифа."
  ],
  [
    "Подойдёт ли для лендинга на Tilda?",
    "Да. LeadFix подходит для лендингов на Tilda, Taplink, конструкторах и кастомных сайтах."
  ],
  [
    "Что будет в PDF?",
    "Оценка продающей способности, критичные проблемы, быстрые улучшения и рекомендации по офферу, CTA, доверию, формам и мобильной версии."
  ],
  [
    "Можно проверить несколько страниц?",
    "Да. В подписке можно проверять несколько лендингов, сравнивать результаты и повторно смотреть страницу после правок."
  ]
];

export function LandingSections() {
  const [openAuditIndex, setOpenAuditIndex] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div className="landing-flow">
      <section className="landing-section" id="audience">
        <div className="section-kicker">Для кого</div>
        <div className="section-head">
          <h2>Когда сайт уже есть, но заявок мало</h2>
          <p>LeadFix помогает быстро понять, что мешает пользователю оставить заявку: оффер, доверие, форма, CTA или мобильная версия.</p>
        </div>
        <div className="audience-grid">
          {audiences.map(([title, text], index) => (
            <article className={`landing-card audience-card audience-card--${index + 1}`} key={title}>
              <AudienceLottieIcon name={audienceIcons[index]} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
          <article className="audience-note" aria-label="Когда пригодится аудит">
            <h3>Когда пригодится аудит</h3>
            <ul>
              {audienceUseCases.map((text, index) => {
                const highlight = audienceUseCaseHighlights[index];
                const [before, after = ""] = text.split(highlight);

                return (
                  <li key={text}>
                    {before}
                    <strong>{highlight}</strong>
                    {after}
                  </li>
                );
              })}
            </ul>
          </article>
        </div>
      </section>

      <section className="landing-section scenario-text-section">
        <div className="scenario-text-list">
          {scenarios.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </section>

      <section className="landing-section" id="audit-checks">
        <div className="section-kicker">Что проверяет аудит</div>
        <div className="section-head">
          <h2>Не общий разбор сайта, а точки потери конверсии</h2>
          <p>Каждый блок отчёта привязан к решению: что мешает заявке и что исправить в первую очередь.</p>
        </div>
        <div className="audit-accordion-layout">
          <div className="audit-accordion">
            {auditChecks.map((item, index) => {
              const isOpen = openAuditIndex === index;

              return (
                <article
                  className={isOpen ? "audit-accordion__item is-active" : "audit-accordion__item"}
                  key={item.title}
                >
                  <div className="audit-accordion__head">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{item.title}</h3>
                  </div>
                  <p>{item.summary}</p>
                  <button
                    type="button"
                    onClick={() => setOpenAuditIndex(index)}
                    aria-haspopup="dialog"
                  >
                    Подробнее
                  </button>
                </article>
              );
            })}
          </div>
        </div>
        {openAuditIndex !== null && (
          <div className="audit-modal" role="dialog" aria-modal="true" aria-labelledby="audit-modal-title" onClick={() => setOpenAuditIndex(null)}>
            <div className="audit-modal__card" onClick={(event) => event.stopPropagation()}>
              <button className="audit-modal__close" type="button" aria-label="Закрыть" onClick={() => setOpenAuditIndex(null)}>×</button>
              <span>{String(openAuditIndex + 1).padStart(2, "0")}</span>
              <h3 id="audit-modal-title">{auditChecks[openAuditIndex].title}</h3>
              <p>{auditChecks[openAuditIndex].summary}</p>
              <ul>
                {auditChecks[openAuditIndex].details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      <ReportShowcase />

      <section className="landing-section" id="pricing">
        <div className="section-kicker">Тарифы</div>
        <div className="section-head">
          <h2>Выберите глубину аудита</h2>
          <p>Для бесплатной проверки, автоматического AI-отчета или ручного экспертного разбора.</p>
        </div>
        <div className="pricing-grid landing-pricing">
          {auditPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} selected={Boolean(plan.recommended)} onSelect={() => undefined} />
          ))}
        </div>
      </section>

      <section className="landing-section faq-section" id="faq">
        <div className="section-kicker">FAQ</div>
        <div className="section-head">
          <h2>Частые <span>вопросы</span></h2>
          <p>Коротко о формате аудита, ожиданиях и применимости для разных сайтов.</p>
        </div>
        <div className="faq-list">
          {faq.map(([question, answer], index) => {
            const isOpen = openFaqIndex === index;

            return (
              <details className="faq-item" key={question} open={isOpen}>
                <summary
                  onClick={(event) => {
                    event.preventDefault();
                    setOpenFaqIndex((current) => (current === index ? null : index));
                  }}
                >
                  {question}
                </summary>
                <p>{answer}</p>
              </details>
            );
          })}
        </div>
      </section>

      <section className="landing-section landing-final">
        <div className="section-head">
          <h2>
            <span>Проверьте сайт до следующего</span>
            <span>запуска рекламы</span>
          </h2>
          <p>Введите адрес страницы и получите предварительный разбор точек, где сайт может терять заявки.</p>
          <a className="landing-final__button" href="#audit">Проверить сайт</a>
        </div>
      </section>

    </div>
  );
}
