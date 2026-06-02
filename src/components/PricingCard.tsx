import type { Plan } from "./types";

type PricingCardProps = {
  plan: Plan;
  selected: boolean;
  onSelect: (planName: string) => void;
  variant?: "default" | "checkout";
};

export function PricingCard({ plan, selected, onSelect, variant = "default" }: PricingCardProps) {
  const features = plan.features ?? ["Аудит сайта", "Рекомендации", "PDF-отчёт"];
  const format = plan.format ?? ["web-отчёт"];
  const isCheckout = variant === "checkout";

  return (
    <button
      className={`pricing-card ${!isCheckout && plan.recommended ? "pricing-card--recommended" : ""} ${selected ? "is-selected" : ""}`}
      type="button"
      onClick={() => onSelect(plan.name)}
    >
      {!isCheckout && plan.recommended && <span className="pricing-card__badge">Оптимальный выбор</span>}
      {isCheckout && selected && <span className="pricing-card__selected-badge">Выбрано</span>}
      {!isCheckout && (
        <span className="pricing-card__icon" aria-hidden="true">
          <img src="/leadfix-logo.png" alt="" />
        </span>
      )}
      <h3>{plan.name}</h3>
      <strong>{plan.price}</strong>
      <p>{plan.description}</p>

      <div className="pricing-card__group">
        <span>Что входит</span>
        <ul>
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>

      <div className="pricing-card__group pricing-card__group--muted">
        <span>Формат</span>
        <ul>
          {format.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {plan.audience && (
        <div className="pricing-card__fit">
          <span>Кому подходит</span>
          <p>{plan.audience}</p>
        </div>
      )}

      <span className="pricing-card__cta">Выбрать тариф</span>
    </button>
  );
}
