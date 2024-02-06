import React, { useState } from "react";
import * as IOIcons from "react-icons/io";
import "./Activity.css";
import "./TeamMemberDashboard.css";

const TeamMemberDashboard = () => {
  var sideBarStatus = true;

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
    ? "activityContent show_SideBar"
    : "activityContent hide_SideBar";
  const IconResult = isOpen ? "rotateIcon0" : "rotateIcon180";

  const infoData = ["Team Activity", "Chat", "Your Progress"];

  const members = [
    "Milni Nanayakkara",
    "Sevinda Perera",
    "Sasri Weeransinghe",
    "Inuka Perera",
    "Nigel Jacob",
  ];

  const taskDetails = [
    { taskDesc: "Finish the individual report", taskStatus: "Completed" },
    { taskDesc: "Finish the group report", taskStatus: "Completed" },
    { taskDesc: "Do the UI mockups", taskStatus: "Completed" },
    { taskDesc: "Create a logo for our brand", taskStatus: "In Progress" },
  ];

  return (
    <div className="home">
      <div className={SideBarResult + " sidebar-main"}>
        <h2>SDGP Group</h2>
        <p className="members">5 members</p>
        <p className="info-text">info</p>

        <div className="line margin-left"></div>

        {infoData.map((info) => (
          <div className="pl-[30px]">
            <p className="side-text text-left margin-left">{info}</p>
            <div className="line margin-left"></div>
          </div>
        ))}

        <div className="text-left margin-left margin-top">
          <h2 className="">Members</h2>

          <div className="line"></div>

          {members.map((info) => (
            <>
              <p className="side-text">{info}</p>
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

      <div className={MainContentResult}>
        <div className="deadline-container">
          <div className="clock-container">
            <img src="/images/clock.svg" alt="clock" />
            <div className="deadline-text-container">
              <h2>Task Deadline Today</h2>
              <p>Task assigned to you by leader from SDGP GROUP dues today</p>
            </div>
          </div>

          <button className="continue-btn">Continue</button>
        </div>

        <div className="mt-[55px] ml-[10px] tasks-container">
          <h2>Your Tasks</h2>
          {taskDetails.map((task, index) => (
            <div className="single-task-container">
              <p>{index + 1 + ". " + task.taskDesc}</p>

              <div className="status-container">
                <select
                  name="status"
                  className={
                    task.taskStatus === "Completed"
                      ? "green-status"
                      : "yellow-status"
                  }
                >
                  <option value="start" disabled selected hidden>
                    {task.taskStatus}
                  </option>
                  <option value="inProgress">
                    In Progress
                  </option>
                  <option value="completed">Completed</option>
                </select>
                {task.taskStatus !== "Completed" ? (
                  <div className="status">In Progress</div>
                ) : (
                  <div className="status">Completed</div>
                )}
              </div>
            </div>
          ))}
        </div>
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

export default TeamMemberDashboard;
