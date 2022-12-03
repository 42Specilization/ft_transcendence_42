/* eslint-disable @typescript-eslint/no-empty-function */
import { Dispatch, SetStateAction, createContext, useState, ReactNode, useEffect } from 'react';
import { actionsChat } from '../adapters/chat/chatState';
import { DirectData, GroupData, MsgToClient } from '../others/Interfaces/interfaces';

export interface ActiveChatData {
  chat: DirectData | GroupData;
  newMessage: boolean;
  historicMsg: MsgToClient[];
  blocks: number;
  currentBlock: number;
}

export interface SelectedChat {
  chat: string;
  type: string;
}

interface IChatContext {
  selectedChat: SelectedChat | null;
  activeChat: ActiveChatData | null;
  updateGroup: number;
  tabSelected: string;
  setSelectedChat: Dispatch<SetStateAction<SelectedChat | null>>;
  setActiveChat: Dispatch<SetStateAction<ActiveChatData | null>>;
  setUpdateGroup: Dispatch<SetStateAction<number>>;
  setTabSelected: Dispatch<SetStateAction<string>>;
}

export const ChatContext = createContext<IChatContext>({
  selectedChat: null,
  activeChat: null,
  updateGroup: Date.now(),
  tabSelected: 'Direct',
  setSelectedChat: () => { },
  setActiveChat: () => { },
  setUpdateGroup: () => { },
  setTabSelected: () => { },
});

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {

  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);
  const [activeChat, setActiveChat] = useState<ActiveChatData | null>(null);
  const [updateGroup, setUpdateGroup] = useState<number>(Date.now());
  const [tabSelected, setTabSelected] = useState('Direct');

  useEffect(() => {
    actionsChat.initializeSocketChat(setActiveChat, setUpdateGroup);
    return () => {
      actionsChat.disconnectSocketChat();
    };
  }, []);

  return (
    <ChatContext.Provider value={{
      selectedChat, setSelectedChat,
      activeChat, setActiveChat,
      updateGroup, setUpdateGroup,
      tabSelected, setTabSelected,
    }}>
      {children}
    </ChatContext.Provider>
  );
};