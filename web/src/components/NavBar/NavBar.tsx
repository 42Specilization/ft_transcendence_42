import logoSmall from '../../assets/logo-small.png';
import { Chats, SignOut, User } from 'phosphor-react';
import './NavBar.scss';

export function NavBar() {
  return (
    <div className='navBar'>
      <ul className='navBar__list '>

        <li className='navBar__logo'>
          <img src={logoSmall} alt='logo small' />
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
            <div className='navBar__user__icon'>
              <User size={46} />
            </div>
            <div className='navBar__user__name'>
              Profile
            </div>
          </div>
        </li>

        <li className='navBar__logout'>
          <SignOut size={32} />
          Log-out
        </li>

      </ul>
    </div>
  );
}