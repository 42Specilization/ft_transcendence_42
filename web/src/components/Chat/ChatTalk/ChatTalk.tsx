import './ChatTalk.scss';
import { DirectData, GroupData, MsgToClient, MsgToServer } from '../../../others/Interfaces/interfaces';
import { useContext, useEffect, useRef, useState } from 'react';
import { ArrowBendUpLeft, PaperPlaneRight } from 'phosphor-react';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { actionsChat } from '../../../adapters/chat/chatState';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { ProfileUserModal } from '../../ProfileUser/ProfileUserModal/ProfileUserModal';
import ReactTooltip from 'react-tooltip';
import { ChatContext } from '../../../contexts/ChatContext';
import { actionsStatus } from '../../../adapters/status/statusState';
import { ProfileGroupModal } from '../../ProfileGroup/ProfileGroupModal/ProfileGroupModal';
import { getUrlImage } from '../../../others/utils/utils';

// interface ChatTalkProps {
// }

export function ChatTalk(
  // { }: ChatTalkProps
) {

  const {
    selectedChat, setSelectedChat,
    activeChat, setActiveChat,
    setTabSelected
  } = useContext(ChatContext);
  const { intraData, setIntraData, api, config } = useContext(IntraDataContext);
  const [friendProfileVisible, setProfileUserVisible] = useState(false);
  const [profileGroupVisible, setProfileGroupVisible] = useState(false);

  useEffect(() => {
    return () => {
      if (activeChat)
        api.patch('/chat/setBreakpoint', { chatId: activeChat.chat.id, type: activeChat.chat.type }, config);
      setActiveChat(null);
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      setNewChat();
    }
  }, [selectedChat]);

  async function exitActiveChat() {
    if (!activeChat)
      return;
    api.patch('/chat/setBreakpoint', { chatId: activeChat.chat.id, type: activeChat.chat.type }, config);
    setIntraData(prev => {
      if (activeChat.chat.type === 'direct') {
        return {
          ...prev,
          directs: prev.directs.map(key => {
            if (key.id === activeChat.chat.id) {
              return { ...key, newMessages: 0 };
            }
            return key;
          })
        };
      } else {
        return {
          ...prev,
          groups: prev.groups.map(key => {
            if (key.id === activeChat.chat.id) {
              return { ...key, newMessages: 0 };
            }
            return key;
          })
        };
      }
    });
    setSelectedChat(null);
    setActiveChat(null);
  }

  function initActiveChat(chat: DirectData | GroupData) {
    const messages: MsgToClient[] = chat.messages;
    const blocks = Math.floor((messages.length - 1) / 20);
    setActiveChat({
      chat: { ...chat, messages: messages.slice(-20) },
      newMessage: true,
      historicMsg: messages.filter((msg: any) => msg.type !== 'breakpoint'),
      blocks: blocks,
      currentBlock: blocks - 1
    });
  }

  async function setNewChat() {
    let chat;
    if (!selectedChat)
      return;
    if (selectedChat.type === 'person') {
      const response = await api.patch('/chat/getFriendDirect', { id: selectedChat?.chat }, config);
      chat = response.data.directDto;
      if (response.data.created) {
        actionsChat.joinChat(chat.id);
        await actionsStatus.newDirect(chat.name, chat.id);
      }
      setTabSelected('directs');
    } else if (selectedChat.type === 'direct') {
      const response = await api.patch('/chat/getDirect', { id: selectedChat?.chat }, config);
      chat = response.data;
      setTabSelected('directs');
    } else {
      const response = await api.patch('/chat/getGroup', { id: selectedChat?.chat }, config);
      chat = response.data;
      setTabSelected('groups');
    }
    if (activeChat) {
      exitActiveChat();
    }
    initActiveChat(chat);
  }

  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitMessage(event);
  }

  async function submitMessage(event: any) {
    if (event.target[0].value.trim() && activeChat) {
      const newMessage: MsgToServer = {
        chat: activeChat?.chat.id,
        user: intraData.login,
        msg: event.target[0].value,
      };
      actionsChat.msgToServer(newMessage, activeChat.chat.type);
      // await api.patch('/user/notifyMessage', { id: activeChat?.chat.id, target: activeChat?.chat.name, add_info: 'direct' }, config);
      // actionsStatus.newNotify(activeChat?.chat.name as string, 'message');
    }
    event.target[0].value = '';
  }


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

  function selectGroupOrFriendVisible() {
    if (activeChat) {
      if (activeChat.chat.type !== 'direct') {
        setProfileGroupVisible(true);
      } else {
        setProfileUserVisible(true);
      }
    }
  }

  return (
    <div className='chat__talk'>
      {activeChat != null &&
        <>
          <div className='chat__talk__header'>
            <ArrowBendUpLeft size={32} onClick={exitActiveChat} />
            <div
              className='chat__talk__header__user'
              onClick={() => selectGroupOrFriendVisible()}
              data-html={true}
              data-tip={`${activeChat.chat?.name} profile`}
            >
              <div
                className='chat__talk__header__user__icon'
                style={{ backgroundImage: `url(${getUrlImage(activeChat.chat?.image as string)})` }}
              />
              <div className='chat__talk__header__user__name'>
                {activeChat.chat?.name}
              </div>
            </div>
          </div>
          <div id='chat__talk__body'
            className='chat__talk__body'
            onScroll={(e) => handleScroll(e)}
            ref={refBody}
          >
            {activeChat.chat?.messages
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
                    <ChatMessage
                      key={Math.random()}
                      user={intraData.login}
                      message={msg} />
                  );
                }
              })
            }
          </div>
          {friendProfileVisible &&
            <ProfileUserModal
              login={activeChat.chat.name}
              setProfileUserVisible={setProfileUserVisible} />
          }
          {profileGroupVisible &&
            < ProfileGroupModal
              id={activeChat.chat.id}
              setProfileGroupVisible={setProfileGroupVisible} />
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

