import './ChatTalk.scss';
import { DirectData, MsgToClient, MsgToServer } from '../../../others/Interfaces/interfaces';
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { ArrowBendUpLeft, PaperPlaneRight } from 'phosphor-react';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { actionsChat } from '../../../adapters/chat/chatState';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';
import ReactTooltip from 'react-tooltip';
import { ChatContext } from '../../../contexts/ChatContext';
import { actionsStatus } from '../../../adapters/status/statusState';
import { GroupInfoModal } from '../../GroupInfoModal/GroupInfoModal';

interface ChatTalkProps {
  setTableSelected: Dispatch<SetStateAction<string>>;
}

export function ChatTalk(
  { setTableSelected }: ChatTalkProps
) {
  const {
    activeChat, setActiveChat,
    peopleChat, setPeopleChat,
    directsChat, setDirectsChat,
    groupsChat, setGroupsChat,
  } = useContext(ChatContext);

  const { intraData, setIntraData, api, config } = useContext(IntraDataContext);
  const [friendProfileVisible, setFriendProfileVisible] = useState(false);
  const [groupInfoVisible, setGroupInfoVisible] = useState(false);

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
    setPeopleChat(null);
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

  async function setActiveChatWithGroup(id: string) {
    const response = await api.patch('/chat/getGroup', { id: id }, config);
    if (activeChat) {
      exitActiveChat();
    }
    initActiveChat(response.data);
    setTableSelected('Groups');
  }

  async function setActiveChatWithDirect(id: string) {
    const response = await api.patch('/chat/getDirect', { id: id }, config);
    if (activeChat) {
      exitActiveChat();
    }
    setTableSelected('Directs');
    initActiveChat(response.data);
  }

  async function setActiveChatWithFriend(id: string) {
    const response = await api.patch('/chat/getFriendDirect', { id: id }, config);
    if (activeChat) {
      exitActiveChat();
    }
    setTableSelected('Directs');
    initActiveChat(response.data.directDto);
    if (response.data.created) {
      actionsChat.joinChat(response.data.directDto.id);
      await actionsStatus.newDirect(response.data.directDto.name, response.data.directDto.id);
    }
  }

  useEffect(() => {
    if (groupsChat)
      setActiveChatWithGroup(groupsChat);
  }, [groupsChat]);

  useEffect(() => {
    if (directsChat)
      setActiveChatWithDirect(directsChat);
  }, [directsChat]);

  useEffect(() => {
    if (peopleChat)
      setActiveChatWithFriend(peopleChat.login);
  }, [peopleChat]);

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
        setGroupInfoVisible(true);
      } else {
        setFriendProfileVisible(true);
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
                style={{ backgroundImage: `url(${activeChat.chat?.image})` }}
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
                if (msg.breakpoint) {
                  return (
                    <div className='chat__talk__unread__message'
                      style={{ display: index !== len ? '' : 'none' }}
                      key={crypto.randomUUID()}
                    >
                      <div /><p>unread message: {len - index}</p><div />
                    </div>);
                }
                return < ChatMessage
                  key={crypto.randomUUID()}
                  user={intraData.login}
                  message={msg} />;
              })
            }
          </div>
          {friendProfileVisible &&
            <ProfileFriendModal
              login={activeChat.chat.name}
              setFriendProfileVisible={setFriendProfileVisible} />
          }
          {groupInfoVisible &&
            <GroupInfoModal
              id={activeChat.chat.id}
              setGroupInfoVisible={setGroupInfoVisible} />
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

