import './Home.scss';
import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ChatContext } from '../../contexts/ChatContext';

export default function Home() {

  const { exitActiveChat } = useContext(GlobalContext);
  const { activeChat } = useContext(ChatContext);

  useEffect(() => {
    if (activeChat)
      exitActiveChat();
  }, []);

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
