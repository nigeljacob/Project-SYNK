import AssignedTaskDetails from "../../../components/AssignedTaskDetailsComponent/AssignedTaskDetails.jsx";
import React, { useEffect, useState } from "react";
import { read_OneValue_from_Database } from "../../../../../Backend/src/firebaseCRUD.js";
import { auth } from "../../../../../Backend/src/firebase.js";
import PieChart from "../../../components/PieChartComponent/PieChart.jsx";
import PieDetails from "../../../components/PieChartComponent/PieDeatils.jsx";
import TaskDetails from "../../../components/TaskComponent/TaskDetails.jsx";




const TeamYourProgress = (props) => {
  let [currentTeam, setCurrentTeam] = useState(props.team);

  useEffect(() => {
    // update when there is a change
  read_OneValue_from_Database("Teams/" + auth.currentUser.uid + "/" + currentTeam.teamCode, (data) => {
    setCurrentTeam(data)
  })
  }, [])

  let teamMemberIndex = 0
  let tasksList = []

  for (let i = 0; i < currentTeam.teamMemberList.length; i++) {
    if(currentTeam.teamMemberList[i]["UID"] === auth.currentUser.uid) {
      tasksList = currentTeam.teamMemberList[i]["taskList"]
      teamMemberIndex = i;
    }

  }


  return (
    <div className="tw-overflow-y-scroll tw-h-full">
      <h3 className="tw-font-bold tw-text-[30px] tw-mb-[100px]">Your Progress</h3>

      <div className=" tw-flex tw-rounded-lg tw-py-10 tw-bg-[#272727] tw-h-[360px]">
         
        <PieChart/> <PieDetails/>
        
        
        
      
      </div>

      <h3 className="tw-font-bold tw-text-[20px] tw-mt-[50px]">
        Tasks Assigned to you
      </h3>
     

      {tasksList[0] != "" ? (
          tasksList.map((item, index) => (
            <TaskDetails
            index= {index + 1}
            task={item}
            team={currentTeam}
            teamMemberIndex={teamMemberIndex}

            startButton = {false}
            />
          ))
        ) : (
          <p className="tasksNotAvailable">
            No tasks has been assigned to you yet
          </p>
        )}
    </div>
  );
};

export default TeamYourProgress;
