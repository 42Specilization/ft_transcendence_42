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
}

export interface ChatMsg {
  id: number;
  user: IntraData;
  msg: string;
  date: Date;
}
