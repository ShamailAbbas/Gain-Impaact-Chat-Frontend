import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../../context/auth";
import "../../css/home.css";
import Users from "./Users";
import Messages from "./Messages";
import isauthanticated from "../../util/isauthanticated";
import { gql, useSubscription } from "@apollo/client";
import { useMessageDispatch, useMessageState } from "../../context/message";
export default function Home({ history }) {
  const { users, selecteduser, messages } = useMessageState();
  const authDispatch = useAuthDispatch();
  const messageDispatch = useMessageDispatch();
  const NEW_MESSAGE = gql`
    subscription newMessage {
      newMessage {
        from
        to
        content
        createdAt
      }
    }
  `;
  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE);

  useEffect(() => {
    console.log("subscription data is ", messageData, messageError);
    if (!isauthanticated()) {
      window.location.reload();
    }
    if (messageError) console.log(messageError);

    if (messageData) {
      const message = messageData.newMessage;
      console.log("receiveed message");
      if (selecteduser == message?.from) {
        let msg = [...messages, message];

        messageDispatch({
          type: "ADD_NEW_MESSAGE",
          payload: {
            msg,
            // email: message.to
          },
        });
      } else {
        console.log("no user is selected but we have a new mesg");
        messageDispatch({
          type: "SET_USERS_LATEST_MSG",
          payload: {
            email: message.from,
            message,
            users,
          },
        });
      }
    }
  }, [messageError, messageData]);
  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  };

  return (
    <div>
      {/* <div className="">
        {!user?.user.email ? (
          <>
            <Link to="/login">
              <button variant="link">Login</button>
            </Link>
            <Link to="/register">
              <button variant="link">Register</button>
            </Link>
          </>
        ) : (
          <>
            <h4>{user.user.email}</h4>
            <button variant="link" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div> */}
      <div className="home">
        <Users />
        <Messages />
      </div>
    </div>
  );
}
