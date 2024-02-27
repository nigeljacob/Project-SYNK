import { useEffect, useState } from "react";
import * as MDIcons from "react-icons/md";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { getCurrentUser } from "../../Backend/src/UserAccount";
import { auth } from "../../Backend/src/firebase";
import "./App.css";
import CreateAccount from "./Pages/CreateAccount/CreateAccount";
import Loading from "./Pages/LoadingPage/LoadingPage";
import Login from "./Pages/Login/Login";
import Activity from "./Pages/MainActivity/Activity";
import Chat from "./Pages/MainChat/Chats";
import Teams from "./Pages/MainTeamsPage/Teams";
import TeamDashboard from "./Pages/TeamDashboard/TeamDashboard";
import noWifi from "./assets/images/noWifi.png";
import SideBar from "./layout/SideNavBar/SideBar";

import React from "react";

let result = "";

function App() {
  let loggedIn = false;

  try {
    loggedIn = getPreviousSetting("loggedIN");
  } catch (e) {
    loggedIn = true;
  }

  const [user, setUser] = useState(getCurrentUser);

  useEffect(() => {
    setTimeout(() => {
      auth.onAuthStateChanged(setUser);
    }, 500);
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);

  const [isLogoutClicked, setLoggedOutClicked] = useState(false);

  const [isOnline, setOnline] = useState(false);

  function checkConnection() {
    if (navigator.onLine) {
      if (!isOnline) {
        setOnline(true);
      }
    } else {
      if (isOnline) {
        setOnline(false);
      }
    }
  }
  checkConnection();
  setInterval(checkConnection, 1000);

  const handleItemClick = (boolean) => {
    setLoggedOutClicked(boolean);
  };

  useEffect(() => {
    if (isLogoutClicked) {
      handleItemClick(false);
      localStorage.setItem("loggedIN", "false");
      auth.signOut();
      setTimeout(() => {
        window.location.reload(false);
      }),
        2000;
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

  if (user == null && loggedIn) {
    return (
      <>
        <Loading message="Loading contents" background = {true} />
      </>
    );
  }

  else if (user === null && !isLoggedIn) {
    return (
      <>
        <div className="titleBar"></div>
        <Router>
          <Routes>
            <Route
              path="/"
              exact
              element={
                <Login setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
              }
            />
            <Route
              path="/createAccount"
              element={
                <CreateAccount
                  setUser={setUser}
                  setIsLoggedIn={setIsLoggedIn}
                />
              }
            />
          </Routes>
        </Router>
      </>
    );
  } else if(user != null && isLoggedIn) {
    return (
      <>
        {isLogoutClicked ? (
          <Loading message="signing out"  background = {true}/>
        ) : (
          <div className="mainFrame" id="mainFrame">
            <div className="titleBar"></div>
            <div className="main" id="main">
              <Router>
                <SideBar user={user} />
                <Routes>
                  <Route
                    path="/"
                    exact
                    element={<Activity user={user} />}
                  />
                  <Route path="/Chats" element={<Chat />} />
                  <Route path="/Teams" element={<Teams />} />
                  <Route
                    path="/memberDashboard"
                    element={<TeamDashboard user={user} />}
                  />
                </Routes>
              </Router>
              <div className={result}>
                <MDIcons.MdOutlineSettings
                  className="SettingIcon"
                  onClick={(event) => {
                    confirm("Are you sure you want to Sign out")
                      ? handleItemClick(true)
                      : null;
                  }}
                />
              </div>

              {!isOnline ? (
                <div className="tw-absolute tw-z-[2000] tw-flex tw-justify-center tw-items-center tw-flex-col tw-w-screen tw-h-screen tw-bg-[rgba(0,0,0,0.85)] wifi">
                  <img
                    src={noWifi}
                    alt="wifi_connection_failed"
                    className="tw-mt-[-20px]"
                  />
                  <h1 className="tw-mt-[-50px]">
                    <b>Lost Connection</b>
                  </h1>
                  {result === "settingsButtonMac" ? (
                    <h3 className="tw-text-[#A7A7A7]">
                      Your Mac seems to be disconnected from WI-FI
                    </h3>
                  ) : (
                    <h3 className="tw-text-[#A7A7A7]">
                      Your PC seems to be disconnected from WI-FI
                    </h3>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </>
    );
  }
}

function getPreviousSetting(name) {
  let setting = localStorage.getItem(name);
  if (setting === "true") {
    return true;
  } else {
    return false;
  }
}

export default App;
