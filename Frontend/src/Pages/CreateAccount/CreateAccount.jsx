import { useState } from "react";
import { Link } from "react-router-dom";
import {
  createUser,
  getCurrentUser,
} from "../../../../Backend/src/UserAccount";
import { auth } from "../../../../Backend/src/firebase";
import "./CreateAccount.css";

import React, { useEffect } from "react";

const CreateAccount = (props) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission

    if (!email.includes("@")) {
      electronApi.sendShowAlertSignamToMain(["Ooops!!", "Entered Email is Invalid"])
      return
    }

    await createUser(email, password, firstName).catch((e) => {
      const errorMessage = e.message;
      const errorCode = errorMessage.match(/\(auth\/([^)]+)\)/)[1]; 
      const formattedErrorCode = errorCode.replace(/-/g, ' ');
      const message = formattedErrorCode.charAt(0).toUpperCase() + formattedErrorCode.slice(1);
      electronApi.sendShowAlertSignamToMain(["Ooops!!", message])
      return;
    });

    if (auth.currentUser != null) {
      props.setIsLoggedIn(true);
      localStorage.setItem("loggedIN", "true");
      localStorage.setItem("currentUser", getCurrentUser);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      auth.onAuthStateChanged(props.setUser);
    }, 500);
  }, []);

  return (
    <div className="create-account-container">
      <form onSubmit={handleSubmit} className="create-account-form">
        <h2>Create New Account</h2>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="tw-flex tw-flex-col ">
          <button type="submit" className="create-account-btn">
            Create Your Account
          </button>
          <Link to="/" className="back-to-login-link tw-mt-[10px] tw-underline">
            Go back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
