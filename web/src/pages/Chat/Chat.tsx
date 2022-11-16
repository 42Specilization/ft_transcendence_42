import './Chat.scss';
import { useState } from 'react';
import { ChatCommunity } from '../../components/Chat/ChatCommunity/ChatCommunity';
import { ChatTalk } from '../../components/Chat/ChatTalk/ChatTalk';
import { DirectData } from '../../Interfaces/interfaces';

export default function Chat() {

  const [activeChat, setActiveChat] = useState<DirectData | null>(null);

  return (
    <div className='body'>
      <div className='chat'>
        <ChatCommunity setActiveChat={setActiveChat} />
        <ChatTalk setActiveChat={setActiveChat} activeChat={activeChat} />
      </div>
    </div>
  );
}
