import type { Plan } from "./types";

type PricingCardProps = {
  plan: Plan;
  selected: boolean;
  onSelect: (planName: string) => void;
};

const planFeatures: Record<string, string[]> = {
  Экспресс: ["Краткий разбор лендинга", "PDF-отчёт", "3 главные ошибки", "Quick wins на 1 день"],
  Стандарт: ["Полный аудит сайта", "Рекомендации по исправлению", "Приоритеты внедрения", "PDF + roadmap"],
  Эксперт: ["Полный аудит + PDF", "Созвон и разбор", "План доработок", "Ответы на вопросы"]
};

export function PricingCard({ plan, selected, onSelect }: PricingCardProps) {
  const features = planFeatures[plan.name] ?? ["Аудит сайта", "Рекомендации", "PDF-отчёт", "Приоритеты"];

  return (
    <button
      className={`pricing-card ${plan.recommended ? "pricing-card--recommended" : ""} ${selected ? "is-selected" : ""}`}
      type="button"
      onClick={() => onSelect(plan.name)}
    >
      {plan.recommended && <span className="pricing-card__badge">Рекомендуем</span>}
      <span className="pricing-card__icon" aria-hidden="true">
        LF
      </span>
      <h3>{plan.name}</h3>
      <strong>{plan.price}</strong>
      <p>{plan.description}</p>
      <ul>
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <span className="pricing-card__cta">Выбрать тариф</span>
      <small>Без подключения оплаты</small>
    </button>
  );
}
