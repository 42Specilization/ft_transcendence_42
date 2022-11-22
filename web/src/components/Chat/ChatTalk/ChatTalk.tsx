import './ChatTalk.scss';
import { MsgToClient, MsgToServer } from '../../../others/Interfaces/interfaces';
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
    groupsChat, setGroupsChat
  } = useContext(ChatContext);

  const { intraData, setIntraData, api, config } = useContext(IntraDataContext);
  const [friendProfileVisible, setFriendProfileVisible] = useState(false);
  const [message, setMessage] = useState('');

  async function getActiveChat(path: string, id: string) {
    const response = await api.patch(path, { id: id }, config);
    if (activeChat) {
      setIntraData(prev => {
        return {
          ...prev,
          directs: prev.directs.map(key => {
            if (key.id === activeChat.id)
              return { ...key, newMessages: undefined };
            return key;
          })
        };
      });
    }
    setActiveChat(response.data);
    setDirectsChat(null);
    setFriendsChat(null);
    setGroupsChat(null);
    if (path == '/chat/getFriendDirect') {
      actionsChat.joinChat(response.data.id);
      await actionsStatus.newDirect(response.data.name, response.data.id);
    }
  }

  // useEffect(() => {
  //   if (activeChat)
  //     getActiveChat('/chat/getDirect', activeChat.id);
  // }, [intraData]);

  useEffect(() => {
    if (directsChat)
      getActiveChat('/chat/getDirect', directsChat);
  }, [directsChat]);

  useEffect(() => {
    if (friendsChat)
      getActiveChat('/chat/getFriendDirect', friendsChat.login);
  }, [friendsChat]);


  /**
   * The function takes an event as an argument, and then calls the preventDefault() method on the
   * event
   * @param event - React.FormEvent<HTMLFormElement>
   */
  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitMessage();
  }

  /**
   * It sends a message to the server if the message is not empty
   */
  function submitMessage() {
    if (message.trim() && activeChat) {
      const newMessage: MsgToServer = {
        chat: activeChat?.id,
        user: intraData.login,
        msg: message,
      };
      actionsChat.msgToServer(newMessage, activeChat.type);
    }
    setMessage('');
  }

  const refBody: React.RefObject<HTMLDivElement> = useRef(null);
  useEffect(() => {
    if (
      refBody.current &&
      refBody.current.scrollHeight > refBody.current.offsetHeight
    ) {
      refBody.current.scrollTop =
        refBody.current.scrollHeight - refBody.current.offsetHeight;
    }
  }, [activeChat]);

  return (
    <div className='chat__talk'>
      {activeChat != null &&
        <>
          <div className='chat__talk__header'>
            <ArrowBendUpLeft size={32} onClick={() => {
              setActiveChat(null);
              setDirectsChat(null);
              setFriendsChat(null);
              setGroupsChat(null);
              actionsChat.leaveChat(activeChat.id);
            }}
            />
            <div
              className='chat__talk__header__user'
              onClick={() => setFriendProfileVisible(true)}
              data-html={true}
              data-tip={`${activeChat.name} profile`}
            >
              <div
                className='chat__talk__header__user__icon'
                style={{ backgroundImage: `url(${activeChat.image})` }}
              />
              <div className='chat__talk__header__user__name'>
                {activeChat.name}
              </div>
            </div>
          </div>
          <div className='chat__talk__body'
            ref={refBody}
          >
            {activeChat.messages?.sort((a, b) => a.date < b.date ? -1 : 1).map((msg: MsgToClient) => (
              <ChatMessage key={msg.id} user={intraData.login} message={msg} />
            ))}
          </div>
          {friendProfileVisible &&
            <ProfileFriendModal
              login={activeChat.name}
              setFriendProfileVisible={setFriendProfileVisible} />
          }
          <form className='chat__talk__footer' onSubmit={handleKeyEnter}>
            <input
              className='chat__talk__footer__input'
              value={message}
              onChange={(msg) => setMessage(msg.target.value)}
              ref={e => { if (activeChat) e?.focus(); }}
            />
            <button className='chat__talk__footer__button' type='submit'>
              <PaperPlaneRight size={30} />
            </button>
          </form>
          <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
        </>
      }
    </div >
  );
}
