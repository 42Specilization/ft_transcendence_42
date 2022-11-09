/* eslint-disable quotes */
import "./ChatCommunity.scss";
import { MagnifyingGlass, UserPlus, UsersThree } from "phosphor-react";
import { FriendData } from "../../../Interfaces/interfaces";
import { UserCard } from "./UserCard";
import { Dispatch, SetStateAction } from "react";

interface ChatCommunityProps {
  friends: FriendData[];
  setActiveFriend: Dispatch<SetStateAction<FriendData | null>>;
}

export function ChatCommunity({
  friends,
  setActiveFriend,
}: ChatCommunityProps) {
  return (
    <div className="chat__community">
      <div className="chat__community__header">
        <UsersThree className="chat__community__header__icon" size={40} />
        <UserPlus className="chat__community__header__icon" size={40} />
        <MagnifyingGlass className="chat__community__header__icon" size={40} />
      </div>
      <div className="chat__community__body">
        {friends.map((obj) => (
          <UserCard key={obj.login} friend={obj} setActiveFriend={setActiveFriend} />
        ))}
      </div>
      <div className="chat__community__footer" />
    </div>
  );
}
