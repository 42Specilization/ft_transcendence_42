import './ChatMessage.scss';
import ReactDOMServer from 'react-dom/server';
import { MsgToClient } from '../../../others/Interfaces/interfaces';
import {
  formatDate,
  getUrlImage
} from '../../../others/utils/utils';
import ReactTooltip from 'react-tooltip';


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
        data-html={true}
        data-tip={ReactDOMServer.renderToString(formatDate(message.date.toString()))}
      >
        {message.msg}
      </p>
      <ReactTooltip delayShow={50} />
    </div >
  );
}
