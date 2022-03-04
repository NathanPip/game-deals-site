import React, { useContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "@firebase/auth";
import { auth } from "../firebase";

export const AuthContext = React.createContext();

//a hook to easily access all values within authcontext
export const useAuth = () => {
  return useContext(AuthContext);
};


export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState();
    //sets the current user whenever authprovider is called
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe;
  }, []);

  //signup function for user - signs user up
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  //login function - signs user in if valid credentials are inputed
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }
//signout function -- signs currentUser out
  function signout() {
      return signOut(auth);
  }

  const value = {
    currentUser,
    signup,
    signout,
    login
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
