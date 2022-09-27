import pongGame from '../../assets/pong-game.png';
import './SignIn.scss';


export default function SignIn() {

  return (
    <div className='signin'>
      <img src={pongGame} alt='title' className='signin__img' />
      <a href='https://api.intra.42.fr/oauth/authorize?client_id=5c183cd72e3fb479931c134cc21a5a4a34df39f54ad42fb9ccb31c6bdc419b6e&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauth&response_type=code'>
        <button className='signin__button'>
          Sign in
        </button>
      </a>
    </div>
  );
}