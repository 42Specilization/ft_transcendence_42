import './NavBar.scss';
import { useAuth } from '../../contexts/AuthContext';
import logoSmall from '../../assets/logo-small.png';
import { Bell, BellRinging, Chats, GameController, List, SignOut, UsersThree } from 'phosphor-react';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { Notifications } from '../Notifications/Notifications';
import { actionsStatus } from '../../adapters/status/statusState';
import { IntraDataContext } from '../../contexts/IntraDataContext';

interface NavBarProps {
  Children: any;
}

export function NavBar({ Children }: NavBarProps) {
  const { logout } = useAuth();

  const { intraData, setIntraData } = useContext(IntraDataContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [notifyVisible, setNotifyVisible] = useState(false);

  const menuRef: React.RefObject<HTMLDivElement> = useRef(null);
  const notifyRef: React.RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (!intraData.image_url.includes('https://')) {
      setIntraData((prevIntraData) => {
        return {
          ...prevIntraData,
          image_url: `${intraData.image_url}`
        };
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (event: any) => {
    if (menuRef.current && !menuRef.current.contains(event.target)
      && event.target.id !== 'navBar__menu__icon') {
      setMenuVisible(false);
    }
    if (notifyRef.current && !notifyRef.current.contains(event.target)
      && event.target.id !== 'navBar__notify__icon') {
      setNotifyVisible(false);
    }
  };

  const handleClickInside = (event: any) => {
    if (event.target.id === 'navBar__menu__icon') {
      setMenuVisible((prevMenuVisible) => !prevMenuVisible);
    }
    if (event.target.id === 'navBar__notify__icon') {
      setNotifyVisible((prevNotifyVisible) => !prevNotifyVisible);
    }
  };

  async function handleLogOut() {
    actionsStatus.disconnectSocketStatus();
    logout();
  }

  return (
    <>
      <div className='navBar'>
        <ul className='navBar__list'>

          <li className='navBar__logo'>
            <Link to='/'>
              <img src={logoSmall} alt='logo small' />
            </Link>
          </li>

          <li className='navBar__divider' />

          <li className='navBar__pages' onClick={(e) => handleClickInside(e)}>
            <div className='navBar__menu__icon'>
              <List id='navBar__menu__icon' size={40} className='navBar__icons' />
            </div>
            <nav ref={menuRef} className='navBar__menu'
              style={{ top: (menuVisible ? '97px' : '-280px') }}>
              <Link to='/game' className='navBar__icons'>
                <GameController size={32} />
                Game
              </Link>
              <Link to='/chat' className='navBar__icons'>
                <Chats size={32} />
                <p>Chats</p>
              </Link>
              <Link to='/community' className='navBar__icons'>
                <UsersThree size={32} />
                <p>Community</p>
              </Link>
            </nav>
          </li>

          <li className='navBar__divider' />

          <li className='navBar__notify' onClick={(e) => handleClickInside(e)}>
            <div id='navBar__notify__icon' className='navBar__notify__icon'>
              {intraData.notify.length == 0 ?
                <Bell id='navBar__notify__icon'
                  className='navBar__icons' size={40} />
                :
                <>
                  <BellRinging id='navBar__notify__icon'
                    className='navBar__icons' size={40} />
                  <div id='navBar__notify__icon'
                    className='notify__icon__notEmpty'>
                    {intraData.notify.length < 99 ? intraData.notify.length : 99}
                  </div>
                </>
              }
            </div>
            <div ref={notifyRef} className='navBar__notify__body'
              style={{ top: (notifyVisible ? '97px' : '-300px') }}>
              <Notifications />
            </div>
          </li>

          <li>
            <Link to='/profile'>
              <div
                className='navBar__profile'
                style={{ backgroundImage: `url(${intraData.image_url})` }}
              />
            </Link>
          </li >


          <li className='navBar__logout navBar__icons' onClick={handleLogOut}>
            <SignOut size={32} />
            Log-out
          </li>

        </ul >
      </div >
      <Children />
    </>

  );
}
