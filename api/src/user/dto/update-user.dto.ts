import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Inform a name!' })
  @MinLength(3, { message: 'The nick must have at least 3 characters!' })
  @MaxLength(50, { message: 'The nick must have less then 50 characters'})
  nick: string;

  @IsOptional()
  @IsString({ message: 'Inform an image url!' })
  imgUrl: string;
}
