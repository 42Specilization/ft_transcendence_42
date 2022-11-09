/* eslint-disable quotes */
import "./ChatMessage.scss";
import { ChatMsg } from "./ChatTalk";
import { IntraData } from "../../../Interfaces/interfaces";
import { ReactElement } from "react";
import ReactDOMServer from "react-dom/server";
import ReactTooltip from "react-tooltip";
interface ChatMessageProps {
  user: IntraData;
  message: ChatMsg;
}

export function ChatMessage({ user, message }: ChatMessageProps) {
  function self(): boolean {
    return user.login === message.user.login;
  }

  function formatDate(date: Date): ReactElement {
    const newDate = new Date(date);
    return (
      <>
        {String(newDate.getHours()).padStart(2, "0") +
          ":" +
          String(newDate.getMinutes()).padStart(2, "0")}{" "}
        <br />
        {String(newDate.getDate()).padStart(2, "0") +
          "/" +
          String(newDate.getMonth() + 1).padStart(2, "0") +
          "/" +
          newDate.getFullYear()}
      </>
    );
  }

  return (
    <div className={`chat__message ${self() ? "self" : ""}`}>
      <div
        className="chat__message__icon"
        style={{ backgroundImage: `url(${message.user.image_url})` }}
      />
      <p
        data-html={true}
        data-tip={ReactDOMServer.renderToString(formatDate(message.date))}
      >
        {message.msg}
      </p>
      <ReactTooltip className="chat__message__date" delayShow={250} />
    </div>
  );
}
