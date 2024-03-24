import React, { useEffect, useState } from "react";
import DeadlineComponent from "../../../components/ActivityDeadlineComponent/DeadlineComponent.jsx";
import TaskDetails from "../../../components/TaskComponent/TaskDetails.jsx";
import TeamProgressComponent from "../../../components/TeamProgressComponent/TeamProgressComponent.jsx";
import "../../MainTeamsPage/Teams.css";
import "./TeamLeaderDashboard.css";
import { auth } from "../../../utils/firebase.js";
import { read_OneValue_from_Database } from "../../../utils/firebaseCRUD.js";
import { assignTask } from "../../../utils/AssignTask/taskFunctions.js";
import { List } from "lucide-react";
const { parse, differenceInMilliseconds, closestTo } = require("date-fns");

const TeamLeaderDashboard = (props) => {
  let [currentTeam, setCurrentTeam] = useState(props.team);

  useEffect(() => {
    // update when there is a change
    read_OneValue_from_Database(
      "Teams/" + auth.currentUser.uid + "/" + currentTeam.teamCode,
      (data) => {
        setCurrentTeam(data);
      }
    );
  }, []);

  let teamMemberIndex = 0;

  const SideBarStatus = useState(props.sideBarStatus);

  const progressContainerClassName = SideBarStatus
    ? "progress_container"
    : "progress_container_sideBarClosed";

  let teamMembers = [];
  let tasksList = [];

  for (let i = 0; i < currentTeam.teamMemberList.length; i++) {
    if (currentTeam.teamMemberList[i]["UID"] != currentTeam.teamLeader.UID) {
      if (!teamMembers.includes(currentTeam.teamMemberList[i])) {
        teamMembers.push(currentTeam.teamMemberList[i]);
      }
    }

    if (currentTeam.teamMemberList[i]["UID"] === auth.currentUser.uid) {
      tasksList = currentTeam.teamMemberList[i]["taskList"];
      teamMemberIndex = i;
    }
  }

  let deadlines = [];

  for (let i = 0; i < tasksList.length; i++) {
    if (tasksList[0] != "") {
      if (tasksList[i].taskStatus != "Completed") {
        deadlines.push(tasksList[i].deadline);
      }
    }
  }

  let closestDeadLine = [];

  if (deadlines.length > 0) {
    const currentDate = new Date(); // Current date

    // Convert each date and time string to a Date object
    const parsedDatesWithTimes = deadlines.map(([dateStr, timeStr]) => {
      const combinedDateTimeStr = `${dateStr} ${timeStr}`;
      return parse(combinedDateTimeStr, "dd/MM/yyyy HH:mm", new Date());
    });

    // Find the closest date/time and its index in the list
    const { value: closestDate, index: closestIndex } =
      parsedDatesWithTimes.reduce(
        (acc, date, index) => {
          const diff = Math.abs(currentDate - date);
          if (diff < acc.minDiff) {
            return { value: date, minDiff: diff, index: index };
          }
          return acc;
        },
        { value: null, minDiff: Infinity, index: -1 }
      );

    closestDeadLine = [closestDate, closestIndex];

    let dueDatePast = currentDate;

    for (let i = 0; i < deadlines.length; i++) {
      // Separate date and time from the array
      const [dateString, timeString] = deadlines[i]; // Note the date format here: "dd/mm/yyyy"

      // Split the date string into day, month, and year
      const [day, month, year] = dateString.split("/");

      // Combine date and time into a single string
      const combinedDateTimeString = `${year}-${month}-${day} ${timeString}`; // Reformat to "yyyy-mm-dd" for consistency with ISO 8601

      // Parse the combined date and time string into a Date object
      const targetDate = new Date(combinedDateTimeString);

      // Check if the target date is in the past
      if (targetDate < dueDatePast) {
        closestDeadLine = [targetDate, i];
        dueDatePast = targetDate;
      }
    }
  }

  return (
    <div className="teamLeaderDashboard">
      <h1>Leader Dashboard</h1>
      {tasksList[0] != "" ? (
        <DeadlineComponent
          task={tasksList[closestDeadLine[1]]}
          closestDate={closestDeadLine[0]}
        />
      ) : (
        <div className="deadline-container tw-flex tw-items-center tw-justify-center tw-h-[140px] tw-mt-[20px]">
          <div className="clock-container tw-flex tw-items-center tw-justify-center tw-w-full">
            <h3 className="tw-text-center tw-w-full">
              No Tasks assigned yet to show deadlines
            </h3>
          </div>
        </div>
      )}
      <div className="tasks-container">
        {teamMembers.length > 0 ? (
          <>
            <h2 className="tw-font-bold tw-text-[30px]">Team Progress</h2>
            <div className={progressContainerClassName}>
              {teamMembers.map((member, index) => (
                <TeamProgressComponent
                  key={index}
                  className="card"
                  photo=""
                  tasks={member.taskList}
                  member={member}
                  currentTeam={currentTeam}
                  elementTrigger={props.elementTrigger}
                  elementStringTrigger={props.elementStringTrigger}
                />
              ))}
            </div>
          </>
        ) : null}
        <h2 className="tw-font-bold tw-text-[30px]">Your Tasks</h2>

        {tasksList[0] != "" ? (
          tasksList.map((item, index) => (
            <TaskDetails
              index={index + 1}
              task={item}
              team={currentTeam}
              teamMemberIndex={teamMemberIndex}
              setViewTaskTrigger={props.setViewTaskTrigger}
              viewTaskTrigger={props.viewTaskTrigger}
              taskTrigger={props.taskTrigger}
              startButton={true}
            />
          ))
        ) : (
          <p className="tasksNotAvailable">
            No tasks has been assigned to you yet
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamLeaderDashboard;
