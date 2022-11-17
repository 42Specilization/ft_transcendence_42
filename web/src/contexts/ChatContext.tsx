import { Dispatch, SetStateAction, createContext, useState, ReactNode, useEffect } from 'react';
import { actionsChat } from '../chat/chatState';
import { DirectChatData, FriendData } from '../Interfaces/interfaces';


interface IChatContext {
  activeChat: DirectChatData | null;
  groupsChat: string | null;
  friendsChat: FriendData | null;
  directsChat: string | null;
  setActiveChat: Dispatch<SetStateAction<DirectChatData | null>>;
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

  const [activeChat, setActiveChat] = useState<DirectChatData | null>(null);
  const [directsChat, setDirectsChat] = useState<string | null>(null);
  const [friendsChat, setFriendsChat] = useState<FriendData | null>(null);
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
      friendsChat, setFriendsChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};