import { Dispatch, SetStateAction, useState } from 'react';
import { ChatCommunity } from '../../components/Chat/ChatCommunity/ChatCommunity';
import { ChatTalk } from '../../components/Chat/ChatTalk/ChatTalk';
import { FriendData, IntraData } from '../../Interfaces/interfaces';
import './Chat.scss';

interface ChatProps {
  intraData: IntraData;
  setIntraData: Dispatch<SetStateAction<IntraData>>;
}

export default function Chat({ intraData, setIntraData }: ChatProps) {
  const [activeFriend, setActiveFriend] = useState<FriendData | null>(null);

  return (
    <div className='body'>
      <div className='chat'>
        <ChatCommunity

          friends={intraData.friends} setActiveFriend={setActiveFriend} />
        <ChatTalk intraData={intraData} setIntraData={setIntraData} activeFriend={activeFriend} />
      </div>
    </div>
  );
}
