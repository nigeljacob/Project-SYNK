import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css"; 
import { loginUser } from "../../Backend/UserAccount";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    if(!username.includes("@")) {
      return alert("Invalid Email");
    }

    await loginUser(username, password).catch(e => {
      alert("Invalid email or password")
    })

    e.preventDefault(); // Prevent form submission
  };

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
          <Link to="/passwordchange" className="forgot-password">
            Forgot Password? Reset
          </Link>
        </div>

        <div className="form-group">
          <Link to="/createAccount" className="create-account-link">
            Create an Account
          </Link>
        </div>
        

        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
}

export default Login;

