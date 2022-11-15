/* eslint-disable no-mixed-spaces-and-tabs */
import { IsNotEmpty } from 'class-validator';

export class FriendRequestDto {
	@IsNotEmpty({ message: 'Inform a valid nick!' })
	  nick: string;
}
