import type { FormEvent } from "react";
import { PricingCard } from "./PricingCard";
import { paidAuditPlans } from "./plans";

type CheckoutScreenProps = {
  urlValue: string;
  selectedPlan: string;
  email: string;
  consent: boolean;
  error: string;
  success: boolean;
  submitting: boolean;
  onPlanChange: (plan: string) => void;
  onUrlChange: (url: string) => void;
  onEmailChange: (email: string) => void;
  onConsentChange: (consent: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function CheckoutScreen({
  urlValue,
  selectedPlan,
  email,
  consent,
  error,
  success,
  submitting,
  onPlanChange,
  onUrlChange,
  onEmailChange,
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
              После оплаты запустим AI-проверку лендинга и отправим ссылку на отчет на указанную почту.
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
                  <p>Укажите сайт и email. После оплаты отчет придет на почту.</p>

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
                    <label htmlFor="checkout-email">Email для получения отчета</label>
                    <input id="checkout-email" value={email} onChange={(event) => onEmailChange(event.target.value)} type="email" placeholder="name@company.ru" />
                  </div>

                  <label className="checkout-consent">
                    <input type="checkbox" checked={consent} onChange={(event) => onConsentChange(event.target.checked)} />
                    <span>
                      Даю согласие на <a href="/personal-data-consent" target="_blank" rel="noreferrer">обработку персональных данных</a> и принимаю <a href="/offer" target="_blank" rel="noreferrer">условия использования</a>.
                    </span>
                  </label>

                  <p className="checkout-error" aria-live="polite">{error}</p>
                  <button className="checkout-submit" type="submit" disabled={submitting}>
                    {submitting ? "Открываем оплату..." : "Оплатить аудит"}
                  </button>
                </form>

                {success && <div className="payment-placeholder">Заявка создана. Открываем оплату.</div>}
              </aside>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}
