import './Button.scss';
import { TelegramLogo } from 'phosphor-react';
import { useContext } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import { Link } from 'react-router-dom';

interface ButtonSendMessageProps {
  id: string;
  type: string;
}

export function ButtonSendMessage({ id, type }: ButtonSendMessageProps) {

  const { setSelectedChat } = useContext(ChatContext);

  function handleSendMessage() {
    setSelectedChat({ chat: id, type: type });
  }

  return (
    <Link to='/chat' className='button__link'>

      <button className='button__icon'
        onClick={handleSendMessage}
        data-html={true}
        data-tip={'Send Message'}
      >
        <TelegramLogo size={32} />
      </button>
    </Link>
  );
}