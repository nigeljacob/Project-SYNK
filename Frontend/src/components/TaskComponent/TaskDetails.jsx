import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { auth } from "../../utils/firebase";
import { read_OneValue_from_Database } from "../../utils/firebaseCRUD";
import "../../Pages/TeamDashboard/TeamDashboard";
import "./TaskDetails.css";
import { startTask } from "../../utils/AssignTask/taskFunctions";
import { PauseTask } from "../../utils/AssignTask/taskFunctions";
import { updateTaskStatus } from "../../utils/AssignTask/taskFunctions";
import { CircularProgress } from "@mui/material";
const electronApi = window?.electronApi;

const TaskDetails = ({
  index,
  task,
  team,
  teamMemberIndex,
  setViewTaskTrigger,
  viewTaskTrigger,
  taskTrigger,
  startButton,
  onProgressClick,
}) => {
  const [currentTask, setCurrentTask] = useState(task);

  const [Status, setStatus] = useState(currentTask.taskStatus);

  const [dateString, timeString] = currentTask.deadline;

  const [day, month, year] = dateString.split("/");

  const combinedDateTimeString = `${year}-${month}-${day} ${timeString}`;

  const targetDate = new Date(combinedDateTimeString);

  const handleProgressButtonClick = () => {
    onProgressClick(index);
  };

  let dued = false;

  if (targetDate < new Date() && task.taskStatus != "Completed") {
    dued = true;
  } else {
    dued = false;
  }

  const handleConfirm = () => {
    electronApi.viewTask("hey there im testing");
  };

  const [isLoading, setLoading] = useState(false);

  const containerClass = dued
    ? "single-task-container_past"
    : "single-task-container";

  useEffect(() => {
    read_OneValue_from_Database(
      "Teams/" +
        auth.currentUser.uid +
        "/" +
        team.teamCode +
        "/teamMemberList/" +
        teamMemberIndex +
        "/taskList/" +
        parseInt(index - 1),
      (task) => {
        setCurrentTask(task);
        setStatus(task.taskStatus);
      }
    );
  }, []);

  return (
    <div className={containerClass}>
      <p>{index + ". " + currentTask.taskName}</p>

      <div className="status-container">
        {startButton &&
          (Status === "Start" ? (
            <Tooltip title="Start Task to Change Status">
              <select
                name="status"
                disabled
                className={
                  Status === "Completed" ? "green-status" : "yellow-status"
                }
              >
                <option value="start" selected>
                  {" "}
                  Not Started Yet
                </option>
                <option value="Continue" hidden>
                  In Progress
                </option>
                <option value="Completed" hidden>
                  Completed
                </option>
              </select>
            </Tooltip>
          ) : Status === "Continue" || Status === "In Progress" ? (
            <select
              name="status"
              onChange={(event) => {
                setStatus(event.target.value);
                updateTaskStatus(
                  team,
                  teamMemberIndex,
                  parseInt(index - 1),
                  event.target.value,
                  auth.currentUser.displayName
                );
              }}
              className={
                Status === "Completed" ? "green-status" : "yellow-status"
              }
            >
              <option value="start" disabled>
                Not Started Yet
              </option>
              <option value="Continue" selected>
                In Progress
              </option>
              <option value="Completed">Completed</option>
            </select>
          ) : (
            <select
              name="status"
              onChange={(event) => {
                setStatus(event.target.value);
                updateTaskStatus(
                  team,
                  teamMemberIndex,
                  parseInt(index - 1),
                  event.target.value,
                  auth.currentUser.displayName
                );
              }}
              className={
                Status === "Completed" ? "green-status" : "yellow-status"
              }
            >
              <option value="start" disabled>
                Not Started Yet
              </option>
              <option value="Continue">In Progress</option>
              <option value="Completed" selected>
                Completed
              </option>
            </select>
          ))}
        {Status === "Start" ? (
          <Tooltip
            title={startButton ? "Start Task" : "View Task details & Progress"}
          >
            <div>
              <button
                className="status"
                onClick={(event) => {
                  let popupLayout = document.getElementById("popupLayout2");
                  if (viewTaskTrigger) {
                    popupLayout.style.background = "rgba(0,0,0,0)";
                  } else {
                    popupLayout.style.visibility = "visible";
                    setTimeout(() => {
                      popupLayout.style.background = "rgba(0,0,0,0.7)";
                    }, 90);

                    setViewTaskTrigger(true);
                    taskTrigger([currentTask, team, parseInt(index - 1)]);
                    handleConfirm();
                  }
                }}
              >
                View
              </button>
            </div>
          </Tooltip>
        ) : Status === "Continue" || Status === "In Progress" ? (
          <div className="tw-flex tw-items-center">
            {startButton ? (
              isLoading ? (
                <CircularProgress />
              ) : (
                Status === "In Progress" ? (
                <button
                  className="status tw-text-white"
                  onClick={(event) => {
                    electronApi.sendPauseTaskToMain("pauseSignal");
                  }}
                >
                  Pause
                </button>
              ) : (
                <button
                  className="status"
                  onClick={(event) => {
                    localStorage.setItem(
                      auth.currentUser.uid + "previousTask",
                      JSON.stringify({
                        task: task,
                        taskIndex: index,
                        team: team,
                        teamMemberIndex: teamMemberIndex,
                      })
                    );

                    setLoading(true);

                    setTimeout(() => {
                      startTask(
                        task,
                        parseInt(index - 1),
                        team,
                        teamMemberIndex,
                        (data) => {
                          if (data != null) {
                            electronApi.sendTaskStarted({
                              task: task,
                              taskIndex: index,
                              team: team,
                              teamMemberIndex: teamMemberIndex,
                            });
                          }
                        }
                      );
                      setLoading(false);
                    }, 1000);
                  }}
                >
                  {Status}
                </button>
              )
              )
            ) : (
              <button
                className="tw-text-cyan-500 tw-bg-black tw-rounded-lg tw-p-1 tw-h-[35px] tw-w-[150px]"
                onClick={() => handleProgressButtonClick(index)}
              >
                View Progress
              </button>
            )}

            {startButton && (
              <MdEdit
                className="tw-w-[20px] tw-h-[20px] tw-ml-[10px] tw-cursor-pointer"
                onClick={(event) => {
                  let popupLayout = document.getElementById("popupLayout2");
                  if (viewTaskTrigger) {
                    popupLayout.style.background = "rgba(0,0,0,0)";
                  } else {
                    popupLayout.style.visibility = "visible";
                    setTimeout(() => {
                      popupLayout.style.background = "rgba(0,0,0,0.7)";
                    }, 90);

                    setViewTaskTrigger(true);
                    taskTrigger([currentTask, team, parseInt(index - 1)]);
                    handleConfirm(); // display installed apps for view task component
                  }
                }}
              />
            )}
          </div>
        ) : Status === "In Progress" ? (
          <div>
            <button
              className="status tw-text-white"
              onClick={(event) => {
                electronApi.sendPauseTaskToMain("pauseSignal");
              }}
            >
              Pause
            </button>
          </div>
        ) : (
          <div>
            <button className="status tw-text-green">Completed</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
