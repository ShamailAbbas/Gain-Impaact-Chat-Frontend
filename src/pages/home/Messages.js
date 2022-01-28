import React, { useEffect, useState, useRef } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";

import { useMessageDispatch, useMessageState } from "../../context/message";
import "../../css/messages.css";
import SingleMessage from "./SingleMessage";
import moment from "moment";
import { FaAirbnb } from "react-icons/fa";
import { useAuthState } from "../../context/auth";
import isauthanticated from "../../util/isauthanticated";
const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      from
      to
      content
      createdAt
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      from
      to
      content
      createdAt
    }
  }
`;

export default function Messages() {
  const { users, selecteduser, messages } = useMessageState();
  const { user } = useAuthState();
  const messageDispatch = useMessageDispatch();
  const [content, setContent] = useState("");

  const pageendRef = useRef();
  const selectedUser = selecteduser;

  const [getMessages, { loading: messagesLoading, data: messagesData }] =
    useLazyQuery(GET_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => {
      console.log(err);
    },
    onCompleted: (data) => {
      let msg = [...messages, data.sendMessage];

      messageDispatch({
        type: "ADD_NEW_MESSAGE",
        payload: {
          msg,
          email: data.sendMessage.to,
          content: data.sendMessage.content,
          createdAt: data.sendMessage.createdAt,
        },
      });
    },
  });

  useEffect(() => {
    if (selectedUser) {
      getMessages({ variables: { from: selectedUser } });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesData) {
      // setMessages(messagesData.getMessages);
      //
      messageDispatch({
        type: "ADD_OLD_MESSAGE",
        payload: messagesData.getMessages,
      });
    }
  }, [messagesData]);
  const scroll = () => {
    pageendRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };
  useEffect(() => {
    scroll();
  }, [messages]);

  const submitMessage = (e) => {
    if (!isauthanticated()) {
      window.location.reload();
    }
    e.preventDefault();

    if (content.trim() === "" || !selectedUser) return;

    // mutation for sending the message

    sendMessage({ variables: { to: selectedUser, content } });
    setContent("");
  };

  let ismsgfromsameuser;
  let isonsamedate;
  return (
    <div className="msgcontainer">
      <div className="allmessages">
        {messages?.map((message, index) => {
          const sameuser = ismsgfromsameuser == message.from ? true : false;
          const onsamedate =
            isonsamedate ==
            moment(message.creadtedAt)
              .subtract(10, "days")
              .calendar()
              .toString()
              ? true
              : false;
          isonsamedate = moment(message.createdAt)
            .subtract(10, "days")
            .calendar()
            .toString();
          console.log("is on same date? ", onsamedate);
          ismsgfromsameuser = message.from;

          return (
            <SingleMessage
              key={index}
              message={message}
              sameuser={sameuser}
              onsamedate={onsamedate}
            />
          );
        })}

        <div ref={pageendRef} />
      </div>

      {selecteduser == "" ? (
        ""
      ) : (
        <form onSubmit={submitMessage} className="sendmsgform">
          <input
            className="inputmsg"
            type="text"
            placeholder="Type a message.."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button className="sendbtn" type="submit">
            send <FaAirbnb className="sendicon" />
          </button>
        </form>
      )}
    </div>
  );
}
