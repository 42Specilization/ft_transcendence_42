import pongGame from '../../assets/pong-game.png';
import './SignIn.scss';
import { SelectItem } from '../../components/SelectItem/SelectItem';


export default function SignIn() {
  return (
    <div className='signin'>
      <img src={pongGame} alt='title' className='signin__img' />
      <a href={import.meta.env.VITE_REDIRECT_LOGIN_URL}>
        <button className='signin__button'>
          Sign in
        </button>
      </a>

    </div>
  );
}