import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as auth from '../utils/auth';
import { tooltipMessage, TooltipType } from '../utils/constants';

export function Login({ handleLogin, openTooltip }) {
  const [authData, setAuthData] = useState({ email: '', password: '' })
  const history = useHistory();

  function handleChange(event) {
    const { name, value } = event.target;
    setAuthData({ ...authData, [name]: value })
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!authData.email || !authData.password) {
      return;
    }

    auth.logIn(authData.email, authData.password)
      .then((data) => {
        if (data) {
          localStorage.setItem('token', data.token)
        }
        handleLogin()
        history.push('/')
      })
      .catch((err) => {
        err.json().then((e) => {
          openTooltip(TooltipType.failure, e.error || e.message || tooltipMessage.registration[TooltipType.failure])
        })
      });
  }

  return (
    <div className="register">
      <h3 className="register__title">
        Вход
      </h3>
      <form onSubmit={handleSubmit} className="form">
        <div className="form__input-wrapper form__input-wrapper_compact">
          <input className="form__input form__input_theme_dark" id="email" name="email" type="email" value={authData.email}
                 onChange={handleChange}
                 placeholder="Email"/>
        </div>
        <div className="form__input-wrapper form__input-wrapper_compact">
          <input className="form__input form__input_theme_dark" id="password" name="password" type="password" value={authData.password}
                 onChange={handleChange}
                 placeholder="Пароль"/>
        </div>
        <button className="form__submit-button form__submit-button_theme_dark register__button" type="submit" onSubmit={handleSubmit}>Войти</button>
      </form>
    </div>
  )
}
