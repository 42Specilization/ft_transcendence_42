import pongGame from '../../assets/pong-game.png';
import { ButtonCustom } from '../../components/ButtonCustom/ButtonCustom';
import './SignIn.scss';

export default function SignIn() {
  return (
    <div className='signin'>
      <div className='signin__logo'>

      </div>
      {/* <img src={pongGame} alt='title' className='signin__img' /> */}
      <a href={import.meta.env.VITE_REDIRECT_LOGIN_URL}>
        <ButtonCustom.Root >
          <ButtonCustom.Button msg='SignIn' className='signin__button' />


          <ButtonCustom.Icon>

          </ButtonCustom.Icon>
        </ButtonCustom.Root>

        {/* <button className='signin__button'>
          Sign in
        </button> */}
      </a>
    </div>
  );
}