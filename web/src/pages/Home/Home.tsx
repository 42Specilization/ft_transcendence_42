import './Home.scss';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='body'>
      <div className='home'>
        <div className='home__gif'>
          <Link to='/game'>
            <div className='home__gif__bounce__text'>
              <span >P</span>
              <span >L</span>
              <span >A</span>
              <span >Y</span>
            </div>
          </Link>
        </div>
      </div >
    </div >
  );
}
