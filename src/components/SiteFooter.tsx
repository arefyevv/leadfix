export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__card">
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <img src="/logo-black.svg" alt="LeadFix" />
            <p>Аудит продающей способности лендингов под платный трафик.</p>
          </div>

          <nav className="site-footer__nav" aria-label="Навигация в футере">
            <div>
              <b>Сервис</b>
              <a href="/#audit-checks">Что проверяем</a>
              <a href="/#pricing">Тарифы</a>
              <a href="/#faq">FAQ</a>
            </div>
            <div>
              <b>Документы</b>
              <a href="/offer">Публичная оферта</a>
              <a href="/privacy">Политика конфиденциальности</a>
            </div>
          </nav>
        </div>

        <div className="site-footer__bottom">
          <div className="site-footer__details">
            <span>© 2026 LeadFix</span>
            <span>НПД</span>
            <span>ИНН 910907646492</span>
          </div>
          <div className="site-footer__contacts">
            <a href="https://t.me/leadfix_support" target="_blank" rel="noreferrer" aria-label="Telegram LeadFix">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.7 4.1 3.9 10.6c-1.1.4-1.1 1.1-.2 1.4l4.3 1.3 1.7 5.1c.2.7.1.9.8.9.5 0 .8-.2 1-.4l2.1-2 4.4 3.2c.8.5 1.4.2 1.6-.8l2.8-13.4c.3-1.2-.5-1.8-1.7-1.3ZM9.1 13l8.4-5.3c.4-.2.8-.1.5.2l-6.9 6.3-.3 3.1-1.7-4.3Z" />
              </svg>
              <span>Telegram</span>
            </a>
            <a href="mailto:hello@leadfix.ru">hello@leadfix.ru</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
