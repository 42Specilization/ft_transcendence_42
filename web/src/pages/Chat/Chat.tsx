import './Chat.scss';
import { useState } from 'react';
import { ChatCommunity } from '../../components/Chat/ChatCommunity/ChatCommunity';
import { ChatTalk } from '../../components/Chat/ChatTalk/ChatTalk';

export default function Chat() {

  return (
    <div className='body'>
      <div className='chat'>
        <ChatCommunity />
        <ChatTalk />
      </div>
    </div>
  );
}
