import React, { useEffect, useState } from "react";
import { auth } from "../../../../../Backend/src/firebase.js";
import { read_OneValue_from_Database } from "../../../../../Backend/src/firebaseCRUD.js";
import PieChart from "../../../components/PieChartComponent/PieChart.jsx";
import PieDetails from "../../../components/PieChartComponent/PieDeatils.jsx";
import TaskDetails from "../../../components/TaskComponent/TaskDetails.jsx";
import ProgressVersionHistory from "./ProgressVersionHistory.jsx";

import "../../MainActivity/Activity.css";

const TeamYourProgress = (props) => {
  let [currentTeam, setCurrentTeam] = useState(props.team);
  let [isProgressClicked, setIsProgressClicked] = useState(false);

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
  let tasksList = [];
  let StartedTasks = [];

  for (let i = 0; i < currentTeam.teamMemberList.length; i++) {
    if (currentTeam.teamMemberList[i]["UID"] === auth.currentUser.uid) {
      tasksList = currentTeam.teamMemberList[i]["taskList"];
      teamMemberIndex = i;
    }
  }

  for (let i = 0; i < tasksList.length; i++) {
    let task = tasksList[i];
    if (task.taskStatus != "Start") {
      StartedTasks.push(task);
    }
  }

  let [progressIndex, setProgressIndex] = useState(0);

  let showProgress;

  if (StartedTasks.length > 0) {
    const data = {
      labels: StartedTasks[progressIndex].progress.applicationTimeList.map(
        (data) => data.name + " - " + formatMilliseconds(data.timeLength)
      ),
      datasets: [
        {
          label: "Average Spent in percentage (%)",
          data: StartedTasks[progressIndex].progress.applicationTimeList.map(
            (data) =>
              Math.round(
                (data.timeLength /
                  StartedTasks[progressIndex].progress.taskLength) *
                  100
              )
          ),
        },
      ],
    };

    showProgress = data;
  }

  const handleVersionHistoryClick = () => {
    props.elementTrigger(
      <ProgressVersionHistory
        setElement={props.elementTrigger}
        team={props.team}
        sideBarStatus={props.sideBarStatus}
        index={progressIndex}
        UID={props.UID}
      />
    );
  };

  const handleProgressClick = (index) => {
    setProgressIndex(index);
    setIsProgressClicked(true);
  };

  return (
    <div>
      {StartedTasks.length > 0 ? (
        <div className="heightMain tw-h-full">
          <h3 className="tw-font-bold tw-text-[30px] tw-mb-[100px]">
            Your Progress
          </h3>

          {isProgressClicked ? (
            <div className=" tw-flex tw-rounded-lg tw-py-10 tw-bg-[#272727] tw-h-[360px] tw-relative">
              <PieChart data={showProgress} />
              <PieDetails task={StartedTasks[progressIndex]} />

              <div className="tw-absolute tw-bottom-0 tw-right-0">
                <button
                  className="tw-text-cyan-500 tw-bg-black tw-rounded-lg tw-p-1 tw-h-[35px] tw-w-[150px] tw-m-5"
                  onClick={(event) => {
                    handleVersionHistoryClick();
                  }}
                >
                  Version History
                </button>
              </div>
            </div>
          ) : (
            <div className=" tw-flex tw-rounded-lg tw-py-10 tw-bg-[#272727] tw-h-[360px]">
              <PieChart
                data={{
                  labels: ["", "", ""],
                  datasets: [{ label: "Revenue", data: [30, 30, 30] }],
                }}
              />
              <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center">
                <h3>Click on a task to view Details</h3>
              </div>
            </div>
          )}
          <h3 className="tw-font-bold tw-text-[20px] tw-mt-[50px]">
            Tasks Assigned to you
          </h3>

          {StartedTasks.map((item, index) => (
            <TaskDetails
              index={index + 1}
              task={item}
              team={currentTeam}
              teamMemberIndex={teamMemberIndex}
              startButton={false}
              onProgressClick={() => {
                handleProgressClick(index);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="tw-w-full tw-h-[90vh] tw-flex tw-justify-center tw-items-center">
          No Tasks have been started yet
        </div>
      )}
    </div>
  );
};

function formatMilliseconds(milliseconds) {
  // Convert milliseconds to hours, minutes, and seconds
  let hours = Math.floor(milliseconds / 3600000);
  milliseconds = milliseconds % 3600000;
  let minutes = Math.floor(milliseconds / 60000);

  // Build the formatted string
  let formattedTime = "";
  if (hours > 0) {
    formattedTime += hours + " hour";
    if (hours > 1) formattedTime += "s"; // pluralize 'hour' if necessary
  }
  if (minutes > 0) {
    if (formattedTime !== "") formattedTime += " ";
    formattedTime += minutes + " minute";
    if (minutes > 1) formattedTime += "s"; // pluralize 'minute' if necessary
  }

  // Handle the case where milliseconds are less than 1 minute
  if (formattedTime === "") formattedTime = "less than a minute";

  return formattedTime;
}

export default TeamYourProgress;
