import headerLogo from '../images/header-logo.svg';
import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Link } from 'react-router-dom';
import { AppRoute } from '../utils/constants';

export function Header({ loggedIn, handleLogout, path }) {
  const currentUser = useContext(CurrentUserContext)

  return (
    <header className="header">
      <img
        className="header__logo"
        alt="Логотип Место"
        src={headerLogo}
      />
      {loggedIn
        ? <div className="header__actions">
            <p className="header__login">{currentUser.email}</p>
            <button className='header__button' onClick={handleLogout}>Выйти</button>
          </div>
        : <Link className='header__link' to={path === AppRoute.login ? AppRoute.registration : AppRoute.login}>
            {path === AppRoute.login ? 'Зарегистрироваться' : 'Войти'}
          </Link>}
    </header>
  )
}
