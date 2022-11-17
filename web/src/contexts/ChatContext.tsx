import { Dispatch, SetStateAction, createContext, useState, ReactNode, useEffect } from 'react';
import { actionsChat } from '../chat/chatState';
import { FriendData } from '../Interfaces/interfaces';


interface IChatContext {
  activeChat: FriendData | null;
  setActiveChat: Dispatch<SetStateAction<FriendData | null>>;
}

export const ChatContext = createContext<IChatContext>({
  activeChat: null,
  setActiveChat: () => { },
});

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {

  const [activeChat, setActiveChat] = useState<FriendData | null>(null);

  useEffect(() => {
    actionsChat.initializeSocketChat();
    return () => {
      actionsChat.disconnectSocketChat();
    };
  }, []);

  return (
    <ChatContext.Provider value={{ activeChat, setActiveChat }}>
      {children}
    </ChatContext.Provider>
  );
};