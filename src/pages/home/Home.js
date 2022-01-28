import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../../context/auth";
import "../../css/home.css";
import Users from "./Users";
import Messages from "./Messages";

export default function Home({ history }) {
  const authDispatch = useAuthDispatch();

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
