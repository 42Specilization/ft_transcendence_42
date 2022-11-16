import './Chat.scss';
import { useState } from 'react';
import { ChatCommunity } from '../../components/Chat/ChatCommunity/ChatCommunity';
import { ChatTalk } from '../../components/Chat/ChatTalk/ChatTalk';
import { FriendData } from '../../Interfaces/interfaces';

export default function Chat() {

  const [activeFriend, setActiveFriend] = useState<FriendData | null>(null);

  return (
    <div className='body'>
      <div className='chat'>
        <ChatCommunity setActiveFriend={setActiveFriend} />
        <ChatTalk activeFriend={activeFriend} />
      </div>
    </div>
  );
}
