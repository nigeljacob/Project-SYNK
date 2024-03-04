import AssignedTaskDetails from "../../../components/AssignedTaskDetailsComponent/AssignedTaskDetails.jsx";
import React, { useEffect } from "react";
import PieChart from "../../../components/PieChartComponent/PieChart.jsx";

const data = [
  {
    taskDesc: "Test-->Task 01",
    taskActivity: "Completed",
  },
 
];


const TeamYourProgress = () => {
  return (
    <div className="tw-overflow-y-scroll tw-h-full">
      <h3 className="tw-font-bold tw-text-[30px] tw-mb-[100px]">Your Progress</h3>

      <div className=" tw-rounded-lg tw-py-20 tw-bg-[#272727] tw-h-[500px]">
        
        <PieChart/>
      
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
