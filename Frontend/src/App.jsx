import React, { useState, useEffect } from "react";
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
import { getCurrentUser, loginUser } from "../../Backend/src/UserAccount";
import { auth } from "../../Backend/src/firebase";
import Loading from "./Pages/LoadingPage/LoadingPage";
import { confirmAlert } from "react-confirm-alert";

let result = "";

function App()  {

  let loggedIn = false;

  try{
    loggedIn = getPreviousSetting("loggedIN");
  } catch(e) {
    loggedIn = true;
  }
  
  const [user, setUser] = useState(getCurrentUser);

  useEffect(() => {
    setTimeout(() => {
     auth.onAuthStateChanged(setUser)
     
    }, 500)
   }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);

  const [isLogoutClicked, setLoggedOutClicked] = useState(false)

  const handleItemClick = (boolean) => {
    setLoggedOutClicked(boolean)
  }

  const handleLogin = (value) => {
    setUser(value);
  }

  useEffect(() => {
    if (isLogoutClicked) {
      handleItemClick(false)
      localStorage.setItem("loggedIN", "false")
      auth.signOut();
      setTimeout(() => {
        window.location.reload(false)
      }), 2000
    }
  }, [isLogoutClicked]);


  const detectOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/Mac/i.test(userAgent)) {
      result = "settingsButtonMac";
    } else {
      result = "settingsButtonWindows";
    }
  };

  detectOS();

  if(user == null && loggedIn) {
    return(
      <>
        <Loading message = "Loading contents"/>
      </>
    )
  }

  if (user === null && !isLoggedIn) {

    return (
      <>
        <div className="titleBar"></div>
        <Router>
          <Routes>
            <Route path="/" exact element={<Login setUser={setUser} setIsLoggedIn={setIsLoggedIn}/>} />
            <Route path="/createAccount" element={<CreateAccount />} />
          </Routes>
        </Router>
      </>
    );
  } else {

    return (
      <>
        {isLogoutClicked ? (
          <Loading message="signing out" />
        ) : (
          <div className="mainFrame" id="mainFrame">
            <div className="titleBar"></div>
            <div className="main" id="main">
              <Router>
                <SideBar user={user == null ? "" : user} />
                <Routes>
                  <Route path="/" exact element={<Activity user={user == null ? "" : user} />} />
                  <Route path="/Chats" element={<Chat />} />
                  <Route path="/Teams" element={<Teams />} />
                  <Route path="/memberDashboard" element={<TeamDashboard user={user} />} />
                </Routes>
              </Router>
              <div className={result}>
                <MDIcons.MdOutlineSettings className="SettingIcon" onClick={event => {
                  confirm("Are you sure you want to Sign out") ? handleItemClick(true) : null
                }} />
              </div>
            </div>
          </div>
        )}
      </>
    );    
  }
}

function getPreviousSetting(name) {
  let setting = localStorage.getItem(name);
  if(setting === "true") {
    return true
  } else {
    return false
  }
}

export default App;
