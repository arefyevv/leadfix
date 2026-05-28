"use client";

import { FormEvent, useEffect, useState } from "react";

type HeroSectionProps = {
  url: string;
  error: string;
  onUrlChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const navItems = [
  { label: "Р”Р»СЏ РєРѕРіРѕ", href: "#audience" },
  { label: "Р§С‚Рѕ РїСЂРѕРІРµСЂСЏРµРј", href: "#audit-checks" },
  { label: "РўР°СЂРёС„С‹", href: "#pricing" },
  { label: "РџСЂРёРјРµСЂ Р°СѓРґРёС‚Р°", href: "#cases" },
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
          aria-label={isMenuOpen ? "Р—Р°РєСЂС‹С‚СЊ РјРµРЅСЋ" : "РћС‚РєСЂС‹С‚СЊ РјРµРЅСЋ"}
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

        <nav className="laptop-menu" aria-label="РќР°РІРёРіР°С†РёСЏ">
          {navItems.map((item, index) => (
            <a href={item.href} key={item.label} className={index === 0 ? "is-active" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="laptop-cta" href="#audit" onClick={closeMobileMenu}>
          РџСЂРѕРІРµСЂРёС‚СЊ СЃР°Р№С‚
        </a>

        <nav className={isMenuOpen ? "mobile-menu-panel is-open" : "mobile-menu-panel"} aria-label="РњРѕР±РёР»СЊРЅРѕРµ РјРµРЅСЋ">
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
              <span>Р­РєСЃРїСЂРµСЃСЃ-Р°СѓРґРёС‚ СЃР°Р№С‚РѕРІ РїРѕРґ Р·Р°СЏРІРєРё</span>
            </div>

            <h1 className="hero__title" id="leadfix-hero-title">
              <span>РќР°Р№РґС‘Рј, РіРґРµ РІР°С€ Р»РµРЅРґРёРЅРі </span>
              <span>С‚РµСЂСЏРµС‚ Р·Р°СЏРІРєРё</span>
            </h1>

            <p className="hero__subtitle">
              РђРЅР°Р»РёР·РёСЂСѓРµРј РѕС„С„РµСЂ, CTA, РґРѕРІРµСЂРёРµ, СЃС‚СЂСѓРєС‚СѓСЂСѓ Рё РјРѕР±РёР»СЊРЅСѓСЋ РІРµСЂСЃРёСЋ СЃ РїРѕРјРѕС‰СЊСЋ РР-РёРЅСЃС‚СЂСѓРјРµРЅС‚РѕРІ. РџРѕРєР°Р·С‹РІР°РµРј
              РєРѕРЅРєСЂРµС‚РЅС‹Рµ РѕС€РёР±РєРё Рё С‡С‚Рѕ РёСЃРїСЂР°РІРёС‚СЊ РІ РїРµСЂРІСѓСЋ РѕС‡РµСЂРµРґСЊ.
            </p>

            <form className="site-form" onSubmit={onSubmit} noValidate>
              <input
                value={url}
                onChange={(event) => onUrlChange(event.target.value)}
                type="url"
                inputMode="url"
                placeholder="https://vash-sajt.ru"
                aria-label="РђРґСЂРµСЃ СЃР°Р№С‚Р°"
              />
              <button type="submit">РќР°Р№С‚Рё РѕС€РёР±РєРё</button>
            </form>

            <p className="hero__proof">Р‘РµСЃРїР»Р°С‚РЅРѕ РїРѕРєР°Р¶РµРј РїРµСЂРІС‹Рµ РѕС€РёР±РєРё Р·Р° 1 РјРёРЅСѓС‚Сѓ</p>
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

