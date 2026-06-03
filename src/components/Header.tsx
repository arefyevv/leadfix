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
  const [activeHref, setActiveHref] = useState("");
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, x: 0, visible: false });

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.href.split("#")[1] ?? ""))
      .filter((section): section is HTMLElement => Boolean(section));

    function updateActiveSection() {
      const viewportAnchor = window.innerHeight * 0.38;
      const current = sections.reduce<HTMLElement | null>((active, section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportAnchor && rect.bottom >= viewportAnchor) return section;
        if (!active && rect.top <= viewportAnchor) return section;
        return active;
      }, null);

      setActiveHref(current ? `/#${current.id}` : "");
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  useEffect(() => {
    function updateIndicator() {
      if (!activeHref) {
        setIndicatorStyle((current) => ({ ...current, visible: false }));
        return;
      }

      const menu = document.querySelector<HTMLElement>(".leadfix-fixed-nav .laptop-menu");
      const activeLink = document.querySelector<HTMLElement>(`.leadfix-fixed-nav .laptop-menu a[data-href="${activeHref}"]`);

      if (!menu || !activeLink) {
        setIndicatorStyle((current) => ({ ...current, visible: false }));
        return;
      }

      const menuRect = menu.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setIndicatorStyle({
        width: Math.round(linkRect.width),
        x: Math.round(linkRect.left - menuRect.left),
        visible: true
      });
    }

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeHref]);

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
        <span
          className={indicatorStyle.visible ? "laptop-menu__indicator is-visible" : "laptop-menu__indicator"}
          style={{ width: `${indicatorStyle.width}px`, transform: `translateX(${indicatorStyle.x}px)` }}
          aria-hidden="true"
        />
        {navItems.map((item) => (
          <a href={item.href} key={item.label} data-href={item.href} className={activeHref === item.href ? "is-active" : undefined}>
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
