/* eslint-disable quotes */
import { useEffect, useState } from "react";
import { ChatCommunity } from "../../components/Chat/ChatCommunity/ChatCommunity";
import { ChatTalk } from "../../components/Chat/ChatTalk/ChatTalk";
import { FriendData, IntraData } from "../../Interfaces/interfaces";
import { getStoredData, defaultIntra } from "../../utils/utils";
import "./Chat.scss";

export default function Chat() {
  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);
  useEffect(() => {
    getStoredData(setIntraData);
  }, []);

  const [activeFriend, setActiveFriend] = useState<FriendData | null>(null);
  console.log(intraData);
  return (
    <div className="body">
      <div className="chat">
        <ChatCommunity friends={intraData.friends} setActiveFriend={setActiveFriend} />
        <ChatTalk activeFriend={activeFriend} />
      </div>
    </div>
  );
}
