/* eslint-disable indent */
import { 
  IsBoolean, 
  IsEmail,
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  MaxLength,
  MinLength,
  NotContains 
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Inform a name!' })
  @NotContains(',')
  @MinLength(3, { message: 'The nick must have at least 3 characters!' })
  @MaxLength(15, { message: 'The nick must have less then 15 characters' })
  nick?: string;

  @IsOptional()
  @IsString({ message: 'Inform an image url!' })
  imgUrl?: string;

  @IsOptional()
  @IsBoolean({ message: 'Value need be true of false' })
  isTFAEnable?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Value need be true of false' })
  tfaValidated?: boolean;

  @IsOptional()
  @IsEmail({ message: 'Inform a valid email' })
  tfaEmail?: string;

  @IsOptional()
  @IsString({ message: 'Inform a valid code' })
  tfaCode?: string;
}
