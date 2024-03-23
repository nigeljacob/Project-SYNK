import { useEffect, useState } from "react";
import * as MDIcons from "react-icons/md";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  HashRouter,
} from "react-router-dom";
import { getCurrentUser, getStatus, updateStatus } from "./utils/UserAccount";
import { auth } from "./utils/firebase";
import "./App.css";
import CreateAccount from "./Pages/CreateAccount/CreateAccount";
import Loading from "./Pages/LoadingPage/LoadingPage";
import Login from "./Pages/Login/Login";
import Activity from "./Pages/MainActivity/Activity";
import Chat from "./Pages/MainChat/Chats";
import Teams from "./Pages/MainTeamsPage/Teams";
import TeamDashboard from "./Pages/TeamDashboard/TeamDashboard";
import NotificationsCenter from "./Pages/Notifications/Notifications";
import noWifi from "./assets/images/noWifi.png";
import SideBar from "./layout/SideNavBar/SideBar";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Store } from "react-notifications-component";
import useSound from "use-sound";
import notificationSound from "./assets/Audio/notification.mp3";
import errorSound from "./assets/Audio/error.mp3";
import successSound from "./assets/Audio/success.mp3";
import React from "react";
import { deleteNotification, fetchNotification } from "./utils/teamFunctions";
import * as IOSIcons from "react-icons/io5";
import "./Pages/MainTeamsPage/Teams.css";
import ProfileSettings from "./Pages/ProfileSettings/ProfileSettings";
import {
  readOnceFromDatabase,
  read_OneValue_from_Database,
  updateDatabase,
} from "./utils/firebaseCRUD";
import { Tooltip } from "@mui/material";
import { uploadVersion } from "./utils/AssignTask/taskFunctions";
import { PauseTask } from "./utils/AssignTask/taskFunctions";
const electronApi = window?.electronApi;

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

  let Notifications = [];

  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);

  const [isLogoutClicked, setLoggedOutClicked] = useState(false);

  const [isOnline, setOnline] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const SideBarResult = isOpen
    ? "sideBarOpened tw-w-[300px] tw-bg-zinc-900 tw-absolute tw-right-0 tw-m-[20px] tw-rounded-[20px]"
    : "sideBarClosed tw-w-[300px] tw-bg-zinc-900 tw-absolute tw-right-0 tw-m-[20px] tw-rounded-[20px]";

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
      updateDatabase("Users/" + auth.currentUser.uid, {
        userStatus: "Offline",
      }).then(() => {
        setUser(null);
        auth.signOut();
        localStorage.setItem("loggedIN", "false");
        setIsLoggedIn(false);
        handleItemClick(false);
      });
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

  const [Status, setStatus] = useState("Offline");

  useEffect(() => {
    if (user != null) {
      getStatus(auth.currentUser.uid, (status) => {
        setStatus(status);
      });
    }
  }, []);

  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    let timer;

    const handleFocus = () => {
      clearTimeout(timer);
      setIsMinimized(false);
    };

    const handleBlur = () => {
      timer = setTimeout(() => {
        setIsMinimized(true);
      }, 100);
    };

    const handleBeforeUnload = () => {
      updateStatus("Offline");
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const [isAppClosing, setAppClosing] = useState(false);

  if (!isAppClosing) {
    if (!isLogoutClicked) {
      if (user != null) {
        if (isMinimized) {
          readOnceFromDatabase(
            "Users/" + auth.currentUser.uid + "/userStatus",
            (status) => {
              if (status != "Busy" && status != "Offline") {
                updateStatus("Away");
              }
            }
          );
        } else if (Status != "Busy") {
          readOnceFromDatabase(
            "Users/" + auth.currentUser.uid + "/userStatus",
            (status) => {
              if (status != "Busy") {
                updateStatus("Active");
              }
            }
          );
        }
      }
    }
  }

  useEffect(() => {
    try {
      electronApi.receiveStatusUpdateSignalFromMain((data) => {
        setAppClosing(true);
        setTimeout(() => {
          updateDatabase("Users/" + auth.currentUser.uid, {
            userStatus: "Offline",
          }).then(() => {
            electronApi.sendStatusUpdatedToMain("statusUpdated");
          });
        }, 1000);
      });
    } catch (e) {}
  }, []);

  useEffect(() => {
    electronApi.receiveTaskInformation((data) => {
      localStorage.setItem("taskDetails", JSON.stringify(data));
      console.log(data);
    });
  }, []);

  useEffect(() => {
    electronApi.receiveConfirmBoxResponseFromMain((data) => {
      handleItemClick(data);
    });
  }, []);

  const [currentlyWorkingApplication, setCurrentlyWorkingApplication] =
    useState("");

  useEffect(() => {
    electronApi.receiveStartTaskFromMain((data) => {
      if (
        data.currentlyTrackingApplication.appName != currentlyWorkingApplication
      ) {
        setCurrentlyWorkingApplication(
          data.currentlyTrackingApplication.appName
        );
        updateDatabase(
          "Teams/" +
            auth.currentUser.uid +
            "/" +
            data.team.teamCode +
            "/teamMemberList/" +
            data.teamMemberIndex +
            "/taskList/" +
            parseInt(data.taskIndex - 1) +
            "/progress",
          { lastApplication: data.currentlyTrackingApplication.appName }
        ).then(() => {
          updateDatabase(
            "Teams/" +
              data.team.teamLeader.UID +
              "/" +
              data.team.teamCode +
              "/teamMemberList/" +
              data.teamMemberIndex +
              "/taskList/" +
              parseInt(data.taskIndex - 1) +
              "/progress",
            { lastApplication: data.currentlyTrackingApplication.appName }
          );
        });
      }
    });
  }, []);

  useEffect(() => {
    electronApi.receiveUrlFromMain((data) => {
      let URL = data.URL;
      uploadVersion(
        URL,
        data.task,
        data.taskIndex,
        data.team,
        data.teamMemberIndex
      ).then(() => {
        electronApi.sendUploadVersion(data);
      });
    });
  }, []);

  useEffect(() => {
    electronApi.receivePauseStatusFromMain((data) => {
      PauseTask(
        data.task,
        parseInt(data.taskIndex - 1),
        data.team,
        data.teamMemberIndex,
        data.trackedApplications,
        (boolean) => {}
      );
    });
  }, []);

  let [notifications, setNotifications] = useState([]);

  const [playNotification] = useSound(notificationSound, { volume: 0.7 });
  const [playError] = useSound(errorSound, { volume: 0.7 });
  const [playSucces] = useSound(successSound, { volume: 0.7 });

  useEffect(() => {
    if (user != null) {
      try {
        let taskDetails =
          JSON.parse(
            localStorage.getItem(auth.currentUser.uid + "previousTask")
          ) || null;
        console.log(taskDetails);
        if (taskDetails != "") {
          PauseTask(
            taskDetails.task,
            parseInt(taskDetails.taskIndex - 1),
            taskDetails.team,
            taskDetails.teamMemberIndex,
            {},
            (boolean) => {}
          );
        }
      } catch (e) {}

      fetchNotification((notification) => {
        for (let i = 0; i < notification.length; i++) {
          if (
            notifications.some(
              (item) =>
                item.title === notification[i].title &&
                item.message === notification[i].message
            )
          ) {
          } else {
            if (notification.length < 5) {
              showNotification(
                notification[i]["title"],
                notification[i]["message"],
                notification[i]["type"]
              );
              if (Status === "Offline" || Status === "Busy") {
                try {
                  electronApi.sendNotificationToMain([
                    notification[i]["title"],
                    notification[i]["message"],
                  ]);
                } catch (e) {}
              }
            } else {
              if (i == 0) {
                showNotification(
                  notification.length + " New Notifications From SYNK",
                  "You can view all you notifications from the notification center",
                  "info",
                  auth.currentUser.uid
                );
                try {
                  electronApi.sendNotificationToMain([
                    notification.length + " New Notifications Found",
                    "You can view all you notifications from the notification center",
                  ]);
                } catch (e) {}
              }
            }
            setTimeout(() => {
              deleteNotification(notification, i);
            }, 50);
            if (
              notification[i].type != "success" &&
              notification[i].type != "danger" &&
              notification[i].type != "warning"
            ) {
              let notificationDict = { ...notification[i], seen: false };
              Notifications.push(notificationDict);
            }
          }
        }
        setNotifications(Notifications);
        try {
          let notificationsList = JSON.parse(
            localStorage.getItem(auth.currentUser.uid + "notifications") || "[]"
          );
          let newNotificationsList = [
            ...new Set([...notificationsList, ...Notifications]),
          ];
          let uniqueArray = newNotificationsList.filter(
            (value, index, self) =>
              index ===
              self.findIndex((t) => JSON.stringify(t) === JSON.stringify(value))
          );

          localStorage.setItem(
            auth.currentUser.uid + "notifications", JSON.stringify(uniqueArray
          ));
        } catch (e) {
          let uniqueArray = Notifications.filter(
            (value, index, self) =>
              index ===
              self.findIndex((t) => JSON.stringify(t) === JSON.stringify(value))
          );
          localStorage.setItem(auth.currentUser.uid + "notifications", JSON.stringify(uniqueArray));
        }

        try {
          let AllFeedList = Notifications.filter((notification) =>
            notification.notificationType.includes("feed")
          );
          let feedList = JSON.parse(localStorage.getItem(auth.currentUser.uid + "feedList") || "[]");
          let newFeedList = [...new Set([...feedList, ...AllFeedList])];
          let uniqueFeedList = newFeedList.filter(
            (value, index, self) =>
              index ===
              self.findIndex((t) => JSON.stringify(t) === JSON.stringify(value))
          );
          localStorage.setItem(auth.currentUser.uid + "feedList", JSON.stringify(uniqueFeedList));
        } catch (e) {
          let AllFeedList = Notifications.filter((notification) =>
            notification.notificationType.includes("feed")
          );
          let uniqueFeedList = AllFeedList.filter(
            (value, index, self) =>
              index ===
              self.findIndex((t) => JSON.stringify(t) === JSON.stringify(value))
          );
          localStorage.setItem(auth.currentUser.uid + "feedList", JSON.stringify(uniqueFeedList));
        }
      });
    }
  }, user);

  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (user != null) {
      read_OneValue_from_Database(
        "Users/" + auth.currentUser.uid,
        (UserData) => {
          setUserData(UserData);
        }
      );
    }
  }, user);

  const showNotification = (title, message, type) => {
    let duration = 5000;
    if (
      type === "success" ||
      title.includes("New Join Request @") ||
      title.includes("Task assigned @")
    ) {
      duration = 10000;
    } else if (type == "danger") {
      duration = 8000;
    }

    Store.addNotification({
      title: title,
      message: message,
      type: type,
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: duration,
        showIcon: true,
      },
    });

    if (type == "danger" || type == "warning") {
      playError();
    } else if (type == "success") {
      playSucces();
    } else {
      playNotification();
    }
  };

  if (user == null && loggedIn) {
    return (
      <>
        <Loading message="Loading contents" background={true} />
      </>
    );
  } else if (user === null && !isLoggedIn) {
    return (
      <>
        <div className="titleBar"></div>
        <HashRouter>
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
        </HashRouter>
      </>
    );
  } else if (user != null && isLoggedIn) {
    return (
      <>
        {isLogoutClicked ? (
          <Loading message="signing out" background={true} />
        ) : (
          <div className="mainFrame" id="mainFrame">
            <div className="titleBar"></div>
            <div className="tw-overflow-y-scroll">
              <ReactNotifications />
            </div>
            <div className="main" id="main">
              <HashRouter>
                <SideBar user={user} setOpen={setIsOpen} isOpen={isOpen} />
                <Routes>
                  <Route path="/" exact element={<Activity user={user} />} />
                  <Route path="/Chats" element={<Chat />} />
                  <Route path="/Teams" element={<Teams />} />
                  <Route
                    path="/memberDashboard"
                    element={<TeamDashboard user={user} />}
                  />
                  <Route
                    path="/notifications"
                    element={<NotificationsCenter className="notifications" />}
                  />
                  <Route
                    path="/profileUpdate"
                    element={
                      <ProfileSettings
                        user={user}
                        className="notifications"
                        userData={userData}
                      />
                    }
                  />
                </Routes>
              </HashRouter>
              <div className={result}>
                <Tooltip title="Logout">
                  <div>
                    <MDIcons.MdOutlineLogout
                      className="SettingIcon"
                      onClick={(event) => {
                        electronApi.sendConfirmBoxSignalToMain([
                          "Are your Sure..??",
                          "Are you sure you want to sign out..?",
                        ]);
                      }}
                    />
                  </div>
                </Tooltip>
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

              <div className={SideBarResult}>
                <IOSIcons.IoClose
                  className="tw-w-[30px] tw-h-[30px] tw-absolute tw-right-0 tw-cursor-pointer hover:tw-text-[#A7A7A7] tw-m-[30px]"
                  onClick={(event) => {
                    setIsOpen(!isOpen);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  } else {
    auth.signOut();
    localStorage.setItem("loggedIN", "false");
    window.location.reload();
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
