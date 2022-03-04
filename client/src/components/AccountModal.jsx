import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useGlobalState } from "../contexts/globalContext";
import { postUserProfile, getUserWishlist } from "../hooks/helperFunctions";

export default function AccountModal({ type, isOpen, setIsOpen, setType }) {
  //login field references
  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();

  //signup field references
  const signupEmailRef = useRef();
  const signupPasswordRef = useRef();
  const signupPasswordConfirmRef = useRef();

  //values provided from authContext
  const { signup, login, currentUser } = useAuth();
  const {setWishlist} = useGlobalState();

  //loading and error states for login and signup requests
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //handles signup - checks for valid email input as well as if both passwords entered match and calls the signup function when both conditions are met
  async function handleSignupSubmit(e) {
    e.preventDefault();

    if (
      signupPasswordRef.current.value !== signupPasswordConfirmRef.current.value
    ) {
      return setError("Passwords do not match");
    }
    if (!signupEmailRef.current.value.includes("@")) {
      return setError("Must be a valid email address");
    }

    try {
      setError("");
      setLoading(true);
      const sign = await signup(
        signupEmailRef.current.value,
        signupPasswordRef.current.value
      );
      await postUserProfile(sign.user);
      handleCloseModal();
    } catch (err) {
      setError("failed to create account");
    } finally {
      setLoading(false);
    }
  }

  //handles login - calls the login function with email and password entered
  async function handleLoginSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const log = await login(
        loginEmailRef.current.value,
        loginPasswordRef.current.value
      );
      const wishlist = await getUserWishlist(log.user);
      setWishlist(wishlist);
      handleCloseModal();
    } catch {
      setError("failed to login");
    } finally {
      setLoading(false);
    }
  }
  //closes the modal and sets error back to default value
  function handleCloseModal() {
    setIsOpen(false);
    setError("");
    setLoading(false);
  }

  //the login form that is rendered if modal state is in login
  const loginForm = (
    <div className="modal-body">
      <button className="form-btn close-btn" onClick={handleCloseModal}>
        Close
      </button>

      <h2 className="modal-title">Login</h2>
      {error ? <p className="alert">{error}</p> : null}
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

        <button className="form-btn" id="forgot-btn" type="submit">
          Forgot Password
        </button>

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
      {error ? <p className="alert">{error}</p> : null}
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
          disabled={loading}
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
    } else {
      return loginForm;
    }
  }
  //if the modal is open render the modal else render nothing
  if (isOpen) {
    return <div className="account-modal">{renderAccountForm()}</div>;
  } else {
    return null;
  }
}
