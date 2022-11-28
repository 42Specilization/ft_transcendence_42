/* eslint-disable @typescript-eslint/no-empty-function */
import { Dispatch, SetStateAction, createContext, useState, ReactNode, useEffect } from 'react';
import { actionsChat } from '../adapters/chat/chatState';
import { DirectData, FriendData, GroupData, MsgToClient } from '../others/Interfaces/interfaces';

export interface ActiveChatData {
  chat: DirectData | GroupData;
  newMessage: boolean;
  historicMsg: MsgToClient[];
  blocks: number;
  currentBlock: number;
}

interface IChatContext {
  activeChat: ActiveChatData | null;
  peopleChat: FriendData | null;
  directsChat: string | null;
  groupsChat: string | null;
  setActiveChat: Dispatch<SetStateAction<ActiveChatData | null>>;
  setPeopleChat: Dispatch<SetStateAction<FriendData | null>>;
  setDirectsChat: Dispatch<SetStateAction<string | null>>;
  setGroupsChat: Dispatch<SetStateAction<string | null>>;
}

export const ChatContext = createContext<IChatContext>({
  activeChat: null,
  peopleChat: null,
  directsChat: null,
  groupsChat: null,
  setActiveChat: () => { },
  setPeopleChat: () => { },
  setDirectsChat: () => { },
  setGroupsChat: () => { },
});

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {

  const [activeChat, setActiveChat] = useState<ActiveChatData | null>(null);
  const [peopleChat, setPeopleChat] = useState<FriendData | null>(null);
  const [directsChat, setDirectsChat] = useState<string | null>(null);
  const [groupsChat, setGroupsChat] = useState<string | null>(null);

  useEffect(() => {
    actionsChat.initializeSocketChat(setActiveChat);
    return () => {
      actionsChat.disconnectSocketChat();
    };
  }, []);

  return (
    <ChatContext.Provider value={{
      activeChat, setActiveChat,
      directsChat, setDirectsChat,
      groupsChat, setGroupsChat,
      peopleChat, setPeopleChat,
    }}>
      {children}
    </ChatContext.Provider>
  );
};