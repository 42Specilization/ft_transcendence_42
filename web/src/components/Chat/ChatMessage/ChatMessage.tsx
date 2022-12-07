import './ChatMessage.scss';
import ReactDOMServer from 'react-dom/server';
import { MsgToClient } from '../../../others/Interfaces/interfaces';
import {
  formatDate,
  getUrlImage
} from '../../../others/utils/utils';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface ChatMessageProps {
  user: string;
  message: MsgToClient;
}

export function ChatMessage({ user, message }: ChatMessageProps) {

  function self(): boolean {
    return user === message.user.login;
  }

  return (
    <div className={'chat__message' + (self() ? ' self' : '')}>
      <div
        className='chat__message__icon'
        style={{ backgroundImage: `url(${getUrlImage(message.user.image)})` }}
      />
      <p
        id={`message_${message.id}`}
        data-tooltip-html={ReactDOMServer.renderToString(formatDate(message.date.toString()))}
      >
        {message.msg}
      </p>
      <Tooltip anchorId={`message_${message.id}`} delayShow={50} />
    </div >
  );
}
