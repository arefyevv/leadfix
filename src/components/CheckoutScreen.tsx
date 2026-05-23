import type { FormEvent } from "react";
import { PricingCard } from "./PricingCard";
import type { Plan } from "./types";

const plans: Plan[] = [
  { name: "Экспресс", price: "3900 ₽", description: "Краткий аудит + PDF" },
  { name: "Стандарт", price: "9900 ₽", description: "Полный аудит + рекомендации", recommended: true },
  { name: "Эксперт", price: "19900 ₽", description: "Аудит + созвон + разбор" }
];

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
  return (
    <section className="checkout screen">
      <div className="checkout__inner">
        <h2 className="checkout__title">Полный аудит сайта</h2>
        <p className="checkout__subtitle">Получите полный AI-аудит с рекомендациями по увеличению конверсии.</p>
        <div className="url-pill">{url}</div>

        <div className="checkout-layout">
          <div className="checkout-panel">
            <ul className="audit-list">
              <li>Полный список проблем</li>
              <li>Рекомендации по исправлению</li>
              <li>Анализ CTA и оффера</li>
              <li>Проверка мобильной версии</li>
              <li>PDF-отчёт</li>
              <li>Приоритеты исправлений</li>
              <li>Quick wins для роста заявок</li>
            </ul>
            <div className="pricing-grid">
              {plans.map((plan) => (
                <PricingCard key={plan.name} plan={plan} selected={selectedPlan === plan.name} onSelect={onPlanChange} />
              ))}
            </div>
          </div>

          <aside className="checkout-panel">
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
          </aside>
        </div>
      </div>
    </section>
  );
}
