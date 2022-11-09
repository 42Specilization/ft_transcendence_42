export class FriendDto {
  online: boolean;
  login: string;
  email: string;
  image_url: string;
}

export class UserDto {
  email: string;
  first_name: string;
  image_url: string;
  login: string;
  usual_full_name: string;
  matches: string;
  wins: string;
  lose: string;
  isTFAEnable: boolean;
  tfaValidated: boolean;
  friends: FriendDto[];
}
