import headerLogo from '../images/header-logo.svg';

export function Header() {
  return (
    <header className="header">
      <img
        className="header__logo"
        alt="Логотип Место"
        src={headerLogo}
      />
    </header>
  )
}
