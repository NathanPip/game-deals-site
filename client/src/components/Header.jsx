import React, { useEffect, useRef, useState } from "react";
import AccountModal from "./AccountModal.jsx";
import { useAuth } from "../contexts/authContext.jsx";
import { useGlobalState } from "../contexts/globalContext.jsx";
import Wishlist from "./Wishlist";

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const { currentUser, signout } = useAuth();
  const { setWishlist, setSelectedGame } = useGlobalState();
  const navRef = useRef();

  useEffect(() => {
    window.removeEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  function handleScroll() {
    const scrollTop = window.scrollY;
    console.log(scrollTop + " : " + lastScrollTop);
    if (scrollTop > lastScrollTop && window.innerWidth < 800) {
      navRef.current.style.top = "-3.5em";
    } else {
      navRef.current.style.top = "0";
    }
    setLastScrollTop(scrollTop);
  }

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
          {/* <p className="user-email">
            {currentUser ? `Signed in as ${currentUser.email}` : ""}
          </p> */}
          <button className="form-btn signup" onClick={handleSignout}>
            Sign Out
          </button>
          <Wishlist setSelected={setSelectedGame} />
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
      <div ref={navRef} className="main__nav">
        <h2 className="nav__brand">
          <span>P</span>
        </h2>
        {renderButtons()}
      </div>
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
