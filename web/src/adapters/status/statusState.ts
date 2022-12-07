import { Dispatch, SetStateAction } from 'react';
import { Socket } from 'socket.io-client';
import { proxy, ref } from 'valtio';
import { ActiveChatData } from '../../contexts/ChatContext';
import { GlobalData, IntraData, MsgToClient, UserData } from '../../others/Interfaces/interfaces';
import { getGlobalDirects, getGlobalGroups, getGlobalInDb, getGlobalData, getGlobalAllGroups, getGlobalAllUsers } from '../../others/utils/utils';
import { actionsChat } from '../chat/chatState';

import {
  createSocketStatus,
  CreateSocketStatusOptions,
  socketStatusIOUrl,
} from './status.socket-io';

export interface AppStateStatus {
  socket?: Socket;
  setIntraData?: Dispatch<SetStateAction<IntraData>> | null;
  setUpdateUser?: Dispatch<SetStateAction<number>> | null;
  setGlobalData?: Dispatch<SetStateAction<GlobalData>> | null;
  setActiveChat?: Dispatch<SetStateAction<ActiveChatData | null>> | null;
}

const stateStatus = proxy<AppStateStatus>({});

const actionsStatus = {

  initializeSocketStatus: (
    setIntraData: Dispatch<SetStateAction<IntraData>>,
    setGlobalData: Dispatch<SetStateAction<GlobalData>>,
    setActiveChat: Dispatch<SetStateAction<ActiveChatData | null>>
  ): void => {
    if (!stateStatus.socket) {
      const createSocketOptions: CreateSocketStatusOptions = {
        socketStatusIOUrl: socketStatusIOUrl,
        actionsStatus: actionsStatus,
        stateStatus: stateStatus,
      };
      stateStatus.socket = ref(createSocketStatus(createSocketOptions));
      stateStatus.setIntraData = ref(setIntraData);
      stateStatus.setGlobalData = ref(setGlobalData);
      stateStatus.setActiveChat = ref(setActiveChat);
      return;
    }

    if (!stateStatus.socket.connected) {
      stateStatus.socket.connect();
      stateStatus.setIntraData = ref(setIntraData);
      stateStatus.setGlobalData = ref(setGlobalData);
      stateStatus.setActiveChat = ref(setActiveChat);
      return;
    }
  },

  disconnectSocketStatus() {
    if (stateStatus.socket?.connected) {
      stateStatus.socket?.disconnect();
    }
  },

  async iAmOnline() {
    const user = await getGlobalInDb();
    stateStatus.socket?.emit('iAmOnline', user.login);
  },

  async iAmInGame() {
    const user = await getGlobalInDb();
    stateStatus.socket?.emit('iAmInGame', user.login);
  },

  async iAmLeaveGame() {
    const user = await getGlobalInDb();
    stateStatus.socket?.emit('iAmLeaveGame', user.login);
  },

  async updateUserStatus(login: string, status: string) {
    if (stateStatus.setGlobalData) {
      const global = await getGlobalAllUsers();
      stateStatus.setGlobalData(prev => {
        return {
          ...prev,
          friends: prev.friends.map(friend =>
            login === friend.login ? { ...friend, status: status } : friend)
            .sort((a, b) => {
              if (a.status !== b.status) {
                if (a.status === 'offline')
                  return 1;
                if (b.status === 'offline')
                  return -1;
              }
              return a.login.toLowerCase() < b.login.toLowerCase() ? -1 : 1;
            }),
          blocked: prev.blocked.map(blocked =>
            login === blocked.login ? { ...blocked, status: status } : blocked),
          globalUsers: global,
        };
      });
    }
  },

  changeLogin(login: string) {
    stateStatus.socket?.emit('changeLogin', login);
  },

  updateYourSelfLogin(login: string) {
    if (stateStatus.setIntraData) {
      stateStatus.setIntraData((prev) => {
        return { ...prev, login: login };
      });
    }
  },

  async updateUserLogin(oldLogin: string, newLogin: string) {
    if (stateStatus.setGlobalData) {
      stateStatus.setGlobalData(prev => {
        return {
          ...prev,
          friends: prev.friends.map(friend =>
            oldLogin === friend.login ? { ...friend, login: newLogin } : friend)
            .sort((a, b) => {
              if (a.status !== b.status) {
                if (a.status === 'offline')
                  return 1;
                if (b.status === 'offline')
                  return -1;
              }
              return a.login.toLowerCase() < b.login.toLowerCase() ? -1 : 1;
            }),
          blocked: prev.blocked.map(blocked =>
            oldLogin === blocked.login ? { ...blocked, login: newLogin } : blocked)
            .sort((a, b) => a.login.toLowerCase() < b.login.toLowerCase() ? -1 : 1),
          globalUsers: prev.globalUsers.map(globalUser =>
            oldLogin === globalUser.login ? { ...globalUser, login: newLogin } : globalUser),
          directs: prev.directs.map(direct =>
            oldLogin === direct.name ? { ...direct, name: newLogin } : direct),
        };
      });
    }
    if (stateStatus.setActiveChat) {
      stateStatus.setActiveChat((prev) => {
        if (prev && prev.chat.name === oldLogin)
          return {
            ...prev,
            chat: {
              ...prev.chat,
              name: newLogin,
            }
          };
        return prev;
      });
    }
  },

  changeImage(image_url: string | undefined) {
    stateStatus.socket?.emit('changeImage', image_url as string);
  },

  updateYourSelfImage(image: string) {
    if (stateStatus.setIntraData) {
      stateStatus.setIntraData((prev) => {
        return { ...prev, image_url: image };
      });
    }
  },

  async updateUserImage(login: string, image: string) {
    if (stateStatus.setGlobalData) {
      stateStatus.setGlobalData(prev => {
        return {
          ...prev,
          friends: prev.friends.map(friend =>
            login === friend.login ? { ...friend, image_url: image } : friend),
          blocked: prev.blocked.map(blocked =>
            login === blocked.login ? { ...blocked, image_url: image } : blocked),
          globalUsers: prev.globalUsers.map(globalUser =>
            login === globalUser.login ? { ...globalUser, image_url: image } : globalUser),
          directs: prev.directs.map(direct =>
            login === direct.name ? { ...direct, image: image } : direct),
        };
      });
    }
    if (stateStatus.setActiveChat) {
      stateStatus.setActiveChat((prev) => {
        if (prev && prev.chat.name === login)
          return {
            ...prev,
            chat: {
              ...prev.chat,
              image: image,
            }
          };
        return prev;
      });
    }
  },

  newNotify(userTarget: string) {
    stateStatus.socket?.emit('newNotify', userTarget);
  },

  removeNotify(login: string | undefined = undefined) {
    if (login) {
      stateStatus.socket?.emit('removeNotify', login);
    } else {
      stateStatus.socket?.emit('removeNotify');
    }
  },

  async updateNotify() {
    if (stateStatus.setGlobalData) {
      const global = await getGlobalData(stateStatus.setGlobalData);
      stateStatus.setGlobalData((prev) => {
        return { ...prev, notify: global.notify };
      });
    }
  },

  newFriend(userSource: string) {
    stateStatus.socket?.emit('newFriend', userSource);
  },

  removeFriend(friend: string) {
    stateStatus.socket?.emit('removeFriend', friend);
  },

  async updateFriend() {
    if (stateStatus.setGlobalData) {
      const global = await getGlobalData(stateStatus.setGlobalData);
      stateStatus.setGlobalData((prev) => {
        if (prev.friends && prev.friends.length < global.friends.length) {
          return {
            ...prev,
            friends: global.friends,
          };
        }
        return {
          ...prev,
          friends: global.friends.sort((a: UserData, b: UserData) => {
            if (a.status !== b.status) {
              if (a.status === 'offline')
                return 1;
              if (b.status === 'offline')
                return -1;
            }
            return a.login.toLowerCase() < b.login.toLowerCase() ? -1 : 1;
          }),
        };
      });
    }
  },

  newBlocked(blocked: string) {
    stateStatus.socket?.emit('newBlocked', blocked);
  },

  removeBlocked(blocked: string) {
    stateStatus.socket?.emit('removeBlocked', blocked);
  },

  async updateBlocked() {
    if (stateStatus.setGlobalData) {
      const global = await getGlobalData(stateStatus.setGlobalData);
      const directs = await getGlobalDirects();
      stateStatus.setGlobalData((prev) => {
        return {
          ...prev,
          friends: global.friends,
          blocked: global.blocked,
          directs: directs,
        };
      });
    }
  },

  async newDirect(name: string, chat: string) {
    stateStatus.socket?.emit('newDirect', { login: name, chat: chat });
    if (stateStatus.setGlobalData) {
      const directs = await getGlobalDirects();
      stateStatus.setGlobalData((prev) => {
        return { ...prev, directs: directs };
      });
    }
  },

  async updateDirects(chat: string) {
    actionsChat.joinChat(chat);
    if (stateStatus.setGlobalData) {
      const directs = await getGlobalDirects();
      stateStatus.setGlobalData((prev) => {
        return { ...prev, directs: directs };
      });
    }
  },

  async updateDirectInfos(message: MsgToClient) {
    if (stateStatus.setGlobalData) {
      stateStatus.setGlobalData((prev) => {
        return {
          ...prev,
          directs: prev.directs.map((key) => {
            if (key.id === message.chat) {
              return {
                ...key,
                date: message.date,
                newMessages: key.newMessages + 1
              };
            }
            return key;
          }).sort((a, b) => a.date < b.date ? 1 : -1),
        };
      });
    }
  },

  async updateGroups() {
    if (stateStatus.setGlobalData) {
      const groups = await getGlobalGroups();
      stateStatus.setGlobalData((prev) => {
        return { ...prev, groups: groups };
      });
    }
  },

  async updateGlobalGroups() {
    if (stateStatus.setGlobalData) {
      const groups = await getGlobalAllGroups();
      stateStatus.setGlobalData((prev) => {
        return { ...prev, globalGroups: groups };
      });
    }
  },

  async updateGroupInfos(message: MsgToClient) {
    if (stateStatus.setGlobalData) {
      stateStatus.setGlobalData((prev) => {
        return {
          ...prev,
          groups: prev.groups.map((key) => {
            if (key.id === message.chat) {
              return {
                ...key,
                date: message.date,
                newMessages: key.newMessages + 1
              };
            }
            return key;
          }).sort((a, b) => a.date < b.date ? 1 : -1),
        };
      });
    }
  },
};

export type AppActionsStatus = typeof actionsStatus;

export { stateStatus, actionsStatus };
