import pongGame from '../../assets/pong-game.png';
import './SignIn.scss';

export default function SignIn() {

  function handleSignIn() {
    console.log('opa');
  }

  return (
    <div className='signin'>
      <img src={pongGame} alt='title' className='signin__img' />
      <button onClick={handleSignIn} className='signin__button'>
        Sign in
      </button>
    </div>
  );
}