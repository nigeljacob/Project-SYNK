import React, { useEffect, useState } from "react";
import DeadlineComponent from "../../../components/ActivityDeadlineComponent/DeadlineComponent.jsx";
import TaskDetails from "../../../components/TaskComponent/TaskDetails.jsx";
import TeamProgressComponent from "../../../components/TeamProgressComponent/TeamProgressComponent.jsx";
import "../../MainTeamsPage/Teams.css";
import "./TeamLeaderDashboard.css";
import { auth } from "../../../../../Backend/src/firebase.js";
import { read_OneValue_from_Database } from "../../../../../Backend/src/firebaseCRUD.js";

const TeamLeaderDashboard = (props) => {
  let [currentTeam, setCurrentTeam] = useState(props.team);

  useEffect(() => {
    // update when there is a change
  read_OneValue_from_Database("Teams/" + auth.currentUser.uid + "/" + currentTeam.teamCode, (data) => {
    setCurrentTeam(data)
  })
  }, [])

  const SideBarStatus = useState(props.sideBarStatus);

  const progressContainerClassName = SideBarStatus ? "progress_container" : "progress_container_sideBarClosed";

  let teamMembers = []

  for (let i = 0; i < currentTeam.teamMemberList.length; i++) {
    if (currentTeam.teamMemberList[i]["UID"] != currentTeam.teamLeader.UID) {
      if(!teamMembers.includes(currentTeam.teamMemberList[i])) {
        teamMembers.push(currentTeam.teamMemberList[i]);
      }
    }
  }

  return (
    <div className="teamLeaderDashboard">
      <h1>Leader Dashboard</h1>
      <DeadlineComponent
        taskDeadlineDate="Finish Report"
        taskDetailsParagraph="Task assigned to you by leader from SDGP GROUP dues today"
      />
      <div className="tasks-container">
        {teamMembers.length > 0 ? (
          <>
          <h2 className="tw-font-bold tw-text-[30px]">Team Progress</h2>
          <div className={progressContainerClassName} >
            {teamMembers.map((member, index) => (
              <TeamProgressComponent
                key={index}
                className="card"
                photo=""
                tasks={[
                  "Working on task 03",
                  "Working on Microsoft Word",
                  "3 more tasks to complete",
                  "working for 2h now",
                ]}
                member={member}
              />
            ))}
          </div>
          </>
        ) : null}
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
