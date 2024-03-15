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
import UserComponent from "../../components/UserComponent/UserComponent";
import PieData1 from "../../components/PieChartComponent/PieData/PieData1"
import PieData2 from "../../components/PieChartComponent/PieData/PieData2"
import PieData3 from "../../components/PieChartComponent/PieData/PieData3"
import { all } from "axios";

const MemberComponent = ({ info, currentTeam, buttonClass, setTeamMemberIndex, setAssignTaskOpen, setAssignTaskPopup, setSelectedUser, index, isAssignTaskOpen}) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return(
    <>
    <div>
    <div className="memberContainer tw-flex tw-items-center tw-w-full tw-justify-between">
    {isHovering && <UserComponent UID={info.UID} type="Single" setTriger={setIsHovering}/>}
      {info.UID === currentTeam.teamLeader.UID ? (
        <h3 className="Leader tw-cursor-pointer" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>{info.name} (L)</h3>
      ) : (
        <p className="side-text tw-cursor-pointer" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>{info.name}</p>
      )}
      <IOIcons.IoIosAdd
        className={buttonClass}
        onClick={(event) => {
          setTeamMemberIndex(index)
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
  </div>
  </>
  )
};

const PendingMemberComponent = ({info, handleAcceptMembers, index}) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleIN = () => {
    setIsHovering(true);
  };

  const handleOut = () => {
    setIsHovering(false);
  };

  return (
  <div className="tw-w-full">
    <div className="line"></div>
    <div className="memberContainer tw-flex tw-items-center tw-w-full tw-justify-between">
      {isHovering && <UserComponent UID={info.UID} type="Single" setTriger={setIsHovering}/>}
      <p className="side-text tw-cursor-pointer" onMouseOver={handleIN} onMouseOut={handleOut}>{info.name}</p>
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
)
}

