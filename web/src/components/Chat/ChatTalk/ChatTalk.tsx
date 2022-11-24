import './ChatTalk.scss';
import { DirectData, MsgToClient, MsgToServer } from '../../../others/Interfaces/interfaces';
import { useContext, useEffect, useRef, useState } from 'react';
import { ArrowBendUpLeft, PaperPlaneRight } from 'phosphor-react';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { actionsChat } from '../../../adapters/chat/chatState';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';
import ReactTooltip from 'react-tooltip';
import { ChatContext } from '../../../contexts/ChatContext';
import { actionsStatus } from '../../../adapters/status/statusState';

// interface ChatTalkProps {

// }

export function ChatTalk(
  // { }: ChatTalkProps
) {
  const {
    activeChat, setActiveChat,
    friendsChat, setFriendsChat,
    directsChat, setDirectsChat,
    groupsChat, setGroupsChat,
  } = useContext(ChatContext);

  const { intraData, setIntraData, api, config } = useContext(IntraDataContext);
  const [friendProfileVisible, setFriendProfileVisible] = useState(false);






  useEffect(() => {
    return () => {
      if (activeChat)
        api.patch('/chat/setBreakpoint', { chatId: activeChat.chat.id, type: activeChat.chat.type }, config);
    };
  }, []);

  async function exitActiveChat() {
    api.patch('/chat/setBreakpoint', { chatId: activeChat?.chat.id, type: activeChat?.chat.type }, config);
    setIntraData(prev => {
      return {
        ...prev,
        directs: prev.directs.map(key => {
          if (key.id === activeChat?.chat.id) {
            return { ...key, newMessages: 0 };
          }
          return key;
        })
      };
    });
    setActiveChat(null);
    setDirectsChat(null);
    setFriendsChat(null);
    setGroupsChat(null);
  }






  function initActiveChat(chat: DirectData) {
    const messages: MsgToClient[] = chat.messages;
    const blocks = Math.floor((messages.length - 1) / 20);
    setActiveChat({
      chat: { ...chat, messages: messages.slice(-20) },
      newMessage: true,
      historicMsg: messages.filter((msg: any) => msg.breakpoint !== true),
      blocks: blocks,
      currentBlock: blocks - 1
    });
  }

  async function setActiveChatWithDirect(id: string) {
    const response = await api.patch('/chat/getDirect', { id: id }, config);
    if (activeChat) {
      exitActiveChat();
    }
    initActiveChat(response.data);
  }

  async function setActiveChatWithFriend(id: string) {
    const response = await api.patch('/chat/getFriendDirect', { id: id }, config);
    if (activeChat) {
      exitActiveChat();
    }
    initActiveChat(response.data.directDto);
    if (response.data.created) {
      actionsChat.joinChat(response.data.directDto.id);
      await actionsStatus.newDirect(response.data.directDto.name, response.data.directDto.id);
    }
  }

  useEffect(() => {
    if (directsChat)
      setActiveChatWithDirect(directsChat);
  }, [directsChat]);

  useEffect(() => {
    if (friendsChat)
      setActiveChatWithFriend(friendsChat.login);
  }, [friendsChat]);







  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitMessage(event);
  }

  function submitMessage(event: any) {
    if (event.target[0].value.trim() && activeChat) {
      const newMessage: MsgToServer = {
        chat: activeChat?.chat.id,
        user: intraData.login,
        msg: event.target[0].value,
      };
      actionsChat.msgToServer(newMessage, activeChat.chat.type);
    }
    event.target[0].value = '';
  }







  function changeBlockMessages(direction: string) {
    if (!activeChat || activeChat.blocks === 1)
      return;

    const current = activeChat.currentBlock;
    const blocks = activeChat.blocks;
    const len = activeChat.historicMsg.length;

    console.log(current, blocks, len);
    const changeBlock = (start: number | null, size: number, newCurrent: number) => {
      setActiveChat(prev => {
        if (!prev)
          return prev;
        // console.log(prev.historicMsg);
        // console.log('caso 1', prev.historicMsg);
        console.log(start, size);
        if (start) {
          console.log('caso 1', prev.historicMsg.slice(start, size));
        }
        // else
        //   console.log('caso 2', prev.historicMsg.slice(size));
        return {
          ...prev,
          chat: {
            ...prev.chat,
            messages: start !== null ?
              prev.historicMsg.slice(start, size) :
              prev.historicMsg.slice(size)
          },
          currentBlock: newCurrent,
        };
      });
      // const body = refBody.current;
      // if (body && body.scrollHeight > body.offsetHeight) {
      //   body.scrollTop = body.scrollHeight / 2;
      // }
    };

    if (direction === 'up') {
      if (current === 0)
        changeBlock(0, 20 + len % 20, 0);
      else if (current === 1)
        changeBlock(0, 40 + len % 20, current - 1);
      else if (current + 1 === blocks)
        changeBlock(null, -40, current - 1);
      else {
        const start = (current - 1) * 20 + len % 20;
        changeBlock(start, start + 40, current - 1);
      }

    }
    //  else {
    //   if current block === 1
    //   slice(0, 40)

    //   if (currentBlock === blocks)
    //   faz nada
    //   if (currentBlock === blocks - 1)
    //     slice(-20)
    // }
  }

  async function handleScroll(e: any) {
    if (e.target.scrollTop === 0) {
      changeBlockMessages('up');
    }
    if (e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight)
      changeBlockMessages('down');
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
    <div className='chat__talk'>
      {activeChat != null &&
        <>
          <div className='chat__talk__header'>
            <ArrowBendUpLeft size={32} onClick={exitActiveChat} />
            <div
              className='chat__talk__header__user'
              onClick={() => setFriendProfileVisible(true)}
              data-html={true}
              data-tip={`${activeChat.chat?.name} profile`}
            >
              <div
                className='chat__talk__header__user__icon'
                style={{ backgroundImage: `url(${activeChat.chat?.image})` }}
              />
              <div className='chat__talk__header__user__name'>
                {activeChat.chat?.name}
              </div>
            </div>
          </div>
          <div id='chat__talk__body' className='chat__talk__body'
            onScroll={(e) => handleScroll(e)}
            ref={refBody}
          >
            {activeChat.chat?.messages
              .map((msg: MsgToClient, index: number) => {
                const len = activeChat.chat?.messages?.length - 1;
                if (msg.breakpoint) {
                  return (
                    <div className='chat__talk__unread__message'
                      style={{ display: index !== len ? '' : 'none' }}
                      key={crypto.randomUUID()}
                    >
                      <div /><p>unread message: {len - index}</p><div />
                    </div>);
                }
                return <div key={crypto.randomUUID()}>
                  < ChatMessage key={crypto.randomUUID()}
                    user={intraData.login}
                    message={msg} />
                  --{index}
                </div>;
              })
            }
          </div>
          {friendProfileVisible &&
            <ProfileFriendModal
              login={activeChat.chat.name}
              setFriendProfileVisible={setFriendProfileVisible} />
          }
          <form autoComplete='off' className='chat__talk__footer' onSubmit={handleKeyEnter}>
            <input
              className='chat__talk__footer__input'
              ref={e => { if (activeChat) e?.focus(); }}
            />
            <button
              className='chat__talk__footer__button'
              type='submit'>
              <PaperPlaneRight size={30} />
            </button>
          </form>
          <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
        </>
      }
    </div >
  );
}
