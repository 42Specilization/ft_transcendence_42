export interface NotifyData {
  id: string;
  type: string;
  user_source: string;
  additional_info: string;
  date: Date;
}

export interface CreateGroupData {
  type: string;
  name: string;
  password?: string;
  confirmPassword?: string;
  image?: string;
  owner: string;
}

export interface FriendData {
  status: string;
  login: string;
  image_url: string;
}

export interface BlockedData {
  login: string;
  image_url: string;
}

export interface UserData {
  status?: string;
  name: string;
  image: string;
}

export interface MemberData {
  name: string;
  image: string;
  role: string;
  mutated: boolean;
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

export interface GroupData {
  id: string;
  type: string;
  name?: string;
  image?: string;
  messages: MsgToClient[];
  date: Date;
  newMessages: number;
}

export interface DirectData {
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
  friends: FriendData[];
  blocked: BlockedData[];
  directs: DirectData[];
  groups: GroupData[];
}

export interface ErrResponse {
  statusCode: number;
  message: string;
  error: string;
}
