import './UserCard.scss';
import { FriendData } from '../../../Interfaces/interfaces';
import { Dispatch, SetStateAction } from 'react';

interface UserCardProps {
  friend: FriendData;
  setActiveFriend: Dispatch<SetStateAction<FriendData | null>>;
}

export function UserCard({ friend, setActiveFriend }: UserCardProps) {
  return (
    <div className='user__card' onClick={() => setActiveFriend(friend)}>
      <div
        className='user__card__icon'
        style={{ backgroundImage: `url(${friend.image_url})` }}
      />
      <div className='user__card__name'>{friend.login}</div>
    </div>
  );
}
