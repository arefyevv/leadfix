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
      </div>
    </section>
  );
}
