/* eslint-disable indent */
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
	@IsNotEmpty({message: 'Insert a valid password'})
	password: string;
	@IsNotEmpty({message: 'Insert a valid  confirmation password'})
	confirmPassword: string;
	@IsNotEmpty({message: 'Insert a valid email'})
	@IsEmail({message: 'Insert a valid email'})
	email: string;
}