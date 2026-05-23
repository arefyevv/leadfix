import type { Plan } from "./types";

type PricingCardProps = {
  plan: Plan;
  selected: boolean;
  onSelect: (planName: string) => void;
};

export function PricingCard({ plan, selected, onSelect }: PricingCardProps) {
  return (
    <button
      className={`pricing-card ${plan.recommended ? "pricing-card--recommended" : ""} ${selected ? "is-selected" : ""}`}
      type="button"
      onClick={() => onSelect(plan.name)}
    >
      {plan.recommended && <span className="pricing-card__badge">Рекомендуем</span>}
      <h3>{plan.name}</h3>
      <strong>{plan.price}</strong>
      <p>{plan.description}</p>
    </button>
  );
}
