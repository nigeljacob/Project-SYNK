import React, { useEffect, useState } from 'react';
import * as IOIcons from "react-icons/io";
import './Activity.css';
import { read_from_Database_onChange } from '../../../../Backend/src/firebaseCRUD';
import { auth } from '../../../../Backend/src/firebase';
import { CircularProgress } from '@mui/material';
import DeadlineComponent from '../../components/ActivityDeadlineComponent/DeadlineComponent';
const { parse, differenceInMilliseconds, closestTo } = require('date-fns');

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
  } else if(curHr < 0 & curHr >= 16){
    greeting = "Good Evening"
  } else {
    greeting = "Time for Bed"
  }

  const [allTeams, setAllTeams] = useState([]);

  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    read_from_Database_onChange("Teams/" + auth.currentUser.uid, (Teams) => {
      setAllTeams(Teams)
    })
  }, [])

  let [deadlines, setDeadlines] = useState([]);

  let [closestDeadLine, setClosestDeadline] = useState([])
  let tempTasksList = []

  useEffect(() => {

    tempTasksList = []
    for(let i = 0; i < allTeams.length; i++) {
        const currentMember = allTeams[i].teamMemberList.filter(teamMember => teamMember["UID"] === auth.currentUser.uid);
        if(currentMember[0].taskList[0] != "") {
          tempTasksList.push(currentMember[0]["taskList"])
        }
    }

    setTimeout(() => {
      setAllTasks(tempTasksList)
    }, 1000)

  }, [allTeams])

  useEffect(() => {
    let tempDeadlines = []
    for(let i = 0; i < allTasks.length; i++) {
      let teamTasks = allTasks[i]
      for(let j = 0; j < teamTasks.length; j++) {
        if(teamTasks[0] !=  "") {
          if(teamTasks[j].taskStatus != "Completed") {
            tempDeadlines.push(teamTasks[j].deadline)
          }
        }
      }
    }

    setTimeout(() => {
      setDeadlines(tempDeadlines)
      console.log(tempDeadlines)
    }, 3000)

  }, [allTasks])

  useEffect(() => {
    if(deadlines.length > 0) {

      const currentDate = new Date();
  
      // Convert each date and time string to a Date object
    const parsedDatesWithTimes = deadlines.map(([dateStr, timeStr]) => {
      const combinedDateTimeStr = `${dateStr} ${timeStr}`;
      return parse(combinedDateTimeStr, "dd/MM/yyyy HH:mm", new Date());
    });
  
  
    // Find the closest date/time and its index in the list
    const { value: closestDate, index: closestIndex } = parsedDatesWithTimes.reduce((acc, date, index) => {
      const diff = Math.abs(currentDate - date);
      if (diff < acc.minDiff) {
          return { value: date, minDiff: diff, index: index };
      }
      return acc;
    }, { value: null, minDiff: Infinity, index: -1 });
  
    setClosestDeadline([closestDate, closestIndex])
  
      let dueDatePast = currentDate;
  
      for(let i = 0; i < deadlines.length; i++) {
        // Separate date and time from the array
        const [dateString, timeString] = deadlines[i]; // Note the date format here: "dd/mm/yyyy"
  
        // Split the date string into day, month, and year
        const [day, month, year] = dateString.split('/');
  
        // Combine date and time into a single string
        const combinedDateTimeString = `${year}-${month}-${day} ${timeString}`; // Reformat to "yyyy-mm-dd" for consistency with ISO 8601
  
        // Parse the combined date and time string into a Date object
        const targetDate = new Date(combinedDateTimeString);
  
        // Check if the target date is in the past
        if (targetDate < dueDatePast) {
          setClosestDeadline([targetDate, i])
            dueDatePast = targetDate
        } 
      }
    }
    console.log(closestDeadLine)
  }, [deadlines])

  const [displayList, setDisplayList] = useState(allTasks);

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
    <div className='home tw-max-h-screen'>
      <div className={SideBarResult}>
        <div className='allButton'>
          <div className='dot'></div>
          <h3>All</h3>
        </div>
        <h2 id='teamsHeading'>Teams</h2>
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

      {allTasks.length != 0 && deadlines.length != 0 && closestDeadLine.length != 0 ? (
        <DeadlineComponent
        task={allTasks[0][closestDeadLine[1]]}
        closestDate= {closestDeadLine[0]}
        />
      ) : (
        <div className="deadline-container tw-flex tw-items-center tw-justify-center tw-h-[140px] tw-mt-[20px]">
          <div className="clock-container tw-flex tw-items-center tw-justify-center tw-w-full">
            <CircularProgress />
            {/* <h3 className="tw-text-center tw-w-full">No Tasks assigned yet to show deadlines</h3> */}
          </div>
        </div>
      )}

      {allTasks.length != 0 ? (
          allTasks.map((item, index) => {
            return(
              <>
                {allTasks[index].map((task, taskIndex) => {
                  return(
                    <h3>{task.taskName}</h3>
                  )
                })}
              </>
            )
          })
      ): null}

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