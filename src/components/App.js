import { useEffect, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Main } from './Main';
import { ImagePopup } from './ImagePopup';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';
import { api } from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function App() {
  const [cards, setCards] = useState([])
  const [isEditProfilePopupOpen, setEditProfilePopupVisibility] = useState(false)
  const [isAddPlacePopupOpen, setAddPlacePopupVisibility] = useState(false)
  const [isEditAvatarPopupOpen, setEditAvatarPopupVisibility] = useState(false)
  const [isLoading, setLoadingStatus] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [currentUser, setCurrentUser] = useState({})

  useEffect(() => {
    api.getInitialCards()
      .then((cards) => {
        setCards(cards)

      })
      .catch((err) => console.log(`Error: ${err}`))
  }, [])

  useEffect(() => {
    api.getUserInfo()
      .then((userData) => {
        setCurrentUser(userData)
      })
      .catch((err) => console.log(`Error: ${err}`))
  }, [])

  function onEditProfile() {
    setEditProfilePopupVisibility(true)
  }

  function onAddPlace() {
    setAddPlacePopupVisibility(true)
  }

  function onEditAvatar() {
    setEditAvatarPopupVisibility(true)
  }

  function closeAllPopups() {
    setEditProfilePopupVisibility(false)
    setAddPlacePopupVisibility(false)
    setEditAvatarPopupVisibility(false)
    setSelectedCard(null)
  }

  function handleCardClick(card) {
    setSelectedCard(card)
  }

  function handleUpdateUser(name, about) {
    setLoadingStatus(true)
    api.updateUserInfo(name, about)
      .then(userInfo => {
        setCurrentUser(userInfo)
        closeAllPopups()
      })
      .catch((err) => console.log(`Error: ${err}`))
      .finally(() => setLoadingStatus(false))
  }

  function handleUpdateAvatar(avatar) {
    setLoadingStatus(true)
    api.updateUserAvatar(avatar)
      .then(userInfo => {
        setCurrentUser(userInfo)
        closeAllPopups()
      })
      .catch((err) => console.log(`Error: ${err}`))
      .finally(() => setLoadingStatus(false))
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(item => item._id === currentUser._id);

    api.toggleLike(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((item) => item._id === card._id ? newCard : item))
      })
      .catch((err) => console.log(`Error: ${err}`))
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id))
      })
      .catch((err) => console.log(`Error: ${err}`))
  }

  function handleAddCard(name, link) {
    setLoadingStatus(true)
    api.addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards])
        closeAllPopups()
      })
      .catch((err) => console.log(`Error: ${err}`))
      .finally(() => setLoadingStatus(false))
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header/>
        <Main onEditProfile={onEditProfile} onAddPlace={onAddPlace} onEditAvatar={onEditAvatar}
              onCardClick={handleCardClick} cards={cards} onCardLike={handleCardLike} onCardDelete={handleCardDelete}/>
        <Footer/>
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddCard={handleAddCard}
                       isLoading={isLoading}/>
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}
                          isLoading={isLoading}/>
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}
                         isLoading={isLoading}/>
        <ImagePopup card={selectedCard} handleCloseButtonClick={closeAllPopups}/>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
