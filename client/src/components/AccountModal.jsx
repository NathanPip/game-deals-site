import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/authContext.jsx";
import { useGlobalState } from "../contexts/globalContext.jsx";
import { postUserProfile } from "../helpers/wishlistAPIFunctions.js";

export default function AccountModal({ type, isOpen, setIsOpen, setType }) {
  //login field references
  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();

  //signup field references
  const signupEmailRef = useRef();
  const signupPasswordRef = useRef();
  const signupPasswordConfirmRef = useRef();

  //values provided from authContext
  const { signup, login } = useAuth();

  //loading and error states for login and signup requests
  const [accountError, setAccountError] = useState("");
  const [accountLoading, setAccountLoading] = useState(false);

  function handleCloseModal() {
    setIsOpen(false);
    setAccountError("");
    setAccountLoading(false);
  }

  //handles signup - checks for valid email input as well as if both passwords entered match and calls the signup function when both conditions are met
  async function handleSignupSubmit(e) {
    e.preventDefault();

    if (
      signupPasswordRef.current.value !== signupPasswordConfirmRef.current.value
    ) {
      return setAccountError("Passwords do not match");
    }

    try {
      setAccountError("");
      setAccountLoading(true);
      const sign = await signup(
        signupEmailRef.current.value,
        signupPasswordRef.current.value
      );
      await postUserProfile(sign.user);
      handleCloseModal();
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        const email = signupEmailRef.current.value;
        setType("login");
        loginEmailRef.current.value = email;
        loginPasswordRef.current.value = "";
        setAccountError("Email already in use please login");
        return;
      }
      console.log(err);
      return setAccountError("failed to signup");
    } finally {
      setAccountLoading(false);
    }
  }

  //handles login - calls the login function with email and password entered
  async function handleLoginSubmit(e) {
    e.preventDefault();
    const emailRef = loginEmailRef.current.value;
    const passwordRef = loginPasswordRef.current.value;
    if (!emailRef || !passwordRef) {
      return setAccountError("please enter an email and password");
    }
    try {
      setAccountError("");
      setAccountLoading(true);
      await login(emailRef, passwordRef);
      handleCloseModal();
    } catch (err) {
      console.log(err.code);
      if (err.code === "auth/wrong-password") {
        setAccountError("incorrect password");
        loginPasswordRef.current.value = "";
        return;
      }
      if (err.code === "auth/user-not-found") {
        setAccountError("user does not exist with that email");
        return;
      }
      return setAccountError("user does not exist with that email");
    } finally {
      setAccountLoading(false);
    }
  }
  //closes the modal and sets error back to default value

  //the login form that is rendered if modal state is in login
  const loginForm = (
    <div className="modal-body">
      <button className="form-btn close-btn" onClick={handleCloseModal}>
        Close
      </button>

      <h2 className="modal-title">Login</h2>
      {accountError ? <p className="account-alert">{accountError}</p> : null}
      <form className="account-form login" onSubmit={handleLoginSubmit}>
        <label htmlFor="email">Email</label>
        <input
          className="account-form-input login"
          id="email"
          type="email"
          placeholder="email@email.com"
          formNoValidate
          ref={loginEmailRef}
        ></input>

        <label htmlFor="password">Password</label>
        <input
          className="account-form-input login"
          id="password"
          type="password"
          placeholder="password"
          ref={loginPasswordRef}
        ></input>
        {/* forgot password support incoming */}
        {/* <button className="form-btn" id="forgot-btn" type="submit">
          Forgot Password
        </button> */}

        <button className="form-submit-btn" id="login-btn" type="submit">
          Login
        </button>
      </form>

      <p className="form-redirect" onClick={() => setType("signup")}>
        Don't have an account? Sign Up
      </p>
    </div>
  );

  //form that is rendered if modal state is in signup
  const signupForm = (
    <div className="modal-body">
      <button className="form-btn close-btn" onClick={handleCloseModal}>
        Close
      </button>
      <h2 className="modal-title">Sign Up</h2>
      {accountError ? <p className="account-alert">{accountError}</p> : null}
      <form className="account-form signup" onSubmit={handleSignupSubmit}>
        <label htmlFor="email">Email</label>
        <input
          className="account-form-input signup"
          id="email"
          type="email"
          placeholder="email@email.com"
          ref={signupEmailRef}
        ></input>

        <label htmlFor="password">Password</label>
        <input
          className="account-form-input signup"
          id="password"
          type="password"
          placeholder="password"
          ref={signupPasswordRef}
        ></input>

        <label htmlFor="password">Confirm Password</label>
        <input
          className="account-form-input signup"
          id="confirm-password"
          type="password"
          placeholder="confirm password"
          ref={signupPasswordConfirmRef}
        ></input>

        <button
          disabled={accountLoading}
          className="form-submit-btn"
          id="signup-btn"
          type="submit"
        >
          Signup
        </button>
      </form>

      <p className="form-redirect" onClick={() => setType("login")}>
        Already have an account? Login
      </p>
    </div>
  );

  //check to see modal state and render corresponding form
  function renderAccountForm() {
    if (type === "signup") {
      return signupForm;
    }
    return loginForm;
  }
  //if the modal is open render the modal else render nothing
  if (isOpen) return <div className="account-modal">{renderAccountForm()}</div>;
  return null;
}
