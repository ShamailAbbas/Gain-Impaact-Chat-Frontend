import React, { useEffect } from "react";
import { gql, useQuery, useSubscription } from "@apollo/client";
import "../../css/user.css";
import { useMessageDispatch, useMessageState } from "../../context/message";
import { useAuthState, useAuthDispatch } from "../../context/auth";
import moment from "moment";
import { BiLogIn } from "react-icons/bi";
import isauthanticated from "../../util/isauthanticated";
const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      email
      createdAt
      latestMessage {
        content
        createdAt
      }
    }
  }
`;

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

export default function Users() {
  const messageDispatch = useMessageDispatch();
  const { users, selecteduser, messages } = useMessageState();
  const authDispatch = useAuthDispatch();
  const { user } = useAuthState();
  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) => {
      messageDispatch({ type: "SET_USERS", payload: data.getUsers });
    },
    onError: (err) => console.log(err),
  });

  //

  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE);

  useEffect(() => {
    if (!isauthanticated()) {
      window.location.reload();
    }
    if (messageError) console.log(messageError);

    if (messageData) {
      const message = messageData.newMessage;
      console.log("message is for ");
      if (selecteduser == message?.from) {
        let msg = [...messages, message];

        messageDispatch({
          type: "ADD_NEW_MESSAGE",
          payload: { msg, email: message.to },
        });
      } else {
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
  //
  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  };

  return (
    <div className="usercontainer">
      <div className={`loggedinuser `}>
        <img
          src={
            user.user?.imageUrl ||
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
          }
          className="profilepic"
        />
        <div className="detail">
          <p className="username">{user.user.username}</p>
        </div>
      </div>
      <div className="otherusers">
        {users?.map((u) => {
          const bg = selecteduser == u.email ? "selecteduserbg" : "";

          return (
            <div
              className={`userwrapper ${bg}`}
              role="button"
              key={u.email}
              onClick={() =>
                messageDispatch({ type: "SET_SELECTED_USER", payload: u.email })
              }
            >
              <img
                src={
                  u?.imageUrl ||
                  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                }
                className="profilepic"
              />
              <div className="detail">
                <p className="username">{u.username}</p>
                <p className="lastmsg">
                  {u.latestMessage?.content
                    ? `${u.latestMessage?.content?.slice(0, 20)} ...`
                    : "You are now connected!"}
                </p>
              </div>
              <div className="lastseen">
                <p className={`lastmsg `}>
                  {u.latestMessage.createdAt
                    ? moment(u.latestMessage.createdAt).format("L")
                    : moment(u.createdAt).format("L")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <h1 className="logout">
        <BiLogIn onClick={logout} className="logoutbtn" />
      </h1>
    </div>
  );
}
