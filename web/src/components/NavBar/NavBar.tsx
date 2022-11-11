import logoSmall from '../../assets/logo-small.png';
import { Chats, GameController, List, SignOut, UsersThree } from 'phosphor-react';
import './NavBar.scss';
import useAuth from '../../auth/auth';
import { Link } from 'react-router-dom';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IntraData } from '../../Interfaces/interfaces';
import { defaultIntra, getStoredData } from '../../utils/utils';
import { Notifications } from '../Notifications/Notifications';
import { useSnapshot } from 'valtio';
import { actionsStatus, stateStatus } from '../../status/statusState';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface NavBarProps {
  Children: any;
}

export function NavBar({ Children }: NavBarProps) {
  const { logout } = useAuth();
  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);
  const currentStateStatus = useSnapshot(stateStatus);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    getStoredData(setIntraData);
    setMenuVisible(false);
  }, []);

  useEffect(() => {
    actionsStatus.initializeSocketStatus();
  }, []);

  useEffect(() => {
    if (currentStateStatus.socket) {
      currentStateStatus.socket.on('change', () => {
        getStoredData(setIntraData);
      });
    }
  }, [currentStateStatus.socket]);


  async function handleLogOut() {
    logout();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleOutsideClick(e: any, id: string) {
    console.log('comparando', e.target.id, id);
    if (e.target.id == id) {
      setMenuVisible(false);

    }
  }
  // console.log(intraData);

  return (
    <>
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
            onClick={() => setMenuVisible(!menuVisible)}
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
                    onClick={(e) => handleOutsideClick(e, 'navBar__menu__overlay')}>
                  </div>
                </>
                : null
            }
            <nav className="navBar__menu"
              style={{ top: (menuVisible ? '100px' : '-1000px') }}>
              <Link
                to="/game"
                className="navBar__game__link"
              >
                <GameController size={32} />
                Game
              </Link>
              <Link
                to="/chat"
                className="navBar__chats__link"
              >
                <Chats className="navBar__chats__icon" />
                <p className="navBar__chats__text">Chats</p>
              </Link>
            </nav>
          </div>
          <li className="navBar__divider" />
          <Notifications email={intraData.email} />
          <li>
            <div className="navBar__user">
              <Link to="/profile">
                <div
                  className="navBar__user__icon"
                  style={{ backgroundImage: `url(${intraData.image_url})` }}
                />
              </Link>
            </div>
          </li >

          <li className="navBar__logout" onClick={handleLogOut}>
            <SignOut size={22} />
            Log-out
          </li>
        </ul >
      </div >
      <Children intraData={intraData} setIntraData={setIntraData} />
    </>

  );
}
