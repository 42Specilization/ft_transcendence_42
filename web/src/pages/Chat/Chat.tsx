import { useEffect, useState } from 'react';
import { ChatCommunity } from '../../components/Chat/ChatCommunity/ChatCommunity';
import { ChatTalk } from '../../components/Chat/ChatTalk/ChatTalk';
import { FriendData, IntraData } from '../../Interfaces/interfaces';
import { defaultIntra, getStoredData } from '../../utils/utils';
import './Chat.scss';

export default function Chat() {
  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);
  const [activeFriend, setActiveFriend] = useState<FriendData | null>(null);

  useEffect(() => {
    getStoredData(setIntraData);
  }, []);

  return (
    <div className='body'>
      <div className='chat'>
        <ChatCommunity friends={intraData.friends} setActiveFriend={setActiveFriend} />
        <ChatTalk activeFriend={activeFriend} />
      </div>
    </div>
  );
}
