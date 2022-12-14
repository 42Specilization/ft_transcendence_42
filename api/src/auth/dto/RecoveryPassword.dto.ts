/* eslint-disable indent */
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RecoveryPasswordDto {
	@IsNotEmpty({message: 'Insert a valid code'})
  @MinLength(6)
	code: string;
	@IsNotEmpty({message: 'Insert a valid email'})
	@IsEmail({message: 'Insert a valid email'})
	email: string;
}