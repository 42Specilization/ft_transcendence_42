export interface NotificationData {
  id: string;
  viewed: boolean;
  type: string;
  target_nick: string;
  source_nick: string;
}

export interface NotifyData {
  id: string;
  type: string;
  user_source: string;
  addtions_info: string;
}

export interface FriendData {
  status: string;
  login: string;
  image_url: string;
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
  friends: FriendData[];
  notify: NotifyData[]
}

export interface ErrResponse {
  statusCode: number;
  message: string;
  error: string;
}
