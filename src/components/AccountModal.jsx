import React from "react";

export default function AccountModal({ type, isOpen, setIsOpen, setType }) {
  const loginForm = (
    <div className="modal-body">
      <button className="form-btn close-btn" onClick={() => setIsOpen(false)}>
        Close
      </button>
      <h2 className="modal-title">Login</h2>
      <form className="account-form login">
        <label htmlFor="email">Email</label>
        <input
          className="account-form-input login"
          id="email"
          type="email"
          placeholder="email@email.com"
        ></input>

        <label htmlFor="password">Password</label>
        <input
          className="account-form-input login"
          id="password"
          type="password"
          placeholder="password"
        ></input>
        <button className="form-btn" id="forgot-btn" type="submit">
          Forgot Password
        </button>
        <button className="form-submit-btn" id="login-btn" type="submit">
          Login
        </button>
      </form>
      <p className="form-redirect" onClick={()=>setType("signup")}>Don't have an account? Sign Up</p>
    </div>
  );

  const signupForm = (
    <div className="modal-body">
      <button className="form-btn close-btn" onClick={() => setIsOpen(false)}>
        Close
      </button>
      <h2 className="modal-title">Sign Up</h2>
      <form className="account-form signup">
        <label htmlFor="email">Email</label>
        <input
          className="account-form-input signup"
          id="email"
          type="email"
          placeholder="email@email.com"
        ></input>

        <label htmlFor="password">Password</label>
        <input
          className="account-form-input signup"
          id="password"
          type="password"
          placeholder="password"
        ></input>
        <button className="form-submit-btn" id="signup-btn" type="submit">
          Signup
        </button>
      </form>
      <p className="form-redirect" onClick={()=>setType("login")}>Already have an account? Login</p>
    </div>
  );

  if (isOpen) {
    return <div className="account-modal">{type==="signup" ? signupForm : loginForm}</div>;
  } else {
      return null;
  }
}
