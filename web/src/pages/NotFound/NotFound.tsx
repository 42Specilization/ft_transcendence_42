import './NotFound.scss';
import pongGame from '../../assets/404.png';

export default function NotFound() {
  return (
    <div className='notfound'>
      <img src={pongGame} alt='error' className='notfound__img' />
    </div>
  );
}