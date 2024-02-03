import React, { useState } from 'react';
import * as IOIcons from "react-icons/io";

function Home() {

  var sideBarStatus = true;

  try{
    sideBarStatus = getPreviousSetting("sideBarStatus");
  } catch(e) {
    sideBarStatus = true;
  }
  
  const [isOpen, setIsOpen] = useState(sideBarStatus);
  const SideBarResult = isOpen ? "sideBar show_SideBar" : "sideBar hide_SideBar";
  const MainContentResult = isOpen ? "activityContent show_SideBar" : "activityContent hide_SideBar";
  const IconResult = isOpen ? "rotateIcon0" : "rotateIcon180";
  return (
    <div className='home'>
      <div className={SideBarResult}>
        <div className='closeButton' onClick={event => {
          setIsOpen(!isOpen);
          sidebarToggler(!isOpen);
        }}>
            <IOIcons.IoMdArrowDropleft className={IconResult} />
        </div>
        </div>
      <div className={MainContentResult}>
      <h1>Good <span>Morning</span> <span>Nigel</span> !</h1>
      </div>
    </div>
  );
}

function sidebarToggler(boolean) {
  if(boolean == true) {
    localStorage.setItem("sideBarStatus", "true");
  } else {
    localStorage.setItem("sideBarStatus", "false");
  }
}

function getPreviousSetting(name) {
  let setting = localStorage.getItem(name);
  if(setting == "true") {
    return true
  } else {
    return false
  }
}

export default Home;