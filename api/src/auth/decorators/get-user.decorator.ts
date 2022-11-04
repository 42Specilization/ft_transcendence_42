import { createParamDecorator } from '@nestjs/common';
import { UserFromJwt } from '../dto/UserFromJwt.dto';

export const GetUserFromJwt = createParamDecorator(
  (data, req): UserFromJwt => {
    data;
    return (req.args[0].user);
  }
);
