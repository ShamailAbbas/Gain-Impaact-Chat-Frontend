import React, { createContext, useReducer, useContext } from "react";

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();
const initialstate = {
  users: [],
  selecteduser: "",
  messages: [],
};
const messageReducer = (state, action) => {
  switch (action.type) {
    case "SET_USERS":
      return {
        ...state,
        users: JSON.parse(JSON.stringify(action.payload)),
      };

    case "SET_SELECTED_USER":
      return {
        ...state,
        selecteduser: action.payload,
      };
    case "ADD_OLD_MESSAGE":
      const messagescopy = state.messages;

      return {
        ...state,
        messages: action.payload,
      };
    case "ADD_NEW_MESSAGE": {
      let userscopy = state.users;
      const indexofuser = userscopy.findIndex((user) => {
        return user.email === action.payload.email;
      });
      if (!indexofuser == -1) {
        userscopy[indexofuser].latestMessage = {
          content: action.payload.msg[action.payload.msg.length - 1].content,
          createdAt:
            action.payload.msg[action.payload.msg.length - 1].createdAt,
        };
      }

      return {
        ...state,
        messages: action.payload.msg,
        users: userscopy,
      };
    }
    case "SET_USERS_LATEST_MSG":
      const indexofuser = action.payload.users.findIndex(
        (user) => user.email === action.payload.email
      );

      let userscopy = action.payload.users;

      userscopy[indexofuser].latestMessage = {
        content: action.payload.message.content,
        createdAt: action.payload.message.createdAt,
      };
      return { ...state, users: userscopy };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, initialstate);

  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  );
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
