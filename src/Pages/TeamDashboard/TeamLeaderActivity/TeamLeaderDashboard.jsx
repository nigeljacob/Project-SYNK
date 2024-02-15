import { useState } from "react";
import DeadlineComponent from "../../../components/ActivityDeadlineComponent/DeadlineComponent.jsx";
import TaskDetails from "../../../components/TaskComponent/TaskDetails.jsx";
import TeamProgressComponent from "../../../components/TeamProgressComponent/TeamProgressComponent.jsx";
import "../../MainTeamsPage/Teams.css";
import "./TeamLeaderDashboard.css";

const TeamLeaderDashboard = (props) => {

  let currentTeam = props.team;

  const SideBarStatus = useState(props.sideBarStatus);

  const progressContainerClassName = SideBarStatus ? "progress_container" : "progress_container_sideBarClosed";

  const teamMemberList = currentTeam._teamMemberList;
  
  let teamMembers = [];

  for(let i = 0; i < teamMemberList.length; i++) {
    if(teamMemberList[i] != currentTeam._teamLeader) {
      teamMembers.push(teamMemberList[i]);
    }
  }

  return (
    <div className="teamLeaderDashboard">
      <h1>Leader</h1>
      <DeadlineComponent
        taskDeadlineDate= "Finish Report"
        taskDetailsParagraph="Task assigned to you by leader from SDGP GROUP dues today"
      />
      <div className="tasks-container">
        <h2 className="tw-font-bold tw-text-[30px]">Team Progress</h2>
        <div className={progressContainerClassName} >
          {teamMembers.map((member, index) => (
              <TeamProgressComponent key={index} className="card" />
          ))}
        </div>
        <h2 className="tw-font-bold tw-text-[30px]">Your Tasks</h2>
        <TaskDetails
          index="1"
          taskDesc="Finish the individual report now"
          taskStatus="Continue"
          setViewTaskTrigger={props.setViewTaskTrigger}
          viewTaskTrigger={props.viewTaskTrigger}
        />
        <TaskDetails
          index="1"
          taskDesc="Finish the individual report"
          taskStatus="Continue"
          setViewTaskTrigger={props.setViewTaskTrigger}
          viewTaskTrigger={props.viewTaskTrigger}
        />
      </div>
    </div>
  );
};

export default TeamLeaderDashboard;
