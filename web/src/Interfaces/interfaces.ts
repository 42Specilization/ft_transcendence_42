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
}

export interface ErrResponse {
  statusCode: number;
  message: string;
  error: string;
}
