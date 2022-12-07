import { useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../../../contexts/ChatContext';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { MsgToClient } from '../../../others/Interfaces/interfaces';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import './ChatTalkBody.scss';

export function ChatTalkBody() {

  const { activeChat, setActiveChat } = useContext(ChatContext);
  const { intraData } = useContext(GlobalContext);

  function changeViewMessage(start: number, size: number, current: number) {
    setActiveChat(prev => {
      if (!prev)
        return prev;
      return {
        ...prev,
        chat: {
          ...prev.chat,
          messages: prev.historicMsg.slice(start, size)
        },
        currentMessage: current,
      };
    });
    // setTimeout(() => {
    // }, 1);
    const body = refBody.current;
    if (body && body.scrollHeight > body.offsetHeight) {
      body.scrollTop = body.scrollHeight / 2;
    }
  }


  async function handleScroll(e: any) {
    if (!activeChat || activeChat.historicMsg.length <= 30)
      return;
    const current = activeChat.currentMessage;

    if (e.target.scrollTop === 0 && current >= 15) {
      if (current - 30 < 0)
        changeViewMessage(0, 30, 14);
      else
        changeViewMessage(current - 30, current, current - 15);
    }
    if (e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1
      && current <= activeChat.historicMsg.length - 16) {
      changeViewMessage(current, current + 30, current + 15);
    }
  }

  const refBody: React.RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (activeChat?.newMessage) {
      const body = refBody.current;
      if (body && body.scrollHeight > body.offsetHeight) {
        body.scrollTop = body.scrollHeight - body.offsetHeight;
      }
      setActiveChat(prev => {
        if (!prev)
          return prev;
        return {
          ...prev,
          newMessage: false
        };
      });
    }
  }, [activeChat]);

  return (
    <div id='chat__talk__body'
      className='chat__talk__body'
      onScroll={(e) => handleScroll(e)}
      ref={refBody}
    >
      {activeChat && activeChat.chat?.messages
        .map((msg: MsgToClient, index: number) => {
          const len = activeChat.chat?.messages?.length - 1;
          if (msg.type === 'breakpoint') {
            return (
              <div className='chat__talk__unread__message'
                style={{ display: index !== len ? '' : 'none' }}
                key={Math.random()}
              >
                <div /><p>unread message: {len - index}</p><div />
              </div>
            );
          } else if (msg.type === 'action') {
            return (
              <div className='chat__talk__action__message'
                key={Math.random()}
              >
                <p>{msg.user.login} {msg.msg}</p>
              </div>
            );
          } else {
            return (
              <ChatMessage key={Math.random()} user={intraData.login} message={msg} />
            );
          }
        })
      }
    </div>
  );
}