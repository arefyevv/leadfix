"use client";

import { FormEvent } from "react";
import { Header } from "@/components/Header";

type HeroSectionProps = {
  url: string;
  error: string;
  onUrlChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function HeroSection({ url, error, onUrlChange, onSubmit }: HeroSectionProps) {
  return (
    <>
      <Header />

      <section className="hero hero--reference screen" id="audit" aria-labelledby="leadfix-hero-title">
        <div className="hero-poster reference-hero">
          <div className="hero__inner">
            <div className="hero__label">
              <span className="hero__label-icon" aria-hidden="true" />
              <span>Аудит лендингов под заявки</span>
            </div>

            <h1 className="hero__title" id="leadfix-hero-title">
              <span>Покажем, где ваш лендинг </span>
              <span>теряет заявки</span>
            </h1>

            <p className="hero__subtitle">
              Проверяем страницу как маркетолог, UX-дизайнер и директолог: находим слабый оффер,
              незаметные CTA, недоверие, лишние поля и мобильные ошибки. На выходе — список правок по влиянию на заявки.
            </p>

            <form className="site-form" onSubmit={onSubmit} noValidate>
              <input
                value={url}
                onChange={(event) => onUrlChange(event.target.value)}
                type="url"
                inputMode="url"
                placeholder="https://vash-sajt.ru"
                aria-label="Адрес сайта"
              />
              <button type="submit">Найти ошибки</button>
            </form>

            <div className="hero__proof-row">
              <p className="hero__proof">Бесплатно покажем первые ошибки за 1 минуту</p>
            </div>
            <p className="form-error" aria-live="polite">
              {error}
            </p>
          </div>

          <div className="laptop-dashboard" aria-hidden="true">
            <aside className="dashboard-sidebar">
              <div className="dashboard-brand">
                <img src="/logo-black.svg" alt="LeadFix" />
              </div>
              <small>Разделы</small>
              <p className="is-selected">Сводка</p>
              <p>Оффер</p>
              <p>Кнопки</p>
              <p>Доверие</p>
              <p>Формы</p>
              <p>Мобильная версия</p>
            </aside>

            <main className="dashboard-main">
              <div className="dashboard-head">
                <b>Обзор</b>
                <span>Поиск по проблемам, блокам и формам...</span>
                <i />
              </div>

              <div className="welcome-row">
                <div>
                  <strong>Аудит конверсии</strong>
                </div>
                <button type="button">Экспорт</button>
              </div>

              <div className="dash-grid">
                <article>
                  <small>Готовность</small>
                  <strong>61/100</strong>
                  <em>требует правок</em>
                </article>
                <article>
                  <small>Критично</small>
                  <strong>2</strong>
                  <em>исправить сначала</em>
                </article>
                <article>
                  <small>Важно</small>
                  <strong>5</strong>
                  <em>следующий этап</em>
                </article>
                <article>
                  <small>План правок</small>
                  <strong>4</strong>
                  <em>сначала</em>
                </article>
              </div>

              <div className="dashboard-bottom">
                <section>
                  <div>
                    <b>Оценка конверсии</b>
                  </div>
                  <div className="dashboard-chart" aria-hidden="true">
                    <i style={{ height: "42%" }} />
                    <i style={{ height: "58%" }} />
                    <i style={{ height: "36%" }} />
                    <i style={{ height: "74%" }} />
                    <i style={{ height: "62%" }} />
                    <i style={{ height: "86%" }} />
                  </div>
                </section>
                <section>
                  <b>Сводка заявок</b>
                  <div className="dashboard-ring" />
                </section>
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
