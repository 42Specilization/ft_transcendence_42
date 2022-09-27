import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AccessTokenResponse } from './dto/AccessTokenResponse.dto';
import { IntraData } from './dto/IntraData.dto';

@Injectable()
export class AuthService {

  async getToken(code: string): Promise<AccessTokenResponse> {
    const url = `${process.env['ACCESS_TOKEN_URI']}?grant_type=authorization_code&client_id=${process.env['CLIENT_ID']}&client_secret=${process.env['CLIENT_SECRET']}&redirect_uri=${process.env['REDIRECT_URI']}&code=${code}`;

    console.log(url);
    return (
      await axios.post(url).then((response) => {
        console.log(response.data);
        return response.data as AccessTokenResponse;
      })
    );
  }

  async getData(token: string): Promise<IntraData> {
    console.log('token is ', token);
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
      })
    );
  }

  async signUp(code: string): Promise<AccessTokenResponse> {

    const token = await this.getToken(code);
    // const data = await this.getData(token);
    console.log(token);
    return (token);
  }

}
