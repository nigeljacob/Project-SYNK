import React, { useState } from "react";
import * as MDIcons from "react-icons/md";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Activity from "./Pages/MainActivity/Activity";
import Chat from "./Pages/MainChat/Chats";
import Teams from "./Pages/MainTeamsPage/Teams";
import TeamDashboard from "./Pages/TeamDashboard/TeamDashboard";
import SideBar from "./layout/SideNavBar/SideBar";
import Login from "./Pages/Login/Login";
import CreateAccount from "./Pages/CreateAccount/CreateAccount";
import { getCurrentUser } from "../../Backend/src/UserAccount";

let result = "";

function App() {
  const [user, setUser] = useState("Nigel");

  const handleLogin = (user) => {
    setUser(user);
  };

  const detectOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/Mac/i.test(userAgent)) {
      result = "settingsButtonMac";
    } else {
      result = "settingsButtonWindows";
    }
  };

  detectOS();

  if (user == null) {
    return (
      <>
        <div className="titleBar"></div>
        <Router>
          <Routes>
            <Route path="/" exact element={<Login />} />
            <Route path="/createAccount" element={<CreateAccount />} />
          </Routes>
        </Router>
      </>
    );
  } else {
    console.log(user);
    return (
      <>
        <div className="titleBar"></div>
        <div className="main" id="main">
          <Router>
            <SideBar />
            <Routes>
              <Route path="/" exact element={<Activity />} />
              <Route path="/Chats" element={<Chat />} />
              <Route path="/Teams" element={<Teams />} />
              <Route path="/memberDashboard" element={<TeamDashboard user={user}/>} />
            </Routes>
          </Router>
          <div className={result}>
            <MDIcons.MdOutlineSettings className="SettingIcon" />
          </div>
        </div>
      </>
    );
  }
}

export default App;
