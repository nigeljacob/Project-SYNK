import React, {useState, useEffect} from "react";
import { useLocation } from "react-router";
import DeadlineComponent from "../../../components/ActivityDeadlineComponent/DeadlineComponent.jsx";
import TaskDetails from "../../../components/TaskComponent/TaskDetails.jsx";
import { auth } from "../../../../../Backend/src/firebase.js";
import { read_OneValue_from_Database } from "../../../../../Backend/src/firebaseCRUD.js";
const { parse, differenceInMilliseconds, closestTo } = require('date-fns');


const TeamMemberDashboard = (props) => {
  const location = useLocation();
  const state = location.state;
  const [currentTeam, setCurrentTeam] = useState(state["Team"]);

  useEffect(() => {
    // update when there is a change
  read_OneValue_from_Database("Teams/" + auth.currentUser.uid + "/" + currentTeam.teamCode, (data) => {
    setCurrentTeam(data)
  })
  }, [])

  // let taskList = currentTeam._taskList;
  let tasksList = [];

  let teamMemberIndex = 0

  for (let i = 0; i < currentTeam.teamMemberList.length; i++) {

    if(currentTeam.teamMemberList[i]["UID"] === auth.currentUser.uid) {
      tasksList = currentTeam.teamMemberList[i]["taskList"]
      teamMemberIndex = i
      break
    }

  }

  let deadlines = [];

  for(let i = 0; i < tasksList.length; i++) {
    if(tasksList[0] !=  "") {
      if(tasksList[i].taskStatus != "Completed") {
        deadlines.push(tasksList[i].deadline)
      }
    }
  }


  let closestDeadLine = []


  if(deadlines.length > 0) {

    const currentDate = new Date(); // Current date

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

    closestDeadLine = [closestDate, closestIndex]

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
          closestDeadLine = [targetDate, i]
          dueDatePast = targetDate
      } 
    }
  }

  return (
    <>
      {tasksList[0] != "" ? (
        <DeadlineComponent
        task={tasksList[closestDeadLine[1]]}
        closestDate= {closestDeadLine[0]}
        />
      ) : (
        <div className="deadline-container tw-flex tw-items-center tw-justify-center tw-h-[140px] tw-mt-[20px]">
          <div className="clock-container tw-flex tw-items-center tw-justify-center tw-w-full">
            <h3 className="tw-text-center tw-w-full">No Tasks assigned yet to show deadlines</h3>
          </div>
        </div>
      )}
      <div className="tasks-container">
        <h2 className="tw-font-bold tw-text-[30px]">Your Tasks</h2>
        {tasksList[0] != "" ? (
          tasksList.map((item, index) => (
            <TaskDetails
            index= {index + 1}
            task={item}
            team={currentTeam}
            teamMemberIndex={teamMemberIndex}
            setViewTaskTrigger={props.setViewTaskTrigger}
            viewTaskTrigger={props.viewTaskTrigger}
            taskTrigger = {props.taskTrigger}
            />
          ))
        ) : (
          <p className="tasksNotAvailable">
            No tasks has been assigned to you yet
          </p>
        )}
      </div>
    </>
  );
};

export default TeamMemberDashboard;
