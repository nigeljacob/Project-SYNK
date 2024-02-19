import React, { useState } from 'react';
import * as IOIcons from "react-icons/io";
import './Activity.css';

function Home(props) {

  var sideBarStatus = true;

  try{
    sideBarStatus = getPreviousSetting("sideBarStatus");
  } catch(e) {
    sideBarStatus = true;
  }

var today = new Date()
var curHr = today.getHours()

var greeting = "";

if (curHr < 12) {
  greeting = "Morning"
} else if (curHr < 18) {
  greeting = "Afternoon"
} else {
  greeting = "Evening"
}
  
  const [isOpen, setIsOpen] = useState(sideBarStatus);
  const SideBarResult = isOpen ? "sideBar show_SideBar" : "sideBar hide_SideBar";
  const MainContentResult = isOpen
    ? "activityContent bringBackMainContent"
    : "activityContent extendMainContent";
  const IconResult = isOpen ? "rotateIcon0" : "rotateIcon180";
  return (
    <div className='home'>
      <div className={SideBarResult}>
        <div className='allButton'>
          <div className='dot'></div>
          <h2>All</h2>
        </div>
        <h2 id='teamsHeading'>Teams</h2>
        <div className='taskTeams'>


        </div>
        {/* close button */}
        <div className='closeButton' onClick={event => {
          setIsOpen(!isOpen);
          sidebarToggler(!isOpen);
        }}>
            <IOIcons.IoMdArrowDropleft className={IconResult} />
        </div>
        </div>
      <div className={MainContentResult}>
      <h1>Good <span>{greeting}</span> <span id='displayName'>{props.user.displayName}</span> !</h1>
      <div className='reminderTask'>
        
      </div>
      <div className='tasks'>
        
      </div>
      </div>
    </div>
  );
}

function sidebarToggler(boolean) {
  if(boolean === true) {
    localStorage.setItem("sideBarStatus", "true");
  } else {
    localStorage.setItem("sideBarStatus", "false");
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

export default Home;