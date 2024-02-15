import DeadlineComponent from "../../../components/ActivityDeadlineComponent/DeadlineComponent.jsx";
import TaskDetails from "../../../components/TaskComponent/TaskDetails.jsx";
import TeamProgressComponent from "../../../components/TeamProgressComponent/TeamProgressComponent.jsx";
import "../../MainTeamsPage/Teams.css";
import "./TeamLeaderDashboard.css";

const TeamLeaderDashboard = (props) => {
  return (
    <div className="teamLeaderDashboard">
      <h1>Leader</h1>
      <DeadlineComponent
        taskDeadlineDate="Task Deadline Today"
        taskDetailsParagraph="Task assigned to you by leader from SDGP GROUP dues today"
      />
      <div className="tasks-container">
        <h2 className="tw-font-bold tw-text-[30px]">Team Progress</h2>
        <div className="tw-flex tw-flex-wrap tw-flex-col tw-gap-5 tw-overflow-x-auto tw-w-[calc(100vw-700px)]">
          <TeamProgressComponent />
          <TeamProgressComponent />
          <TeamProgressComponent />
          <TeamProgressComponent />
          <TeamProgressComponent />
          <TeamProgressComponent />
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
