import { createParamDecorator } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';

export const GetUser = createParamDecorator((data, req): User => {
  data;
  const user = req.args[0].user;
  return user;
});
