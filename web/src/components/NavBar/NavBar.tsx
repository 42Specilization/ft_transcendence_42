import logoSmall from '../../assets/logo-small.png';
import { Chats, SignOut} from 'phosphor-react';
import './NavBar.scss';
import useAuth from '../../auth/auth';
import { Link } from 'react-router-dom';
import React from 'react';
interface NavBarProps {
  name: string,
  imgUrl: string,
}

export function NavBar({ name, imgUrl }: NavBarProps) {

  const { logout } = useAuth();

  async function handleLogOut() {
    logout();
  }

  return (
    <div className='navBar'>
      <ul className='navBar__list '>
        <li className='navBar__logo'>
          <Link to='/'><img src={logoSmall} alt='logo small' /></Link>
        </li>
        <li className='navBar__divider' />
        <li>
          <strong>Achievements</strong>
        </li>

        <li>
          <strong>Historic</strong>
        </li>

        <li>
          <strong>Ladder level</strong>
        </li>

        <li className='navBar__divider' />

        <li className='navBar__chats'>
          <Chats size={32} />
          Chats
        </li>
        <li>
          <div className='navBar__user'>
            <div
              className='navBar__user__icon'
              style={{ 'backgroundImage': `url(${imgUrl})` }}
            >
            </div>
            <div className='navBar__user__name'>
              <Link to='/profile'>{name}</Link>
            </div>
          </div>
        </li>

        <li className='navBar__logout' onClick={handleLogOut}>
          <SignOut size={32} />
          Log-out
        </li>

      </ul>
    </div >
  );
}
