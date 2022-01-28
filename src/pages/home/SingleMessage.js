import React, { useState } from "react";

import moment from "moment";
import "../../css/singlemessage.css";
import { useAuthState } from "../../context/auth";

export default function SingleMessage({ message, sameuser, onsamedate }) {
  const { user } = useAuthState();
  const align = message.from === user.user.email ? "alignleft" : "alignright";
  const bgcolor =
    message.from === user.user.email ? "bgcolorleft" : "bgcolorright";

  const imgwithtextright =
    message.from === user.user.email ? "" : "imgwithtextright";
  const textdivright = message.from === user.user.email ? "" : "textdivright";
  const aligntime =
    message.from === user.user.email ? "aligntimeleft" : "aligntimeright";

  return (
    <div className={`${align} textdiv ${textdivright}`}>
      {!onsamedate ? (
        <div className="date">
          {moment(message.createdAt).subtract(10, "days").calendar()}
        </div>
      ) : (
        ""
      )}
      {!sameuser ? <p className="from">{message.from}</p> : ""}
      <div className={`imgwithtext ${imgwithtextright}`}>
        <img
          src={
            message?.imageUrl ||
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
          }
          className="userimg"
        />
        <div className={`message ${bgcolor}`}>
          <p className="content">{message.content}</p>
          <p className={`time ${aligntime}`}>
            {moment(message.createdAt).format("LT")}
          </p>
        </div>
      </div>
    </div>
  );
}
