import './ChatMessage.scss';
import ReactDOMServer from 'react-dom/server';
import { MsgToClient } from '../../../others/Interfaces/interfaces';
import { Tooltip } from '@mui/material';
import {
  formatDate,
  getUrlImage
} from '../../../others/utils/utils';
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
      <Tooltip title={ReactDOMServer.renderToString(formatDate(message.date.toString()))}>
        <p
          id={`message_${message.id}`}
        >
          {message.msg}
        </p>
      </Tooltip>
    </div >
  );
}
