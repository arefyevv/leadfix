"use client";

import { useEffect, useState } from "react";

type HeaderProps = {
  onAuditClick: () => void;
};

export function Header({ onAuditClick }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleAuditClick() {
    setMenuOpen(false);
    onAuditClick();
  }

  return (
    <header className={`header ${scrolled || menuOpen ? "is-scrolled" : ""}`}>
      <div className="brand">
        <button className="logo" type="button" onClick={handleAuditClick}>
          LeadFix
        </button>
        <span className="brand__descriptor">Аудитор продающей способности сайтов</span>
      </div>

      <button
        className="menu-toggle"
        type="button"
        aria-label="Открыть меню"
        aria-controls="site-nav"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`nav ${menuOpen ? "is-open" : ""}`} id="site-nav" aria-label="Навигация">
        <a href="#for" onClick={() => setMenuOpen(false)}>Для кого?</a>
        <a href="#pricing" onClick={() => setMenuOpen(false)}>Тарифы</a>
        <a href="#cases" onClick={() => setMenuOpen(false)}>Кейсы</a>
        <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
        <button className="nav__audit" type="button" onClick={handleAuditClick}>
          Проверить сайт
        </button>
      </nav>
      <button className="header__button" type="button" onClick={handleAuditClick}>
        Проверить сайт
      </button>
    </header>
  );
}
