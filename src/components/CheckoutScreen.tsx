import type { FormEvent } from "react";
import { PricingCard } from "./PricingCard";
import { auditPlans } from "./plans";

type CheckoutScreenProps = {
  url: string;
  selectedPlan: string;
  email: string;
  telegram: string;
  error: string;
  success: boolean;
  onPlanChange: (plan: string) => void;
  onEmailChange: (email: string) => void;
  onTelegramChange: (telegram: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function CheckoutScreen({
  url,
  selectedPlan,
  email,
  telegram,
  error,
  success,
  onPlanChange,
  onEmailChange,
  onTelegramChange,
  onSubmit
}: CheckoutScreenProps) {
  const selectedPlanData = auditPlans.find((plan) => plan.name === selectedPlan) ?? auditPlans[1];

  return (
    <section className="full-report full-audit checkout checkout-audit screen">
      <div className="full-report__inner full-audit__layout checkout-audit__layout">
        <aside className="full-audit-sidebar checkout-audit__sidebar">
          <section className="full-audit-sidebar__site">
            <p className="full-audit__eyebrow">Оформление аудита</p>
            <div className="full-audit-sidebar__meta">
              <div><span>Адрес сайта</span><a href={url} target="_blank" rel="noreferrer">{url}</a></div>
              <div><span>Выбранный тариф</span><b>{selectedPlanData.name}</b></div>
              <div><span>Стоимость</span><b>{selectedPlanData.price}</b></div>
            </div>
          </section>

          <section className="checkout-audit__form-card">
            <form className="checkout-form" onSubmit={onSubmit} noValidate>
              <h3>Куда отправить аудит</h3>
              <div className="field">
                <label htmlFor="checkout-email">Email</label>
                <input id="checkout-email" value={email} onChange={(event) => onEmailChange(event.target.value)} type="email" placeholder="you@company.ru" />
              </div>
              <div className="field">
                <label htmlFor="checkout-telegram">Telegram (необязательно)</label>
                <input id="checkout-telegram" value={telegram} onChange={(event) => onTelegramChange(event.target.value)} type="text" placeholder="@username" />
              </div>
              <p className="checkout-error" aria-live="polite">{error}</p>
              <button className="checkout-submit" type="submit">Перейти к оплате</button>
            </form>

            <div className="guarantee-block">Отчёт носит рекомендательный характер и помогает найти потенциальные точки потери заявок.</div>
            {success && <div className="payment-placeholder">Оплата будет подключена следующим этапом</div>}
          </section>
        </aside>

        <main className="full-audit-content checkout-audit__content">
          <header className="full-audit-content__hero checkout-audit__hero">
            <p className="full-audit__eyebrow">Следующий шаг</p>
            <h2>Выберите подходящий формат аудита</h2>
            <p>От быстрой AI-проверки перед запуском рекламы до регулярного контроля нескольких лендингов.</p>
            <div className="full-audit-content__hero-metrics">
              <div><span>Фокус проверки</span><b>Конверсия в заявки</b></div>
              <div><span>Источник трафика</span><b>Яндекс Директ</b></div>
            </div>
          </header>

          <section className="full-audit__section checkout-audit__plans">
            <div className="full-audit__section-heading">
              <p className="full-audit__eyebrow">Тарифы</p>
              <h2>Выберите глубину аудита</h2>
            </div>
            <p className="full-audit__lead">Карточки отличаются глубиной проверки, форматом отчёта и уровнем ручной проверки.</p>
            <div className="pricing-grid checkout-pricing">
              {auditPlans.map((plan) => (
                <PricingCard key={plan.name} plan={plan} selected={selectedPlan === plan.name} onSelect={onPlanChange} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}
