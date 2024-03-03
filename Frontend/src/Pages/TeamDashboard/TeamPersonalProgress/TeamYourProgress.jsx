import AssignedTaskDetails from "../../../components/AssignedTaskDetailsComponent/AssignedTaskDetails.jsx";
import React, { useEffect } from "react";

const data = [
  {
    taskDesc: "Test-->Task 01",
    taskActivity: "Completed",
  },
  {
    taskDesc: "Test--> Task 02",
    taskActivity: "In Progress",
  },
  {
    taskDesc: "Test--> Task 03",
    taskActivity: "In Progress",
  },
  {
    taskDesc: "Test--> Task 04",
    taskActivity: "In Progress",
  },
  {
    taskDesc: "Test--> Task 05",
    taskActivity: "In Progress",
  },
  {
    taskDesc: "Test--> Task 05",
    taskActivity: "In Progress",
  },
  {
    taskDesc: "Test--> Task 05",
    taskActivity: "In Progress",
  },
];


const TeamYourProgress = () => {
  return (
    <div className="tw-overflow-y-scroll tw-h-full">
      <h3 className="tw-font-bold tw-text-[30px]">Your Progress</h3>

      <div className="tw-mt-[100px] tw-rounded-lg tw-py-40 tw-bg-[#272727]">
      
      </div>

      <h3 className="tw-font-bold tw-text-[20px] tw-mt-[50px]">
        Tasks Assigned to you
      </h3>
      {data.map((task, index) => (
        <AssignedTaskDetails
          index={index + 1}
          taskDesc={task.taskDesc}
          taskActivity={task.taskActivity}
        />
      ))}
    </div>
  );
};

export default TeamYourProgress;
