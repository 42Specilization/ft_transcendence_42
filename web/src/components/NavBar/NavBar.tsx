import logoSmall from '../../assets/logo-small.png';
import { Bell, Chats, CheckCircle, GameController, List, SignOut, TelegramLogo, UsersThree, XCircle } from 'phosphor-react';
import './NavBar.scss';
import useAuth from '../../auth/auth';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IntraData } from '../../Interfaces/interfaces';
import { defaultIntra, getStoredData } from '../../utils/utils';
import { NotificationFriend } from '../Notifications/NotificationFriend/NotificationFriend';
import { NotificationChallenge } from '../Notifications/NotificationChallenge/NotificationChallenge';
import { NotificationMessage } from '../Notifications/NotificationMessage/NotificationMessage';
import { Notifications } from '../Notifications/Notifications';

export function NavBar() {
  const { logout } = useAuth();


  const [menuVisible, setMenuVisible] = useState(false);
  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);

  useEffect(() => {
    getStoredData(setIntraData);
  }, []);

  async function handleLogOut() {
    logout();
  }

  function handleMenuClick(){
    setMenuVisible(!menuVisible);
  }

  function handleOutsideClick (e: any, id : string)  {
    if (e.target.id == id) {
      setMenuVisible(false);
    }
  }


  return (
    <div className="navBar">
      <ul className="navBar__list">
        <li className="navBar__logo">
          <Link to="/">
            <img
              className="navBar__logo__image"
              src={logoSmall}
              alt="logo small"
            />
          </Link>
        </li>
        <li className="navBar__divider" />
        <div 
          className="navBar__div__menu"
          onClick={handleMenuClick}
        >
          <p className="navBar__menus__list">
            <span>
              <List size={22} />
            </span>
          </p>

          {
            menuVisible ?
              <>
                <div
                  id='navBar__menu__overlay'
                  className='navBar__menu__overlay'
                  onClick={(e)=> handleOutsideClick(e, 'navBar__menu__overlay')}>
                </div>
              </> 
              : null
          }
          <nav className="navBar__menu"
            style={{top: (menuVisible? '100px' : '-1000px')}}>
            <Link to="/game" className="navBar__game__link">
              <GameController size={32} />
              Game
            </Link>
            <Link to="/chat" className="navBar__chats__link">
              <Chats className="navBar__chats__icon" />
              <p className="navBar__chats__text">Chats</p>
            </Link>
            <Link to="/community" className="navBar__community__link">
              <UsersThree size={32} />
              <p className="navBar__community__text">Community</p>
            </Link>

          </nav>
        </div>
        <li className="navBar__divider" />
        {/* <li className='navBar__notify' > */}
        <Notifications />
        {/* </li> */}
        <li>
          <div className="navBar__user">
            <Link to="/profile">
              <div
                className="navBar__user__icon"
                style={{ backgroundImage: `url(${intraData.image_url})` }}
              />
            </Link>
          </div>
        </li>

        <li className="navBar__logout" onClick={handleLogOut}>
          <SignOut size={22} />
          Log-out
        </li>
      </ul>
    </div>
  );
}
