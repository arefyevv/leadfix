import type { Plan } from "./types";

type PricingCardProps = {
  plan: Plan;
  selected: boolean;
  onSelect: (planName: string) => void;
  variant?: "default" | "checkout";
};

export function PricingCard({ plan, selected, onSelect, variant = "default" }: PricingCardProps) {
  const features = plan.features ?? ["Аудит сайта", "Рекомендации", "web-отчет"];
  const format = plan.format ?? ["web-отчет"];
  const featureDetails = plan.featureDetails ?? {};
  const isCheckout = variant === "checkout";
  const isFreePlan = plan.name === "Тест сайта";
  const ctaHref = isFreePlan ? "/#audit" : `/checkout?plan=${encodeURIComponent(plan.name)}`;
  const ctaLabel = isFreePlan ? "Запустить тест" : "Получить отчёт";
  const className = `pricing-card ${!isCheckout && plan.recommended ? "pricing-card--recommended" : ""} ${selected ? "is-selected" : ""}`;

  const content = (
    <>
      {!isCheckout && plan.recommended && <span className="pricing-card__badge">Популярный выбор</span>}
      {isCheckout && selected && <span className="pricing-card__selected-badge">Выбрано</span>}
      {!isCheckout && (
        <span className="pricing-card__icon" aria-hidden="true">
          <img src="/logo-black.svg" alt="" />
        </span>
      )}
      <div className="pricing-card__intro">
        <h3>{plan.name}</h3>
        <strong>{plan.price}</strong>
        <p>{plan.description}</p>
      </div>

      <div className="pricing-card__group">
        <span>Что входит</span>
        <ul>
          {features.map((feature) => (
            <li key={feature}>
              <span>{feature}</span>
              {featureDetails[feature] && (
                <span className="pricing-card__info" tabIndex={0} aria-label={featureDetails[feature]} data-tooltip={featureDetails[feature]}>
                  i
                </span>
              )}
            </li>
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

      {isCheckout ? (
        <span className="pricing-card__cta">{ctaLabel}</span>
      ) : (
        <a className="pricing-card__cta" href={ctaHref}>{ctaLabel}</a>
      )}
    </>
  );

  if (isCheckout) {
    return (
      <button className={className} type="button" onClick={() => onSelect(plan.name)}>
        {content}
      </button>
    );
  }

  return (
    <article className={className}>
      {content}
    </article>
  );
}
