import React, {useState} from "react";
import AccountModal from "./AccountModal";


export default function Header() {

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

    const handleAccountButtonClick = (type) => {
        setModalOpen(true);
        setModalType(type);
    }


  return (
    <header>
      {/* login/Signup buttons */}
      <div className="login-btn-group">
        <button className="form-btn login" onClick={()=>handleAccountButtonClick('login')}>Login</button>
        <button className="form-btn signup" onClick={()=>handleAccountButtonClick('signup')}>Sign Up</button>
      </div>
      {/* main heading */}
      <h1 className="title">Player's Plug</h1>
      <AccountModal isOpen={modalOpen} setIsOpen={setModalOpen} type={modalType} setType={setModalType}/>
    </header>
  );
}
