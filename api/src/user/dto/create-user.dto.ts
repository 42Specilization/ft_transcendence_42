/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';


export class CreateUserDto {

  @IsNotEmpty({ message: 'Inform your first name!' })
  @MinLength(3, { message: 'The first name must have at least 3 characters!' })
  @MaxLength(50, { message: 'The first name must have less then 200 characters' })
  @ApiProperty()
  first_name: string;

  @IsNotEmpty({ message: 'Inform your full name!' })
  @MinLength(3, { message: 'The your full name must have at least 3 characters!' })
  @MaxLength(200, { message: 'The your full name must have less then 200 characters' })
  @ApiProperty()
  usual_full_name: string;

  @IsNotEmpty({ message: 'Inform an e-mail address!' })
  @IsEmail({}, { message: 'Inform a valid e-mail address!' })
  @MaxLength(200, { message: 'The e-mail address must have less then 200 characters!' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Inform a name!' })
  @MinLength(3, { message: 'The nick must have at least 3 characters!' })
  @MaxLength(50, { message: 'The nick must have less then 50 characters' })
  @ApiProperty()
  nick: string;

  @IsNotEmpty({ message: 'Inform an image url!' })
  @ApiProperty()
  imgUrl: string;

  @IsNotEmpty({ message: 'Inform a token!' })
  @ApiProperty()
  token: string;

}
