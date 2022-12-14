/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty({ message: 'Inform your e-mail address!' })
  @ApiProperty()
  @IsEmail({}, {message: 'Inform a correct e-mail address!'})
  email: string;
  @IsNotEmpty({message: 'Inform a password!'})
  @MinLength(6, {message: 'The password must have at least 6 characters'})
  @ApiProperty()
  password: string;
}