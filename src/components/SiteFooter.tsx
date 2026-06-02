export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__card">
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <img src="/leadfix-logo.png" alt="LeadFix" />
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
          <span>© 2026 LeadFix</span>
          <span>НПД Арефьев В.О.</span>
          <span>ИНН 910907646492</span>
        </div>
      </div>
    </footer>
  );
}
