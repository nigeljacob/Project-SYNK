import React, { useState } from "react";
import * as IOIcons from "react-icons/io";
import "./Activity.css";

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

  return (
    <div className="home">
      <div className={SideBarResult + " text-center"}>
        <h2 className="pl-[10px] text-[20px] mt-[40px] font-bold">
          SDGP Group
        </h2>
        <p className="text-[15px] mt-[3px]">5 members</p>
        <p className="text-[15px] mt-[7px] text-[#5BCEFF] mb-[30px]">info</p>

        <div className="ml-[30px] h-[1px] w-[150px] bg-[#272727] my-[10px]"></div>

        {infoData.map((info) => (
          <div className="pl-[30px]">
            <p className="text-left text-[15px]">{info}</p>
            <div className="h-[1px] w-[150px] bg-[#272727] my-[10px]"></div>
          </div>
        ))}

        <div className="pl-[30px] mt-[28px] text-left">
          <h2 className="font-bold">Members</h2>

          <div className="h-[1px] w-[150px] bg-[#272727] mt-[20px] mb-[10px]"></div>

          {members.map((info) => (
            <>
              <p className="text-left text-[15px]">{info}</p>
              <div className="h-[1px] w-[150px] bg-[#272727] my-[10px]"></div>
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
        <div className=""></div>
        <div className="tasks">hey</div>
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
