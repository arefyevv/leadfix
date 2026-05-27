"use client";

import { FormEvent, useEffect, useState } from "react";

type HeroSectionProps = {
  url: string;
  error: string;
  onUrlChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const navItems = [
  { label: "Для кого", href: "#audience" },
  { label: "Что проверяем", href: "#checks" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Пример аудита", href: "#showcase" },
  { label: "FAQ", href: "#faq" }
];

export function HeroSection({ url, error, onUrlChange, onSubmit }: HeroSectionProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavScrolled, setIsNavScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsNavScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function closeMobileMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
      <header
        className={isNavScrolled ? "laptop-nav leadfix-fixed-nav is-scrolled" : "laptop-nav leadfix-fixed-nav"}
        aria-label="LeadFix hero navigation"
      >
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <a className="laptop-logo" href="#audit" aria-label="LeadFix" onClick={closeMobileMenu}>
          <span>LF</span>
          <b>LeadFix</b>
        </a>

        <nav className="laptop-menu" aria-label="Навигация">
          {navItems.map((item, index) => (
            <a href={item.href} key={item.label} className={index === 0 ? "is-active" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="laptop-cta" href="#audit" onClick={closeMobileMenu}>
          Проверить сайт
        </a>

        <nav className={isMenuOpen ? "mobile-menu-panel is-open" : "mobile-menu-panel"} aria-label="Мобильное меню">
          {navItems.map((item) => (
            <a href={item.href} key={item.label} onClick={closeMobileMenu}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero hero--reference screen" id="audit" aria-labelledby="leadfix-hero-title">
        <div className="hero-poster reference-hero">
          <div className="hero__inner">
            <div className="hero__label">
              <span className="hero__label-icon" aria-hidden="true" />
              <span>Экспресс-аудит сайтов под заявки</span>
            </div>

            <h1 className="hero__title" id="leadfix-hero-title">
              <span>Найдём, где ваш лендинг </span>
              <span>теряет заявки</span>
            </h1>

            <p className="hero__subtitle">
              Анализируем оффер, CTA, доверие, структуру и мобильную версию с помощью ИИ-инструментов. Показываем
              конкретные ошибки и что исправить в первую очередь.
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

            <p className="hero__proof">Бесплатно покажем первые ошибки за 1 минуту</p>
            <p className="form-error" aria-live="polite">
              {error}
            </p>
          </div>

          <div className="laptop-dashboard" aria-hidden="true">
            <aside className="dashboard-sidebar">
              <div className="dashboard-brand">
                <span>LF</span>
                <b>LeadFix</b>
              </div>
              <small>Main Menu</small>
              <p className="is-selected">Dashboard</p>
              <p>Offer</p>
              <p>CTA</p>
              <p>Trust</p>
              <p>Mobile UX</p>
            </aside>

            <main className="dashboard-main">
              <div className="dashboard-head">
                <b>Overview</b>
                <span>Search audit findings, pages, forms...</span>
                <i />
              </div>

              <div className="welcome-row">
                <div>
                  <strong>Conversion audit, Founder!</strong>
                  <em>Monday, 24 December 2026</em>
                </div>
                <button type="button">Export</button>
              </div>

              <div className="dash-grid">
                <article>
                  <small>Score</small>
                  <strong>61/100</strong>
                  <em>+32% potential</em>
                </article>
                <article>
                  <small>Critical</small>
                  <strong>2</strong>
                  <em>fix first</em>
                </article>
                <article>
                  <small>Medium</small>
                  <strong>5</strong>
                  <em>next sprint</em>
                </article>
                <article>
                  <small>Quick wins</small>
                  <strong>4</strong>
                  <em>1 day</em>
                </article>
              </div>

              <div className="dashboard-bottom">
                <section>
                  <div>
                    <b>Conversion score</b>
                    <span>Offer clarity</span>
                  </div>
                  <p>
                    <i style={{ width: "62%" }} />
                  </p>
                  <p>
                    <i style={{ width: "42%" }} />
                  </p>
                  <p>
                    <i style={{ width: "78%" }} />
                  </p>
                </section>
                <section>
                  <b>Sales Overview</b>
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
