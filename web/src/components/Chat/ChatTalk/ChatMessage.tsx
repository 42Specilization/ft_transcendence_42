import './ChatMessage.scss';
import { ReactElement } from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactTooltip from 'react-tooltip';
import { MsgToClient } from '../../../Interfaces/interfaces';

interface ChatMessageProps {
  user: string;
  message: MsgToClient;
}

export function ChatMessage({ user, message }: ChatMessageProps) {
  function self(): boolean {
    return user === message.user.login;
  }

  function formatDate(date: Date): ReactElement {
    const newDate = new Date(date);
    return (
      <>
        {String(newDate.getHours()).padStart(2, '0') +
          ':' +
          String(newDate.getMinutes()).padStart(2, '0')}{' '}
        <br />
        {String(newDate.getDate()).padStart(2, '0') +
          '/' +
          String(newDate.getMonth() + 1).padStart(2, '0') +
          '/' +
          newDate.getFullYear()}
      </>
    );
  }

  return (
    <div className={'chat__message' + (self() ? ' self' : '')}>
      <div
        className='chat__message__icon'
        style={{ backgroundImage: `url(${message.user.image})` }}
      />
      <p
        data-html={true}
        data-tip={ReactDOMServer.renderToString(formatDate(message.date))}
      >
        {message.msg}
      </p>
      <ReactTooltip className='chat__message__date' delayShow={250} />
    </div>
  );
}
