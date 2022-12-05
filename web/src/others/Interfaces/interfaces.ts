export interface UserData {
  status?: string;
  login: string;
  image_url: string;
  role?: string;
  mutated?: boolean;
  ratio?: string
}

export interface CreateGroupData {
  type: string;
  name: string;
  password?: string;
  confirmPassword?: string;
  image?: string;
  owner: string;
}

export interface GroupCardData {
  id: string;
  type: string;
  name: string;
  image: string;
  date: Date;
  member: boolean;
  size: number;
}

export interface NotifyData {
  id: string;
  type: string;
  user_source: string;
  additional_info: string;
  date: Date;
}

export interface ChatData {
  id: string;
  type: string;
  name?: string;
  image?: string;
  date: Date;
  messages: MsgToClient[];
  newMessages: number;
}

export interface UserMsg {
  login: string;
  image: string;
}

export interface MsgToServer {
  chat: string;
  user: string;
  msg: string;
}

export interface MsgToClient {
  id: string;
  chat: string;
  user: UserMsg;
  date: Date;
  msg: string;
  type: string;
}

export interface IntraData {
  first_name: string;
  email: string;
  usual_full_name: string;
  image_url: string;
  login: string;
  matches: string;
  wins: string;
  lose: string;
  isTFAEnable: boolean;
  tfaValidated: boolean;
  notify: NotifyData[];
  friends: UserData[];
  blocked: UserData[];
  directs: ChatData[];
  groups: ChatData[];
}

export interface ErrResponse {
  statusCode: number;
  message: string;
  error: string;
}

export interface GlobalData {
  notify: NotifyData[];
  friends: UserData[];
  blocked: UserData[];
  directs: ChatData[];
  groups: ChatData[];
  globalUsers: UserData[];
  globalGroups: GroupCardData[];
}