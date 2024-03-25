import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser, loginUser } from "../../utils/UserAccount";
import { auth } from "../../utils/firebase";
import "./Login.css";
import React from "react";
const electronApi = window?.electronApi;

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission

    if (!username.includes("@")) {
      electronApi.sendShowAlertSignamToMain([
        "Ooops!!",
        "Entered Email is Invalid",
      ]);
      return;
    }

    await loginUser(username, password).catch((e) => {
      const errorMessage = e.message;
      const errorCode = errorMessage.match(/\(auth\/([^)]+)\)/)[1];
      const formattedErrorCode = errorCode.replace(/-/g, " ");
      const message =
        formattedErrorCode.charAt(0).toUpperCase() +
        formattedErrorCode.slice(1);
      electronApi.sendShowAlertSignamToMain(["Ooops!!", message]);
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
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        <p>Welcome to Synk</p>
        <div className="form-group">
          <label htmlFor="username">Email:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <div className="reset">
          <Link to="" className="forgot-password">
            Forgot Password? Reset
          </Link>
        </div>

        <div className="form-group">
          <Link to="/createAccount" className="create-account-link">
            Create an Account
          </Link>
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
}

function getPreviousSetting(name) {
  let setting = localStorage.getItem(name);
  if (setting === "true") {
    return true;
  } else {
    return false;
  }
}

export default Login;
