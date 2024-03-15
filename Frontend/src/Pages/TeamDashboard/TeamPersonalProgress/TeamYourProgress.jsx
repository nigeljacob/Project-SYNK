import AssignedTaskDetails from "../../../components/AssignedTaskDetailsComponent/AssignedTaskDetails.jsx";
import React, { useEffect, useState } from "react";
import { read_OneValue_from_Database } from "../../../../../Backend/src/firebaseCRUD.js";
import { auth } from "../../../../../Backend/src/firebase.js";
import PieChart from "../../../components/PieChartComponent/PieChart.jsx";
import PieDetails from "../../../components/PieChartComponent/PieDeatils.jsx";
import TaskDetails from "../../../components/TaskComponent/TaskDetails.jsx";


const TeamYourProgress = (props) => {
  let [currentTeam, setCurrentTeam] = useState(props.team);
  let [isProgressClicked, setIsProgressClicked] = useState(false)

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

  let [progressIndex, setProgressIndex] = useState(0);
  let showProgress = props.data[progressIndex]

  const handleProgressClick = (index) => {
    setProgressIndex(index)
    setIsProgressClicked(true)
  }
  
  return (
    <div className="tw-overflow-y-scroll tw-h-full">
      <h3 className="tw-font-bold tw-text-[30px] tw-mb-[100px]">Your Progress</h3>

{       
        isProgressClicked ?
        <div className=" tw-flex tw-rounded-lg tw-py-10 tw-bg-[#272727] tw-h-[360px]">
         <PieChart data={showProgress} /> <PieDetails totalTime="30" taskCompletedDate="03/07/2024" taskAssigneddDate = "03/18/2024" taskBeforeAfter="3" />
       </div>
       :
       <div className=" tw-flex tw-rounded-lg tw-py-10 tw-bg-[#272727] tw-h-[360px]">
        <PieChart data={{
          labels:["","","",],
          datasets:[
            {label:"Revenue",
             data:[30,30,30],
             }
          ]
        }}/>
          <ul className="tw-text-4xl tw-mt-10">
          <li>Please click on the</li>
          <li className="tw-mt-5">Progress Button</li>
          <li className="tw-mt-5">To view your Progress</li>
          </ul> 
         
         
        
       </div>
}
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
            onProgressClick = {() => {
              handleProgressClick(index)
            }}
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
