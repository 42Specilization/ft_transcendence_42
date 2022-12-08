import './ChatTalk.scss';
import { ChatData, MsgToClient, MsgToServer } from '../../../others/Interfaces/interfaces';
import { useContext, useEffect, useState } from 'react';
import { PaperPlaneRight, X } from 'phosphor-react';
import { actionsChat } from '../../../adapters/chat/chatState';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { ProfileUserModal } from '../../ProfileUser/ProfileUserModal/ProfileUserModal';
import { ChatContext } from '../../../contexts/ChatContext';
import { actionsStatus } from '../../../adapters/status/statusState';
import { ProfileGroupModal } from '../../ProfileGroup/ProfileGroupModal/ProfileGroupModal';
import { getUrlImage } from '../../../others/utils/utils';
import { ChatTalkBody } from '../ChatTalkBody/ChatTalkBody';
import ReactTooltip from 'react-tooltip';

export function ChatTalk() {
  const {
    selectedChat, setSelectedChat,
    activeChat, setActiveChat,
    setTabSelected
  } = useContext(ChatContext);
  const {
    api,
    config,
    intraData,
    setGlobalData,
    updateUserProfile
  } = useContext(GlobalContext);

  const [profileGroupVisible, setProfileGroupVisible] = useState('');
  const [profileUserVisible, setProfileUserVisible] = useState('');

  useEffect(() => {
    return () => {
      exitActiveChat();
    };
  }, []);

  useEffect(() => {
    if (updateUserProfile.newLogin && updateUserProfile.login === profileUserVisible) {
      setProfileUserVisible(updateUserProfile.newLogin);
    }
  }, [updateUserProfile]);

  useEffect(() => {
    if (selectedChat) {
      setNewChat();
    }
  }, [selectedChat]);

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
      setTabSelected('Direct');
    } else if (selectedChat.type === 'direct') {
      const response = await api.patch('/chat/getDirect', { id: selectedChat?.chat }, config);
      chat = response.data;
      setTabSelected('Direct');
    } else {
      const response = await api.patch('/chat/getGroup', { id: selectedChat?.chat }, config);
      chat = response.data;
      setTabSelected('Group');
    }
    if (activeChat) {
      exitActiveChat();
    }
    initActiveChat(chat);
  }

  function initActiveChat(chat: ChatData) {
    const messages: MsgToClient[] = chat.messages;
    setActiveChat({
      chat: { ...chat, messages: messages.slice(-30) },
      newMessage: true,
      historicMsg: messages.filter((msg: any) => msg.type !== 'breakpoint'),
      currentMessage: messages.length - 1
    });
  }

  async function exitActiveChat() {
    if (activeChat) {
      api.patch('/chat/setBreakpoint', { chatId: activeChat.chat.id, type: activeChat.chat.type }, config);
      if (activeChat.chat.type === 'direct')
        setGlobalData(prev => {
          return {
            ...prev,
            directs: prev.directs.map(key => key.id === activeChat.chat.id ? { ...key, newMessages: 0 } : key)
          };
        });
      else
        setGlobalData(prev => {
          return {
            ...prev,
            groups: prev.groups.map(key => key.id === activeChat.chat.id ? { ...key, newMessages: 0 } : key)
          };
        });
    }
    setSelectedChat(null);
    setActiveChat(null);
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
    }
    event.target[0].value = '';
  }

  function selectGroupOrFriendVisible() {
    if (activeChat) {
      if (activeChat.chat.type !== 'direct') {
        setProfileGroupVisible(activeChat.chat.name as string);
      } else {
        setProfileUserVisible(activeChat.chat.name as string);
      }
    }
  }

  return (
    <div className='chat__talk'>
      {activeChat != null &&
        <>
          <div className='chat__talk__header'>
            <div
              id='activeChat_profile_header'
              className='chat__talk__header__profile'
              onClick={() => selectGroupOrFriendVisible()}
              data-tip={`${activeChat.chat?.name} profile`}
            >
              <div
                className='chat__talk__header__profile__icon'
                style={{ backgroundImage: `url(${getUrlImage(activeChat.chat?.image as string)})` }}
              />
              <div className='chat__talk__header__profile__name'>
                {activeChat.chat?.name}
              </div>
            </div>
            <ReactTooltip delayShow={50} />
            <X size={32} weight="bold" onClick={exitActiveChat} className='chat__talk__header__exit' />
          </div>
          <ChatTalkBody />
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
          {profileUserVisible !== '' &&
            <ProfileUserModal
              login={activeChat.chat.name}
              setProfileUserVisible={setProfileUserVisible} />
          }
          {profileGroupVisible !== '' &&
            <ProfileGroupModal
              id={activeChat.chat.id}
              setProfileGroupVisible={setProfileGroupVisible} />
          }
        </>
      }
    </div >
  );
}

