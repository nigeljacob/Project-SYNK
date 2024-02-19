import "./TaskDetails.css";
import "../../Pages/TeamDashboard/TeamDashboard"
import { useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import { MdEdit } from "react-icons/md";

const TaskDetails = ({ index, taskDesc, taskStatus, setViewTaskTrigger, viewTaskTrigger }) => {

  const [Status, setStatus] = useState(taskStatus);

  return (
    <div className="single-task-container">
      <p>{index + ". " + taskDesc}</p>

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
                <option value="start" selected >
                Not Started Yet
                </option>
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
          <Tooltip title = "Start Task">
            <div >
          <button className="status" onClick={event => {
          let popupLayout = document.getElementById("popupLayout2");
            if(viewTaskTrigger) {
              popupLayout.style.background = "rgba(0,0,0,0)"
            } else {
              popupLayout.style.visibility = "visible";
              setTimeout(() => {
                popupLayout.style.background = "rgba(0,0,0,0.7)"
              }, 90);

          setViewTaskTrigger(true);

          }}}>{Status}</button>
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
