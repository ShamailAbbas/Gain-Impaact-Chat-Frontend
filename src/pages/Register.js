import React, { useState } from "react";

import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { FaAirbnb } from "react-icons/fa";
import "../css/auth.css";
const REGISTER_USER = gql`
  mutation register(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      name: $name
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      success
    }
  }
`;

export default function Register(props) {
  const [variables, setVariables] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, __) => props.history.push("/login"),
    onError: (err) => {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const submitRegisterForm = (e) => {
    e.preventDefault();

    registerUser({ variables });
  };

  return (
    <div>
      <div className="headline">Gain Impact Chat</div>
      <div className="logincontainer">
        <form onSubmit={submitRegisterForm} className="signinform">
          <h1>Sign Up</h1>

          <div className="input">
            <input
              value={variables.name}
              required={true}
              className="inputfields"
              type="text"
              placeholder="Enter your name"
              onChange={(e) => {
                setErrors("");
                setVariables({
                  ...variables,
                  name: e.target.value,
                });
              }}
            />
          </div>
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
          {errors?.email ? (
            <p
              style={{
                color: "red",
                alignSelf: "flex-start",
                marginBottom: "5px",
              }}
            >
              {errors.email}
            </p>
          ) : (
            ""
          )}
          <div className="input">
            <input
              value={variables.email}
              required={true}
              className="inputfields"
              type="email"
              placeholder="Enter your email"
              onChange={(e) => {
                setErrors("");
                setVariables({
                  ...variables,
                  email: e.target.value,
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
          {errors?.confirmPassword ? (
            <p
              style={{
                color: "red",
                alignSelf: "flex-start",
                marginBottom: "5px",
              }}
            >
              {errors.confirmPassword}
            </p>
          ) : (
            ""
          )}
          <div className="input">
            <input
              value={variables.confirmPassword}
              required={true}
              className="inputfields"
              type="password"
              placeholder="Confirm password"
              onChange={(e) => {
                setErrors("");

                setVariables({
                  ...variables,
                  confirmPassword: e.target.value,
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
          <Link to="/login" className="noaccount">
            <p>Already have an account?</p>
          </Link>
        </form>
      </div>
    </div>
  );
}
