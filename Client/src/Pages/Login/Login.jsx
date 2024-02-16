import React, { useState } from "react";
import {Link} from "react-router-dom"

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Here you can perform authentication logic, like sending a request to your backend
    // For simplicity, let's just check if the username and password match
    if (username === "admin" && password === "password") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="tw-w-screen tw-h-screen tw-text-white">
      {isLoggedIn ? (
        <h1>Welcome, {username}!</h1>
      ) : (
        <form onSubmit={handleLogin}>
          <p>Login</p>
          <p>Welcome back to Synk</p>
          <label>
            Email:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <Link to="/createAccount">Link to create Account?</Link>
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
}

export default Login;
