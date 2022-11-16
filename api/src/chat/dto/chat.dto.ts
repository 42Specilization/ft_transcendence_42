export class DirectUserDto {
  login: string;
  image_url: string;
}

export class DirectDto {
  id: string;
  type: string;
  name?: string;
  image?: string;
  users: DirectUserDto[];
}

