type HeaderProps = {
  onAuditClick: () => void;
};

export function Header({ onAuditClick }: HeaderProps) {
  return (
    <header className="header">
      <div className="brand">
        <button className="logo" type="button" onClick={onAuditClick}>
          LeadFix
        </button>
        <span className="brand__descriptor">Аудитор продающей способности сайтов</span>
      </div>
      <nav className="nav" aria-label="Навигация">
        <a href="#for">Для кого?</a>
        <a href="#pricing">Тарифы</a>
        <a href="#cases">Кейсы</a>
        <a href="#faq">FAQ</a>
      </nav>
      <button className="header__button" type="button" onClick={onAuditClick}>
        Проверить сайт
      </button>
    </header>
  );
}
