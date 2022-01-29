import React, { useState } from "react";

import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import "../css/auth.css";
import { useAuthDispatch } from "../context/auth";
import { FaAirbnb } from "react-icons/fa";
const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;

export default function Register(props) {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const dispatch = useAuthDispatch();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted(data) {
      dispatch({ type: "LOGIN", payload: data.login });
      window.location.href = "/";
    },
  });

  const submitLoginForm = (e) => {
    e.preventDefault();

    loginUser({ variables });
  };

  return (
    <div>
      <div className="headline">Gain Impact Chat</div>
      <div className="logincontainer">
        <form onSubmit={submitLoginForm} className="signinform">
          <h1>Sign In</h1>
          {errors?.username ? (
            <p
              style={{
                color: "red",
                alignSelf: "flex-start",
                marginBottom: "5px",
              }}
            >
              {errors.username}
            </p>
          ) : (
            ""
          )}
          <div className="input">
            <input
              value={variables.username}
              required={true}
              className="inputfields"
              type="text"
              placeholder="Enter your username"
              onChange={(e) => {
                setErrors("");
                setVariables({
                  ...variables,
                  username: e.target.value,
                });
              }}
            />
          </div>
          {errors?.password ? (
            <p
              style={{
                color: "red",
                alignSelf: "flex-start",
                marginBottom: "5px",
              }}
            >
              {errors.password}
            </p>
          ) : (
            ""
          )}
          <div className="input">
            <input
              value={variables.password}
              required={true}
              className="inputfields"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => {
                setErrors("");

                setVariables({
                  ...variables,
                  password: e.target.value,
                });
              }}
            />
          </div>

          <button type="submit" className="signinbtn" disabled={loading}>
            {loading ? (
              "Processing..."
            ) : (
              <div className="signin">
                <p>Submit</p> <FaAirbnb className="signinicon" />
              </div>
            )}
          </button>
          <Link to="/register" className="noaccount">
            <p>Don't have an account?</p>
          </Link>
        </form>
      </div>
    </div>
  );
}
