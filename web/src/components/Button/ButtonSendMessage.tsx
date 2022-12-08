import './Button.scss';
import { TelegramLogo } from 'phosphor-react';
import { useContext } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';


interface ButtonSendMessageProps {
  id: string;
  type: string;
  onClick: any;

}

export function ButtonSendMessage({ id, type, onClick }: ButtonSendMessageProps) {

  const { setSelectedChat } = useContext(ChatContext);

  function handleSendMessage() {
    setSelectedChat({ chat: id, type: type });
    onClick();
  }

  return (
    <Link to='/chat' className='button__link'>
      <button
        id='sendMessage_button'
        className='button__icon'
        onClick={handleSendMessage}
        data-tip={'Send Message'}
      >
        <TelegramLogo size={32} />
        <ReactTooltip delayShow={50} />
      </button>
    </Link>
  );
}