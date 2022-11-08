
import logoSmall from '../../assets/logo-small.png';
import { Chats, List, SignOut } from 'phosphor-react';
import './NavBar.scss';
import useAuth from '../../auth/auth';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IntraData } from '../../Interfaces/interfaces';
import { defaultIntra, getStoredData } from '../../utils/utils';

export function NavBar() {
  const { logout } = useAuth();

  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);
  useEffect(() => {
    getStoredData(setIntraData);
  }, []);

  async function handleLogOut() {
    logout();
  }

  return (
    <div className="navBar">
      <ul className="navBar__list ">
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
        <div className="navBar__div__menu">
          <p className="navBar__menus__list">
            <span>
              <List size={22} />
            </span>
          </p>
          <nav className="navBar__menu">
            <Link to="/" className="navBar__achievements">
              Achievements
            </Link>
            <Link to="/historic" className="navBar__historic">
              Historic
            </Link>
            <Link to="/game" className="navBar__game">
              Game
            </Link>
          </nav>
        </div>
        <li className="navBar__divider" />
        <li className="navBar__chats">
          <Link to="/" className="navBar__chats__link">
            <Chats className="navBar__chats__icon" />
            <p className="navBar__chats__text">Chats</p>
          </Link>
        </li>
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
