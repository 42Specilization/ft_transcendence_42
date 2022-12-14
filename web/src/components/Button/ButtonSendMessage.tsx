import './Button.scss';
import { TelegramLogo } from 'phosphor-react';
import { useContext, useRef } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

interface ButtonSendMessageProps {
  id: string;
  type: string;

}

export function ButtonSendMessage({ id, type }: ButtonSendMessageProps) {
  const { setSelectedChat } = useContext(ChatContext);
  const refMessage: React.RefObject<HTMLButtonElement> = useRef(null);
  function handleSendMessage() {
    setSelectedChat({ chat: id, type: type });
    refMessage.current?.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      cancelable: true,
      composed: true,
      keyCode: 27,
      which: 27,
    }));
  }

  return (
    <Link to='/chat' className='button__link'>
      <button
        id='sendMessage_button'
        ref={refMessage}
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