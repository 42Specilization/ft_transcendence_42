/* eslint-disable quotes */
import "./UserCard.scss";
import { IntraData } from "../../../Interfaces/interfaces";

interface UserCardProps {
  friend: IntraData;
  setActiveFriend: (arg0: IntraData | null) => void;
}

export function UserCard({ friend, setActiveFriend }: UserCardProps) {
  return (
    <div className="user__card" onClick={() => setActiveFriend(friend)}>
      <div
        className="user__card__icon"
        style={{ backgroundImage: `url(${friend.image_url})` }}
      />
      <div className="user__card__name">{friend.login}</div>
    </div>
  );
}
