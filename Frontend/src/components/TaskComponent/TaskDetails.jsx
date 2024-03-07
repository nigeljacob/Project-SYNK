import "./TaskDetails.css";
import "../../Pages/TeamDashboard/TeamDashboard"
import React, { useEffect, useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import { MdEdit } from "react-icons/md";
import { updateTaskStatus } from "../../../../Backend/src/AssignTask/taskFunctions";
import { auth } from "../../../../Backend/src/firebase";
import { read_OneValue_from_Database } from "../../../../Backend/src/firebaseCRUD";
import { Indent } from "lucide-react";

const TaskDetails = ({ index, task, team, teamMemberIndex, setViewTaskTrigger, viewTaskTrigger, taskTrigger, startButton }) => {

  const [currentTask, setCurrentTask] = useState(task)

  const [Status, setStatus] = useState(currentTask.taskStatus);

  const [dateString, timeString] = currentTask.deadline;

    const [day, month, year] = dateString.split('/');

    const combinedDateTimeString = `${year}-${month}-${day} ${timeString}`;

    const targetDate = new Date(combinedDateTimeString);

    let dued = false;

  if(targetDate < new Date()) {
    dued = true;
  } else {
    dued = false
  }

  const handleConfirm = () => {
    electronApi.viewTask("hey there im testing")
  }

  const containerClass = dued ? "single-task-container_past" : "single-task-container"



  // there are some errros in this function have to fix.. don't use it might ruin the firebase structure
  // useEffect(() => {

  //   updateTaskStatus(team, teamMemberIndex, index, Status, auth.currentUser.displayName)

  // }, Status)

  useEffect(() => {
    read_OneValue_from_Database("Teams/" + auth.currentUser.uid + "/" + team.teamCode + "/teamMemberList/" + teamMemberIndex + "/taskList/" + parseInt(index - 1), (task) => {
      setCurrentTask(task)
      setStatus(task.taskStatus)
    })
  }, [])

  return (
    <div className={containerClass}>
      <p>{index + ". " + currentTask.taskName}</p>

      <div className="status-container">
          {Status === "Start" ? (
            <Tooltip title = "Start Task to Change Status">
            <select
              name="status"
              disabled
              className={
                Status === "Completed" ? "green-status" : "yellow-status"
              }
            >
                <option value="start" selected > Not Started Yet</option>
                <option value="Continue" hidden>In Progress</option>
                <option value="Completed" hidden>Completed</option>

            </select>
            </Tooltip>
          ) : (
            Status === "Continue" ? (
              <select
              name="status"
              onChange={event => setStatus(event.target.value)}
              className={
                Status === "Completed" ? "green-status" : "yellow-status"
              }
            >
              <option value="start" disabled>
                  Not Started Yet
                </option>
                <option value="Continue" selected>In Progress</option>
                <option value="Completed" >Completed</option>

            </select>
            ) : (
              <select
              name="status"
              onChange={event => setStatus(event.target.value)}
              className={
                Status === "Completed" ? "green-status" : "yellow-status"
              }
            >
              <option value="start" disabled>
                Not Started Yet
                </option>
                <option value="Continue">In Progress</option>
                <option value="Completed" selected>Completed</option>

            </select>
            )
          )}
        {Status === "Start" ? (
          <Tooltip title = {startButton ? "Start Task" : "View Task"}>
            <div >
              {startButton ? <button className="status" onClick={event => {
          let popupLayout = document.getElementById("popupLayout2");
            if(viewTaskTrigger) {
              popupLayout.style.background = "rgba(0,0,0,0)"
            } else {
              popupLayout.style.visibility = "visible";
              setTimeout(() => {
                popupLayout.style.background = "rgba(0,0,0,0.7)"
              }, 90);

          setViewTaskTrigger(true);
          taskTrigger([currentTask, team, parseInt(index - 1)])
          handleConfirm()

          }}}>{Status}</button> : <button   className="viewTaskNew">View Button</button>}
        </div>
          </Tooltip>
        ) : (
          Status === "Continue" ? (
            <div className="tw-flex tw-items-center">
            <button className="status" >{Status}</button>
            <MdEdit className="tw-w-[20px] tw-h-[20px] tw-ml-[10px] tw-cursor-pointer" onClick={event => {
          let popupLayout = document.getElementById("popupLayout2");
            if(viewTaskTrigger) {
              popupLayout.style.background = "rgba(0,0,0,0)"
            } else {
              popupLayout.style.visibility = "visible";
              setTimeout(() => {
                popupLayout.style.background = "rgba(0,0,0,0.7)"
              }, 90);

          setViewTaskTrigger(true);
          taskTrigger([currentTask, team, parseInt(index - 1)])
          handleConfirm() // display installed apps for view task component

          }}}/>  
            </div>
          ) : (
            <div >
            <button className="status tw-text-red" >{Status}</button> </div>
          )
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
