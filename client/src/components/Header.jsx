import React, { useState } from "react";
import AccountModal from "./AccountModal.jsx";
import { useAuth } from "../contexts/authContext.jsx";
import { useGlobalState } from "../contexts/globalContext.jsx";

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const { currentUser, signout } = useAuth();
  const { setWishlist } = useGlobalState();

  function handleAccountButtonClick(type) {
    setModalOpen(true);
    setModalType(type);
  }

  function handleSignout() {
    setWishlist([]);
    signout();
  }

  function renderButtons() {
    if (currentUser) {
      return (
        <div className="login-btn-group">
          <p className="user-email">
            {currentUser ? `Signed in as ${currentUser.email}` : ""}
          </p>
          <button className="form-btn signup" onClick={handleSignout}>
            Sign Out
          </button>
        </div>
      );
    } else {
      return (
        <div className="login-btn-group">
          <button
            className="form-btn login"
            onClick={() => handleAccountButtonClick("login")}
          >
            Login
          </button>
          <button
            className="form-btn signup"
            onClick={() => handleAccountButtonClick("signup")}
          >
            Sign Up
          </button>
        </div>
      );
    }
  }

  return (
    <header>
      {/* login/Signup buttons */}
      {renderButtons()}
      {/* main heading */}
      <h1 className="title">Player's Plug</h1>
      <AccountModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        type={modalType}
        setType={setModalType}
      />
    </header>
  );
}
