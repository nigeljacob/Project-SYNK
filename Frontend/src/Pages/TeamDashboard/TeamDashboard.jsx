import React, { useState } from "react";
import * as IOIcons from "react-icons/io";
import "../MainActivity/Activity.css";
import "./TeamDashboard.css";
import { useLocation } from "react-router";
import TeamMemberDashboard from "./TeamMemberActivity/TeamMemberDashboard";
import Chat from "./TeamChat/TeamChat";
import TeamYourProgress from "./TeamPersonalProgress/TeamYourProgress";
import TeamLeaderDashboard from "./TeamLeaderActivity/TeamLeaderDashboard";
import reactElementToJSXString from "react-element-to-jsx-string";
import { Button } from "../../shadCN-UI/ui/button";
import AssignTask from "../../components/AssignTaskComponent/AssignTask";
import ViewTask from "../../components/ViewTaskComponent/ViewTask";

const TeamDashboard = ({ user }) => {
  const [assignTaskPopup, setAssignTaskPopup] = useState(false);
  const [viewTaskPopup, setViewTaskPopup] = useState(false);

  const [isAssignTaskOpen, setAssignTaskOpen] = useState(false);
  const [isViewTaskOpen, setViewTaskOpen] = useState(false);

  var buttonClass =
    "tw-w-7 tw-h-7 tw-mr-[10px] tw-cursor-pointer hover:tw-text-[#5bceff]";

  const location = useLocation();
  const state = location.state;
  const currentTeam = state["Team"];

  let teamMembersList = currentTeam._teamMemberList;

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
      } else if (reactElementToJSXString(element) === "<TeamChat />") {
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
      element: <Chat />,
      className: "teamChat",
    },
    {
      title: "Your Progress",
      element: <TeamYourProgress />,
      className: "teamProgress",
    },
  ];

  let dashboard = <TeamLeaderDashboard team = {currentTeam} sideBarStatus = {isOpen}/>;

  if (currentUser === currentTeam._teamLeader) {
    infoData[0]["element"] = (
      <TeamLeaderDashboard
        viewTaskTrigger={viewTaskPopup}
        setViewTaskTrigger={setViewTaskPopup}
        team = {currentTeam}
        sideBarStatus = {isOpen}
      />
    );
    dashboard = (
      <TeamLeaderDashboard
        viewTaskTrigger={viewTaskPopup}
        setViewTaskTrigger={setViewTaskPopup}
        team = {currentTeam}
        sideBarStatus = {isOpen}
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
    <div className="teamDashboard">
      <div className={SideBarResult + " sidebar-main"}>
        <h2>{currentTeam._teamName}</h2>
        <p className="members">{currentTeam._teamMemberList.length} Members</p>
        <p className="info-text">info</p>

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
                document.getElementById("teamActivity").style.color = "#ffffff";
                document
                  .getElementById("teamActivity")
                  .querySelector("#dot").style.visibility = "hidden";
              } else if (reactElementToJSXString(element) === "<TeamChat />") {
                document.getElementById("teamChat").style.color = "#ffffff";
                document
                  .getElementById("teamChat")
                  .querySelector("#dot").style.visibility = "hidden";
              } else if (
                reactElementToJSXString(element) === "<TeamYourProgress />"
              ) {
                document.getElementById("teamProgress").style.color = "#ffffff";
                document
                  .getElementById("teamProgress")
                  .querySelector("#dot").style.visibility = "hidden";
              }

              handleItemClick(info.element);
            }}
          >
            <div className="barContent">
              <p className="side-text text-left margin-left">{info.title}</p>
              <div className="dot" id="dot"></div>
            </div>
            <div className="line margin-left"></div>
          </div>
        ))}

        <div className="text-left margin-left margin-top">
          <h2 className="">Members</h2>

          <div className="line"></div>

          {teamMembersList.map((info) => (
            <>
              <div className="memberContainer tw-flex tw-items-center tw-w-full tw-justify-between">
                {info === currentTeam._teamLeader ? (
                  <h3 className="Leader">{info} (L)</h3>
                ) : (
                  <p className="side-text">{info}</p>
                )}
                <IOIcons.IoIosAdd
                  className={buttonClass}
                  onClick={(event) => {
                    let popupLayout = document.getElementById("popupLayout");
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
          isAssignTaskOpen ? "popupLayout show_popup" : "popupLayout hide_popup"
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
          viewTaskPopup ? "popupLayout show_popup" : "popupLayout hide_popup"
        }
        id="popupLayout2"
      >
        <ViewTask
          trigger={viewTaskPopup}
          setTrigger={setViewTaskPopup}
        ></ViewTask>
      </div>
    </div>
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