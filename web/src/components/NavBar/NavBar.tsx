import './NavBar.scss';
import { useAuth } from '../../contexts/AuthContext';
import logoSmall from '../../assets/logo-small.png';
import { Bell, BellRinging, Chats, GameController, List, SignOut, UsersThree } from 'phosphor-react';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { Notify } from '../Notify/Notify';
import { actionsStatus } from '../../adapters/status/statusState';
import { GlobalContext } from '../../contexts/GlobalContext';
import { getUrlImage } from '../../others/utils/utils';
import { ChatContext } from '../../contexts/ChatContext';

interface NavBarProps {
  Children: any;
}

export function NavBar({ Children }: NavBarProps) {
  const { logout } = useAuth();
  const { activeChat } = useContext(ChatContext);
  const { intraData, globalData } = useContext(GlobalContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [notifyVisible, setNotifyVisible] = useState(false);
  const menuRef: React.RefObject<HTMLDivElement> = useRef(null);
  const notifyRef: React.RefObject<HTMLDivElement> = useRef(null);

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
    if (event.target.id === 'navBar__menu__icon')
      setMenuVisible((prevMenuVisible) => !prevMenuVisible);
    if (event.target.id === 'navBar__chat__icon')
      setMenuVisible((prevMenuVisible) => !prevMenuVisible);
    if (event.target.id === 'navBar__notify__icon')
      setNotifyVisible((prevNotifyVisible) => !prevNotifyVisible);
  };

  async function handleLogOut() {
    actionsStatus.disconnectSocketStatus();
    logout();
  }

  function newMessages() {
    const newMessagesDirects = globalData.directs.reduce((acc, chat) => {
      if (activeChat && chat.id === activeChat.chat.id)
        return acc;
      return acc + chat.newMessages;
    }, 0);
    const newMessagesGroups = globalData.groups.reduce((acc, chat) => {
      if (activeChat && chat.id === activeChat.chat.id)
        return acc;
      return acc + chat.newMessages;
    }, 0);
    return newMessagesDirects + newMessagesGroups;
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
            <div id='navBar__menu__icon' className='navBar__menu__icon'>
              <List id='navBar__menu__icon' size={40} className='navBar__icons' />
              {(newMessages() !== 0 && !menuVisible) &&
                <div id='navBar__menu__icon' className='navBar__chat__newMessage'>
                  {newMessages() < 99 ? newMessages() : 99}
                </div>
              }
            </div>
            <nav ref={menuRef} className='navBar__menu'
              style={{ top: (menuVisible ? '97px' : '-280px') }}>
              <Link to='/game' className='navBar__icons'>
                <div>
                  <GameController size={32} />
                </div>
                Game
              </Link>
              <Link to='/chat' id='navBar__chat__icon' className='navBar__icons' >
                <div id='navBar__chat__icon' style={{ position: 'relative' }}>
                  <Chats id='navBar__chat__icon' size={32} />
                  {newMessages() !== 0 &&
                    <div id='navBar__chat__icon' className='navBar__chat__newMessage'>
                      {newMessages() < 99 ? newMessages() : 99}
                    </div>
                  }
                </div>
                Chats
              </Link>
              <Link to='/community' id='navBar__menu__icon' className='navBar__icons'>
                <div>
                  <UsersThree id='navBar__menu__icon' size={32} />
                </div>
                Community
              </Link>
            </nav>
          </li>
          <li className='navBar__divider' />
          <li className='navBar__notify' onClick={(e) => handleClickInside(e)}>
            <div id='navBar__notify__icon' className='navBar__notify__icon'>
              {!globalData.notify || globalData.notify.length == 0 ?
                <Bell id='navBar__notify__icon'
                  className='navBar__icons' size={40} />
                :
                <>
                  <BellRinging id='navBar__notify__icon'
                    className='navBar__icons' size={40} />
                  <div id='navBar__notify__icon'
                    className='notify__icon__notEmpty'>
                    {globalData.notify.length < 99 ? globalData.notify.length : 99}
                  </div>
                </>
              }
            </div>
            <div ref={notifyRef} className='navBar__notify__body'
              style={{ top: (notifyVisible ? '97px' : '-300px') }}>
              <Notify />
            </div>
          </li>
          <li>
            <Link to='/profile'>
              <div
                className='navBar__profile'
                style={{ backgroundImage: `url(${getUrlImage(intraData.image_url)})` }}
              />
            </Link>
          </li>
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
