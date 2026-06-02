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
        <main className="full-audit-content checkout-audit__content">
          <header className="checkout-audit__heading">
            <p className="full-audit__eyebrow">Следующий шаг</p>
            <h2>Выберите подходящий формат аудита</h2>
            <p>От быстрой AI-проверки перед запуском рекламы до регулярного контроля нескольких лендингов.</p>
          </header>

          <section className="full-audit__section checkout-audit__plans">
            <div className="checkout-audit__selection">
              <div className="pricing-grid checkout-pricing">
                {auditPlans.map((plan) => (
                  <PricingCard key={plan.name} plan={plan} selected={selectedPlan === plan.name} onSelect={onPlanChange} />
                ))}
              </div>

              <aside className="checkout-audit__form-card">
                <form className="checkout-form" onSubmit={onSubmit} noValidate>
                  <h3>Куда отправить аудит</h3>
                  <p>Укажите контакты, чтобы перейти к оплате выбранного тарифа.</p>
                  <div className="field">
                    <label htmlFor="checkout-email">Email</label>
                    <input id="checkout-email" value={email} onChange={(event) => onEmailChange(event.target.value)} type="email" placeholder="you@company.ru" />
                  </div>
                  <div className="field">
                    <label htmlFor="checkout-telegram">Telegram (необязательно)</label>
                    <input id="checkout-telegram" value={telegram} onChange={(event) => onTelegramChange(event.target.value)} type="text" placeholder="@username" />
                  </div>
                  <div className="checkout-audit__form-total">
                    <span>{selectedPlanData.name}</span>
                    <b>{selectedPlanData.price}</b>
                  </div>
                  <p className="checkout-error" aria-live="polite">{error}</p>
                  <button className="checkout-submit" type="submit">Перейти к оплате</button>
                </form>

                <div className="guarantee-block">Отчёт носит рекомендательный характер и помогает найти потенциальные точки потери заявок.</div>
                {success && <div className="payment-placeholder">Оплата будет подключена следующим этапом</div>}
              </aside>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}
