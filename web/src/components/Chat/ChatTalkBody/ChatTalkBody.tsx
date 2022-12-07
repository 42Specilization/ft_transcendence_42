import { useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../../../contexts/ChatContext';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { MsgToClient } from '../../../others/Interfaces/interfaces';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import './ChatTalkBody.scss';

export function ChatTalkBody() {

  const { activeChat, setActiveChat } = useContext(ChatContext);
  const { intraData } = useContext(GlobalContext);

  function changeBlock(start: number, size: number, newCurrent: number) {
    setActiveChat(prev => {
      if (!prev)
        return prev;
      return {
        ...prev,
        chat: {
          ...prev.chat,
          messages: prev.historicMsg.slice(start, size)
        },
        currentBlock: newCurrent,
      };
    });
    setTimeout(() => {
      const body = refBody.current;
      if (body && body.scrollHeight > body.offsetHeight) {
        body.scrollTop = body.scrollHeight / 2;
      }
    }, 500);
  }


  async function handleScroll(e: any) {
    if (!activeChat || activeChat.historicMsg.length <= 20)
      return;

    const residue = activeChat.historicMsg.length % 20;
    let current = activeChat.currentBlock;

    if (e.target.scrollTop === 0 && current !== -1) {
      if (current === 0)
        changeBlock(0, 40 + residue, -1);
      else {
        const start = (current - 1) * 20 + residue;
        changeBlock(start, start + 40, current - 1);
      }
    }
    if (e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1
      && current !== activeChat.blocks - 1) {
      if (current === -1)
        current = 0;
      const start = current * 20 + residue;
      changeBlock(start, start + 40, current + 1);
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