import type { FormEvent } from "react";
import { PricingCard } from "./PricingCard";
import { paidAuditPlans } from "./plans";

type CheckoutScreenProps = {
  urlValue: string;
  selectedPlan: string;
  email: string;
  telegram: string;
  consent: boolean;
  error: string;
  success: boolean;
  submitting: boolean;
  onPlanChange: (plan: string) => void;
  onUrlChange: (url: string) => void;
  onEmailChange: (email: string) => void;
  onTelegramChange: (telegram: string) => void;
  onConsentChange: (consent: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function CheckoutScreen({
  urlValue,
  selectedPlan,
  email,
  telegram,
  consent,
  error,
  success,
  submitting,
  onPlanChange,
  onUrlChange,
  onEmailChange,
  onTelegramChange,
  onConsentChange,
  onSubmit
}: CheckoutScreenProps) {
  return (
    <section className="full-report full-audit checkout checkout-audit screen">
      <div className="full-report__inner full-audit__layout checkout-audit__layout">
        <main className="full-audit-content checkout-audit__content">
          <header className="checkout-audit__heading">
            <p className="full-audit__eyebrow">Следующий шаг</p>
            <h2>Выберите формат аудита и оставьте заявку</h2>
            <p>
              Первый запуск LeadFix работает как Concierge MVP: заявка сохраняется, оплата подтверждается вручную,
              полный аудит готовится до 24 часов.
            </p>
          </header>

          <section className="full-audit__section checkout-audit__plans">
            <div className="checkout-audit__selection">
              <div className="pricing-grid checkout-pricing">
                {paidAuditPlans.map((plan) => (
                  <PricingCard key={plan.name} plan={plan} selected={selectedPlan === plan.name} onSelect={onPlanChange} variant="checkout" />
                ))}
              </div>

              <aside className="checkout-audit__form-card">
                <form className="checkout-form" onSubmit={onSubmit} noValidate>
                  <h3>Куда отправить аудит</h3>
                  <p>Укажите контакты. После создания заявки откроется страница оплаты.</p>

                  <div className="field">
                    <label htmlFor="checkout-url">Сайт на проверку</label>
                    <input id="checkout-url" value={urlValue} onChange={(event) => onUrlChange(event.target.value)} type="url" placeholder="https://site.ru" />
                  </div>

                  <div className="field">
                    <label htmlFor="checkout-plan">Выбранный тариф</label>
                    <select id="checkout-plan" value={selectedPlan} onChange={(event) => onPlanChange(event.target.value)}>
                      {paidAuditPlans.map((plan) => <option key={plan.name} value={plan.name}>{plan.name} — {plan.price}</option>)}
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="checkout-email">Email</label>
                    <input id="checkout-email" value={email} onChange={(event) => onEmailChange(event.target.value)} type="email" placeholder="you@company.ru" />
                  </div>

                  <div className="field">
                    <label htmlFor="checkout-telegram">Telegram</label>
                    <input id="checkout-telegram" value={telegram} onChange={(event) => onTelegramChange(event.target.value)} type="text" placeholder="@username" />
                  </div>

                  <label className="checkout-consent">
                    <input type="checkbox" checked={consent} onChange={(event) => onConsentChange(event.target.checked)} />
                    <span>
                      Даю согласие на <a href="/personal-data-consent" target="_blank" rel="noreferrer">обработку персональных данных</a> и принимаю <a href="/offer" target="_blank" rel="noreferrer">условия использования</a>.
                    </span>
                  </label>

                  <p className="checkout-error" aria-live="polite">{error}</p>
                  <button className="checkout-submit" type="submit" disabled={submitting}>
                    {submitting ? "Создаем заявку..." : "Создать заявку"}
                  </button>
                </form>

                <div className="guarantee-block">
                  Отчет носит информационно-аналитический характер и не гарантирует рост заявок.
                </div>
                {success && <div className="payment-placeholder">Заявка создана. Открываем оплату.</div>}
              </aside>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}
