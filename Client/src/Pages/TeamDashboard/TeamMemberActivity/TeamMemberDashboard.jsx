import { useLocation } from "react-router";
import DeadlineComponent from "../../../components/ActivityDeadlineComponent/DeadlineComponent.jsx";
import TaskDetails from "../../../components/TaskComponent/TaskDetails.jsx";

const TeamMemberDashboard = (props) => {
  const location = useLocation();
  const state = location.state;
  const currentTeam = state["Team"];

  // let taskList = currentTeam._taskList;
  let taskList = [{}];

  return (
    <>
      <DeadlineComponent
        taskDeadlineDate="Task Deadline Today"
        taskDetailsParagraph="Task assigned to you by leader from SDGP GROUP dues today"
      />
      <div className="tasks-container">
        <h2 className="tw-font-bold tw-text-[30px]">Your Tasks</h2>
        {taskList.length > 0 ? (
          taskList.map((item) => {
            // Render the item here
            return (
              <TaskDetails
                index="1"
                taskDesc="Finish the individual report"
                taskStatus="Completed"
                setViewTaskTrigger={props.setViewTaskTrigger}
                viewTaskTrigger={props.viewTaskTrigger}
              />
            );
          })
        ) : (
          <p className="tasksNotAvailable">
            No tasks has been assigned to you yet
          </p>
        )}
      </div>
    </>
  );
};

export default TeamMemberDashboard;
