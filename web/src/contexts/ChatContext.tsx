/* eslint-disable @typescript-eslint/no-empty-function */
import { Dispatch, SetStateAction, createContext, useState, ReactNode, useEffect } from 'react';
import { actionsChat } from '../adapters/chat/chatState';
import { DirectData, FriendData } from '../others/Interfaces/interfaces';

interface IChatContext {
  activeChat: DirectData | null;
  groupsChat: string | null;
  friendsChat: FriendData | null;
  directsChat: string | null;
  setActiveChat: Dispatch<SetStateAction<DirectData | null>>;
  setGroupsChat: Dispatch<SetStateAction<string | null>>;
  setFriendsChat: Dispatch<SetStateAction<FriendData | null>>;
  setDirectsChat: Dispatch<SetStateAction<string | null>>;
}

export const ChatContext = createContext<IChatContext>({
  activeChat: null,
  groupsChat: null,
  friendsChat: null,
  directsChat: null,
  setActiveChat: () => { },
  setGroupsChat: () => { },
  setFriendsChat: () => { },
  setDirectsChat: () => { },
});

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {

  const [activeChat, setActiveChat] = useState<DirectData | null>(null);
  const [directsChat, setDirectsChat] = useState<string | null>(null);
  const [friendsChat, setFriendsChat] = useState<FriendData | null>(null);
  const [groupsChat, setGroupsChat] = useState<string | null>(null);

  // function getActiveChat(): DirectData | null {
  //   return activeChat;
  // }
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
      friendsChat, setFriendsChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};