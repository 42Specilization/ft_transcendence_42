import { Dispatch, SetStateAction, createContext, useState, ReactNode, useEffect } from 'react';
import { actionsChat } from '../adapters/chat/chatState';
import { ChatData, MsgToClient } from '../others/Interfaces/interfaces';

export interface ActiveChatData {
  chat: ChatData;
  newMessage: boolean;
  historicMsg: MsgToClient[];
  blocks: number;
  currentBlock: number;
}

export interface SelectedChat {
  chat: string;
  type: string;
}

export interface UpdateGroupProfile {
  change: number;
  id: string;
}

interface IChatContext {
  selectedChat: SelectedChat | null;
  setSelectedChat: Dispatch<SetStateAction<SelectedChat | null>>;
  activeChat: ActiveChatData | null;
  setActiveChat: Dispatch<SetStateAction<ActiveChatData | null>>;
  tabSelected: string;
  setTabSelected: Dispatch<SetStateAction<string>>;
  updateGroupProfile: UpdateGroupProfile;
  setUpdateGroupProfile: Dispatch<SetStateAction<UpdateGroupProfile>>;
}

export const ChatContext = createContext<IChatContext>({
  selectedChat: null,
  setSelectedChat: () => { },
  activeChat: null,
  setActiveChat: () => { },
  tabSelected: 'Direct',
  setTabSelected: () => { },
  updateGroupProfile: { change: Date.now(), id: '' },
  setUpdateGroupProfile: () => { },
});

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {

  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);
  const [activeChat, setActiveChat] = useState<ActiveChatData | null>(null);
  const [tabSelected, setTabSelected] = useState('Direct');
  const [
    updateGroupProfile, setUpdateGroupProfile
  ] = useState<UpdateGroupProfile>({ change: Date.now(), id: '' });

  useEffect(() => {
    actionsChat.initializeSocketChat(setActiveChat);
    return () => {
      actionsChat.disconnectSocketChat();
    };
  }, []);

  return (
    <ChatContext.Provider value={{
      selectedChat, setSelectedChat,
      activeChat, setActiveChat,
      tabSelected, setTabSelected,
      updateGroupProfile, setUpdateGroupProfile,
    }}>
      {children}
    </ChatContext.Provider>
  );
};