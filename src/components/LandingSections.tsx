"use client";

import { useState } from "react";
import { AudienceLottieIcon } from "./AudienceLottieIcon";
import { PricingCard } from "./PricingCard";
import { ReportShowcase } from "./ReportShowcase";
import { auditPlans } from "./plans";

const audiences = [
  ["Владельцам бизнеса", "Понять, почему трафик есть, а заявок мало: оффер, доверие, форма, мобильная версия."],
  ["Маркетологам", "Быстро найти слабые места посадочной страницы перед запуском рекламы или A/B-тестом."],
  ["Директологам", "Показать клиенту, где лендинг теряет конверсию ещё до увеличения бюджета."],
  ["Веб-студиям", "Использовать аудит как входной продукт перед доработкой сайта или редизайном."]
];

const audienceIcons = ["business", "marketing", "analytics", "design"] as const;

const audienceUseCases = [
  "Проверить посадочную страницу до того, как бюджет начнёт сливать заявки.",
  "Понять, какие блоки реально мешают конверсии, а не менять сайт вслепую.",
  "Показать клиенту конкретные причины, почему текущий сайт просит улучшений.",
  "Быстро найти очевидные проблемы в оффере, CTA, доверии и мобильной версии.",
  "Проверить типовые ошибки лендинга без долгой ручной экспертизы.",
  "Получить понятный список задач для дизайнера, маркетолога или разработчика."
];

const auditChecks = [
  {
    title: "Оффер и первый экран",
    description:
      "Понимает ли посетитель за 5 секунд: что вы предлагаете; для кого это; почему выбрать именно вас."
  },
  {
    title: "CTA и формы",
    description:
      "Проверяем: заметны ли кнопки; есть ли призыв к действию; насколько легко оставить заявку."
  },
  {
    title: "Доверие",
    description:
      "Анализируем: кейсы, отзывы, цифры, гарантии и подтверждение экспертности."
  },
  {
    title: "Структура и UX",
    description:
      "Смотрим: логичность блоков, читаемость, визуальную перегрузку и насколько сайт ведёт к заявке."
  },
  {
    title: "Mobile-версия",
    description:
      "Проверяем удобство на телефоне: размеры текста и кнопок, проблемы адаптации и скорость восприятия."
  },
  {
    title: "Потери конверсии",
    description:
      "Находим критичные ошибки, слабые места и элементы, которые могут снижать количество заявок."
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
    "Предварительный отчёт формируется без AI: сервис загружает HTML страницы и проверяет базовые сигналы конверсии. Расширенный аудит может включать дополнительные проверки."
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
    "Оценка продающей способности, критичные проблемы, quick wins и рекомендации по офферу, CTA, доверию, формам и мобильной версии."
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
          <h2>Когда сайт уже есть, но заявки не убеждают</h2>
          <p>LeadFix помогает быстро увидеть, что именно мешает пользователю оставить заявку.</p>
        </div>
        <div className="audience-grid">
          {audiences.map(([title, text], index) => (
            <article className={`landing-card audience-card audience-card--${index + 1}`} key={title}>
              <AudienceLottieIcon name={audienceIcons[index]} />
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
            {auditChecks.map((item, index) => {
              const isOpen = openAuditIndex === index;

              return (
                <details
                  className="audit-accordion__item"
                  key={item.title}
                  open={isOpen}
                >
                  <summary
                    onClick={(event) => {
                      event.preventDefault();
                      setOpenAuditIndex((current) => (current === index ? null : index));
                    }}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <b>{item.title}</b>
                  </summary>
                  <div className="audit-accordion__content">
                    <p>{item.description}</p>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      <ReportShowcase />

      <section className="landing-section" id="pricing">
        <div className="section-kicker">Тарифы</div>
        <div className="section-head">
          <h2>Выберите глубину аудита</h2>
          <p>Для быстрой проверки, полноценного отчёта или регулярной оптимизации посадочных страниц.</p>
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
