"use client";

import { useEffect, useState } from "react";

const navItems = [
  { label: "Для кого", href: "/#audience" },
  { label: "Что проверяем", href: "/#audit-checks" },
  { label: "Тарифы", href: "/#pricing" },
  { label: "Пример аудита", href: "/#cases" },
  { label: "FAQ", href: "/#faq" }
];

export function Header() {
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

  function closeMobileMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      className={scrolled ? "laptop-nav leadfix-fixed-nav is-scrolled" : "laptop-nav leadfix-fixed-nav"}
      aria-label="Навигация LeadFix"
    >
      <button
        className="mobile-menu-button"
        type="button"
        aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>

      <a className="laptop-logo" href="/#audit" aria-label="LeadFix" onClick={closeMobileMenu}>
        <img src="/logo-white.svg" alt="LeadFix" />
      </a>

      <nav className="laptop-menu" aria-label="Основная навигация">
        {navItems.map((item, index) => (
          <a href={item.href} key={item.label} className={index === 0 ? "is-active" : undefined}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="laptop-cta" href="/#audit" onClick={closeMobileMenu}>
        Проверить сайт
      </a>

      <nav className={menuOpen ? "mobile-menu-panel is-open" : "mobile-menu-panel"} aria-label="Мобильное меню">
        {navItems.map((item) => (
          <a href={item.href} key={item.label} onClick={closeMobileMenu}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
