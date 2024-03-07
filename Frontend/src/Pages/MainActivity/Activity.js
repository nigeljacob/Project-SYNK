import React, { useEffect, useState } from 'react';
import * as IOIcons from "react-icons/io";
import './Activity.css';
import { read_from_Database_onChange } from '../../../../Backend/src/firebaseCRUD';
import { auth } from '../../../../Backend/src/firebase';
import { CircularProgress } from '@mui/material';
import DeadlineComponent from '../../components/ActivityDeadlineComponent/DeadlineComponent';
import ActivityFeedComponent from '../../components/ActivityFeed/ActivityFeedComponent';
const { parse, differenceInMilliseconds, closestTo, isToday, isTomorrow } = require('date-fns');

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

  if (curHr < 12 && curHr > 5) {
    greeting = "Good Morning"
  } else if (curHr < 16 && curHr >= 12) {
    greeting = "Good Afternoon"
  } else if(curHr < 24 & curHr >= 16){
    greeting = "Good Evening"
  } else {
    greeting = "Time for Bed"
  }

  const [allTeams, setAllTeams] = useState([]);

  const [todayTasks, setTodayTasks] = useState([]);

  const [tomorrowTasks, setTomorrowTasks] = useState([]);

  useEffect(() => {
    read_from_Database_onChange("Teams/" + auth.currentUser.uid, (Teams) => {
      setAllTeams(Teams)
      
      // let tempTodayTasks = [];
      // let tempTomorrowTasks = [];

      // const getTasks = (callback) => {
      //   for(let i = 0; i < Teams.length; i++) {
      //     let currentMember = Teams[i].filter(member => member.UID === auth.currentUser.uid)
      //     let taskList = currentMember[0].taskList;
      //     tempTodayTasks = [...tempTodayTasks, taskList.filter(task => isToday(new Date(task.deadline[0])))]
      //     tempTomorrowTasks = [...tempTomorrowTasks, taskList.filter(task => isTomorrow(new Date(task.deadline[0])))]
      //   }
      //   setTimeout(() => {
      //     callback([tempTodayTasks, tempTomorrowTasks])
      //   }, 1000)
      // }

      // getTasks((tasksList) => {
      //   setTodayTasks(tasksList[0])
      //   setTomorrowTasks(tasksList[1])
      // })

    })
  }, [])

  let notifications = [];

  try{
    notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
  } catch (e) {

  }

  const [isAvailable, setAvailable] = useState(true)

  const [isLoading, setLoading] = useState(true)

  setTimeout(() => {
    setAvailable(false)
  }, 3000)


  const [isOpen, setIsOpen] = useState(sideBarStatus);
  const SideBarResult = isOpen ? "sideBar show_SideBar" : "sideBar hide_SideBar";
  const MainContentResult = isOpen
    ? "activityContent bringBackMainContent"
    : "activityContent extendMainContent";
  const IconResult = isOpen ? "rotateIcon0" : "rotateIcon180";

  return (
    <div className='home tw-max-h-screen tw-overflow-hidden'>
      <div className={SideBarResult}>
          <div className= 'tw-w-[85%] tw-mt-[20px] tw-flex tw-flex-col tw-justify-center tw-items-center tw-ml-[20px]'>
            <h3 className='tw-mt-[10px] tw-text-[14px]'>Main</h3>
            <h3 className='tw-font-bold tw-text-[28px]'>Activities</h3>
          </div>
        <h2 id='teamsHeading'>Your Teams</h2>
        <div className='taskTeams tw-w-full tw-min-h-[100px] tw-flex tw-flex-col tw-justify-center tw-mt-[-10px] tw-max-h-[76%] tw-overflow-y-scroll tw-pb-[30px]'>

        {allTeams.length > 0 ? (
          allTeams.map((team, index) => (
            <>
            <div className='tw-w-[full] tw-flex tw-items-center hover:tw-bg-[#181818] tw-cursor-pointer'>
              <div className='tw-h-[40px] tw-mt-[15px] tw-mr-[10px] tw-ml-[20px] tw-mb-[10px] tw-w-[40px] tw-bg-[#0B0B0B] tw-flex tw-items-center tw-justify-center tw-flex-col tw-flex-shrink-0'>
                {team.teamLeader.UID === auth.currentUser.uid ? (
                  <h3 className='tw-text-[#5bceff]'>{team.teamName.split(" ")[0][0].toUpperCase()} {team.teamName.split(" ")[team.teamName.split(" ").length - 1][0].toUpperCase()}</h3>
                ) : (
                  <h3>{team.teamName.split(" ")[0][0].toUpperCase()} {team.teamName.split(" ")[team.teamName.split(" ").length - 1][0].toUpperCase()}</h3>
                )}
                
              </div>
              <h5 className='teamNameCropping'>{team.teamName}</h5>
            </div>
            {index != allTeams.length - 1 ? (
              <div className="lineSep"></div>
            ) : null}
            </>
        ))
        ) : (
          isAvailable ? (
              <div className='tw-w-full tw-flex tw-items-center tw-justify-center'>
                <CircularProgress/>
              </div>
          ) : (
              <div className='tw-w-full tw-flex tw-items-center tw-justify-center'>
              <h3>No Teams Created</h3>
              </div>
          )
          
        )}


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
      <h1><span>{greeting}</span> <span id='displayName'>{props.user.displayName.split(" ")[0]}</span> !</h1>

      <div className='tw-w-full tw-flex heightMain' > 
        <div className='tw-flex-1 tw-rounded-[10px] tw-m-[10px]'>
          <h3 className='tw-mt-[20px]'>Latest Activity Feed</h3>

          <ActivityFeedComponent />
        </div>

        <div className='tw-flex-1 tw-m-[10px] tw-rounded-[10px]'>
        <h3 className='tw-mt-[20px]'>Today Tasks</h3>
        </div>

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