import type { FormEvent } from "react";

type HeroSectionProps = {
  url: string;
  error: string;
  onUrlChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function HeroSection({ url, error, onUrlChange, onSubmit }: HeroSectionProps) {
  return (
    <section className="hero screen" id="audit">
      <div className="hero__inner">
        <p className="hero__label">LeadFix / AI-аудит конверсии</p>
        <h1 className="hero__title">Найдём, где ваш сайт теряет заявки.</h1>
        <p className="hero__subtitle">
          AI + правила конверсии: за 5 минут найдём слабый оффер, CTA, доверие, формы и мобильные проблемы.
        </p>
        <form className="site-form" onSubmit={onSubmit} noValidate>
          <input
            value={url}
            onChange={(event) => onUrlChange(event.target.value)}
            type="url"
            inputMode="url"
            placeholder="https://example.ru"
            aria-label="Адрес сайта"
          />
          <button type="submit">Найти проблемы</button>
        </form>
        <p className="hero__proof">Уже нашли 243 проблемы конверсии</p>
        <p className="form-error" aria-live="polite">{error}</p>

        <div className="hero-product" aria-label="Пример отчета LeadFix">
          <div className="hero-product__sidebar">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="hero-product__content">
            <div className="hero-product__top">
              <div>
                <span>Conversion score</span>
                <strong>61/100</strong>
              </div>
              <div className="hero-product__status">3 quick wins</div>
            </div>
            <div className="hero-product__grid">
              <div className="hero-chart">
                <span style={{ height: "42%" }} />
                <span style={{ height: "64%" }} />
                <span style={{ height: "50%" }} />
                <span style={{ height: "78%" }} />
                <span style={{ height: "58%" }} />
              </div>
              <div className="hero-ring">
                <i />
              </div>
              <div className="hero-checks">
                <span>Слабый оффер</span>
                <span>CTA без следующего шага</span>
                <span>Мало доверия до формы</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-stats" aria-label="Метрики LeadFix">
        <div><strong>5 мин</strong><span>до preview-аудита</span></div>
        <div><strong>10</strong><span>приоритетных проблем</span></div>
        <div><strong>3</strong><span>quick wins в отчете</span></div>
        <div><strong>24 ч</strong><span>на полный разбор</span></div>
      </div>
    </section>
  );
}
