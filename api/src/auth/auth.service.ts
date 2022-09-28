import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { UserService } from 'src/user/user.service';
import { AccessTokenResponse } from './dto/AccessTokenResponse.dto';
import { IntraData } from './dto/IntraData.dto';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService) { }

  async getToken(code: string): Promise<AccessTokenResponse> {
    const url = `${process.env['ACCESS_TOKEN_URI']}?grant_type=authorization_code&client_id=${process.env['CLIENT_ID']}&client_secret=${process.env['CLIENT_SECRET']}&redirect_uri=${process.env['REDIRECT_URI']}&code=${code}`;

    return (
      await axios.post(url).then((response) => {
        // console.log(response.data);
        return response.data as AccessTokenResponse;
      }).catch(() => {
        // console.log('erro aqui hehe \n', err);
        throw new InternalServerErrorException('getToken: Fail to request access token to intra!');
      })
    );
  }

  async getData(token: string): Promise<IntraData> {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const urlMe = `${process.env['URL_ME']}`;
    return (
      await axios(urlMe, config).then(response => {
        return ({
          first_name: response.data.first_name,
          email: response.data.email,
          usual_full_name: response.data.usual_full_name,
          image_url: response.data.image_url,
          login: response.data.login
        });
      }).catch(err => {
        if (err.code == 'ERR_BAD_REQUEST')
          throw new UnauthorizedException('getData: Token invalid!');
        else
          throw new InternalServerErrorException('getData: Something is wrong!');
      })
    );
  }

  async signUp(code: string): Promise<AccessTokenResponse> {

    const token = await this.getToken(code);
    const data = await this.getData(token.access_token);
    const user = this.userService.getUser(data.email);
    // console.log(user);
    if (!user) {
      this.userService.createUser(data, token);
      console.log('user Criado!');
    } else {
      this.userService.updateToken(data.email, token);
      console.log('token atualizado!');
    }


    return (token);
  }

}
