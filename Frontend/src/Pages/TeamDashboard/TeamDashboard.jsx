import React, { useEffect, useState } from "react";
import reactElementToJSXString from "react-element-to-jsx-string";
import * as IOIcons from "react-icons/io";
import { useLocation } from "react-router";
import {
  acceptMembers,
  fetchPendingInvites,
} from "../../../../Backend/src/teamFunctions";
import AssignTask from "../../components/AssignTaskComponent/AssignTask";
import ViewTask from "../../components/ViewTaskComponent/ViewTask";
import Loading from "../LoadingPage/LoadingPage";
import "../MainActivity/Activity.css";
import Chat from "./TeamChat/TeamChat";
import "./TeamDashboard.css";
import TeamLeaderDashboard from "./TeamLeaderActivity/TeamLeaderDashboard";
import TeamMemberDashboard from "./TeamMemberActivity/TeamMemberDashboard";
import TeamYourProgress from "./TeamPersonalProgress/TeamYourProgress";
import { read_OneValue_from_Database, read_from_Database_onChange } from "../../../../Backend/src/firebaseCRUD";
import { auth } from "../../../../Backend/src/firebase";

const TeamDashboard = ({ user }) => {
  const [assignTaskPopup, setAssignTaskPopup] = useState(false);
  const [viewTaskPopup, setViewTaskPopup] = useState(false);

  const [isAssignTaskOpen, setAssignTaskOpen] = useState(false);
  const [isViewTaskOpen, setViewTaskOpen] = useState(false);

  let [isLoading, setLoading] = useState(false);

  const handlLoad = (boolean) => {
    setLoading(boolean);
  };

  var buttonClass =
    "tw-w-7 tw-h-7 tw-mr-[10px] tw-cursor-pointer hover:tw-text-[#5bceff]";

  const location = useLocation();
  const state = location.state;
  const [currentTeam, setCurrentTeam] = useState(state["Team"]);

  useEffect(() => {

    // update when there is a change
    read_OneValue_from_Database("Teams/" + auth.currentUser.uid + "/" + currentTeam.teamCode, (data) => {
        setCurrentTeam(data)
    })

  }, [])

  const [pendingInvites, setPendingInvites] = useState(
    currentTeam.teamPendingInvites
  );

  useEffect(() => {
    const onDataReceived = (data) => {
      setPendingInvites(data);
    };
    fetchPendingInvites(onDataReceived, currentTeam.teamCode);
  }, []);

  const handleAcceptMembers = (info, index) => {
    acceptMembers(info, currentTeam.teamCode);
  };

  let sideBarStatus = true;

  const [selectedUser, setSelectedUser] = useState("");

  var currentUser = user;

  try {
    sideBarStatus = getPreviousSetting("sideBarStatus");
  } catch (e) {
    sideBarStatus = true;
  }

  const [isOpen, setIsOpen] = useState(sideBarStatus);
  const SideBarResult = isOpen
    ? "sideBar show_SideBar"
    : "sideBar hide_SideBar";
  const MainContentResult = isOpen
    ? "activityContent bringBackMainContent"
    : "activityContent extendMainContent";
  const IconResult = isOpen ? "rotateIcon0" : "rotateIcon180";

  const handleItemClick = (element) => {
    setElement(element);
    try {
      if (
        reactElementToJSXString(element).includes("<TeamMemberDashboard") ||
        reactElementToJSXString(element).includes("<TeamLeaderDashboard")
      ) {
        document.getElementById("teamActivity").style.color = "#5bceff";
        document
          .getElementById("teamActivity")
          .querySelector("#dot").style.visibility = "visible";
      } else if (reactElementToJSXString(element).includes("<TeamChat")) {
        document.getElementById("teamChat").style.color = "#5bceff";
        document
          .getElementById("teamChat")
          .querySelector("#dot").style.visibility = "visible";
      } else if (reactElementToJSXString(element) === "<TeamYourProgress />") {
        document.getElementById("teamProgress").style.color = "#5bceff";
        document
          .getElementById("teamProgress")
          .querySelector("#dot").style.visibility = "visible";
      }
    } catch (e) {}
  };

  const infoData = [
    {
      title: "Team Activity",
      element: (
        <TeamMemberDashboard
          viewTaskTrigger={viewTaskPopup}
          setViewTaskTrigger={setViewTaskPopup}
        />
      ),
      className: "teamActivity",
    },
    {
      title: "Chat",
      element: <Chat user={user} team={currentTeam} />,
      className: "teamChat",
    },
    {
      title: "Your Progress",
      element: <TeamYourProgress />,
      className: "teamProgress",
    },
  ];

  let dashboard = (
    <TeamLeaderDashboard team={currentTeam} sideBarStatus={isOpen} />
  );

  if (currentUser.uid === currentTeam["teamLeader"]["UID"]) {
    infoData[0]["element"] = (
      <TeamLeaderDashboard
        viewTaskTrigger={viewTaskPopup}
        setViewTaskTrigger={setViewTaskPopup}
        team={currentTeam}
        sideBarStatus={isOpen}
      />
    );
    dashboard = (
      <TeamLeaderDashboard
        viewTaskTrigger={viewTaskPopup}
        setViewTaskTrigger={setViewTaskPopup}
        team={currentTeam}
        sideBarStatus={isOpen}
      />
    );
    buttonClass =
      "tw-w-7 tw-h-7 tw-mr-[10px] tw-cursor-pointer hover:tw-text-[#5bceff]";
  } else {
    infoData[0]["element"] = (
      <TeamMemberDashboard
        viewTaskTrigger={viewTaskPopup}
        setViewTaskTrigger={setViewTaskPopup}
      />
    );
    dashboard = (
      <TeamMemberDashboard
        viewTaskTrigger={viewTaskPopup}
        setViewTaskTrigger={setViewTaskPopup}
      />
    );
    buttonClass =
      "tw-w-7 tw-h-7 tw-mr-[10px] tw-cursor-pointer hover:tw-text-[#5bceff] hide_Button";
  }

  const [element, setElement] = useState(dashboard);

  return (
    <>
      {isLoading ? (
        <Loading message="Loading Team Details" />
      ) : (
        <div className="teamDashboard">
          <div className={SideBarResult + " sidebar-main"}>
            <p className="tw-text-[20px]">{currentTeam["teamName"]}</p>
            <p className="info-text">{currentTeam.teamCode}</p>

            <p className="members">
              {currentTeam["teamMemberList"].length} Members
            </p>
            <div className="line margin-left"></div>

            {infoData.map((info) => (
              <div
                className={info.className}
                id={info.className}
                onClick={(event) => {
                  console.log(reactElementToJSXString(element));
                  if (
                    reactElementToJSXString(element).includes(
                      "<TeamMemberDashboard"
                    ) ||
                    reactElementToJSXString(element).includes(
                      "<TeamLeaderDashboard"
                    )
                  ) {
                    document.getElementById("teamActivity").style.color =
                      "#ffffff";
                    document
                      .getElementById("teamActivity")
                      .querySelector("#dot").style.visibility = "hidden";
                  } else if (
                    reactElementToJSXString(element).includes("<TeamChat")
                  ) {
                    document.getElementById("teamChat").style.color = "#ffffff";
                    document
                      .getElementById("teamChat")
                      .querySelector("#dot").style.visibility = "hidden";
                  } else if (
                    reactElementToJSXString(element) === "<TeamYourProgress />"
                  ) {
                    document.getElementById("teamProgress").style.color =
                      "#ffffff";
                    document
                      .getElementById("teamProgress")
                      .querySelector("#dot").style.visibility = "hidden";
                  }

                  handleItemClick(info.element);
                }}
              >
                <div className="barContent">
                  <p className="side-text text-left margin-left">
                    {info.title}
                  </p>
                  <div className="dot" id="dot"></div>
                </div>
                <div className="line margin-left"></div>
              </div>
            ))}

            <div className="text-left margin-left margin-top">
              <h2>Members</h2>

              <div className="line"></div>

              {currentTeam["teamMemberList"].map((info) => (
                <>
                  <div className="memberContainer tw-flex tw-items-center tw-w-full tw-justify-between">
                    {info.UID === currentTeam.teamLeader.UID ? (
                      <h3 className="Leader">{info.name} (L)</h3>
                    ) : (
                      <p className="side-text">{info.name}</p>
                    )}
                    <IOIcons.IoIosAdd
                      className={buttonClass}
                      onClick={(event) => {
                        let popupLayout =
                          document.getElementById("popupLayout");
                        if (isAssignTaskOpen) {
                          popupLayout.style.background = "rgba(0,0,0,0)";
                        } else {
                          popupLayout.style.visibility = "visible";
                          setTimeout(() => {
                            popupLayout.style.background = "rgba(0,0,0,0.7)";
                          }, 100);
                        }

                        setAssignTaskOpen(!isAssignTaskOpen);
                        setAssignTaskPopup(true);
                        setSelectedUser(info);
                      }}
                    />
                  </div>
                  <div className="line"></div>
                </>
              ))}

              {pendingInvites[0] !== "" && (
                <>
                  <h2 className="tw-mt-[50px] tw-mb-[10px]">Pending Invites</h2>

                  {pendingInvites.map((info, index) => (
                    <div className="tw-w-full">
                      <div className="line"></div>
                      <div className="memberContainer tw-flex tw-items-center tw-w-full tw-justify-between">
                        <p className="side-text">{info.name}</p>
                        <button
                          className="tw-py-[5px] tw-px-[10px] tw-cursor-pointer tw-bg-[#5bceff] tw-text-black tw-mr-[15px] tw-text-[12px] tw-rounded-lg"
                          onClick={(event) => {
                            handleAcceptMembers(info, index);
                          }}
                        >
                          Accept
                        </button>
                      </div>
                      <div className="line"></div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div
              className="closeButton"
              onClick={(event) => {
                setIsOpen(!isOpen);
                sidebarToggler(!isOpen);
              }}
            >
              <IOIcons.IoMdArrowDropleft className={IconResult} />
            </div>
          </div>

          <div className={MainContentResult}>{element}</div>

          <div
            className={
              isAssignTaskOpen
                ? "popupLayout show_popup"
                : "popupLayout hide_popup"
            }
            id="popupLayout"
          >
            <AssignTask
              trigger={assignTaskPopup}
              setTrigger={setAssignTaskOpen}
              currentUser={selectedUser}
            />
          </div>
          <div
            className={
              viewTaskPopup
                ? "popupLayout show_popup"
                : "popupLayout hide_popup"
            }
            id="popupLayout2"
          >
            <ViewTask
              trigger={viewTaskPopup}
              setTrigger={setViewTaskPopup}
            ></ViewTask>
          </div>
        </div>
      )}
    </>
  );
};

function sidebarToggler(boolean) {
  if (boolean === true) {
    localStorage.setItem("sideBarStatus", "true");
  } else {
    localStorage.setItem("sideBarStatus", "false");
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

export default TeamDashboard;