const TeamDashboard = ({ user }) => {
  const [assignTaskPopup, setAssignTaskPopup] = useState(false);
  const [viewTaskPopup, setViewTaskPopup] = useState(false);

  const [isAssignTaskOpen, setAssignTaskOpen] = useState(false);
  const [isViewTaskOpen, setViewTaskOpen] = useState(false);
  const [teamMemberIndex, setTeamMemberIndex] = useState(0);
  let [isLoading, setLoading] = useState(false);

  const handlLoad = (boolean) => {
    setLoading(boolean);
  };

  var buttonClass =
    "tw-w-7 tw-h-7 tw-mr-[10px] tw-cursor-pointer hover:tw-text-[#5bceff]";

  const location = useLocation();
  const state = location.state;
  const [currentTeam, setCurrentTeam] = useState(state["Team"])

  const [selectedTask, setSelectedTask] = useState({})

  const [isTaskClicked, setTaskClicked] = useState(false)

  useEffect(() => {

    // update when there is a change
    read_OneValue_from_Database("Teams/" + auth.currentUser.uid + "/" + currentTeam.teamCode, (data) => {
        setCurrentTeam(data)
    })

  }, [])


  // const [pendingInvites, setPendingInvites] = useState(
  //   currentTeam.teamPendingInvites
  // );

  // useEffect(() => {
  //   const onDataReceived = (data) => {
  //     setTimeout(() => {
  //       setPendingInvites(data);
  //     }, 1000)
  //   };
  //   fetchPendingInvites(onDataReceived, currentTeam.teamCode);
  // }, []);

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
      } else if (reactElementToJSXString(element).includes("<TeamYourProgress")) {
        document.getElementById("teamProgress").style.color = "#5bceff";
        document
          .getElementById("teamProgress")
          .querySelector("#dot").style.visibility = "visible";
      }
    } catch (e) {}
  };

  const data1 = {
    labels: PieData1.map((data) => data.label),
    datasets: [
        {
            label: "Total Miniutes Spent",
            data:PieData1.map((data) => data.value),
        },

    ],
  };
  
  const data2 = {
    labels: PieData2.map((data) => data.label),
    datasets: [
        {
            label: "Total Miniutes Spent",
            data:PieData2.map((data) => data.value),
        },

    ],
  };

  const data3 = {
    labels: PieData3.map((data) => data.label),
    datasets: [
        {
            label: "Total Miniutes Spent",
            data:PieData3.map((data) => data.value),
        },

    ],
  };

  const allData = [data1, data2, data3]

  const infoData = [
    {
      title: "Team Activity",
      element: (
        <TeamMemberDashboard
          viewTaskTrigger={viewTaskPopup}
          setViewTaskTrigger={setViewTaskPopup}
          taskTrigger = {setSelectedTask}
          className = "tw-z-[-1000]"
        />
      ),
      className: "teamActivity",
    },
    {
      title: "Chat",
      element: <Chat user={user} team={currentTeam} className = "tw-z-[-2000]" />,
      className: "teamChat",
    },
    {
      title: "Your Progress",
      element: <TeamYourProgress team={currentTeam} sideBarStatus={isOpen} data={allData} />,
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
        taskTrigger = {setSelectedTask}
        team={currentTeam}
        sideBarStatus={isOpen}
        className = "tw-z-[-1000]"
      />
    );
    dashboard = (
      <TeamLeaderDashboard
        viewTaskTrigger={viewTaskPopup}
        setViewTaskTrigger={setViewTaskPopup}
        taskTrigger = {setSelectedTask}
        team={currentTeam}
        sideBarStatus={isOpen}
        className = "tw-z-[-1000]"
      />
    );
    buttonClass =
      "tw-w-7 tw-h-7 tw-mr-[10px] tw-cursor-pointer hover:tw-text-[#5bceff]";
  } else {
    infoData[0]["element"] = (
      <TeamMemberDashboard
        viewTaskTrigger={viewTaskPopup}
        setViewTaskTrigger={setViewTaskPopup}
        taskTrigger = {setSelectedTask}
        className = "tw-z-[-1000]"
      />
    );
    dashboard = (
      <TeamMemberDashboard
        viewTaskTrigger={viewTaskPopup}
        setViewTaskTrigger={setViewTaskPopup}
        taskTrigger = {setSelectedTask}
        className = "tw-z-[-1000]"
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
          <div className={SideBarResult + " sidebar-main tw-max-h-screen tw-overflow-y-scroll tw-z-1000"}>
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
                    reactElementToJSXString(element).includes("<TeamYourProgress")
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

              <div className="tw-w-full tw-max-h-[300px] tw-overflow-y-scroll">
              {currentTeam["teamMemberList"].map((info, index) => {

                return(
                  <>
                    <MemberComponent info={info} currentTeam={currentTeam} buttonClass={buttonClass} setTeamMemberIndex = {setTeamMemberIndex} setAssignTaskOpen = {setAssignTaskOpen} setAssignTaskPopup = {setAssignTaskPopup} setSelectedUser  = {setSelectedUser} index={index} isAssignTaskOpen={isAssignTaskOpen}/>
                </>
                )
              })}
              </div>

              <div className="tw-w-full tw-max-h-[300px] tw-overflow-y-scroll">
                {currentTeam.teamPendingInvites[0] !== "" && (
                <>
                  <h2 className="tw-mt-[50px] tw-mb-[10px]">Pending Invites</h2>

                  {currentTeam.teamPendingInvites.map((info, index) => {
                    
                    return(
                      <div>
                        <PendingMemberComponent info={info} handleAcceptMembers={handleAcceptMembers} index={index} />
                      </div>
                    )
                    })}
                </>
                )}
              </div>

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
              currentTeam={currentTeam}
              index={teamMemberIndex}
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
            {viewTaskPopup ? (
              <ViewTask
              trigger={viewTaskPopup}
              setTrigger={setViewTaskPopup}
              task={selectedTask}
              
            ></ViewTask>
            ) : null}
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
