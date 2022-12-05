
import './Home.scss';
import gameGif from '../../assets/game.gif';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='body'>
      <div className='home'>
        <Link to='/game'>
          <div className='home__gif'>
            <img src={gameGif} alt='Game Gif' />
          </div>
        </Link>
      </div>
    </div>
  );
}
